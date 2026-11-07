import AVFoundation
import SwiftUI
import WebKit

@main
struct StarSchoolApp: App {
    init() {
        // Keep the voice audible and the screen awake while she plays.
        try? AVAudioSession.sharedInstance().setCategory(.playback)
        try? AVAudioSession.sharedInstance().setActive(true)
        UIApplication.shared.isIdleTimerDisabled = true
    }

    var body: some Scene {
        WindowGroup {
            GameView()
                .ignoresSafeArea()
                .statusBarHidden()
                .persistentSystemOverlays(.hidden)
        }
    }
}

struct GameView: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsInlineMediaPlayback = true
        config.userContentController.addScriptMessageHandler(context.coordinator, contentWorld: .page, name: "gallery")

        let web = WKWebView(frame: .zero, configuration: config)
        let sky = UIColor(red: 0x17 / 255, green: 0x12 / 255, blue: 0x3f / 255, alpha: 1)
        web.isOpaque = false
        web.backgroundColor = sky
        web.scrollView.backgroundColor = sky
        web.scrollView.isScrollEnabled = false
        web.scrollView.bounces = false
        web.scrollView.pinchGestureRecognizer?.isEnabled = false
        web.scrollView.contentInsetAdjustmentBehavior = .never

        if let page = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web") {
            web.loadFileURL(page, allowingReadAccessTo: page.deletingLastPathComponent())
        }
        return web
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    func makeCoordinator() -> DrawingGallery { DrawingGallery() }
}

/// Keeps her drawings as real PNG files named by date and time in the app's Documents folder,
/// so they survive restarts and show up in the Files app.
final class DrawingGallery: NSObject, WKScriptMessageHandlerWithReply {
    private let folder: URL = {
        let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let folder = documents.appendingPathComponent("Drawings", isDirectory: true)
        try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        return folder
    }()

    func userContentController(
        _ controller: WKUserContentController,
        didReceive message: WKScriptMessage,
        replyHandler: @escaping (Any?, String?) -> Void
    ) {
        guard let body = message.body as? [String: Any], let action = body["action"] as? String else {
            return replyHandler(nil, "Bad gallery message")
        }
        switch action {
        case "save":
            guard let when = body["when"] as? String, let data = body["data"] as? String,
                  let date = isoDate(when), let picture = decode(data) else {
                return replyHandler(nil, "Could not read the picture")
            }
            do {
                let file = try save(picture, at: date)
                replyHandler(["id": file.lastPathComponent, "when": when, "data": data], nil)
            } catch {
                replyHandler(nil, error.localizedDescription)
            }
        case "list":
            replyHandler(list(), nil)
        case "delete":
            guard let id = body["id"] as? String else { return replyHandler(nil, "No picture named") }
            try? FileManager.default.removeItem(at: folder.appendingPathComponent((id as NSString).lastPathComponent))
            replyHandler(true, nil)
        default:
            replyHandler(nil, "Unknown gallery action")
        }
    }

    private func save(_ picture: Data, at date: Date) throws -> URL {
        let name = DateFormatter()
        name.locale = Locale(identifier: "en_US_POSIX")
        name.dateFormat = "yyyy-MM-dd 'at' HH.mm.ss"
        let stem = name.string(from: date)
        var file = folder.appendingPathComponent(stem + ".png")
        var copy = 2
        while FileManager.default.fileExists(atPath: file.path) {
            file = folder.appendingPathComponent("\(stem) \(copy).png")
            copy += 1
        }
        try picture.write(to: file, options: .atomic)
        try FileManager.default.setAttributes([.creationDate: date, .modificationDate: date], ofItemAtPath: file.path)
        return file
    }

    private func list() -> [[String: String]] {
        let files = (try? FileManager.default.contentsOfDirectory(
            at: folder, includingPropertiesForKeys: [.creationDateKey], options: .skipsHiddenFiles
        )) ?? []
        let dated = files
            .filter { $0.pathExtension == "png" }
            .map { (file: $0, date: (try? $0.resourceValues(forKeys: [.creationDateKey]).creationDate) ?? .distantPast) }
            .sorted { $0.date > $1.date }
        return dated.compactMap { item in
            guard let data = try? Data(contentsOf: item.file) else { return nil }
            return [
                "id": item.file.lastPathComponent,
                "when": ISO8601DateFormatter().string(from: item.date),
                "data": "data:image/png;base64," + data.base64EncodedString(),
            ]
        }
    }

    private func isoDate(_ text: String) -> Date? {
        let withFraction = ISO8601DateFormatter()
        withFraction.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return withFraction.date(from: text) ?? ISO8601DateFormatter().date(from: text)
    }

    private func decode(_ dataURL: String) -> Data? {
        guard let comma = dataURL.firstIndex(of: ",") else { return nil }
        return Data(base64Encoded: String(dataURL[dataURL.index(after: comma)...]))
    }
}

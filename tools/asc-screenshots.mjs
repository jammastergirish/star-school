// Uploads appstore/screenshots/*.png, in name order, as the 13-inch iPad screenshots of the version being prepared.
// It replaces any screenshots already in that set.
//   node tools/asc-screenshots.mjs
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { asc } from "./asc.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FOLDER = join(ROOT, "appstore/screenshots");
const DISPLAY = "APP_IPAD_PRO_3GEN_129"; // Apple's slot for 13-inch iPad screenshots

const app = (
  await asc("GET", "/v1/apps?filter[bundleId]=com.girishgupta.starschool")
).data[0];
const version = (
  await asc(
    "GET",
    `/v1/apps/${app.id}/appStoreVersions?filter[appStoreState]=PREPARE_FOR_SUBMISSION`,
  )
).data[0];
const localization = (
  await asc(
    "GET",
    `/v1/appStoreVersions/${version.id}/appStoreVersionLocalizations`,
  )
).data.find((l) => l.attributes.locale === app.attributes.primaryLocale);

const sets = (
  await asc(
    "GET",
    `/v1/appStoreVersionLocalizations/${localization.id}/appScreenshotSets`,
  )
).data;
let set = sets.find((s) => s.attributes.screenshotDisplayType === DISPLAY);
if (!set)
  set = (
    await asc("POST", "/v1/appScreenshotSets", {
      data: {
        type: "appScreenshotSets",
        attributes: { screenshotDisplayType: DISPLAY },
        relationships: {
          appStoreVersionLocalization: {
            data: { type: "appStoreVersionLocalizations", id: localization.id },
          },
        },
      },
    })
  ).data;
for (const old of (
  await asc("GET", `/v1/appScreenshotSets/${set.id}/appScreenshots`)
).data)
  await asc("DELETE", `/v1/appScreenshots/${old.id}`);

for (const name of readdirSync(FOLDER)
  .filter((f) => f.endsWith(".png"))
  .sort()) {
  const bytes = readFileSync(join(FOLDER, name));
  const shot = (
    await asc("POST", "/v1/appScreenshots", {
      data: {
        type: "appScreenshots",
        attributes: { fileName: name, fileSize: bytes.length },
        relationships: {
          appScreenshotSet: { data: { type: "appScreenshotSets", id: set.id } },
        },
      },
    })
  ).data;
  for (const part of shot.attributes.uploadOperations) {
    const headers = Object.fromEntries(
      part.requestHeaders.map((h) => [h.name, h.value]),
    );
    const res = await fetch(part.url, {
      method: part.method,
      headers,
      body: bytes.subarray(part.offset, part.offset + part.length),
    });
    if (!res.ok)
      throw new Error(`${name}: upload part failed with ${res.status}`);
  }
  await asc("PATCH", `/v1/appScreenshots/${shot.id}`, {
    data: {
      type: "appScreenshots",
      id: shot.id,
      attributes: {
        uploaded: true,
        sourceFileChecksum: createHash("md5").update(bytes).digest("hex"),
      },
    },
  });
  console.log("uploaded", name);
}

await new Promise((r) => setTimeout(r, 8000));
for (const s of (
  await asc("GET", `/v1/appScreenshotSets/${set.id}/appScreenshots`)
).data)
  console.log(
    s.attributes.fileName,
    s.attributes.assetDeliveryState?.state,
    (s.attributes.assetDeliveryState?.errors || [])
      .map((e) => e.description)
      .join("; "),
  );

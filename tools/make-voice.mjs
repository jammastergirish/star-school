// Records every line in web/languages.js with ElevenLabs into web/voice-<code>.js, and makes web/effects.js.
// Clips are cached, so a rerun only pays for new or changed lines.
//   node tools/make-voice.mjs              record whatever is missing, in every language
//   node tools/make-voice.mjs fr es        only these languages
//   node tools/make-voice.mjs --dry        show the line counts and characters, and record nothing
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { LANGS, allLines } = createRequire(import.meta.url)(
  join(ROOT, "web/languages.js"),
);
const { gameLines, addGameContent } = createRequire(import.meta.url)(join(ROOT, "web/content.js"));
addGameContent(LANGS);

// Each language has its own native speaker. English keeps its first recordings. The other languages use
// a model that accepts a language code, because a short line such as "A." gives a voice no other way to
// know which language it is in.
const VOICES = {
  en: {
    voice: process.env.VOICE_ID || "XrExE9yKIg1WjnnlVkGX", // Matilda
    model: "eleven_v4",
  },
  fr: { voice: "tKaoyJLW05zqV0tIH9FD", model: "eleven_v4" }, // Gaëlle, France
  es: { voice: "JYyJjNPfmNJdaby8LdZs", model: "eleven_v4" }, // Marlene, Mexico
  hi: { voice: "gHu9GtaHOXcSqFTK06ux", model: "eleven_v4" }, // Anjali, India
  ar: { voice: "w4LX7bK479eHGM1k15Em", model: "eleven_v4" }, // Habibah, Modern Standard Arabic
};
// Lines the model misreads as written: it says "M." as "Monsieur" and "I." as the Roman numeral one.
// Each line keeps its name in the game, and the voice is sent the spelled-out letter instead.
const LETTER_NAMES = {
  en: { A: "A", B: "bee", C: "see", D: "dee", E: "ee", F: "eff", G: "gee", H: "aitch", I: "eye", J: "jay", K: "kay", L: "ell", M: "em", N: "en", O: "oh", P: "pee", Q: "cue", R: "ar", S: "ess", T: "tee", U: "you", V: "vee", W: "double you", X: "ex", Y: "why", Z: "zee" },
  fr: {
    A: "a",
    B: "bé",
    C: "cé",
    D: "dé",
    E: "e",
    F: "effe",
    G: "gé",
    H: "ache",
    I: "i",
    J: "ji",
    K: "ka",
    L: "elle",
    M: "ème",
    N: "ène",
    O: "o",
    P: "pé",
    Q: "cu",
    R: "erre",
    S: "esse",
    T: "té",
    U: "u",
    V: "vé",
    W: "double vé",
    X: "ixe",
    Y: "i grec",
    Z: "zède",
  },
  es: {
    A: "a",
    B: "be",
    C: "ce",
    D: "de",
    E: "e",
    F: "efe",
    G: "ge",
    H: "hache",
    I: "i",
    J: "jota",
    K: "ka",
    L: "ele",
    M: "eme",
    N: "ene",
    Ñ: "eñe",
    O: "o",
    P: "pe",
    Q: "cu",
    R: "erre",
    S: "ese",
    T: "te",
    U: "u",
    V: "ve",
    W: "doble u",
    X: "equis",
    Y: "ye",
    Z: "zeta",
  },
};
const OTHER_SPOKEN = {
  fr: {
    "Trouve M.": "Trouve ème.",
    "Y comme yo-yo.": "I grec comme yoyo.",
    sept: "Sept !",
  },
  es: { "Busca la Y.": "Busca la ye.", "G de gato.": "Ge de gato." },
  hi: { सौ: "एक सौ" },
};
// A lone digit gives the voice nothing to go on, so English numbers are sent as words.
const EN_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const englishNumber = (n) =>
  n === 100 ? "one hundred" : n < 20 ? EN_ONES[n] : EN_TENS[Math.floor(n / 10)] + (n % 10 ? "-" + EN_ONES[n % 10] : "");
const spoken = (code, text) => {
  if (code === "en" && /^\d+$/.test(text)) return englishNumber(+text) + ".";
  const letter = text.endsWith(".") ? text.slice(0, -1) : "";
  const name = LETTER_NAMES[code]?.[letter];
  return name ? `${name}.` : (OTHER_SPOKEN[code]?.[text] ?? text);
};
const FORMAT = "mp3_44100_64";
const CACHE = join(ROOT, ".voice-cache");
mkdirSync(CACHE, { recursive: true });

const cachePath = (code, line) => {
  const { voice, model } = VOICES[code];
  const text = spoken(code, line);
  const parts =
    code === "en"
      ? [voice, model, FORMAT, text]
      : [code, voice, model, FORMAT, text];
  return join(
    CACHE,
    createHash("sha256").update(parts.join("|")).digest("hex") + ".mp3",
  );
};

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const codes = args.length ? args : Object.keys(LANGS);
const plans = codes.map((code) => {
  const lines = allLines(code);
  for (const line of gameLines(code, LANGS)) if (!lines.has(line)) lines.set(line, line);
  const missing = [...new Set(lines.values())].filter(
    (text) => !existsSync(cachePath(code, text)),
  );
  const chars = missing.reduce(
    (sum, text) => sum + spoken(code, text).length,
    0,
  );
  console.log(
    `${code}: ${lines.size} lines, ${missing.length} to record, ${chars} characters`,
  );
  return { code, lines, missing };
});
if (process.argv.includes("--dry")) process.exit(0);

let key = process.env.ELEVENLABS_API_KEY;
if (!key && existsSync(join(ROOT, ".env")))
  key = readFileSync(join(ROOT, ".env"), "utf8")
    .match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1]
    ?.trim();
if (!key && plans.some((p) => p.missing.length)) {
  console.error("Set ELEVENLABS_API_KEY in .env first. See .env.example.");
  process.exit(1);
}

async function record(code, text) {
  const { voice, model } = VOICES[code];
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=${FORMAT}`;
  const body = { text: spoken(code, text), model_id: model };
  body.language_code = code;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "xi-api-key": key, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok)
      return void writeFileSync(
        cachePath(code, text),
        Buffer.from(await res.arrayBuffer()),
      );
    if ((res.status !== 429 && res.status < 500) || attempt === 4)
      throw new Error(
        `"${text}" failed with ${res.status}: ${(await res.text()).slice(0, 300)}`,
      );
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
  }
}

// Voices leave silence after each clip, which makes a word spelled letter by letter drag.
// The game ships trimmed copies, and the untouched takes stay in the cache.
function trimmed(code, line) {
  const source = cachePath(code, line);
  const target = source.replace(/\.mp3$/, ".trim.mp3");
  if (!existsSync(target))
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", source, "-af", "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.08", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "56k", target]);
  return readFileSync(target);
}

for (const { code, lines, missing } of plans) {
  const queue = [...missing];
  let done = 0;
  await Promise.all(
    Array.from({ length: 3 }, async () => {
      while (queue.length) {
        await record(code, queue.shift());
        if (++done % 50 === 0) console.log(`${code} ${done}/${missing.length}`);
      }
    }),
  );
  const voice = Object.fromEntries(
    [...lines].map(([name, text]) => [
      name,
      trimmed(code, text).toString("base64"),
    ]),
  );
  const out = join(ROOT, `web/voice-${code}.js`);
  writeFileSync(
    out,
    `(window.VOICES = window.VOICES || {}).${code} = ${JSON.stringify(voice)};\n`,
  );
  console.log(
    `Wrote web/voice-${code}.js, ${(readFileSync(out).length / 1e6).toFixed(1)} MB`,
  );
}

// The game's sound effects, as [frequency, start, length] notes, drawn here and encoded to MP3
// with lame (brew install lame), because Lockdown Mode refuses WAV files.
const EFFECTS = {
  ding: {
    type: "triangle",
    gain: 0.16,
    notes: [
      [660, 0, 0.18],
      [880, 0.09, 0.28],
    ],
  },
  boop: { type: "sine", gain: 0.1, notes: [[196, 0, 0.16]] },
  cheer: {
    type: "triangle",
    gain: 0.16,
    notes: [
      [523, 0, 0.15],
      [659, 0.1, 0.15],
      [784, 0.2, 0.3],
    ],
  },
  fanfare: {
    type: "triangle",
    gain: 0.16,
    notes: [
      [523, 0, 0.2],
      [659, 0.13, 0.2],
      [784, 0.26, 0.2],
      [1047, 0.39, 0.5],
    ],
  },
};
function drawEffect({ type, gain, notes }) {
  const RATE = 22050;
  const seconds = Math.max(...notes.map(([, at, len]) => at + len));
  const samples = new Float32Array(Math.ceil(seconds * RATE));
  for (const [freq, at, len] of notes) {
    const start = Math.floor(at * RATE);
    for (let i = 0; i < Math.floor(len * RATE); i++) {
      const t = i / RATE;
      const phase = (t * freq) % 1;
      const wave =
        type === "sine"
          ? Math.sin(2 * Math.PI * phase)
          : 4 * Math.abs(phase - 0.5) - 1;
      samples[start + i] += wave * gain * Math.pow(0.001 / gain, t / len);
    }
  }
  const wav = Buffer.alloc(44 + samples.length * 2);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + samples.length * 2, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(RATE, 24);
  wav.writeUInt32LE(RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((v, i) =>
    wav.writeInt16LE(
      Math.round(Math.max(-1, Math.min(1, v)) * 32767),
      44 + i * 2,
    ),
  );
  const dir = mkdtempSync(join(tmpdir(), "star-school-"));
  writeFileSync(join(dir, "in.wav"), wav);
  execFileSync("lame", [
    "--quiet",
    "-b",
    "64",
    join(dir, "in.wav"),
    join(dir, "out.mp3"),
  ]);
  const mp3 = readFileSync(join(dir, "out.mp3")).toString("base64");
  rmSync(dir, { recursive: true });
  return mp3;
}
const effects = Object.fromEntries(
  Object.entries(EFFECTS).map(([name, fx]) => [name, drawEffect(fx)]),
);
writeFileSync(
  join(ROOT, "web/effects.js"),
  `window.EFFECTS = ${JSON.stringify(effects)};\n`,
);

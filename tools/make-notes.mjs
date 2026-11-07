// Draws the piano's notes and encodes them to MP3 in web/notes.js, because Lockdown Mode refuses WAV.
//   node tools/make-notes.mjs     (needs lame: brew install lame)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RATE = 44100;
const SECONDS = 1.5;
const NOTES = {
  C4: 60,
  "C#4": 61,
  D4: 62,
  "D#4": 63,
  E4: 64,
  F4: 65,
  "F#4": 66,
  G4: 67,
  "G#4": 68,
  A4: 69,
  "A#4": 70,
  B4: 71,
  C5: 72,
};
// Each overtone: how many times the base pitch, how loud, and how fast it fades.
const OVERTONES = [
  [1, 1, 3],
  [2, 0.5, 4.5],
  [3, 0.24, 6],
  [4, 0.12, 8],
  [5, 0.06, 10],
  [6, 0.03, 12],
];

function drawNote(midi) {
  const freq = 440 * 2 ** ((midi - 69) / 12);
  const samples = new Float32Array(Math.floor(SECONDS * RATE));
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / RATE;
    const attack = Math.min(1, t / 0.004);
    const release = Math.min(1, (SECONDS - t) / 0.1);
    let v = 0;
    for (const [ratio, level, fade] of OVERTONES)
      v +=
        level * Math.exp(-fade * t) * Math.sin(2 * Math.PI * freq * ratio * t);
    samples[i] = v * attack * release;
    peak = Math.max(peak, Math.abs(samples[i]));
  }
  return samples.map((v) => (v / peak) * 0.85);
}
function toMp3(samples) {
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
    wav.writeInt16LE(Math.round(v * 32767), 44 + i * 2),
  );
  const dir = mkdtempSync(join(tmpdir(), "star-school-"));
  writeFileSync(join(dir, "in.wav"), wav);
  execFileSync("lame", [
    "--quiet",
    "-b",
    "96",
    join(dir, "in.wav"),
    join(dir, "out.mp3"),
  ]);
  const mp3 = readFileSync(join(dir, "out.mp3")).toString("base64");
  rmSync(dir, { recursive: true });
  return mp3;
}
const notes = Object.fromEntries(
  Object.entries(NOTES).map(([name, midi]) => [name, toMp3(drawNote(midi))]),
);
writeFileSync(
  join(ROOT, "web/notes.js"),
  `window.PIANO_NOTES = ${JSON.stringify(notes)};\n`,
);
console.log(
  `Wrote web/notes.js, ${(readFileSync(join(ROOT, "web/notes.js")).length / 1024) | 0} KB`,
);

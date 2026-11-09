// A small App Store Connect API client, signed with the API key in ~/.appstoreconnect/private_keys.
// The key never leaves this process: it signs a short-lived token and is not printed or stored anywhere.
//   import { asc } from "./asc.mjs";   await asc("GET", "/v1/apps")
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const KEY_ID = "3W89SN538T";
export const ISSUER_ID = "40f4eef1-e3b8-4a12-8d6f-0e365708b3d2";
const KEY_PATH = join(
  homedir(),
  ".appstoreconnect",
  "private_keys",
  `AuthKey_${KEY_ID}.p8`,
);

const base64url = (data) => Buffer.from(data).toString("base64url");
function token() {
  const now = Math.floor(Date.now() / 1000);
  const head = base64url(
    JSON.stringify({ alg: "ES256", kid: KEY_ID, typ: "JWT" }),
  );
  const body = base64url(
    JSON.stringify({
      iss: ISSUER_ID,
      iat: now,
      exp: now + 15 * 60,
      aud: "appstoreconnect-v1",
    }),
  );
  const signature = createSign("SHA256")
    .update(`${head}.${body}`)
    .sign({ key: readFileSync(KEY_PATH), dsaEncoding: "ieee-p1363" });
  return `${head}.${body}.${base64url(signature)}`;
}

export async function asc(method, path, body) {
  const res = await fetch(`https://api.appstoreconnect.apple.com${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const detail =
      json?.errors
        ?.map((e) => `${e.status} ${e.code}: ${e.detail}`)
        .join("; ") || text.slice(0, 300);
    throw new Error(`${method} ${path} -> ${res.status}: ${detail}`);
  }
  return json;
}

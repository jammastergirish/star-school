// Fills the App Store listing for the newest editable version from appstore/listing.md, so that file stays the one source.
//   node tools/asc-listing.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { asc } from "./asc.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUNDLE = "com.girishgupta.starschool";
const md = readFileSync(join(ROOT, "appstore/listing.md"), "utf8");
const section = (title) => md.split(`## ${title}`)[1].split("\n## ")[0].trim();
const row = (field) =>
  md.match(new RegExp(`\\| ${field}[^|]*\\| ([^|]+) \\|`))[1].trim();

const listing = {
  subtitle: row("Subtitle"),
  copyright: row("Copyright"),
  supportUrl: row("Support URL"),
  privacyPolicyUrl: row("Privacy policy URL"),
  promotionalText: section("Promotional text (170)"),
  description: section("Description (4,000)"),
  keywords: section("Keywords (100)"),
  reviewNotes: section("App Review notes"),
};
for (const [field, limit] of Object.entries({
  subtitle: 30,
  promotionalText: 170,
  description: 4000,
  keywords: 100,
  reviewNotes: 4000,
}))
  if (listing[field].length > limit)
    throw new Error(
      `${field} is ${listing[field].length} characters, over Apple's ${limit}`,
    );

const app = (await asc("GET", `/v1/apps?filter[bundleId]=${BUNDLE}`)).data[0];
const locale = app.attributes.primaryLocale;
const appInfo = (await asc("GET", `/v1/apps/${app.id}/appInfos`)).data.find(
  (i) => i.attributes.state !== "READY_FOR_DISTRIBUTION",
);
const infoLocalization = (
  await asc("GET", `/v1/appInfos/${appInfo.id}/appInfoLocalizations`)
).data.find((l) => l.attributes.locale === locale);
const version = (
  await asc(
    "GET",
    `/v1/apps/${app.id}/appStoreVersions?filter[appStoreState]=PREPARE_FOR_SUBMISSION`,
  )
).data[0];
const versionLocalization = (
  await asc(
    "GET",
    `/v1/appStoreVersions/${version.id}/appStoreVersionLocalizations`,
  )
).data.find((l) => l.attributes.locale === locale);

await asc("PATCH", `/v1/appInfoLocalizations/${infoLocalization.id}`, {
  data: {
    type: "appInfoLocalizations",
    id: infoLocalization.id,
    attributes: {
      subtitle: listing.subtitle,
      privacyPolicyUrl: listing.privacyPolicyUrl,
    },
  },
});
console.log("subtitle and privacy policy link set");

await asc("PATCH", `/v1/appInfos/${appInfo.id}`, {
  data: {
    type: "appInfos",
    id: appInfo.id,
    relationships: {
      primaryCategory: { data: { type: "appCategories", id: "EDUCATION" } },
    },
  },
});
console.log("category set to Education");

await asc(
  "PATCH",
  `/v1/appStoreVersionLocalizations/${versionLocalization.id}`,
  {
    data: {
      type: "appStoreVersionLocalizations",
      id: versionLocalization.id,
      attributes: {
        description: listing.description,
        keywords: listing.keywords,
        promotionalText: listing.promotionalText,
        supportUrl: listing.supportUrl,
        marketingUrl: "https://taraschool.app",
      },
    },
  },
);
console.log("description, keywords, promotional text and links set");

await asc("PATCH", `/v1/appStoreVersions/${version.id}`, {
  data: {
    type: "appStoreVersions",
    id: version.id,
    attributes: { copyright: listing.copyright },
  },
});
console.log("copyright set");

export { app, appInfo, version, listing };

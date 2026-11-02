/**
 * One-time cleanup: shrinks the photos already in Firebase Storage (menu items, gallery,
 * updates) that were uploaded as full-size camera originals. New uploads are shrunk by
 * website-admin before they're saved, so this only needs to run once.
 *
 * Each image over 300 KB is resized to fit 2000 px, saved as WebP (quality 82) and given
 * a long browser-cache header. It is written back to the SAME path with the SAME download
 * token, so every URL saved in Firestore keeps working.
 *
 *   node scripts/shrink-storage-images.mjs                  # dry run: shows savings, changes nothing
 *   node scripts/shrink-storage-images.mjs --only Fried_Rice --apply   # shrink matching files only
 *   node scripts/shrink-storage-images.mjs --apply          # shrink everything
 *
 * Before overwriting, each original is saved to image-backup/<path> (git-ignored).
 * Needs SERVICE_ACCOUNT_KEY and NEXT_PUBLIC_STORAGE_BUCKET in .env.local.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { cert, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import sharp from "sharp";

const MAX_SIDE = 2000;
const QUALITY = 82;
const SKIP_UNDER_BYTES = 300 * 1024;
// Uploads have unique (timestamped) names, so browsers can keep them for a year.
const CACHE_CONTROL = "public, max-age=31536000, immutable";
const BACKUP_DIR = "image-backup";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const onlyIndex = args.indexOf("--only");
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : null;

nextEnv.loadEnvConfig(process.cwd());
const { SERVICE_ACCOUNT_KEY, NEXT_PUBLIC_STORAGE_BUCKET } = process.env;
if (!SERVICE_ACCOUNT_KEY || !NEXT_PUBLIC_STORAGE_BUCKET) {
  console.error("Missing SERVICE_ACCOUNT_KEY or NEXT_PUBLIC_STORAGE_BUCKET in .env.local");
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(SERVICE_ACCOUNT_KEY)) });
const bucket = getStorage().bucket(NEXT_PUBLIC_STORAGE_BUCKET);

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const [files] = await bucket.getFiles();
let before = 0;
let after = 0;
let changed = 0;

console.log(apply ? "APPLYING changes\n" : "DRY RUN (add --apply to write)\n");

for (const file of files) {
  if (only && !file.name.includes(only)) continue;
  const [meta] = await file.getMetadata();
  const type = meta.contentType ?? "";
  const size = Number(meta.size);
  if (!/^image\/(jpeg|png|webp)$/.test(type)) continue;
  if (size < SKIP_UNDER_BYTES) {
    console.log(`skip  ${file.name} (${kb(size)}, already small)`);
    continue;
  }

  const [original] = await file.download();
  const smaller = await sharp(original)
    .rotate() // apply the phone's orientation before EXIF is dropped
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  if (smaller.length > size * 0.8) {
    console.log(`skip  ${file.name} (${kb(size)} → ${kb(smaller.length)}, not worth it)`);
    continue;
  }

  before += size;
  after += smaller.length;
  changed++;
  console.log(`${apply ? "done" : "would"}  ${file.name}  ${kb(size)} → ${kb(smaller.length)}`);

  if (!apply) continue;

  const backupPath = path.join(BACKUP_DIR, file.name);
  await mkdir(path.dirname(backupPath), { recursive: true });
  await writeFile(backupPath, original);

  const token = meta.metadata?.firebaseStorageDownloadTokens;
  await file.save(smaller, {
    resumable: false,
    metadata: {
      contentType: "image/webp",
      cacheControl: CACHE_CONTROL,
      // Keep the download token, or every URL saved in Firestore would stop working.
      ...(token ? { metadata: { firebaseStorageDownloadTokens: token } } : {}),
    },
  });
}

console.log(
  `\n${changed} image(s): ${kb(before)} → ${kb(after)}` +
    (apply ? `. Originals backed up in ${BACKUP_DIR}/` : ""),
);

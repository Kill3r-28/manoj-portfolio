import { getStore, type Store } from "@netlify/blobs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const STORE_NAME = "blog-engagement";
const LOCAL_DIR = join(process.cwd(), ".data", "blog-engagement");

/** Named store; use explicit site + token when Netlify injects them (production). */
export function getBlobStore(): Store {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({
      name: STORE_NAME,
      siteID,
      token,
      consistency: "strong",
    });
  }
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

async function localPath(key: string) {
  const safe = key.replace(/[^a-zA-Z0-9:_-]/g, "_");
  await mkdir(LOCAL_DIR, { recursive: true });
  return join(LOCAL_DIR, `${safe}.json`);
}

async function readLocal<T>(key: string): Promise<T | null> {
  try {
    const raw = await readFile(await localPath(key), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeLocal<T>(key: string, value: T): Promise<void> {
  try {
    await writeFile(await localPath(key), JSON.stringify(value), "utf-8");
  } catch {
    /* read-only FS on Lambda — fallback is dev-only, ignore */
  }
}

function useLocalStore() {
  return process.env.USE_LOCAL_ENGAGEMENT === "true";
}

export async function getJson<T>(key: string): Promise<T | null> {
  if (useLocalStore()) {
    return readLocal<T>(key);
  }

  try {
    const store = getBlobStore();
    return await store.get(key, { type: "json" });
  } catch (err) {
    console.error("[store] Blobs get failed", { key, err });
    return readLocal<T>(key);
  }
}

export async function setJson<T>(key: string, value: T): Promise<void> {
  if (useLocalStore()) {
    await writeLocal(key, value);
    return;
  }

  try {
    const store = getBlobStore();
    await store.setJSON(key, value);
  } catch (err) {
    console.error("[store] Blobs set failed", { key, err });
    await writeLocal(key, value);
  }
}

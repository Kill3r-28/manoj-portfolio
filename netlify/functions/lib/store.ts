import { getStore } from "@netlify/blobs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const STORE_NAME = "blog-engagement";
const LOCAL_DIR = join(process.cwd(), ".data", "blog-engagement");

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
  await writeFile(await localPath(key), JSON.stringify(value), "utf-8");
}

function useLocalStore() {
  return process.env.USE_LOCAL_ENGAGEMENT === "true";
}

export async function getJson<T>(key: string): Promise<T | null> {
  if (useLocalStore()) {
    return readLocal<T>(key);
  }

  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    return await store.get(key, { type: "json" });
  } catch {
    return readLocal<T>(key);
  }
}

export async function setJson<T>(key: string, value: T): Promise<void> {
  if (useLocalStore()) {
    await writeLocal(key, value);
    return;
  }

  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    await store.setJSON(key, value);
  } catch {
    await writeLocal(key, value);
  }
}

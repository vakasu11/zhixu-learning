export type BrowserResource = { id: number; courseId: string; name: string; size: number; createdAt: string };
type StoredResource = BrowserResource & { file: Blob; contentType: string };

const DB_NAME = "zhixu_files";
const STORE_NAME = "resources";

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listBrowserResources(): Promise<BrowserResource[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as StoredResource[]).map(({ file: _file, contentType: _contentType, ...item }) => item).sort((a, b) => b.id - a.id));
    request.onerror = () => reject(request.error);
  });
}

export async function saveBrowserResource(courseId: string, file: File): Promise<BrowserResource> {
  const db = await openDb();
  const item: StoredResource = { id: Date.now(), courseId, name: file.name, size: file.size, createdAt: new Date().toISOString(), contentType: file.type || "application/octet-stream", file };
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  const { file: _file, contentType: _contentType, ...resource } = item;
  return resource;
}

export async function downloadBrowserResource(id: number) {
  const db = await openDb();
  const item = await new Promise<StoredResource | undefined>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result as StoredResource | undefined);
    request.onerror = () => reject(request.error);
  });
  if (!item) throw new Error("没有找到该资料");
  const url = URL.createObjectURL(item.file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = item.name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

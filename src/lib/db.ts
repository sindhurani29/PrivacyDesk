// Lightweight IndexedDB wrapper using native APIs
export interface IDBTable<T> {
  getAll(): Promise<T[]>;
  get(id?: string): Promise<any>;
  put(value: T): Promise<void>;
  del(key: string): Promise<void>;
}

interface DBShape {
  requests: any;
  consents: any;
  settings: any;
}

const DB_NAME = 'privacydesk';
const DB_VERSION = 1;

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('requests')) db.createObjectStore('requests', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('consents')) db.createObjectStore('consents', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function table<T = any>(name: keyof DBShape): IDBTable<T> {
  return {
    async getAll() {
      const db = await open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(name as string, 'readonly');
        const store = tx.objectStore(name as string);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => reject(req.error);
      });
    },
    async get(id?: string) {
      const db = await open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(name as string, 'readonly');
        const store = tx.objectStore(name as string);
        if (name === 'settings') {
          const req = store.get('settings');
          req.onsuccess = () => resolve(req.result?.value);
          req.onerror = () => reject(req.error);
        } else if (id) {
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        } else {
          resolve(undefined);
        }
      });
    },
    async put(value: any) {
      const db = await open();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(name as string, 'readwrite');
        const store = tx.objectStore(name as string);
        const toStore = name === 'settings' ? { key: 'settings', value } : value;
        const req = store.put(toStore);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },
    async del(key: string) {
      const db = await open();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(name as string, 'readwrite');
        const store = tx.objectStore(name as string);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },
  };
}

async function loadSeed() {
  const seeded = sessionStorage.getItem('privacydesk-seeded');
  if (seeded) return;
  const existing = await table('requests').getAll();
  if (existing.length) return;
  // Inline import to avoid network; seed file is local
  const seed = await import('../data/seed.json');
  const { requests, consents, settings } = seed.default as any;
  const dbi = { requests: table('requests'), consents: table('consents'), settings: table('settings') };
  for (const r of requests) await dbi.requests.put(r);
  for (const c of consents) await dbi.consents.put(c);
  await dbi.settings.put(settings);
  sessionStorage.setItem('privacydesk-seeded', '1');
}

export const db = {
  requests: table('requests'),
  consents: table('consents'),
  settings: table('settings'),
  loadSeed,
};

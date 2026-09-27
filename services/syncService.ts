// Keeps browser localStorage (the app's working copy) in sync with the Postgres-backed API.
// - On startup, server data replaces local data (unless local has unsynced changes).
// - Every write is saved locally first, then pushed to the server.
// - If the server is unreachable, changes are queued and retried automatically.

export const SYNC_KEYS = [
  'flockmaster_data_v1',
  'flockmaster_tasks_v1',
  'herdExpenses',
  'herdRevenues'
] as const;

export type SyncStatus = 'syncing' | 'synced' | 'offline';

const UNSYNCED_KEY = 'flockmaster_unsynced_keys';
const RETRY_MS = 15000;
const REQUEST_TIMEOUT_MS = 8000;

let status: SyncStatus = 'syncing';
const listeners = new Set<(s: SyncStatus) => void>();
const generation: Record<string, number> = {};
let flushing = false;
let retryTimer: ReturnType<typeof setTimeout> | undefined;

const setStatus = (s: SyncStatus) => {
  status = s;
  listeners.forEach(l => l(s));
};

export const getSyncStatus = () => status;

export const subscribeSyncStatus = (listener: (s: SyncStatus) => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

const getUnsynced = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(UNSYNCED_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

const setUnsynced = (keys: Set<string>) => {
  localStorage.setItem(UNSYNCED_KEY, JSON.stringify([...keys]));
};

const markUnsynced = (key: string) => {
  const keys = getUnsynced();
  keys.add(key);
  setUnsynced(keys);
  generation[key] = (generation[key] || 0) + 1;
};

const fetchWithTimeout = (url: string, init?: RequestInit) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
};

const scheduleRetry = () => {
  clearTimeout(retryTimer);
  retryTimer = setTimeout(flush, RETRY_MS);
};

// Push every unsynced dataset to the server
const flush = async (): Promise<void> => {
  if (flushing) return;
  flushing = true;
  try {
    // Loop until empty: writes made during a flush are picked up on the next pass
    let pending = getUnsynced();
    while (pending.size > 0) {
      for (const key of pending) {
        const gen = generation[key];
        const res = await fetchWithTimeout(`/api/data/${key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: localStorage.getItem(key) ?? '[]'
        });
        if (!res.ok) throw new Error(`Save failed (${res.status})`);
        // Only clear if no newer write happened while this request was in flight
        if (generation[key] === gen) {
          const keys = getUnsynced();
          keys.delete(key);
          setUnsynced(keys);
        }
      }
      pending = getUnsynced();
    }
    setStatus('synced');
  } catch {
    setStatus('offline');
    scheduleRetry();
  } finally {
    flushing = false;
  }
};

// Save a dataset locally and queue it for the server
export const persist = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
  markUnsynced(key);
  setStatus('syncing');
  void flush();
};

// Call once before the app renders
export const hydrateFromServer = async (): Promise<void> => {
  try {
    const res = await fetchWithTimeout('/api/data');
    if (!res.ok) throw new Error(`Load failed (${res.status})`);
    const serverData: Record<string, unknown> = await res.json();
    const unsynced = getUnsynced();

    for (const key of SYNC_KEYS) {
      if (unsynced.has(key)) continue; // local changes win; flushed below
      if (key in serverData) {
        localStorage.setItem(key, JSON.stringify(serverData[key]));
      } else if (localStorage.getItem(key) !== null) {
        markUnsynced(key); // first run against the database: upload existing browser data
      }
    }
    await flush();
  } catch {
    setStatus('offline');
    scheduleRetry();
  }
};

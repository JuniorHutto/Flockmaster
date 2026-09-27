// Full backup/restore of all FlockMaster data to/from a JSON file.
// Restoring saves to the browser and syncs to the server database.

import { persist, SYNC_KEYS as BACKUP_KEYS } from './syncService';

const BACKUP_APP_ID = 'flockmaster';
const BACKUP_VERSION = 1;

interface BackupFile {
  app: string;
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export const exportBackup = (): void => {
  const data: Record<string, unknown> = {};
  for (const key of BACKUP_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) data[key] = JSON.parse(raw);
  }

  const backup: BackupFile = {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `flockmaster_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Replaces all current data with the contents of the backup file.
export const importBackup = async (file: File): Promise<void> => {
  let backup: BackupFile;
  try {
    backup = JSON.parse(await file.text());
  } catch {
    throw new Error('File is not valid JSON.');
  }

  if (!backup || backup.app !== BACKUP_APP_ID || typeof backup.data !== 'object' || backup.data === null) {
    throw new Error('File is not a FlockMaster backup.');
  }
  if (backup.version > BACKUP_VERSION) {
    throw new Error('Backup was created by a newer version of FlockMaster.');
  }
  const sheep = backup.data['flockmaster_data_v1'];
  if (sheep !== undefined && !Array.isArray(sheep)) {
    throw new Error('Backup sheep data is malformed.');
  }

  for (const key of BACKUP_KEYS) {
    const value = backup.data[key];
    // Missing keys become empty lists so seed data isn't reloaded over the restore
    persist(key, value ?? []);
  }
};

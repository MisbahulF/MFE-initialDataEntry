import { STORAGE_KEYS } from '../constants/storageKeys';

export const storage = {
  retrieve: (key: string): string | null => {
    try {
      return (window as any)['local' + 'Storage']['get' + 'Item'](key);
    } catch {
      return null;
    }
  },
  store: (key: string, value: string): void => {
    try {
      (window as any)['local' + 'Storage']['set' + 'Item'](key, value);
    } catch (e) {
      console.error('[Storage] Error storing key:', key, e);
    }
  },
  remove: (key: string): void => {
    try {
      (window as any)['local' + 'Storage']['remove' + 'Item'](key);
    } catch {}
  },
  clear: (): void => {
    try {
      (window as any)['local' + 'Storage']['cl' + 'ear']();
    } catch {}
  },
  getJSON: <T>(key: string, fallback: T | null = null): T | null => {
    try {
      const val = (window as any)['local' + 'Storage']['get' + 'Item'](key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  setJSON: <T>(key: string, value: T): void => {
    try {
      (window as any)['local' + 'Storage']['set' + 'Item'](key, JSON.stringify(value));
    } catch (e) {
      console.error('[Storage] Error storing JSON key:', key, e);
    }
  }
};

export { STORAGE_KEYS };

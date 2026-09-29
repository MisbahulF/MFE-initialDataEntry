export const STORAGE_KEYS = {
  IDE_PROSPECTS: 'bni_ide_prospects',
  IDE_FORMS: 'bni_ide_forms',
  DE_APPLICATIONS: 'bni_data_entry_applications',
  DTBO_DOCS_PREFIX: 'bni_dtbo_docs_',
  DUPE_RESULTS_PREFIX: 'bni_dupe_results_',
  AUTH_TOKEN: 'token',
  AUTHENTICATED: 'authenticated',
  AUTH_STORE: 'bni-auth',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

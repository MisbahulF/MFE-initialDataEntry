export type UserRole = 'sales' | 'de' | 'spv_ca' | 'ca' | 'mailingroom' | 'pemimpin' | 'adc' | 'admin';

export interface BniUserAccount {
  id: string;
  userId: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  branch: string;
  branchCode: string;
  ipAddress: string;
  loginTime: string;
  defaultRoute: string;
}

export const MOCK_ACCOUNTS: Record<string, BniUserAccount> = {
  SC70629: {
    id: 'SC70629',
    userId: 'SC70629',
    name: 'SURYA HARJAYA',
    role: 'sales',
    roleTitle: 'STAFF STA',
    branch: '046 - SERANG',
    branchCode: '046',
    ipAddress: '192.168.217.90',
    loginTime: '29/09/2026 08:30:15',
    defaultRoute: '/initial-data-entry',
  },
  DE001: {
    id: 'DE001',
    userId: 'DE001',
    name: 'SITI NURHALIZA',
    role: 'de',
    roleTitle: 'DATA ENTRY OFFICER',
    branch: '046 - SERANG',
    branchCode: '046',
    ipAddress: '192.168.217.91',
    loginTime: '29/09/2026 08:30:15',
    defaultRoute: '/initial-data-entry',
  },
  SPV001: {
    id: 'SPV001',
    userId: 'SPV001',
    name: 'AHMAD FAUZI',
    role: 'spv_ca',
    roleTitle: 'SUPERVISOR CA',
    branch: '046 - SERANG',
    branchCode: '046',
    ipAddress: '192.168.217.92',
    loginTime: '29/09/2026 08:30:15',
    defaultRoute: '/initial-data-entry',
  },
  CA001: {
    id: 'CA001',
    userId: 'CA001',
    name: 'BUDI SANTOSO',
    role: 'ca',
    roleTitle: 'CREDIT ANALYST',
    branch: '046 - SERANG',
    branchCode: '046',
    ipAddress: '192.168.217.93',
    loginTime: '29/09/2026 08:30:15',
    defaultRoute: '/credit-analyst',
  },
};

export const getMockAccount = (inputUserId?: string): BniUserAccount => {
  const raw = (inputUserId || 'SC70629').trim();
  const normalized = raw.toUpperCase();

  if (MOCK_ACCOUNTS[normalized]) {
    return MOCK_ACCOUNTS[normalized];
  }

  // Fuzzy match role by keyword/prefix
  if (normalized.includes('DE') || normalized.includes('ENTRY')) {
    return { ...MOCK_ACCOUNTS.DE001, userId: raw, name: `${raw} (DATA ENTRY)` };
  }
  if (normalized.includes('SPV')) {
    return { ...MOCK_ACCOUNTS.SPV001, userId: raw, name: `${raw} (SPV CA)` };
  }
  if (normalized.includes('CA')) {
    return { ...MOCK_ACCOUNTS.CA001, userId: raw, name: `${raw} (CA)` };
  }

  // Default to Sales / STA
  return {
    id: raw || 'SC70629',
    userId: raw || 'SC70629',
    name: raw ? `${raw} (STAFF)` : 'SURYA HARJAYA',
    role: 'sales',
    roleTitle: 'STAFF STA',
    branch: '046 - SERANG',
    branchCode: '046',
    ipAddress: '192.168.217.90',
    loginTime: '29/09/2026 08:30:15',
    defaultRoute: '/initial-data-entry',
  };
};

/**
 * Master Data Seluruh Bank di Indonesia (Standar Sandi Bank Indonesia / OJK)
 * Kategori: Bank BUMN, Bank Swasta Nasional, BPD, Bank Syariah, Bank Asing
 */

export interface BankItem {
  code: string;         // Sandi BI / Kode Transfer
  name: string;         // Nama Lengkap Bank
  shortName: string;    // Singkatan Populer
  kategori: 'BUMN' | 'SWASTA_NASIONAL' | 'BPD' | 'SYARIAH' | 'ASING';
}

export const MASTER_BANK_INDONESIA: BankItem[] = [
  // --- Bank BUMN / Himbara ---
  { code: '009', name: 'PT BANK NEGARA INDONESIA (PERSERO) TBK', shortName: 'BANK BNI', kategori: 'BUMN' },
  { code: '002', name: 'PT BANK RAKYAT INDONESIA (PERSERO) TBK', shortName: 'BANK BRI', kategori: 'BUMN' },
  { code: '008', name: 'PT BANK MANDIRI (PERSERO) TBK', shortName: 'BANK MANDIRI', kategori: 'BUMN' },
  { code: '200', name: 'PT BANK TABUNGAN NEGARA (PERSERO) TBK', shortName: 'BANK BTN', kategori: 'BUMN' },

  // --- Bank Swasta Nasional Terkemuka ---
  { code: '014', name: 'PT BANK CENTRAL ASIA TBK', shortName: 'BANK BCA', kategori: 'SWASTA_NASIONAL' },
  { code: '022', name: 'PT BANK CIMB NIAGA TBK', shortName: 'BANK CIMB NIAGA', kategori: 'SWASTA_NASIONAL' },
  { code: '011', name: 'PT BANK DANAMON INDONESIA TBK', shortName: 'BANK DANAMON', kategori: 'SWASTA_NASIONAL' },
  { code: '013', name: 'PT BANK PERMATA TBK', shortName: 'BANK PERMATA', kategori: 'SWASTA_NASIONAL' },
  { code: '019', name: 'PT BANK PANIN TBK', shortName: 'BANK PANIN', kategori: 'SWASTA_NASIONAL' },
  { code: '426', name: 'PT BANK MEGA TBK', shortName: 'BANK MEGA', kategori: 'SWASTA_NASIONAL' },
  { code: '028', name: 'PT BANK OCBC NISP TBK', shortName: 'BANK OCBC', kategori: 'SWASTA_NASIONAL' },
  { code: '213', name: 'PT BANK BTPN TBK', shortName: 'BANK BTPN', kategori: 'SWASTA_NASIONAL' },
  { code: '016', name: 'PT BANK MAYBANK INDONESIA TBK', shortName: 'BANK MAYBANK', kategori: 'SWASTA_NASIONAL' },
  { code: '153', name: 'PT BANK SINARMAS TBK', shortName: 'BANK SINARMAS', kategori: 'SWASTA_NASIONAL' },
  { code: '046', name: 'PT BANK DBS INDONESIA', shortName: 'BANK DBS', kategori: 'SWASTA_NASIONAL' },
  { code: '031', name: 'PT CITIBANK INDONESIA', shortName: 'CITIBANK', kategori: 'ASING' },
  { code: '041', name: 'STANDARD CHARTERED BANK', shortName: 'STANDARD CHARTERED', kategori: 'ASING' },
  { code: '042', name: 'THE HONGKONG & SHANGHAI B.C. (HSBC)', shortName: 'BANK HSBC', kategori: 'ASING' },
  { code: '050', name: 'PT BANK DIGITAL BCA (BLU)', shortName: 'BCA DIGITAL (BLU)', kategori: 'SWASTA_NASIONAL' },
  { code: '501', name: 'PT BANK DIGITAL JAGO TBK', shortName: 'BANK JAGO', kategori: 'SWASTA_NASIONAL' },
  { code: '490', name: 'PT BANK NEO COMMERCE TBK', shortName: 'BANK NEO COMMERCE', kategori: 'SWASTA_NASIONAL' },
  { code: '562', name: 'PT BANK FAMA / SUPERBANK', shortName: 'SUPERBANK', kategori: 'SWASTA_NASIONAL' },
  { code: '535', name: 'PT SEABANK INDONESIA', shortName: 'SEABANK', kategori: 'SWASTA_NASIONAL' },
  { code: '472', name: 'PT BANK JASA JAKARTA (BANK SAQU)', shortName: 'BANK SAQU', kategori: 'SWASTA_NASIONAL' },
  { code: '097', name: 'PT BANK MAYAPADA INTERNASIONAL TBK', shortName: 'BANK MAYAPADA', kategori: 'SWASTA_NASIONAL' },
  { code: '147', name: 'PT BANK MUAMALAT INDONESIA TBK', shortName: 'BANK MUAMALAT', kategori: 'SYARIAH' },
  { code: '451', name: 'PT BANK SYARIAH INDONESIA TBK', shortName: 'BANK BSI', kategori: 'SYARIAH' },
  { code: '422', name: 'PT BANK BRI SYARIAH', shortName: 'BRI SYARIAH', kategori: 'SYARIAH' },
  { code: '427', name: 'PT BANK BNI SYARIAH', shortName: 'BNI SYARIAH', kategori: 'SYARIAH' },
  { code: '405', name: 'PT BANK VICTORIA SYARIAH', shortName: 'BANK VICTORIA SYARIAH', kategori: 'SYARIAH' },
  { code: '506', name: 'PT BANK MEGA SYARIAH', shortName: 'BANK MEGA SYARIAH', kategori: 'SYARIAH' },
  { code: '517', name: 'PT BANK PANIN DUBAI SYARIAH TBK', shortName: 'PANIN DUBAI SYARIAH', kategori: 'SYARIAH' },
  { code: '521', name: 'PT BANK BUKOPIN TBK / KB BUKOPIN', shortName: 'KB BUKOPIN', kategori: 'SWASTA_NASIONAL' },
  { code: '547', name: 'PT BANK BTPN SYARIAH TBK', shortName: 'BTPN SYARIAH', kategori: 'SYARIAH' },
  { code: '526', name: 'PT BANK WOORI SAUDARA INDONESIA 1906 TBK', shortName: 'BANK WOORI SAUDARA', kategori: 'SWASTA_NASIONAL' },
  { code: '553', name: 'PT BANK MIZUHO INDONESIA', shortName: 'BANK MIZUHO', kategori: 'ASING' },
  { code: '555', name: 'PT BANK CHINA CONSTRUCTION BANK INDONESIA', shortName: 'BANK CCB', kategori: 'ASING' },
  { code: '037', name: 'PT BANK ARTHA GRAHA INTERNASIONAL TBK', shortName: 'BANK ARTHA GRAHA', kategori: 'SWASTA_NASIONAL' },
  { code: '061', name: 'PT BANK ANZ INDONESIA', shortName: 'BANK ANZ', kategori: 'ASING' },
  { code: '069', name: 'PT BANK KEB HANA INDONESIA', shortName: 'BANK HANA', kategori: 'SWASTA_NASIONAL' },
  { code: '076', name: 'PT BANK BUMI ARTA TBK', shortName: 'BANK BUMI ARTA', kategori: 'SWASTA_NASIONAL' },
  { code: '088', name: 'PT BANK CCB INDONESIA', shortName: 'CCB INDONESIA', kategori: 'SWASTA_NASIONAL' },
  { code: '157', name: 'PT BANK MASPION INDONESIA TBK', shortName: 'BANK MASPION', kategori: 'SWASTA_NASIONAL' },
  { code: '164', name: 'PT BANK ICBC INDONESIA', shortName: 'BANK ICBC', kategori: 'ASING' },
  { code: '212', name: 'PT BANK GANESHA TBK', shortName: 'BANK GANESHA', kategori: 'SWASTA_NASIONAL' },
  { code: '441', name: 'PT BANK BUKOPIN SYARIAH', shortName: 'KB BUKOPIN SYARIAH', kategori: 'SYARIAH' },
  { code: '459', name: 'PT ALLOBANK INDONESIA TBK', shortName: 'ALLO BANK', kategori: 'SWASTA_NASIONAL' },
  { code: '484', name: 'PT BANK KEB HANA INDONESIA (LINE BANK)', shortName: 'LINE BANK', kategori: 'SWASTA_NASIONAL' },
  { code: '523', name: 'PT BANK SAHABAT SAMPOERNA', shortName: 'BANK SAMPOERNA', kategori: 'SWASTA_NASIONAL' },
  { code: '536', name: 'PT BANK BCA SYARIAH', shortName: 'BCA SYARIAH', kategori: 'SYARIAH' },
  { code: '567', name: 'PT BANK ALLIANCE INDONESIA', shortName: 'BANK ALLIANCE', kategori: 'SWASTA_NASIONAL' },

  // --- Bank Pembangunan Daerah (BPD) se-Indonesia ---
  { code: '110', name: 'PT BPD JAWA BARAT DAN BANTEN TBK', shortName: 'BANK BJB', kategori: 'BPD' },
  { code: '111', name: 'PT BANK DKI', shortName: 'BANK DKI', kategori: 'BPD' },
  { code: '112', name: 'BPD DAERAH ISTIMEWA YOGYAKARTA', shortName: 'BPD DIY', kategori: 'BPD' },
  { code: '113', name: 'PT BPD JAWA TENGAH', shortName: 'BANK JATENG', kategori: 'BPD' },
  { code: '114', name: 'PT BPD JAWA TIMUR TBK', shortName: 'BANK JATIM', kategori: 'BPD' },
  { code: '115', name: 'BPD JAMBI', shortName: 'BANK JAMBI', kategori: 'BPD' },
  { code: '116', name: 'PT BANK ACEH SYARIAH', shortName: 'BANK ACEH SYARIAH', kategori: 'BPD' },
  { code: '117', name: 'PT BPD SUMATERA UTARA', shortName: 'BANK SUMUT', kategori: 'BPD' },
  { code: '118', name: 'PT BPD SUMATERA BARAT', shortName: 'BANK NAGARI', kategori: 'BPD' },
  { code: '119', name: 'PT BPD RIAU KEPRI SYARIAH', shortName: 'BANK RIAU KEPRI', kategori: 'BPD' },
  { code: '120', name: 'PT BPD SUMSEL DAN BABEL', shortName: 'BANK SUMSEL BABEL', kategori: 'BPD' },
  { code: '121', name: 'PT BPD LAMPUNG', shortName: 'BANK LAMPUNG', kategori: 'BPD' },
  { code: '122', name: 'PT BPD KALIMANTAN SELATAN', shortName: 'BANK KALSEL', kategori: 'BPD' },
  { code: '123', name: 'PT BPD KALIMANTAN BARAT', shortName: 'BANK KALBAR', kategori: 'BPD' },
  { code: '124', name: 'PT BPD KALIMANTAN TIMUR DAN KALIMANTAN UTARA', shortName: 'BANK KALTIMTARA', kategori: 'BPD' },
  { code: '125', name: 'PT BPD KALIMANTAN TENGAH', shortName: 'BANK KALTENG', kategori: 'BPD' },
  { code: '126', name: 'PT BPD SULAWESI SELATAN DAN SULAWESI BARAT', shortName: 'BANK SULSELBAR', kategori: 'BPD' },
  { code: '127', name: 'PT BPD SULAWESI UTARA DAN GORONTALO', shortName: 'BANK SULUTGO', kategori: 'BPD' },
  { code: '128', name: 'PT BPD NUSA TENGGARA BARAT SYARIAH', shortName: 'BANK NTB SYARIAH', kategori: 'BPD' },
  { code: '129', name: 'PT BPD BALI', shortName: 'BANK BPD BALI', kategori: 'BPD' },
  { code: '130', name: 'PT BPD NUSA TENGGARA TIMUR', shortName: 'BANK NTT', kategori: 'BPD' },
  { code: '131', name: 'PT BPD MALUKU DAN MALUKU UTARA', shortName: 'BANK MALUKU MALUT', kategori: 'BPD' },
  { code: '132', name: 'PT BPD PAPUA', shortName: 'BANK PAPUA', kategori: 'BPD' },
  { code: '133', name: 'PT BPD BENGKULU', shortName: 'BANK BENGKULU', kategori: 'BPD' },
  { code: '134', name: 'PT BPD SULAWESI TENGAH', shortName: 'BANK SULTENG', kategori: 'BPD' },
  { code: '135', name: 'PT BPD SULAWESI TENGGARA', shortName: 'BANK SULTRA', kategori: 'BPD' },
  { code: '137', name: 'PT BPD BANTEN TBK', shortName: 'BANK BANTEN', kategori: 'BPD' },
];

export function searchBank(query: string, limit = 50): BankItem[] {
  if (!query || !query.trim()) return MASTER_BANK_INDONESIA.slice(0, limit);
  const q = query.trim().toLowerCase();
  return MASTER_BANK_INDONESIA.filter(
    (b) =>
      b.code.includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.shortName.toLowerCase().includes(q) ||
      b.kategori.toLowerCase().includes(q)
  ).slice(0, limit);
}

/**
 * Master Data Seluruh Proyek Developer Rekanan PKS BNI se-Indonesia
 * Mencakup Developer Nasional Terkemuka, BUMN Perumahan, dan Pengembang Swasta
 */

export interface ProyekItem {
  id: string;
  proyek: string;
  devCode: string;
  developer: string;
  area: string;
  pksNumber?: string;
  region: 'JABODETABEK' | 'BANTEN' | 'JAWA_BARAT' | 'JAWA_TENGAH_TIMUR' | 'LUAR_JAWA';
}

export const MASTER_PROYEK_INDONESIA: ProyekItem[] = [
  // --- BANTEN & TANGERANG RAYA ---
  { id: 'PRJ-001', proyek: 'CITRA GARDEN SERANG BLOK B & C', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KOTA SERANG', pksNumber: 'PKS/BNI/2024/011', region: 'BANTEN' },
  { id: 'PRJ-002', proyek: 'CITRARAYA TANGERANG CLUSTER ECOPOLIS', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KAB TANGERANG', pksNumber: 'PKS/BNI/2024/011', region: 'BANTEN' },
  { id: 'PRJ-003', proyek: 'CITRA MAJA RAYA CLUSTER TEVANA', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KAB LEBAK', pksNumber: 'PKS/BNI/2024/011', region: 'BANTEN' },
  { id: 'PRJ-004', proyek: 'BSD CITY CLUSTER THE EMINENT', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'KOTA TANGERANG SELATAN', pksNumber: 'PKS/BNI/2023/890', region: 'BANTEN' },
  { id: 'PRJ-005', proyek: 'NAVAPARK BSD RESIDENCES', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'KOTA TANGERANG SELATAN', pksNumber: 'PKS/BNI/2023/890', region: 'BANTEN' },
  { id: 'PRJ-006', proyek: 'THE ZORA BSD CITY (JAPAN LUXURY)', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'KAB TANGERANG', pksNumber: 'PKS/BNI/2023/890', region: 'BANTEN' },
  { id: 'PRJ-007', proyek: 'SUMMARECON SERPONG RAINBOW SPRINGS', devCode: 'DEV-003', developer: 'PT SUMMARECON AGUNG TBK', area: 'KAB TANGERANG', pksNumber: 'PKS/BNI/2024/104', region: 'BANTEN' },
  { id: 'PRJ-008', proyek: 'SUMMARECON SERPONG CLUSTER SYMPHONY', devCode: 'DEV-003', developer: 'PT SUMMARECON AGUNG TBK', area: 'KAB TANGERANG', pksNumber: 'PKS/BNI/2024/104', region: 'BANTEN' },
  { id: 'PRJ-009', proyek: 'ALAM SUTERA CLUSTER SUTERA WINONA', devCode: 'DEV-013', developer: 'PT ALAM SUTERA REALTY TBK', area: 'KOTA TANGERANG', pksNumber: 'PKS/BNI/2023/732', region: 'BANTEN' },
  { id: 'PRJ-010', proyek: 'SUVARNA SUTERA PASAR KEMIS', devCode: 'DEV-013', developer: 'PT ALAM SUTERA REALTY TBK', area: 'KAB TANGERANG', pksNumber: 'PKS/BNI/2023/732', region: 'BANTEN' },
  { id: 'PRJ-011', proyek: 'ELEVEES RESIDENCES DOWNTOWN ALAM SUTERA', devCode: 'DEV-013', developer: 'PT ALAM SUTERA REALTY TBK', area: 'KOTA TANGERANG', pksNumber: 'PKS/BNI/2023/732', region: 'BANTEN' },
  { id: 'PRJ-012', proyek: 'BINTARO JAYA DISCOVERY PARK', devCode: 'DEV-012', developer: 'PT JAYA REAL PROPERTY TBK', area: 'KOTA TANGERANG SELATAN', pksNumber: 'PKS/BNI/2024/401', region: 'BANTEN' },
  { id: 'PRJ-013', proyek: 'GRAHA RAYA BINTARO FORTUNE', devCode: 'DEV-012', developer: 'PT JAYA REAL PROPERTY TBK', area: 'KOTA TANGERANG SELATAN', pksNumber: 'PKS/BNI/2024/401', region: 'BANTEN' },
  { id: 'PRJ-014', proyek: 'LIPPO VILLAGE KARAWACI CENTRAL', devCode: 'DEV-006', developer: 'PT LIPPO KARAWACI TBK', area: 'KOTA TANGERANG', pksNumber: 'PKS/BNI/2023/310', region: 'BANTEN' },
  { id: 'PRJ-015', proyek: 'PARK SERPONG CLUSTER XYZ', devCode: 'DEV-006', developer: 'PT LIPPO KARAWACI TBK', area: 'KAB TANGERANG', pksNumber: 'PKS/BNI/2023/310', region: 'BANTEN' },
  { id: 'PRJ-016', proyek: 'KOTA MODERN TANGERANG', devCode: 'DEV-014', developer: 'PT MODERNLAND REALTY TBK', area: 'KOTA TANGERANG', pksNumber: 'PKS/BNI/2023/198', region: 'BANTEN' },
  { id: 'PRJ-017', proyek: 'MODERN CIKANDE RESIDENTIAL ESTATE', devCode: 'DEV-014', developer: 'PT MODERNLAND REALTY TBK', area: 'KAB SERANG', pksNumber: 'PKS/BNI/2023/198', region: 'BANTEN' },
  { id: 'PRJ-018', proyek: 'PARAMOUNT PETALS CURUG', devCode: 'DEV-016', developer: 'PT PARAMOUNT ENTERPRISE', area: 'KAB TANGERANG', pksNumber: 'PKS/BNI/2024/099', region: 'BANTEN' },
  { id: 'PRJ-019', proyek: 'GADING SERPONG PARAMOUNT HILLS', devCode: 'DEV-016', developer: 'PT PARAMOUNT ENTERPRISE', area: 'KAB TANGERANG', pksNumber: 'PKS/BNI/2024/099', region: 'BANTEN' },
  { id: 'PRJ-020', proyek: 'SAMESTA MAHATA SERPONG RAWABUNTU', devCode: 'DEV-007', developer: 'PERUM PERUMNAS (PERSERO)', area: 'KOTA TANGERANG SELATAN', pksNumber: 'PKS/BNI/2022/089', region: 'BANTEN' },

  // --- DKI JAKARTA ---
  { id: 'PRJ-021', proyek: 'CITRA GARDEN CITY CLUSTER AEROVILLE', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'JAKARTA BARAT', pksNumber: 'PKS/BNI/2024/011', region: 'JABODETABEK' },
  { id: 'PRJ-022', proyek: 'SOUTHGATE RESIDENCE TB SIMATUPANG', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'JAKARTA SELATAN', pksNumber: 'PKS/BNI/2023/890', region: 'JABODETABEK' },
  { id: 'PRJ-023', proyek: 'AERIUM APARTMENT TAMAN PERMATA BUANA', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'JAKARTA BARAT', pksNumber: 'PKS/BNI/2023/890', region: 'JABODETABEK' },
  { id: 'PRJ-024', proyek: 'SUMMARECON KELAPA GADING RESIDENCE', devCode: 'DEV-003', developer: 'PT SUMMARECON AGUNG TBK', area: 'JAKARTA UTARA', pksNumber: 'PKS/BNI/2024/104', region: 'JABODETABEK' },
  { id: 'PRJ-025', proyek: 'KOTA KASABLANKA RESIDENCE CASA GRANDE', devCode: 'DEV-004', developer: 'PT PAKUWON JATI TBK', area: 'JAKARTA SELATAN', pksNumber: 'PKS/BNI/2023/452', region: 'JABODETABEK' },
  { id: 'PRJ-026', proyek: 'GANDARIA CITY RESIDENCE', devCode: 'DEV-004', developer: 'PT PAKUWON JATI TBK', area: 'JAKARTA SELATAN', pksNumber: 'PKS/BNI/2023/452', region: 'JABODETABEK' },
  { id: 'PRJ-027', proyek: 'BUKIT PODOMORO JAKARTA', devCode: 'DEV-005', developer: 'PT AGUNG PODOMORO LAND TBK', area: 'JAKARTA TIMUR', pksNumber: 'PKS/BNI/2024/221', region: 'JABODETABEK' },
  { id: 'PRJ-028', proyek: 'SAMESTA SENTRALAND CENGKARENG', devCode: 'DEV-007', developer: 'PERUM PERUMNAS (PERSERO)', area: 'JAKARTA BARAT', pksNumber: 'PKS/BNI/2022/089', region: 'JABODETABEK' },
  { id: 'PRJ-029', proyek: 'TAMANSARI HIVE CAWANG', devCode: 'DEV-008', developer: 'PT WIJAYA KARYA REALTY', area: 'JAKARTA TIMUR', pksNumber: 'PKS/BNI/2024/156', region: 'JABODETABEK' },
  { id: 'PRJ-030', proyek: 'LRT CITY CIRACAS URBAN SIGNATURE', devCode: 'DEV-009', developer: 'PT ADHI COMMUTER PROPERTI TBK', area: 'JAKARTA TIMUR', pksNumber: 'PKS/BNI/2024/078', region: 'JABODETABEK' },
  { id: 'PRJ-031', proyek: 'SERENIA HILLS LEBAK BULUS', devCode: 'DEV-011', developer: 'PT INTILAND DEVELOPMENT TBK', area: 'JAKARTA SELATAN', pksNumber: 'PKS/BNI/2024/319', region: 'JABODETABEK' },
  { id: 'PRJ-032', proyek: 'SOUTH QUARTER RESIDENCE CILANDAK', devCode: 'DEV-011', developer: 'PT INTILAND DEVELOPMENT TBK', area: 'JAKARTA SELATAN', pksNumber: 'PKS/BNI/2024/319', region: 'JABODETABEK' },
  { id: 'PRJ-033', proyek: 'JAKARTA GARDEN CITY CAKUNG', devCode: 'DEV-014', developer: 'PT MODERNLAND REALTY TBK', area: 'JAKARTA TIMUR', pksNumber: 'PKS/BNI/2023/198', region: 'JABODETABEK' },
  { id: 'PRJ-034', proyek: 'PANTAI INDAH KAPUK 2 (PIK 2)', devCode: 'DEV-017', developer: 'PT AGUNG SEDAYU GROUP', area: 'JAKARTA UTARA / TANGERANG', pksNumber: 'PKS/BNI/2023/601', region: 'JABODETABEK' },
  { id: 'PRJ-035', proyek: 'GOLF ISLAND PIK 1', devCode: 'DEV-017', developer: 'PT AGUNG SEDAYU GROUP', area: 'JAKARTA UTARA', pksNumber: 'PKS/BNI/2023/601', region: 'JABODETABEK' },
  { id: 'PRJ-036', proyek: 'SEDAYU CITY KELAPA GADING', devCode: 'DEV-017', developer: 'PT AGUNG SEDAYU GROUP', area: 'JAKARTA TIMUR', pksNumber: 'PKS/BNI/2023/601', region: 'JABODETABEK' },

  // --- JAWA BARAT (BEKASI, BOGOR, DEPOK, BANDUNG, KARAWANG) ---
  { id: 'PRJ-037', proyek: 'GRAND WISATA BEKASI MONTE CARLO', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'KAB BEKASI', pksNumber: 'PKS/BNI/2023/890', region: 'JAWA_BARAT' },
  { id: 'PRJ-038', proyek: 'KOTA WISATA CIBUBUR CLUSTER NASHVILLE', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'KAB BOGOR', pksNumber: 'PKS/BNI/2023/890', region: 'JAWA_BARAT' },
  { id: 'PRJ-039', proyek: 'LEGENDA WISATA CIBUBUR', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'KAB BOGOR', pksNumber: 'PKS/BNI/2023/890', region: 'JAWA_BARAT' },
  { id: 'PRJ-040', proyek: 'SUMMARECON BEKASI THE SPRINGLAKE', devCode: 'DEV-003', developer: 'PT SUMMARECON AGUNG TBK', area: 'KOTA BEKASI', pksNumber: 'PKS/BNI/2024/104', region: 'JAWA_BARAT' },
  { id: 'PRJ-041', proyek: 'SUMMARECON CROWN GADING BEKASI', devCode: 'DEV-003', developer: 'PT SUMMARECON AGUNG TBK', area: 'KAB BEKASI', pksNumber: 'PKS/BNI/2024/104', region: 'JAWA_BARAT' },
  { id: 'PRJ-042', proyek: 'SUMMARECON BOGOR THE MAJESTIC', devCode: 'DEV-003', developer: 'PT SUMMARECON AGUNG TBK', area: 'KOTA BOGOR', pksNumber: 'PKS/BNI/2024/104', region: 'JAWA_BARAT' },
  { id: 'PRJ-043', proyek: 'SUMMARECON BANDUNG CLUSTER CYPRUS', devCode: 'DEV-003', developer: 'PT SUMMARECON AGUNG TBK', area: 'KOTA BANDUNG', pksNumber: 'PKS/BNI/2024/104', region: 'JAWA_BARAT' },
  { id: 'PRJ-044', proyek: 'PODOMORO GOLF VIEW CIMANGGIS', devCode: 'DEV-005', developer: 'PT AGUNG PODOMORO LAND TBK', area: 'KOTA DEPOK / BOGOR', pksNumber: 'PKS/BNI/2024/221', region: 'JAWA_BARAT' },
  { id: 'PRJ-045', proyek: 'PODOMORO PARK BANDUNG BUAH BATU', devCode: 'DEV-005', developer: 'PT AGUNG PODOMORO LAND TBK', area: 'KAB BANDUNG', pksNumber: 'PKS/BNI/2024/221', region: 'JAWA_BARAT' },
  { id: 'PRJ-046', proyek: 'KOTA PODOMORO TENJO THE GREENVILLE', devCode: 'DEV-005', developer: 'PT AGUNG PODOMORO LAND TBK', area: 'KAB BOGOR', pksNumber: 'PKS/BNI/2024/221', region: 'JAWA_BARAT' },
  { id: 'PRJ-047', proyek: 'GRAND TARUMA KARAWANG', devCode: 'DEV-005', developer: 'PT AGUNG PODOMORO LAND TBK', area: 'KAB KARAWANG', pksNumber: 'PKS/BNI/2024/221', region: 'JAWA_BARAT' },
  { id: 'PRJ-048', proyek: 'LIPPO CIKARANG WATERFRONT ESTATES', devCode: 'DEV-006', developer: 'PT LIPPO KARAWACI TBK', area: 'KAB BEKASI', pksNumber: 'PKS/BNI/2023/310', region: 'JAWA_BARAT' },
  { id: 'PRJ-049', proyek: 'SAMESTA MAHATA MARGONDA DEPOK', devCode: 'DEV-007', developer: 'PERUM PERUMNAS (PERSERO)', area: 'KOTA DEPOK', pksNumber: 'PKS/BNI/2022/089', region: 'JAWA_BARAT' },
  { id: 'PRJ-050', proyek: 'PERUMNAS PARUNG PANJANG ASRI', devCode: 'DEV-007', developer: 'PERUM PERUMNAS (PERSERO)', area: 'KAB BOGOR', pksNumber: 'PKS/BNI/2022/089', region: 'JAWA_BARAT' },
  { id: 'PRJ-051', proyek: 'TAMANSARI CYBER BOGOR HEIGHTS', devCode: 'DEV-008', developer: 'PT WIJAYA KARYA REALTY', area: 'KOTA BOGOR', pksNumber: 'PKS/BNI/2024/156', region: 'JAWA_BARAT' },
  { id: 'PRJ-052', proyek: 'LRT CITY BEKASI EASTERN GREEN', devCode: 'DEV-009', developer: 'PT ADHI COMMUTER PROPERTI TBK', area: 'KOTA BEKASI', pksNumber: 'PKS/BNI/2024/078', region: 'JAWA_BARAT' },
  { id: 'PRJ-053', proyek: 'LRT CITY SENTUL ROYAL SENTUL PARK', devCode: 'DEV-009', developer: 'PT ADHI COMMUTER PROPERTI TBK', area: 'KAB BOGOR', pksNumber: 'PKS/BNI/2024/078', region: 'JAWA_BARAT' },
  { id: 'PRJ-054', proyek: 'GRAND KAMALA LAGOON BEKASI', devCode: 'DEV-010', developer: 'PT PP PROPERTI TBK (PPRO)', area: 'KOTA BEKASI', pksNumber: 'PKS/BNI/2023/512', region: 'JAWA_BARAT' },
  { id: 'PRJ-055', proyek: 'METLAND TRANSYOGI CIBUBUR', devCode: 'DEV-015', developer: 'PT METROPOLITAN LAND TBK', area: 'KAB BOGOR', pksNumber: 'PKS/BNI/2024/333', region: 'JAWA_BARAT' },
  { id: 'PRJ-056', proyek: 'METLAND CIBITUNG TELAGA MURNI', devCode: 'DEV-015', developer: 'PT METROPOLITAN LAND TBK', area: 'KAB BEKASI', pksNumber: 'PKS/BNI/2024/333', region: 'JAWA_BARAT' },

  // --- JAWA TENGAH & JAWA TIMUR ---
  { id: 'PRJ-057', proyek: 'CITRALAND SURABAYA THE GREENLAKE', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KOTA SURABAYA', pksNumber: 'PKS/BNI/2024/011', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-058', proyek: 'CITRALAND DRIYOREJO CBD GRESIK', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KAB GRESIK', pksNumber: 'PKS/BNI/2024/011', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-059', proyek: 'CITRAGRAND SEMARANG CANDI GOLF', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KOTA SEMARANG', pksNumber: 'PKS/BNI/2024/011', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-060', proyek: 'PAKUWON MALL RESIDENCE TOWER SURABAYA', devCode: 'DEV-004', developer: 'PT PAKUWON JATI TBK', area: 'KOTA SURABAYA', pksNumber: 'PKS/BNI/2023/452', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-061', proyek: 'GRAND PAKUWON SURABAYA BARAT', devCode: 'DEV-004', developer: 'PT PAKUWON JATI TBK', area: 'KOTA SURABAYA', pksNumber: 'PKS/BNI/2023/452', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-062', proyek: 'PAKUWON CITY SURABAYA TIMUR', devCode: 'DEV-004', developer: 'PT PAKUWON JATI TBK', area: 'KOTA SURABAYA', pksNumber: 'PKS/BNI/2023/452', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-063', proyek: 'PAKUWON RESIDENCES SOLO BARU', devCode: 'DEV-004', developer: 'PT PAKUWON JATI TBK', area: 'KAB SUKOHARJO', pksNumber: 'PKS/BNI/2023/452', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-064', proyek: 'GRAND SUNGKONO LAGOON SURABAYA', devCode: 'DEV-010', developer: 'PT PP PROPERTI TBK (PPRO)', area: 'KOTA SURABAYA', pksNumber: 'PKS/BNI/2023/512', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-065', proyek: 'AMARTHA VIEW SEMARANG NGALIYAN', devCode: 'DEV-010', developer: 'PT PP PROPERTI TBK (PPRO)', area: 'KOTA SEMARANG', pksNumber: 'PKS/BNI/2023/512', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-066', proyek: 'BEGAWAN APARTMENT MALANG', devCode: 'DEV-010', developer: 'PT PP PROPERTI TBK (PPRO)', area: 'KOTA MALANG', pksNumber: 'PKS/BNI/2023/512', region: 'JAWA_TENGAH_TIMUR' },
  { id: 'PRJ-067', proyek: 'GRAHA NATURA SURABAYA BARAT', devCode: 'DEV-011', developer: 'PT INTILAND DEVELOPMENT TBK', area: 'KOTA SURABAYA', pksNumber: 'PKS/BNI/2024/319', region: 'JAWA_TENGAH_TIMUR' },

  // --- LUAR JAWA (BALI, SUMATERA, KALIMANTAN, SULAWESI) ---
  { id: 'PRJ-068', proyek: 'CITRALAND GAMA CITY MEDAN', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KOTA MEDAN / DELI SERDANG', pksNumber: 'PKS/BNI/2024/011', region: 'LUAR_JAWA' },
  { id: 'PRJ-069', proyek: 'PODOMORO CITY DELI MEDAN RESIDENCES', devCode: 'DEV-005', developer: 'PT AGUNG PODOMORO LAND TBK', area: 'KOTA MEDAN', pksNumber: 'PKS/BNI/2024/221', region: 'LUAR_JAWA' },
  { id: 'PRJ-070', proyek: 'CITRALAND PALEMBANG MUSI', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KOTA PALEMBANG', pksNumber: 'PKS/BNI/2024/011', region: 'LUAR_JAWA' },
  { id: 'PRJ-071', proyek: 'CIPUTRA BEACH RESORT TABANAN', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KAB TABANAN', pksNumber: 'PKS/BNI/2024/011', region: 'LUAR_JAWA' },
  { id: 'PRJ-072', proyek: 'CITRALAND CITY LOSARI WATERFRONT MAKASSAR', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KOTA MAKASSAR', pksNumber: 'PKS/BNI/2024/011', region: 'LUAR_JAWA' },
  { id: 'PRJ-073', proyek: 'SUMMARECON MUTIARA MAKASSAR', devCode: 'DEV-003', developer: 'PT SUMMARECON AGUNG TBK', area: 'KOTA MAKASSAR', pksNumber: 'PKS/BNI/2024/104', region: 'LUAR_JAWA' },
  { id: 'PRJ-074', proyek: 'GRAND CITY BALIKPAPAN RESIDENCES', devCode: 'DEV-002', developer: 'PT SINAR MAS LAND (BSD GROUP)', area: 'KOTA BALIKPAPAN', pksNumber: 'PKS/BNI/2023/890', region: 'LUAR_JAWA' },
  { id: 'PRJ-075', proyek: 'BORNEO BAY CITY BALIKPAPAN', devCode: 'DEV-005', developer: 'PT AGUNG PODOMORO LAND TBK', area: 'KOTA BALIKPAPAN', pksNumber: 'PKS/BNI/2024/221', region: 'LUAR_JAWA' },
  { id: 'PRJ-076', proyek: 'TAMANSARI METROPOLITAN MANADO', devCode: 'DEV-008', developer: 'PT WIJAYA KARYA REALTY', area: 'KOTA MANADO', pksNumber: 'PKS/BNI/2024/156', region: 'LUAR_JAWA' },
  { id: 'PRJ-077', proyek: 'CITRALAND PEKANBARU CLUSTER MAYFAIR', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KOTA PEKANBARU', pksNumber: 'PKS/BNI/2024/011', region: 'LUAR_JAWA' },
  { id: 'PRJ-078', proyek: 'CITRALAND DENPASAR BALI CLUSTER BUKIT', devCode: 'DEV-001', developer: 'PT CIPUTRA DEVELOPMENT TBK', area: 'KOTA DENPASAR', pksNumber: 'PKS/BNI/2024/011', region: 'LUAR_JAWA' },
];

export const searchProyek = (query: string, maxResults: number = 80): ProyekItem[] => {
  const q = (query || '').toLowerCase().trim();
  if (!q) return MASTER_PROYEK_INDONESIA.slice(0, maxResults);

  return MASTER_PROYEK_INDONESIA.filter(
    (p) =>
      p.proyek.toLowerCase().includes(q) ||
      p.developer.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.pksNumber && p.pksNumber.toLowerCase().includes(q))
  ).slice(0, maxResults);
};

/**
 * BNI eLO Konsumer - Layanan Reference Master Data Service
 * Centralized master data fetching with client cache and fallback
 */

import { ZipcodeResult, PartnerItem } from '../types/ide.types';

const API_BASE = 'http://localhost:5139/api';

const MOCK_ZIPCODES: ZipcodeResult[] = [
  { zipcode: '42111', kelurahan: 'Kotabaru', kecamatan: 'Serang', kota: 'Kota Serang', provinsi: 'Banten' },
  { zipcode: '42112', kelurahan: 'Cipare', kecamatan: 'Serang', kota: 'Kota Serang', provinsi: 'Banten' },
  { zipcode: '42113', kelurahan: 'Kagungan', kecamatan: 'Serang', kota: 'Kota Serang', provinsi: 'Banten' },
  { zipcode: '10260', kelurahan: 'Petamburan', kecamatan: 'Tanah Abang', kota: 'Jakarta Pusat', provinsi: 'DKI Jakarta' },
  { zipcode: '12190', kelurahan: 'Senayan', kecamatan: 'Kebayoran Baru', kota: 'Jakarta Selatan', provinsi: 'DKI Jakarta' },
  { zipcode: '13340', kelurahan: 'Cipinang Cempedak', kecamatan: 'Jatinegara', kota: 'Jakarta Timur', provinsi: 'DKI Jakarta' },
];

const MOCK_DEVELOPERS: PartnerItem[] = [
  { id: 'DEV-001', name: 'PT CIPUTRA DEVELOPMENT TBK', type: 'DEVELOPER', pksNumber: 'PKS/BNI/2024/011', projectList: ['Citra Garden Serang', 'CitraRaya Tangerang'], status: 'AKTIF (PKS)' },
  { id: 'DEV-002', name: 'PT SINAR MAS LAND', type: 'DEVELOPER', pksNumber: 'PKS/BNI/2023/890', projectList: ['BSD City', 'Grand Wisata'], status: 'AKTIF (PKS)' },
  { id: 'DEV-003', name: 'PT SUMMARECON AGUNG TBK', type: 'DEVELOPER', pksNumber: 'PKS/BNI/2024/104', projectList: ['Summarecon Serpong', 'Summarecon Bekasi'], status: 'AKTIF (PKS)' },
  { id: 'DEV-004', name: 'PT PAKUWON JATI TBK', type: 'DEVELOPER', pksNumber: 'PKS/BNI/2023/452', projectList: ['Pakuwon Mall Residence'], status: 'AKTIF (PKS)' },
  { id: 'DEV-005', name: 'DEVELOPER NON-PKS (PERORANGAN)', type: 'DEVELOPER', pksNumber: '-', projectList: ['Rumah Mandiri'], status: 'NON-PKS' },
];

const MOCK_MITRA_KARYA: PartnerItem[] = [
  { id: 'MT-001', name: 'PT TELKOM INDONESIA TBK', type: 'MITRA_KARYA', pksNumber: 'PKS/MITRA/2022/01', status: 'MITRA PAYROLL' },
  { id: 'MT-002', name: 'PT PLN (PERSERO)', type: 'MITRA_KARYA', pksNumber: 'PKS/MITRA/2021/44', status: 'MITRA PAYROLL' },
  { id: 'MT-003', name: 'PT PERTAMINA (PERSERO)', type: 'MITRA_KARYA', pksNumber: 'PKS/MITRA/2023/10', status: 'MITRA PAYROLL' },
  { id: 'MT-004', name: 'KEMENTERIAN KEUANGAN RI', type: 'MITRA_KARYA', pksNumber: 'PKS/MITRA/2020/05', status: 'MITRA ASN' },
];

export const referenceService = {
  async getGroupFasilitas(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/Parameter/Dropdown_Group_Fasilitas`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) return json.data;
    } catch {}
    return [
      { id: '1', grouP_NAME: 'Pembiayaan Griya' },
      { id: '2', grouP_NAME: 'BNI Griya Sejahtera' },
      { id: '3', grouP_NAME: 'BNI Griya Multiguna' }
    ];
  },

  async getChannels(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/Parameter/Dropdown_Channel`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) return json.data;
    } catch {}
    return [
      { cH_CODE: '01', cH_DESC: 'Branch' },
      { cH_CODE: '02', cH_DESC: 'Developer' },
      { cH_CODE: '03', cH_DESC: 'Dealers' },
      { cH_CODE: '04', cH_DESC: 'Institusi' },
      { cH_CODE: '15', cH_DESC: 'Eform' }
    ];
  },

  async getMedia(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/Parameter/Dropdown_Media`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) return json.data;
    } catch {}
    return [
      { mediA_CODE: '01', mediA_DESC: 'Walk In' },
      { mediA_CODE: '02', mediA_DESC: 'Telemarketing' },
      { mediA_CODE: '03', mediA_DESC: 'Pameran / Expo' }
    ];
  },

  async searchZipcode(query: string): Promise<ZipcodeResult[]> {
    if (!query || query.trim().length === 0) return MOCK_ZIPCODES;
    const q = query.trim().toLowerCase();
    try {
      const res = await fetch(`${API_BASE}/Reference/search-zipcode?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data)) return json.data;
    } catch {}

    return MOCK_ZIPCODES.filter(z =>
      z.zipcode.includes(q) ||
      z.kelurahan.toLowerCase().includes(q) ||
      z.kecamatan.toLowerCase().includes(q) ||
      z.kota.toLowerCase().includes(q)
    );
  },

  async searchPartners(query: string, type: 'DEVELOPER' | 'MITRA_KARYA' = 'DEVELOPER'): Promise<PartnerItem[]> {
    const list = type === 'DEVELOPER' ? MOCK_DEVELOPERS : MOCK_MITRA_KARYA;
    if (!query || query.trim().length === 0) return list;
    const q = query.trim().toLowerCase();
    try {
      const res = await fetch(`${API_BASE}/Reference/search-developer?q=${encodeURIComponent(q)}&type=${type}`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data)) return json.data;
    } catch {}

    return list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.projectList && p.projectList.some(proj => proj.toLowerCase().includes(q)))
    );
  }
};

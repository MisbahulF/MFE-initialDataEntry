import { MASTER_DEVELOPERS_INDONESIA, MASTER_MITRA_KARYA_INDONESIA } from '../data/masterPartners';
import { searchKecamatan, MASTER_KECAMATAN_INDONESIA } from '../data/masterKecamatan';
/**
 * BNI eLO Konsumer - Layanan Reference Master Data Service
 * Centralized master data fetching with client cache and fallback
 */

import { getApiBaseUrl } from '@template/shared';
import { ZipcodeResult, PartnerItem } from '../types/ide.types';

const API_BASE = getApiBaseUrl();

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
      { grouP_ID: '1', grouP_NAME: 'BNI GRIYA' },
      { grouP_ID: '4', grouP_NAME: 'BNI FLEKSI' },
      { grouP_ID: '5', grouP_NAME: 'BNI GRIYA MULTIGUNA' }
    ];
  },

  async getChannels(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/Parameter/Dropdown_Channel`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) return json.data;
    } catch {}
    return [
      { cH_CODE: '1', cH_DESC: 'Branch' },
      { cH_CODE: '10', cH_DESC: 'Developer' },
      { cH_CODE: '11', cH_DESC: 'Dealers' },
      { cH_CODE: '12', cH_DESC: 'Institusi' },
      { cH_CODE: '14', cH_DESC: 'BNI FLEKSI - Khusus WJS DIKNAS' },
      { cH_CODE: '16', cH_DESC: 'Instant Approval' },
      { cH_CODE: '17', cH_DESC: 'BAPERTARUM PNS - BUM GOL I' },
      { cH_CODE: '18', cH_DESC: 'BAPERTARUM PNS - BUM GOL II' },
      { cH_CODE: '19', cH_DESC: 'BAPERTARUM PNS - BUM GOL III' },
      { cH_CODE: '2', cH_DESC: 'Mail drop' },
      { cH_CODE: '20', cH_DESC: 'BAPERTARUM PNS - BTP PNS' },
      { cH_CODE: '21', cH_DESC: 'YKPP - BUM' },
      { cH_CODE: '22', cH_DESC: 'YKPP - PUM' },
      { cH_CODE: '23', cH_DESC: 'BPJS - JHT' },
      { cH_CODE: '24', cH_DESC: 'Eform' },
      { cH_CODE: '25', cH_DESC: 'Referral' },
      { cH_CODE: '26', cH_DESC: 'Mobile Banking' },
      { cH_CODE: '28', cH_DESC: 'Ringkas' },
      { cH_CODE: '3', cH_DESC: 'Member get member' },
      { cH_CODE: '4', cH_DESC: 'Others' },
      { cH_CODE: '5', cH_DESC: 'Pre-approved' },
      { cH_CODE: '6', cH_DESC: 'Printed Ad' },
      { cH_CODE: '7', cH_DESC: 'Take one' },
      { cH_CODE: '8', cH_DESC: 'Walk in' },
      { cH_CODE: '9', cH_DESC: 'Penjualan Sendiri' }
    ];
  },

  async getMedia(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/Parameter/Dropdown_Media`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) return json.data;
    } catch {}
    return [
      { mediaid: '01', medianame: 'Televisi' },
      { mediaid: '02', medianame: 'Radio' },
      { mediaid: '03', medianame: 'Surat Kabar' },
      { mediaid: '04', medianame: 'Majalah' },
      { mediaid: '05', medianame: 'Testing' }
    ];
  },

  async searchZipcode(query: string): Promise<ZipcodeResult[]> {
    const q = (query || '').trim().toLowerCase();
    
    // 1. Try Backend API first (Local SQLite with 83.762 records)
    try {
      const res = await fetch(`${API_BASE}/Reference/search-zipcode?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) return json.data;
    } catch {}

    // 2. Instant client-side search across ALL 7.285 Kecamatan se-Indonesia
    if (q.length > 0) {
      const kecResults = searchKecamatan(q, 50);
      if (kecResults.length > 0) {
        return kecResults.map(k => ({
          zipcode: k.kodepos,
          kelurahan: k.kecamatan,
          kecamatan: k.kecamatan,
          kota: k.kota,
          provinsi: k.provinsi
        }));
      }
    }

    // Default sample if empty query
    return MASTER_KECAMATAN_INDONESIA.slice(0, 20).map(k => ({
      zipcode: k.kodepos,
      kelurahan: k.kecamatan,
      kecamatan: k.kecamatan,
      kota: k.kota,
      provinsi: k.provinsi
    }));
  },

  async searchPartners(query: string, type: 'DEVELOPER' | 'MITRA_KARYA' = 'DEVELOPER'): Promise<PartnerItem[]> {
    const list = type === 'DEVELOPER' ? MASTER_DEVELOPERS_INDONESIA : MASTER_MITRA_KARYA_INDONESIA;
    if (!query || query.trim().length === 0) return list;
    const q = query.trim().toLowerCase();
    try {
      const res = await fetch(`${API_BASE}/Reference/search-developer?q=${encodeURIComponent(q)}&type=${type}`);
      const json = await res.json();
      if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) return json.data;
    } catch {}

    return list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.projectList && p.projectList.some(proj => proj.toLowerCase().includes(q)))
    );
  }
};

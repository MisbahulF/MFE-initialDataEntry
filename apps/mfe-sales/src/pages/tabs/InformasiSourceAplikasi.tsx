import { SearchZipcodeModal } from '../../components/SearchZipcodeModal';
import { SearchPartnerModal } from '../../components/SearchPartnerModal';
import { Package, FileText, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { SearchableSelect } from '../../components/SearchableSelect';
import { useAuth } from '@template/shared';

export interface InformasiSourceAplikasiProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onSaveDraft?: () => void;
  onLanjut?: (e?: React.FormEvent) => void;
  isSubmitting?: boolean;
}



const BRANCH_MAP: Record<string, string> = {
  '046': 'SERANG',
  '259': 'JAKARTA PUSAT',
  '001': 'JAKARTA KOTA',
  '002': 'BANDUNG',
  '007': 'SEMARANG',
  '009': 'SURABAYA',
  '018': 'MEDAN',
  '023': 'MAKASSAR',
  '034': 'PALEMBANG',
  '050': 'DENPASAR'
};

const DEFAULT_GROUPS = [
  { grouP_ID: '1', grouP_NAME: 'BNI GRIYA' },
  { grouP_ID: '4', grouP_NAME: 'BNI FLEKSI' },
  { grouP_ID: '5', grouP_NAME: 'BNI GRIYA MULTIGUNA' }
];

export const DEFAULT_GRIYA_FACILITIES = [
  { productid: '70', productname: 'BNI GRIYA TOP UP' },
  { productid: '7', productname: 'GRIYA IDAMAN PEMBANGUNAN RUMAH TINGGAL' },
  { productid: '6', productname: 'GRIYA IDAMAN PEMBELIAN RUMAH TINGGAL' },
  { productid: '18', productname: 'GRIYA IDAMAN PEMBELIAN RUSUN' },
  { productid: '10', productname: 'GRIYA IDAMAN REFINANCING RUMAH TINGGAL' },
  { productid: '11', productname: 'GRIYA IDAMAN REFINANCING RUSUN' },
  { productid: '8', productname: 'GRIYA IDAMAN RENOVASI RUMAH TINGGAL' },
  { productid: '13', productname: 'GRIYA IDAMAN RENOVASI RUSUN' },
  { productid: '16', productname: 'GRIYA IDAMAN TAKEOVER RUMAH TINGGAL' },
  { productid: '17', productname: 'GRIYA IDAMAN TAKEOVER RUSUN' },
  { productid: '29', productname: 'GRIYA IMPIAN PEMBANGUNAN VILLA' },
  { productid: '23', productname: 'GRIYA IMPIAN PEMBELIAN APARTEMEN' },
  { productid: '24', productname: 'GRIYA IMPIAN PEMBELIAN KONDOMINIUM' },
  { productid: '25', productname: 'GRIYA IMPIAN PEMBELIAN VILLA' },
  { productid: '39', productname: 'GRIYA IMPIAN REFINANCING APARTEMEN' },
  { productid: '40', productname: 'GRIYA IMPIAN REFINANCING KONDOMINIUM' },
  { productid: '41', productname: 'GRIYA IMPIAN REFINANCING VILLA' },
  { productid: '33', productname: 'GRIYA IMPIAN RENOVASI APARTEMEN' },
  { productid: '34', productname: 'GRIYA IMPIAN RENOVASI KONDOMINIUM' },
  { productid: '35', productname: 'GRIYA IMPIAN RENOVASI VILLA' },
  { productid: '45', productname: 'GRIYA IMPIAN TAKEOVER APARTEMEN' },
  { productid: '46', productname: 'GRIYA IMPIAN TAKEOVER KONDOMINIUM' },
  { productid: '47', productname: 'GRIYA IMPIAN TAKEOVER VILLA' },
  { productid: '83', productname: 'GRIYA PEMBANGUNAN BAPERTARUM' },
  { productid: '63', productname: 'GRIYA PEMBANGUNAN KIOS' },
  { productid: '31', productname: 'GRIYA PEMBANGUNAN KIOS' },
  { productid: '27', productname: 'GRIYA PEMBANGUNAN RUKAN' },
  { productid: '26', productname: 'GRIYA PEMBANGUNAN RUKO' },
  { productid: '82', productname: 'GRIYA PEMBELIAN BAPERTARUM' },
  { productid: '15', productname: 'GRIYA PEMBELIAN KAVLING' },
  { productid: '62', productname: 'GRIYA PEMBELIAN KIOS' },
  { productid: '22', productname: 'GRIYA PEMBELIAN KIOS' },
  { productid: '21', productname: 'GRIYA PEMBELIAN RUKAN' },
  { productid: '20', productname: 'GRIYA PEMBELIAN RUKO' },
  { productid: '42', productname: 'GRIYA REFINANCING KAVLING' },
  { productid: '38', productname: 'GRIYA REFINANCING KIOS' },
  { productid: '65', productname: 'GRIYA REFINANCING KIOS' },
  { productid: '37', productname: 'GRIYA REFINANCING RUKAN' },
  { productid: '36', productname: 'GRIYA REFINANCING RUKO' },
  { productid: '32', productname: 'GRIYA RENOVASI KIOS' },
  { productid: '64', productname: 'GRIYA RENOVASI KIOS' },
  { productid: '12', productname: 'GRIYA RENOVASI RUKAN' },
  { productid: '14', productname: 'GRIYA RENOVASI RUKO' },
  { productid: '9', productname: 'GRIYA SEHAT' },
  { productid: '1', productname: 'GRIYA SEHAT BAPERTARUM PEMBELIAN' },
  { productid: '2', productname: 'GRIYA SEHAT JAMSOSTEK PEMBELIAN' },
  { productid: '4', productname: 'GRIYA SEHAT MENPERA PEMBANGUNAN' },
  { productid: '3', productname: 'GRIYA SEHAT MENPERA PEMBELIAN' },
  { productid: '5', productname: 'GRIYA SEHAT MENPERA RENOVASI' },
  { productid: '67', productname: 'GRIYA SEHAT MENPERA SARUSUNA' },
  { productid: '43', productname: 'GRIYA TAKEOVER KAVLING' },
  { productid: '66', productname: 'GRIYA TAKEOVER KIOS' },
  { productid: '49', productname: 'GRIYA TAKEOVER KIOS' },
  { productid: '48', productname: 'GRIYA TAKEOVER RUKAN' },
  { productid: '44', productname: 'GRIYA TAKEOVER RUKO' },
  { productid: '81', productname: 'KPR Sejahtera Bank BNI' },
  { productid: '85', productname: 'MLT BPJS PEMBELIAN APARTEMEN' },
  { productid: '86', productname: 'MLT BPJS PEMBELIAN RUKO' },
  { productid: '84', productname: 'MLT BPJS PEMBELIAN RUMAH' },
  { productid: '87', productname: 'MLT BPJS RENOVASI' }
];

export const DEFAULT_FLEKSI_FACILITIES = [
  { productid: '58', productname: 'FLEKSI' },
  { productid: '72', productname: 'FLEKSI KEMITRAAN' },
  { productid: '88', productname: 'FLEKSI PENSIUN' },
  { productid: '95', productname: 'FLEKSI PENSIUN IBR' }
];

export const DEFAULT_PROGRAMS_PEMBELIAN_RUMAH = [
  {
    "pR_CODE": "2",
    "pR_DESC": "ANGSURAN SUKA-SUKA"
  },
  {
    "pR_CODE": "1024",
    "pR_DESC": "BNI FLEKSI - POLRES BANJARNEGARA"
  },
  {
    "pR_CODE": "1254",
    "pR_DESC": "BNI Griya - 2025 HUT 1,79% fixed 1 Thn"
  },
  {
    "pR_CODE": "150",
    "pR_DESC": "BNI Griya - BANK OPERASIONAL"
  },
  {
    "pR_CODE": "1160",
    "pR_DESC": "BNI GRIYA - BEBAS PSJT 2019 TIER 1"
  },
  {
    "pR_CODE": "1161",
    "pR_DESC": "BNI GRIYA - BEBAS PSJT 2019 TIER 2"
  },
  {
    "pR_CODE": "1162",
    "pR_DESC": "BNI GRIYA - BEBAS PSJT 2019 TIER 3"
  },
  {
    "pR_CODE": "1164",
    "pR_DESC": "BNI GRIYA - BP2BT 2019"
  },
  {
    "pR_CODE": "912",
    "pR_DESC": "BNI Griya - CASH BERTAHAP"
  },
  {
    "pR_CODE": "1152",
    "pR_DESC": "BNI GRIYA - DEBITUR NPL DAN HAPUS BUKU SEGMEN BB (REG-1)"
  },
  {
    "pR_CODE": "1153",
    "pR_DESC": "BNI GRIYA - DEBITUR NPL DAN HAPUS BUKU SEGMEN BB (REG-2)"
  },
  {
    "pR_CODE": "1154",
    "pR_DESC": "BNI GRIYA - DEBITUR NPL DAN HAPUS BUKU SEGMEN BB (SUKU BUNGA PROMO TIER-1)"
  },
  {
    "pR_CODE": "1155",
    "pR_DESC": "BNI GRIYA - DEBITUR NPL DAN HAPUS BUKU SEGMEN BB (SUKU BUNGA PROMO TIER-3)"
  },
  {
    "pR_CODE": "1198",
    "pR_DESC": "BNI GRIYA - FIXED 5 TAHUN"
  },
  {
    "pR_CODE": "142",
    "pR_DESC": "BNI Griya - HOAP (PERTAMINA EP)"
  },
  {
    "pR_CODE": "74",
    "pR_DESC": "BNI Griya - HOAP (PT. Medco EP)"
  },
  {
    "pR_CODE": "132",
    "pR_DESC": "BNI Griya - HOAP HESS LIMITED"
  },
  {
    "pR_CODE": "1044",
    "pR_DESC": "BNI GRIYA - HOAP PT. SAKA INDONESIA PANGKAH LIMITED (SIPL)"
  },
  {
    "pR_CODE": "490",
    "pR_DESC": "BNI Griya - HOP (PERTAMINA EP CEPU)"
  },
  {
    "pR_CODE": "1144",
    "pR_DESC": "BNI GRIYA - IIPEX 2019"
  },
  {
    "pR_CODE": "709",
    "pR_DESC": "BNI Griya - Institut Teknologi Nasional (ITENAS)"
  },
  {
    "pR_CODE": "747",
    "pR_DESC": "BNI Griya - KEMENLU"
  },
  {
    "pR_CODE": "745",
    "pR_DESC": "BNI Griya - KEMENPUPERA"
  },
  {
    "pR_CODE": "718",
    "pR_DESC": "BNI Griya - KEMENTERIAN AGAMA"
  },
  {
    "pR_CODE": "1092",
    "pR_DESC": "BNI Griya - Khusus Guru, Tenaga Pendidik, & Pegawai Kemendikbud (Min.10 thn)"
  },
  {
    "pR_CODE": "1091",
    "pR_DESC": "BNI Griya - Khusus Guru, Tenaga Pendidik, & Pegawai Kemendikbud (Min.8 thn)"
  },
  {
    "pR_CODE": "1089",
    "pR_DESC": "BNI Griya - Khusus Guru,Tenaga Pendidik & Pegawai Kemendikbud(Min.7thn Fix.1thn)"
  },
  {
    "pR_CODE": "1090",
    "pR_DESC": "BNI Griya - Khusus Guru,Tenaga Pendidik & Pegawai Kemendikbud(Min.7thn Fix.2thn)"
  },
  {
    "pR_CODE": "1053",
    "pR_DESC": "BNI Griya - Khusus Karyawan BPK"
  },
  {
    "pR_CODE": "1168",
    "pR_DESC": "BNI GRIYA - KHUSUS KARYAWAN PT. HUTAMA KARYA 1 (TENOR MIN 12 s/d 24 BLN)"
  },
  {
    "pR_CODE": "1169",
    "pR_DESC": "BNI GRIYA - KHUSUS KARYAWAN PT. HUTAMA KARYA 2 (TENOR MIN 36 BLN)"
  },
  {
    "pR_CODE": "1170",
    "pR_DESC": "BNI GRIYA - KHUSUS KARYAWAN PT. HUTAMA KARYA 3 (TENOR MIN 48 BLN)"
  },
  {
    "pR_CODE": "1171",
    "pR_DESC": "BNI GRIYA - KHUSUS KARYAWAN PT. HUTAMA KARYA 4 (TENOR MIN 60 BLN)"
  },
  {
    "pR_CODE": "1172",
    "pR_DESC": "BNI GRIYA - KHUSUS KARYAWAN PT. HUTAMA KARYA 5 (TENOR MIN 120 BLN)"
  },
  {
    "pR_CODE": "1131",
    "pR_DESC": "BNI GRIYA - KHUSUS PT. HIDRO TAMARIS"
  },
  {
    "pR_CODE": "168",
    "pR_DESC": "BNI Griya - NON HOAP (PERTAMINA EP)"
  },
  {
    "pR_CODE": "491",
    "pR_DESC": "BNI Griya - NON HOP (PERTAMINA EP CEPU)"
  },
  {
    "pR_CODE": "1075",
    "pR_DESC": "BNI GRIYA - PEGAWAI PT. ASAHIMAS CHEMICAL (ASC)"
  },
  {
    "pR_CODE": "1174",
    "pR_DESC": "BNI GRIYA - PEGAWAI PT. KALLA GROUP"
  },
  {
    "pR_CODE": "1002",
    "pR_DESC": "BNI GRIYA - PELINDO III FIXED 2 TAHUN"
  },
  {
    "pR_CODE": "978",
    "pR_DESC": "BNI GRIYA - PELINDO III FIXED 5 TAHUN"
  },
  {
    "pR_CODE": "1048",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS DIREKSI BUMN (TENOR MIN 12 BLN)"
  },
  {
    "pR_CODE": "1049",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS DIREKSI BUMN (TENOR MIN 36 BLN)"
  },
  {
    "pR_CODE": "1050",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS DIREKSI BUMN (TENOR MIN 48 BLN)"
  },
  {
    "pR_CODE": "1051",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS DIREKSI BUMN (TENOR MIN 60 BLN)"
  },
  {
    "pR_CODE": "1058",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS DIREKSI BUMN (TENOR MIN 61 BLN)"
  },
  {
    "pR_CODE": "1061",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS NASABAH EMERALD (TENOR MIN 12 BLN)"
  },
  {
    "pR_CODE": "1080",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS NASABAH EMERALD (TENOR MIN 120 BLN)"
  },
  {
    "pR_CODE": "1062",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS NASABAH EMERALD (TENOR MIN 36 BLN)"
  },
  {
    "pR_CODE": "1063",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS NASABAH EMERALD (TENOR MIN 48 BLN)"
  },
  {
    "pR_CODE": "1064",
    "pR_DESC": "BNI GRIYA - PROGRAM BUNGA KHUSUS NASABAH EMERALD (TENOR MIN 60 BLN)"
  },
  {
    "pR_CODE": "983",
    "pR_DESC": "BNI GRIYA - PROMO AKHIR TAHUN 2017"
  },
  {
    "pR_CODE": "585",
    "pR_DESC": "BNI Griya - PT. AJB bumiputera 1912"
  },
  {
    "pR_CODE": "984",
    "pR_DESC": "BNI GRIYA - PT. BINA BUSANA INTERNUSA"
  },
  {
    "pR_CODE": "997",
    "pR_DESC": "BNI GRIYA - PT. BUKIT ASAM OPSI 1"
  },
  {
    "pR_CODE": "998",
    "pR_DESC": "BNI GRIYA - PT. BUKIT ASAM OPSI 2"
  },
  {
    "pR_CODE": "999",
    "pR_DESC": "BNI GRIYA - PT. BUKIT ASAM OPSI 3"
  },
  {
    "pR_CODE": "521",
    "pR_DESC": "BNI Griya - PT. First Indo American Leasing"
  },
  {
    "pR_CODE": "616",
    "pR_DESC": "BNI Griya - PT. NS Bluescope Indonesia"
  },
  {
    "pR_CODE": "514",
    "pR_DESC": "BNI Griya - PT. Priamanaya Djan Internasional"
  },
  {
    "pR_CODE": "852",
    "pR_DESC": "BNI Griya - PTPN"
  },
  {
    "pR_CODE": "371",
    "pR_DESC": "BNI Griya - QATAR"
  },
  {
    "pR_CODE": "1156",
    "pR_DESC": "BNI GRIYA - REGULER BEBAS PSJT 2019 FIXED 1 TAHUN"
  },
  {
    "pR_CODE": "1157",
    "pR_DESC": "BNI GRIYA - REGULER BEBAS PSJT 2019 FIXED 2 TAHUN"
  },
  {
    "pR_CODE": "592",
    "pR_DESC": "BNI Griya - STP TRISAKTI"
  },
  {
    "pR_CODE": "1054",
    "pR_DESC": "BNI Griya - Subsidi Bunga 2% Selama 2 Tahun SAUNG RIUNG"
  },
  {
    "pR_CODE": "1076",
    "pR_DESC": "BNI Griya - Suku Bunga 6,75 fixed 4 thn Simprug diPoris"
  },
  {
    "pR_CODE": "1200",
    "pR_DESC": "BNI GRIYA - SUKU BUNGA KHUSUS NASABAH EMERALD WMK (TENOR MIN 12 BLN)"
  },
  {
    "pR_CODE": "1121",
    "pR_DESC": "BNI GRIYA - SUKU BUNGA TAHUN 2019 TIER 1"
  },
  {
    "pR_CODE": "1122",
    "pR_DESC": "BNI GRIYA - SUKU BUNGA TAHUN 2019 TIER 2"
  },
  {
    "pR_CODE": "1123",
    "pR_DESC": "BNI GRIYA - SUKU BUNGA TAHUN 2019 TIER 3"
  },
  {
    "pR_CODE": "1180",
    "pR_DESC": "BNI GRIYA - SUKU BUNGA TAHUN 2020 TIER 1"
  },
  {
    "pR_CODE": "1181",
    "pR_DESC": "BNI GRIYA - SUKU BUNGA TAHUN 2020 TIER 2"
  },
  {
    "pR_CODE": "1182",
    "pR_DESC": "BNI GRIYA - SUKU BUNGA TAHUN 2020 TIER 3"
  },
  {
    "pR_CODE": "1111",
    "pR_DESC": "BNI Griya - Top Level Management BUMN dan Kementerian (Tenor Min 12 Bln)"
  },
  {
    "pR_CODE": "1196",
    "pR_DESC": "BNI Griya - Top Level Management BUMN dan Kementerian (Tenor Min 24 Bln)"
  },
  {
    "pR_CODE": "1112",
    "pR_DESC": "BNI Griya - Top Level Management BUMN dan Kementerian (Tenor Min 36 Bln)"
  },
  {
    "pR_CODE": "1113",
    "pR_DESC": "BNI Griya - Top Level Management BUMN dan Kementerian (Tenor Min 48 Bln)"
  },
  {
    "pR_CODE": "1114",
    "pR_DESC": "BNI Griya - Top Level Management BUMN dan Kementerian (Tenor Min 60 Bln)"
  },
  {
    "pR_CODE": "49",
    "pR_DESC": "BNI Griya - TOP UP"
  },
  {
    "pR_CODE": "1065",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 1 THN)"
  },
  {
    "pR_CODE": "1074",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 10 THN)"
  },
  {
    "pR_CODE": "1066",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 2 THN)"
  },
  {
    "pR_CODE": "1067",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 3 THN)"
  },
  {
    "pR_CODE": "1068",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 4 THN)"
  },
  {
    "pR_CODE": "1069",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 5 THN)"
  },
  {
    "pR_CODE": "1070",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 6 THN)"
  },
  {
    "pR_CODE": "1071",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 7 THN)"
  },
  {
    "pR_CODE": "1072",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 8 THN)"
  },
  {
    "pR_CODE": "1073",
    "pR_DESC": "BNI GRIYA - TOP UP - DEBITUR EKSISTING 2018 (JANGKA WAKTU 9 THN)"
  },
  {
    "pR_CODE": "1195",
    "pR_DESC": "BNI GRIYA - TOP UP DEBITUR EKSISTING 2020"
  },
  {
    "pR_CODE": "655",
    "pR_DESC": "BNI Griya - UNNES"
  },
  {
    "pR_CODE": "333",
    "pR_DESC": "BNI Griya Khusus - Diplomat KEMLU"
  },
  {
    "pR_CODE": "138",
    "pR_DESC": "BNI Griya Khusus - NOTARIS & PPAT"
  },
  {
    "pR_CODE": "690",
    "pR_DESC": "BNI Griya Khusus - PT. CEMINDO GEMILANG"
  },
  {
    "pR_CODE": "1134",
    "pR_DESC": "BNI GRIYA KHUSUS ANGGOTA TNI AD"
  },
  {
    "pR_CODE": "1103",
    "pR_DESC": "BNI Griya Q1 - 2019 Tier 1"
  },
  {
    "pR_CODE": "1105",
    "pR_DESC": "BNI Griya Q1 - 2019 Tier 2"
  },
  {
    "pR_CODE": "1106",
    "pR_DESC": "BNI Griya Q1 - 2019 Tier 3"
  },
  {
    "pR_CODE": "1025",
    "pR_DESC": "BNI GRIYA Q2 - 2018"
  },
  {
    "pR_CODE": "1043",
    "pR_DESC": "BNI GRIYA Q3 - 2018"
  },
  {
    "pR_CODE": "1057",
    "pR_DESC": "BNI Griya Q4 - 2018"
  },
  {
    "pR_CODE": "141",
    "pR_DESC": "BUNDLING BNI Griya dan BNI Fleksi"
  },
  {
    "pR_CODE": "1",
    "pR_DESC": "REGULER"
  },
  {
    "pR_CODE": "987",
    "pR_DESC": "REGULER FIXED 2 TAHUN"
  }
];

export const DEFAULT_MULTIGUNA_FACILITIES = [
  { productid: '61', productname: 'BNI GRIYA MULTIGUNA DUAL FACILITY' },
  { productid: '60', productname: 'BNI GRIYA MULTIGUNA SINGLE FACILITY' },
  { productid: '69', productname: 'BNI GRIYA MULTIGUNA TOP UP' }
];



// Helper validasi nomor handphone Indonesia (08 / +62, 11 - 13 digit)
export const validateIndonesianPhone = (phone: string): { isValid: boolean; message: string } => {
  if (!phone || !phone.trim()) {
    return { isValid: false, message: 'Nomor handphone wajib diisi' };
  }
  const clean = phone.trim();

  const startsWith08 = clean.startsWith('08');
  const startsWithPlus62 = clean.startsWith('+62');
  const startsWith62 = clean.startsWith('62') && !clean.startsWith('620');

  if (!startsWith08 && !startsWithPlus62 && !startsWith62) {
    return { isValid: false, message: 'Nomor HP harus berawalan 08 atau +62' };
  }

  const digitsOnly = clean.replace(/[^0-9]/g, '');
  let normalized = digitsOnly;
  if (digitsOnly.startsWith('62')) {
    normalized = '0' + digitsOnly.slice(2);
  }

  if (normalized.length < 11) {
    return { isValid: false, message: `Nomor HP minimal 11 angka (saat ini ${normalized.length} angka)` };
  }
  if (normalized.length > 13) {
    return { isValid: false, message: `Nomor HP maksimal 13 angka (saat ini ${normalized.length} angka)` };
  }

  return { isValid: true, message: '' };
};

// Helper validasi email
export const validateEmail = (email: string): boolean => {
  if (!email || !email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// Helper validasi jangka waktu tenor
export const validateTenor = (tenor: string | number): { isValid: boolean; message: string } => {
  if (!tenor) return { isValid: true, message: '' };
  const num = typeof tenor === 'string' ? parseInt(tenor, 10) : tenor;
  if (isNaN(num)) return { isValid: false, message: 'Jangka waktu harus berupa angka' };
  if (num < 12) return { isValid: false, message: 'Jangka waktu minimum 12 bulan' };
  if (num > 360) return { isValid: false, message: 'Jangka waktu maksimum 360 bulan' };
  return { isValid: true, message: '' };
};

export const InformasiSourceAplikasi: React.FC<InformasiSourceAplikasiProps> = ({
  formData,
  onChange,
  onLanjut,
  isSubmitting = false,
}) => {
  const { user } = useAuth();
  const userRegionalSales = user?.branch ? (user.branch.includes('STA') ? user.branch : `${user.branch} STA`) : 'SERANG STA';
  const userSalesName = user?.name && user?.userId 
    ? `${user.name} - ${user.userId}` 
    : (user?.name ? `${user.name} - SC70629` : 'SURYA HARJAYA - SC70629');

  useEffect(() => {
    if (!formData?.regionalSales) {
      onChange('regionalSales', userRegionalSales);
    }
    if (!formData?.namaSales) {
      onChange('namaSales', userSalesName);
    }
  }, [userRegionalSales, userSalesName]);

  
  const [groupFasilitasList, setGroupFasilitasList] = useState<any[]>(DEFAULT_GROUPS);
  const [fasilitasList, setFasilitasList] = useState<any[]>([]);
  const [programList, setProgramList] = useState<any[]>([
    { pR_CODE: 'REG', pR_DESC: 'REGULER' },
    { pR_CODE: 'HUT', pR_DESC: 'PROMO HUT BNI' },
    { pR_CODE: 'MIL', pR_DESC: 'BNI GRIYA MILENIAL / GUWE' },
    { pR_CODE: 'ASN', pR_DESC: 'PROGRAM KHUSUS ASN & BUMN' },
    { pR_CODE: 'PKS', pR_DESC: 'PROGRAM PKS DEVELOPER REKANAN' }
  ]);
  const [tujuanList, setTujuanList] = useState<any[]>([
    { id: '11', tujuaN_NAME: 'TANAH ATAU KAPLING' },
    { id: '12', tujuaN_NAME: 'RUMAH BARU' },
    { id: '13', tujuaN_NAME: 'TAKE OVER RUMAH' },
    { id: '14', tujuaN_NAME: 'RENOVASI RUMAH' },
    { id: '15', tujuaN_NAME: 'PEMBANGUNAN RUMAH' },
    { id: '16', tujuaN_NAME: 'REFINANCING RUMAH' },
    { id: '17', tujuaN_NAME: 'TAKE OVER PLUS' },
    { id: '18', tujuaN_NAME: 'RUMAH SECOND' },
    { id: '19', tujuaN_NAME: 'BNI GRIYA TOP UP' }
  ]);
  const [channelList, setChannelList] = useState<any[]>([
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
  ]);
  const [mediaList, setMediaList] = useState<any[]>([
    { mediaid: '01', medianame: 'Televisi' },
    { mediaid: '02', medianame: 'Radio' },
    { mediaid: '03', medianame: 'Surat Kabar' },
    { mediaid: '04', medianame: 'Majalah' },
    { mediaid: '05', medianame: 'Testing' }
  ]);
  const [tipeNasabahList, setTipeNasabahList] = useState<any[]>([
    { rN_CODE: 2, rN_DESC: 'Emerald BNI' },
    { rN_CODE: 4, rN_DESC: 'Nasabah Dana' },
    { rN_CODE: 5, rN_DESC: 'Nasabah VIP' },
    { rN_CODE: 3, rN_DESC: 'Non Nasabah' },
    { rN_CODE: 1, rN_DESC: 'Payroll BNI' }
  ]);
  const [appraisalList, setAppraisalList] = useState<any[]>([
    { code: '30023', name: 'INHOUSE KERAGILAN KCP' },
    { code: '29639', name: 'INHOUSE RANGKASBITUNG - KLN' },
    { code: '0175', name: 'INHOUSE SERANG' },
    { code: '0329', name: 'STA-SERANG' }
  ]);
  const [asuransiList, setAsuransiList] = useState<any[]>([
    { code: '1', name: 'PT. Asuransi CIGNA' },
    { code: '15', name: 'PT.ASURANSI JASA INDONESIA' },
    { code: '5', name: 'PT. Asuransi Jiwasraya' },
    { code: '52', name: 'PT. Asuransi Jiwa Mega Life' },
    { code: '58', name: 'PT. BNI Life Insurance' }
  ]);
  const [notarisList, setNotarisList] = useState<any[]>([
    { code: '4361', name: 'H.M.ISLAMSYAH ARIFIN, SH' }
  ]);
  const [investigationList, setInvestigationList] = useState<any[]>([
    { code: '30024', name: 'INHOUSE KERAGILAN KCP' },
    { code: '29637', name: 'INHOUSE RANGKASBITUNG - KLN' },
    { code: '0291', name: 'STA-SERANG' }
  ]);

  useEffect(() => {
    // 1. Fetch Group Fasilitas
    fetch('http://localhost:5139/api/Parameter/Dropdown_Group_Fasilitas')
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setGroupFasilitasList(json.data);
        }
      })
      .catch(() => {});

    // 2. Fetch Channels
    fetch('http://localhost:5139/api/Parameter/Dropdown_Channel')
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setChannelList(json.data);
        }
      })
      .catch(() => {});

    // 3. Fetch Media
    fetch('http://localhost:5139/api/Parameter/Dropdown_Media')
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setMediaList(json.data);
        }
      })
      .catch(() => {});

    // 4. Fetch Tujuan Pembiayaan
    fetch('http://localhost:5139/api/Parameter/Dropdown_IDD_Tujuan_Pembiayaan')
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setTujuanList(json.data);
        }
      })
      .catch(() => {});

    // 5. Fetch Tipe Nasabah
    fetch('http://localhost:5139/api/Parameter/Tipe_Nasabah')
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setTipeNasabahList(json.data);
        }
      })
      .catch(() => {});

    // 6. Fetch Pihak Ketiga
    fetch('http://localhost:5139/api/Parameter/Dropdown_Appraisal')
      .then(res => res.json())
      .then(json => { if (json?.isSuccess && Array.isArray(json.data)) setAppraisalList(json.data); })
      .catch(() => {});

    fetch('http://localhost:5139/api/Parameter/Dropdown_Asuransi')
      .then(res => res.json())
      .then(json => { if (json?.isSuccess && Array.isArray(json.data)) setAsuransiList(json.data); })
      .catch(() => {});

    fetch('http://localhost:5139/api/Parameter/Dropdown_Notaris')
      .then(res => res.json())
      .then(json => { if (json?.isSuccess && Array.isArray(json.data)) setNotarisList(json.data); })
      .catch(() => {});

    fetch('http://localhost:5139/api/Parameter/Dropdown_Investigation')
      .then(res => res.json())
      .then(json => { if (json?.isSuccess && Array.isArray(json.data)) setInvestigationList(json.data); })
      .catch(() => {});
  }, []);

  const loadProgramsByProduct = (facilityName: string) => {
    let pId = facilityName;
    if (facilityName === '6' || facilityName.toUpperCase().includes('PEMBELIAN RUMAH TINGGAL')) {
      pId = '6';
    }
    fetch('http://localhost:5139/api/Parameter/Kode_Program?productId=' + encodeURIComponent(pId))
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setProgramList(json.data);
        } else if (pId === '6') {
          setProgramList(DEFAULT_PROGRAMS_PEMBELIAN_RUMAH);
        }
      })
      .catch(() => {
        if (pId === '6') {
          setProgramList(DEFAULT_PROGRAMS_PEMBELIAN_RUMAH);
        }
      });
  };

  useEffect(() => {
    if (formData?.fasilitas) {
      loadProgramsByProduct(formData.fasilitas);
    }
  }, [formData?.fasilitas]);

  const loadFasilitasByGroup = (groupNameOrId: string) => {
    let idParam = groupNameOrId;
    if (groupNameOrId.toUpperCase().includes('GRIYA') && !groupNameOrId.toUpperCase().includes('MULTIGUNA')) idParam = '1';
    else if (groupNameOrId.toUpperCase().includes('FLEKSI')) idParam = '4';
    else if (groupNameOrId.toUpperCase().includes('MULTIGUNA')) idParam = '5';

    fetch('http://localhost:5139/api/Parameter/Dropdown_Fasilitas?groupId=' + encodeURIComponent(idParam))
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setFasilitasList(json.data);
        } else if (groupNameOrId.toUpperCase().includes('MULTIGUNA') || groupNameOrId === '5') {
          setFasilitasList(DEFAULT_MULTIGUNA_FACILITIES);
        } else if (groupNameOrId.toUpperCase().includes('FLEKSI') || groupNameOrId === '4') {
          setFasilitasList(DEFAULT_FLEKSI_FACILITIES);
        } else if (groupNameOrId.toUpperCase().includes('GRIYA') || groupNameOrId === '1') {
          setFasilitasList(DEFAULT_GRIYA_FACILITIES);
        }
      })
      .catch(() => {
        if (groupNameOrId.toUpperCase().includes('MULTIGUNA') || groupNameOrId === '5') {
          setFasilitasList(DEFAULT_MULTIGUNA_FACILITIES);
        } else if (groupNameOrId.toUpperCase().includes('FLEKSI') || groupNameOrId === '4') {
          setFasilitasList(DEFAULT_FLEKSI_FACILITIES);
        } else if (groupNameOrId.toUpperCase().includes('GRIYA') || groupNameOrId === '1') {
          setFasilitasList(DEFAULT_GRIYA_FACILITIES);
        }
      });
  };

  useEffect(() => {
    if (formData?.groupFasilitas) {
      loadFasilitasByGroup(formData.groupFasilitas);
    }
  }, [formData?.groupFasilitas]);

  
  const handleKodeCabangChange = (val: string) => {
    const code = val.trim();
    onChange('kodeCabangPembukuan', code);
    const branchName = BRANCH_MAP[code] || (code.length === 3 ? `CABANG ${code}` : '');
    if (branchName) {
      onChange('namaCabangPembukuan', branchName);
    }
  };

  
  // State validasi real-time
  const hpValidation = formData?.noHandphone ? validateIndonesianPhone(formData.noHandphone) : { isValid: true, message: '' };
  const emailValidation = formData?.email ? validateEmail(formData.email) : true;
  const tenorValidation = formData?.jangkaWaktu ? validateTenor(formData.jangkaWaktu) : { isValid: true, message: '' };

  const handleHandphoneChange = (val: string) => {
    let clean = val.replace(/[^0-9+]/g, '');
    if (clean.indexOf('+') > 0) {
      clean = clean.charAt(0) + clean.slice(1).replace(/\+/g, '');
    }
    const maxLen = clean.startsWith('+') ? 15 : 13;
    onChange('noHandphone', clean.slice(0, maxLen));
  };

  const handleGroupFasilitasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange('groupFasilitas', val);
    onChange('fasilitas', '');
    onChange('kodeProgram', '');
    onChange('tujuanPembiayaan', '');
    setProgramList([]);
    if (val && val !== '- SELECT -') {
      loadFasilitasByGroup(val);
    } else {
      setFasilitasList([]);
    }
  };

  const handleProgramChange = (val: string) => {
    onChange('kodeProgram', val);

    const selectedProg = programList.find((p: any) => (p.pR_CODE === val || p.code === val || p.pR_DESC === val));
    const isReguler = val === '1' || val.toUpperCase() === 'REGULER' || selectedProg?.pR_DESC?.toUpperCase() === 'REGULER';

    if (isReguler) {
      // Sesuai CuBES: Tujuan Pembiayaan default '- SELECT -'
      onChange('tujuanPembiayaan', '');
      // Sesuai CuBES: Channel default '10' (Developer)
      onChange('channels', 'Developer');
      onChange('sourceAplikasi', 'Developer');
      // Sesuai CuBES: Tipe Nasabah default '3' (Non Nasabah)
      onChange('tipeNasabah', 'Non Nasabah');
    }
  };

  const handleFasilitasChange = (val: string) => {
    onChange('fasilitas', val);
    onChange('kodeProgram', '');

    if (!val || val === '- SELECT -') {
      setProgramList([]);
      return;
    }

    loadProgramsByProduct(val);

    const upper = val.toUpperCase();
    let kat = 'Pembelian';
    if (upper.includes('FLEKSI') || val === '58' || val === '72' || val === '88' || val === '95') {
      kat = 'Fleksi';
    } else if (upper.includes('MULTIGUNA') || val === '60' || val === '61' || val === '69') {
      kat = 'Multiguna';
    } else if (upper.includes('TOP UP') || val === '70' || val === '69') {
      kat = 'Top Up';
    } else if (upper.includes('KAVLING') || upper.includes('KAPLING') || val === '15') {
      kat = 'Tanah';
    } else if (upper.includes('PEMBANGUNAN') || upper.includes('BANGUN') || val === '7') {
      kat = 'Pembangunan';
    } else if (upper.includes('RENOVASI') || val === '8' || val === '14') {
      kat = 'Renovasi';
    } else if (upper.includes('REFINANCING') || upper.includes('REFINANCE') || val === '10') {
      kat = 'Refinancing';
    } else if (upper.includes('TAKEOVER') || upper.includes('TAKE OVER') || val === '16' || val === '43') {
      kat = 'Take Over';
    } else {
      kat = 'Pembelian';
    }
    onChange('kategoriPembiayaan', kat);
    // Sesuai CuBES WebForms: Tujuan Pembiayaan default '- SELECT -' saat ganti fasilitas
    onChange('tujuanPembiayaan', '');
  };

  // Helper deteksi apakah group fasilitas terpilih adalah GRIYA (sesuai CuBES CheckingGriyaGrupFasilitas)
  const isGriya = !formData?.groupFasilitas || 
    formData?.groupFasilitas?.toUpperCase().includes('GRIYA') || 
    formData?.groupFasilitas === '1' ||
    formData?.groupFasilitas === '5';

  const isGroupSelected = Boolean(formData?.groupFasilitas && formData.groupFasilitas !== '- SELECT -');
  const isFasilitasSelected = Boolean(isGroupSelected && formData?.fasilitas && formData.fasilitas !== '- SELECT -');

  const handleCheckboxSameAddress = (checked: boolean) => {
    onChange('samaDenganKtp', checked);
    if (checked) {
      onChange('alamatTinggal', formData?.alamatKtp || '');
      onChange('kelurahanTinggal', formData?.kelurahanKtp || '');
      onChange('kecamatanTinggal', formData?.kecamatanKtp || '');
      onChange('rtTinggal', formData?.rtKtp || '');
      onChange('rwTinggal', formData?.rwKtp || '');
      onChange('kodeposTinggal', formData?.kodeposKtp || '');
      onChange('kotaTinggal', formData?.kotaKtp || '');
    }
  };

  // Modal pencarian kodepos
  const [zipcodeModalOpen, setZipcodeModalOpen] = useState(false);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [zipcodeModalTarget, setZipcodeModalTarget] = useState<'Ktp' | 'Tinggal'>('Ktp');
  const [zipcodeSearchQuery, setZipcodeSearchQuery] = useState('');
  const [zipcodeSearchResults, setZipcodeSearchResults] = useState<any[]>([]);
  const [isSearchingZipcode, setIsSearchingZipcode] = useState(false);

  // Lookup kode pos otomatis (otomatis isi kota saat 5 digit dimasukkan)
  const lookupAndApplyZipcode = async (zip: string, target: 'Ktp' | 'Tinggal') => {
    const clean = zip.replace(/[^0-9]/g, '');
    if (!clean || clean.length < 5) return;

    try {
      const res = await fetch(`http://localhost:5139/api/Parameter/Zipcode?zipcode=${clean}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const { kota, kelurahan, kecamatan } = json.data;
          if (kota) onChange(`kota${target}`, kota);
          if (kelurahan && !formData?.[ `kelurahan${target}` ]) onChange(`kelurahan${target}`, kelurahan);
          if (kecamatan && !formData?.[ `kecamatan${target}` ]) onChange(`kecamatan${target}`, kecamatan);
          if (target === 'Ktp' && formData?.samaDenganKtp) {
            if (kota) onChange('kotaTinggal', kota);
            if (kelurahan) onChange('kelurahanTinggal', kelurahan);
            if (kecamatan) onChange('kecamatanTinggal', kecamatan);
          }
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    // Fallback prefix kota di Indonesia
    let fallbackKota = 'KOTA SERANG';
    if (clean.startsWith('10')) fallbackKota = 'KOTA JAKARTA PUSAT';
    else if (clean.startsWith('11')) fallbackKota = 'KOTA JAKARTA BARAT';
    else if (clean.startsWith('12')) fallbackKota = 'KOTA JAKARTA SELATAN';
    else if (clean.startsWith('13')) fallbackKota = 'KOTA JAKARTA TIMUR';
    else if (clean.startsWith('14')) fallbackKota = 'KOTA JAKARTA UTARA';
    else if (clean.startsWith('15')) fallbackKota = 'KOTA TANGERANG';
    else if (clean.startsWith('16')) fallbackKota = clean.startsWith('164') ? 'KOTA DEPOK' : 'KOTA BOGOR';
    else if (clean.startsWith('17')) fallbackKota = 'KOTA BEKASI';
    else if (clean.startsWith('40')) fallbackKota = 'KOTA BANDUNG';
    else if (clean.startsWith('42')) {
      if (clean.startsWith('424')) fallbackKota = 'KOTA CILEGON';
      else if (clean.startsWith('422')) fallbackKota = 'KAB. PANDEGLANG';
      else if (clean.startsWith('423')) fallbackKota = 'KAB. LEBAK';
      else fallbackKota = 'KOTA SERANG';
    }
    else if (clean.startsWith('50')) fallbackKota = 'KOTA SEMARANG';
    else if (clean.startsWith('55')) fallbackKota = 'KOTA YOGYAKARTA';
    else if (clean.startsWith('60')) fallbackKota = 'KOTA SURABAYA';

    onChange(`kota${target}`, fallbackKota);
    if (target === 'Ktp' && formData?.samaDenganKtp) {
      onChange('kotaTinggal', fallbackKota);
    }
  };

  const handleKodeposInputChange = (val: string, target: 'Ktp' | 'Tinggal') => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 5);
    onChange(`kodepos${target}`, clean);
    if (target === 'Ktp' && formData?.samaDenganKtp) {
      onChange('kodeposTinggal', clean);
    }
    if (clean.length === 5) {
      lookupAndApplyZipcode(clean, target);
    }
  };

  const handleKodeposInputBlur = (target: 'Ktp' | 'Tinggal') => {
    const val = formData?.[ `kodepos${target}` ];
    if (val && val.length === 5) {
      lookupAndApplyZipcode(val, target);
    }
  };

  const openZipcodeModal = (target: 'Ktp' | 'Tinggal') => {
    setZipcodeModalTarget(target);
    setZipcodeModalOpen(true);
    const initQuery = formData?.[ `kodepos${target}` ] || formData?.[ `kota${target}` ] || 'SERANG';
    setZipcodeSearchQuery(initQuery);
    searchZipcodes(initQuery);
  };

  const searchZipcodes = async (q: string) => {
    setIsSearchingZipcode(true);
    try {
      const res = await fetch(`http://localhost:5139/api/Parameter/Search_Zipcode?query=${encodeURIComponent(q || '')}`);
      if (res.ok) {
        const json = await res.json();
        setZipcodeSearchResults(json.data || []);
      }
    } catch {
      setZipcodeSearchResults([]);
    } finally {
      setIsSearchingZipcode(false);
    }
  };

  const handleSelectZipcode = (item: any) => {
    const target = zipcodeModalTarget;
    const zCode = item.zipcode || item.ZIPCODE;
    const zKota = item.kota || item.KOTA;
    const zKel = item.kelurahan || item.KELURAHAN;
    const zKec = item.kecamatan || item.KECAMATAN;

    onChange(`kodepos${target}`, zCode);
    if (zKota) onChange(`kota${target}`, zKota);
    if (zKel) onChange(`kelurahan${target}`, zKel);
    if (zKec) onChange(`kecamatan${target}`, zKec);

    if (target === 'Ktp' && formData?.samaDenganKtp) {
      onChange('kodeposTinggal', zCode);
      if (zKota) onChange('kotaTinggal', zKota);
      if (zKel) onChange('kelurahanTinggal', zKel);
      if (zKec) onChange('kecamatanTinggal', zKec);
    }

    setZipcodeModalOpen(false);
  };

  // Format currency saat ketik maksimum kredit
  const handleMaksKreditChange = (val: string) => {
    // Bersihkan desimal lama jika ada (mencegah akumulasi nol berlipat)
    const raw = val.includes(',') ? val.split(',')[0] : val;
    const clean = raw.replace(/[^0-9]/g, '');
    if (!clean) {
      onChange('maksimumKredit', '');
      return;
    }
    const num = parseInt(clean, 10);
    if (isNaN(num)) {
      onChange('maksimumKredit', '');
      return;
    }
    // Format pemisah ribuan standar Indonesia tanpa menambahkan koma desimal palsu
    const formatted = new Intl.NumberFormat('id-ID').format(num);
    onChange('maksimumKredit', formatted);
  };

  return (
    <div className="space-y-4 font-sans text-[11px] text-gray-800">

      {/* =========================================================================
          SECTION 1: PRODUK (3D Modern Elevated Card)
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(194, 65, 12,0.15)] transition-all duration-300 overflow-hidden">
        {/* 3D Header Bar */}
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_6px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase">PRODUK & FASILITAS KREDIT</h2>
                <span className="text-[9px] font-extrabold uppercase bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/20">
                  Bagian 1
                </span>
              </div>
              <p className="text-[10px] text-white/80 font-normal">Pemilihan grup fasilitas kredit, program pembiayaan, dan rekanan pihak ketiga</p>
            </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-white bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 w-max">
            Step 1 / 9
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 bg-slate-50/40">
          {/* Kolom Kiri: Produk */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Produk & Program Pembiayaan</span>
            </div>
            <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Group Fasilitas :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.groupFasilitas || ''}
                      onChange={handleGroupFasilitasChange}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {groupFasilitasList.map((g: any) => (
                        <option key={g.grouP_ID || g.id} value={g.grouP_NAME || g.name}>
                          {g.grouP_NAME || g.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Fasilitas :</td>
                  <td className="p-1.5">
                    <SearchableSelect
                      value={formData?.fasilitas || ''}
                      onChange={handleFasilitasChange}
                      options={fasilitasList.map((f: any) => ({
                        value: f.productid || f.id || f.productname,
                        label: f.productname || f.name,
                      }))}
                      disabled={!isGroupSelected}
                      placeholder="- SELECT -"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kode Program :</td>
                  <td className="p-1.5">
                    <SearchableSelect
                      value={formData?.kodeProgram || ''}
                      onChange={handleProgramChange}
                      options={programList.map((p: any) => ({
                        value: p.pR_CODE || p.code || p.pR_DESC,
                        label: p.pR_DESC || p.name,
                      }))}
                      disabled={!isFasilitasSelected}
                      placeholder="- SELECT -"
                    />
                    {(formData?.kodeProgram || formData?.fasilitas) && (
                      <p className="text-[10px] text-slate-500 italic mt-1 font-medium leading-tight">
                        *) Tenor maksimum untuk fasilitas ini adalah 360 bulan dan tenor minimumnya 12 bulan.
                      </p>
                    )}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Tujuan Pembiayaan :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.tujuanPembiayaan || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange('tujuanPembiayaan', val);
                        let kat = 'Pembelian';
                        const upper = val.toUpperCase();
                        if (upper.includes('PEMBANGUNAN')) kat = 'Pembangunan';
                        else if (upper.includes('RENOVASI')) kat = 'Renovasi';
                        else if (upper.includes('TAKE OVER') || upper.includes('TAKEOVER')) kat = 'Take Over';
                        else if (upper.includes('TOP UP')) kat = 'Top Up';
                        else if (upper.includes('REFINANCING')) kat = 'Refinancing';
                        else if (upper.includes('MULTIGUNA')) kat = 'Multiguna';
                        else kat = 'Pembelian';
                        onChange('kategoriPembiayaan', kat);
                      }}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {tujuanList.map((t: any) => (
                        <option key={t.id} value={t.tujuaN_NAME || t.name}>
                          {t.tujuaN_NAME || t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* Agunan Kredit Macet (Kondisional: Muncul bila Group Fasilitas BNI GRIYA) */}
                {isGriya && (
                  <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                    <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Agunan Kredit Macet :</td>
                    <td className="p-1.5">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="agunanKreditMacet"
                            value="1"
                            checked={formData?.agunanKreditMacet === '1'}
                            onChange={() => onChange('agunanKreditMacet', '1')}
                            className="text-[#C2410C] focus:ring-orange-700"
                          />
                          <span>Ya</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="agunanKreditMacet"
                            value="0"
                            checked={!formData?.agunanKreditMacet || formData?.agunanKreditMacet === '0'}
                            onChange={() => onChange('agunanKreditMacet', '0')}
                            className="text-[#C2410C] focus:ring-orange-700"
                          />
                          <span>Tidak</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                )}

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Maksimum Kredit :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.maksimumKredit || ''}
                      onChange={(e) => handleMaksKreditChange(e.target.value)}
                      className="w-full max-w-[140px] h-[22px] px-1.5 bg-[#f4fbac] border border-[#b7c46b] font-semibold text-gray-900 text-xs text-left focus:outline-none focus:ring-1 focus:ring-orange-700 focus:bg-[#fffde5]"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Jangka Waktu :</td>
                  <td className="p-1.5">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          maxLength={3}
                          value={formData?.jangkaWaktu || ''}
                          onChange={(e) => onChange('jangkaWaktu', e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                          placeholder="180"
                          className={`w-14 h-[22px] px-1.5 bg-white border ${
                            formData?.jangkaWaktu && !tenorValidation.isValid
                              ? 'border-red-500 text-red-900 bg-red-50/20'
                              : 'bg-[#f4fbac] border-[#b7c46b] text-gray-900 font-bold focus:bg-[#fffde5] focus:ring-orange-700'
                          } text-xs text-center focus:outline-none focus:ring-1`}
                        />
                        <span className="text-gray-600">bulan</span>
                      </div>
                      {formData?.jangkaWaktu && !tenorValidation.isValid && (
                        <p className="text-[10px] text-red-600 font-medium mt-0.5 flex items-center gap-1">
                          <span>⚠️</span> {tenorValidation.message}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>

          {/* Kolom Kanan: Pihak Ketiga yang dipilih */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#9A3412]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Pihak Ketiga & Rekanan yang Dipilih</span>
            </div>
            <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Appraisal :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.appraisal || ''}
                      onChange={(e) => onChange('appraisal', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {appraisalList.map((a: any) => (
                        <option key={a.code || a.id} value={a.name || a.code}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Asuransi Jiwa :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.asuransiJiwa || ''}
                      onChange={(e) => onChange('asuransiJiwa', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {asuransiList.map((a: any) => (
                        <option key={a.code || a.id} value={a.name || a.code}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Notaris :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.notaris || ''}
                      onChange={(e) => onChange('notaris', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {notarisList.map((n: any) => (
                        <option key={n.code || n.id} value={n.name || n.code}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Investigation :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.investigation || ''}
                      onChange={(e) => onChange('investigation', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {investigationList.map((i: any) => (
                        <option key={i.code || i.id} value={i.name || i.code}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* Developer (Kondisional: Muncul bila Channel Developer dipilih) */}
                {(formData?.channels?.toUpperCase().includes('DEV') || formData?.developerCode) && (
                  <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                    <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Developer :</td>
                    <td className="p-1.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={formData?.developerCode || ''}
                          onChange={(e) => onChange('developerCode', e.target.value)}
                          placeholder="Kode"
                          className="w-14 h-[22px] px-1 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-700"
                        />
                        <input
                          type="text"
                          readOnly
                          value={formData?.developerName || 'PT SUMMARECON AGUNG TBK'}
                          className="w-full max-w-[150px] h-[22px] px-1.5 bg-gray-100 border border-gray-300 text-xs text-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => setDevModalOpen(true)}
                          className="h-[22px] px-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-400 text-[11px] font-medium rounded-xs cursor-pointer flex items-center gap-1"
                        >
                          Cari
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: INFORMASI SOURCE APLIKASI (3D Modern Elevated Card)
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(194, 65, 12,0.15)] transition-all duration-300 overflow-hidden">
        {/* 3D Header Bar */}
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_6px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
              <FileText className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase">INFORMASI SOURCE APLIKASI</h2>
                <span className="text-[9px] font-extrabold uppercase bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/20">
                  Bagian 2
                </span>
              </div>
              <p className="text-[10px] text-white/80 font-normal">Data asal permohonan, media promosi, dan unit referensi sales marketing</p>
            </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-white bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 w-max">
            No. Prospek: {formData?.noProspek || 'Auto Generate'}
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 bg-slate-50/40">
          {/* Kolom Kiri */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Sumber Permohonan & Channels</span>
            </div>
            <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">No. Prospek :</td>
                  <td className="p-1 font-mono text-xs font-semibold text-gray-800">
                    {formData?.noProspek || 'Auto Generate'}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Channels :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.channels === '10' ? 'Developer' : (formData?.channels || formData?.sourceAplikasi || '')}
                      onChange={(e) => {
                        onChange('channels', e.target.value);
                        onChange('sourceAplikasi', e.target.value);
                      }}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {channelList.map((c: any) => (
                        <option key={c.cH_CODE || c.code} value={c.cH_DESC || c.name}>
                          {c.cH_DESC || c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* Detail Referal (Kondisional: Muncul bila Channel Referral dipilih) */}
                {(formData?.channels?.toUpperCase().includes('REF') || formData?.namaPeReferral) && (
                  <>
                    <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors bg-amber-50/30">
                      <td className="w-44 text-right pr-3 py-1.5 font-semibold text-amber-900 whitespace-nowrap text-[11px]">Detail Referral :</td>
                      <td className="p-1.5">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="referralType"
                              value="Internal"
                              checked={!formData?.referralType || formData?.referralType === 'Internal'}
                              onChange={() => onChange('referralType', 'Internal')}
                              className="text-[#C2410C] focus:ring-orange-700"
                            />
                            <span>Internal</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="referralType"
                              value="External"
                              checked={formData?.referralType === 'External'}
                              onChange={() => onChange('referralType', 'External')}
                              className="text-[#C2410C] focus:ring-orange-700"
                            />
                            <span>External</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors bg-amber-50/15">
                      <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Pe-referral :</td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={formData?.namaPeReferral || ''}
                          onChange={(e) => onChange('namaPeReferral', e.target.value)}
                          placeholder="Masukkan nama pe-referral"
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-700"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors bg-amber-50/15">
                      <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">No HP Pe-referral :</td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={formData?.noHpPeReferral || ''}
                          onChange={(e) => onChange('noHpPeReferral', e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="08xxxxxxxxxx"
                          className="w-full max-w-[180px] h-[22px] px-1.5 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-700"
                        />
                      </td>
                    </tr>
                  </>
                )}

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Media :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.media || ''}
                      onChange={(e) => onChange('media', e.target.value)}
                      className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-700"
                    >
                      <option value="">- SELECT -</option>
                      {mediaList.map((m: any) => (
                        <option key={m.mediaid || m.id} value={m.medianame || m.name}>
                          {m.medianame || m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Regional Sales / Agensi :</td>
                  <td className="p-1.5">
                    <select
                      disabled
                      value={formData?.regionalSales || userRegionalSales}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-lg cursor-not-allowed opacity-90 focus:outline-none"
                    >
                      <option value={formData?.regionalSales || userRegionalSales}>
                        {formData?.regionalSales || userRegionalSales}
                      </option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Sales - UserID :</td>
                  <td className="p-1.5">
                    <select
                      disabled
                      value={formData?.namaSales || userSalesName}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-lg cursor-not-allowed opacity-90 focus:outline-none"
                    >
                      <option value={formData?.namaSales || userSalesName}>
                        {formData?.namaSales || userSalesName}
                      </option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>

          {/* Kolom Kanan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#9A3412]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Unit Penjualan & Referensi Sales</span>
            </div>
            <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Marketing Org Type :</td>
                  <td className="p-1 text-gray-800 font-medium">
                    {formData?.marketingOrgType || 'STAFF STA'}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Officer :</td>
                  <td className="p-1 text-gray-800 font-medium">
                    {formData?.namaOfficer || 'SURYA HARJAYA'}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Sales Point/Cabang/Agensi :</td>
                  <td className="p-1 text-gray-800 font-medium">
                    {formData?.salesPoint || 'SERANG'}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Supervisor :</td>
                  <td className="p-1 text-gray-800 font-medium">
                    {formData?.supervisor || ''}
                  </td>
                </tr>

                <tr>
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kode Cabang Pembukuan :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.kodeCabangPembukuan ?? '046'}
                        onChange={(e) => handleKodeCabangChange(e.target.value)}
                        className="w-16 h-[22px] px-1.5 bg-[#f4fbac] border border-[#b7c46b] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-orange-700 focus:bg-[#fffde5] text-center"
                      />
                      <span className="text-xs font-extrabold text-[#C2410C] tracking-wide">
                        {formData?.namaCabangPembukuan || (formData?.kodeCabangPembukuan && BRANCH_MAP[formData?.kodeCabangPembukuan]) || 'SERANG'}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Kondisional Program Referral / Debitur Pengajak */}
                {(formData?.kodeProgram?.toUpperCase().includes('REF') || formData?.kodeProgram?.toUpperCase().includes('MIL') || formData?.kodeProgram?.toUpperCase().includes('MGM') || formData?.rekDebiturPengajak) && (
                  <>
                    <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors bg-orange-50/20">
                      <td className="w-44 text-right pr-3 py-1.5 font-medium text-orange-900 whitespace-nowrap text-[11px]">Rek. Debitur Pengajak :</td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={formData?.rekDebiturPengajak || ''}
                          onChange={(e) => onChange('rekDebiturPengajak', e.target.value)}
                          placeholder="Nomor rekening pengajak"
                          className="w-full max-w-[180px] h-[22px] px-1.5 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-700"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors bg-orange-50/20">
                      <td className="w-44 text-right pr-3 py-1.5 font-medium text-orange-900 whitespace-nowrap text-[11px]">Nama Debitur Pengajak :</td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={formData?.namaDebiturPengajak || ''}
                          onChange={(e) => onChange('namaDebiturPengajak', e.target.value)}
                          placeholder="Nama lengkap debitur pengajak"
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-700"
                        />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: INITIAL DATA ENTRY (3D Modern Elevated Card)
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(194, 65, 12,0.15)] transition-all duration-300 overflow-hidden">
        {/* 3D Header Bar */}
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_6px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase">INITIAL DATA ENTRY</h2>
                <span className="text-[9px] font-extrabold uppercase bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/20">
                  Bagian 3
                </span>
              </div>
              <p className="text-[10px] text-white/80 font-normal">Perekaman identitas KTP dan alamat domisili calon debitur perorangan</p>
            </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-white bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 w-max">
            Debitur Perorangan
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 bg-slate-50/40">
          {/* Kolom Kiri */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Identitas Pribadi Sesuai e-KTP</span>
            </div>
            <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Gelar Sebelum :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.gelarSebelum || ''}
                      onChange={(e) => onChange('gelarSebelum', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Depan :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.namaDepan || ''}
                      onChange={(e) => onChange('namaDepan', e.target.value.replace(/[^a-zA-Z\s\.\']/g, '').slice(0, 35))}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Tengah :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.namaTengah || ''}
                      onChange={(e) => onChange('namaTengah', e.target.value.replace(/[^a-zA-Z\s\.\']/g, '').slice(0, 35))}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Belakang :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.namaBelakang || ''}
                      onChange={(e) => onChange('namaBelakang', e.target.value.replace(/[^a-zA-Z\s\.\']/g, '').slice(0, 35))}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Gelar Sesudah :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.gelarSesudah || ''}
                      onChange={(e) => onChange('gelarSesudah', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Alamat KTP :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.alamatKtp || ''}
                      onChange={(e) => onChange('alamatKtp', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kelurahan/Desa :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kelurahanKtp || ''}
                      onChange={(e) => onChange('kelurahanKtp', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kecamatan :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kecamatanKtp || ''}
                      onChange={(e) => onChange('kecamatanKtp', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Rt / Rw :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.rtKtp || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                          onChange('rtKtp', val);
                          if (formData?.samaDenganKtp) onChange('rtTinggal', val);
                        }}
                        placeholder="001"
                        className="w-12 h-[22px] px-1.5 bg-[#f4fbac] border border-[#b7c46b] text-xs text-center font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-orange-700 focus:bg-[#fffde5]"
                      />
                      <span>/</span>
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.rwKtp || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                          onChange('rwKtp', val);
                          if (formData?.samaDenganKtp) onChange('rwTinggal', val);
                        }}
                        placeholder="002"
                        className="w-12 h-[22px] px-1.5 bg-[#f4fbac] border border-[#b7c46b] text-xs text-center font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-orange-700 focus:bg-[#fffde5]"
                      />
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kodepos :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={5}
                        value={formData?.kodeposKtp || ''}
                        onChange={(e) => handleKodeposInputChange(e.target.value, 'Ktp')}
                        onBlur={() => handleKodeposInputBlur('Ktp')}
                        placeholder="Contoh: 42111"
                        className="w-20 h-[22px] px-1.5 bg-[#f4fbac] border border-[#b7c46b] text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-orange-700 focus:bg-[#fffde5]"
                      />
                      <button
                        type="button"
                        onClick={() => openZipcodeModal('Ktp')}
                        className="h-[28px] px-3 bg-gradient-to-b from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 active:scale-[0.98] border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
                      >
                        Cari
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kota :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kotaKtp || ''}
                      onChange={(e) => onChange('kotaKtp', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    />
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>

          {/* Kolom Kanan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#9A3412]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Alamat Domisili & Nomor Kontak</span>
            </div>
            <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Alamat Tinggal :</td>
                  <td className="p-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={Boolean(formData?.samaDenganKtp)}
                        onChange={(e) => handleCheckboxSameAddress(e.target.checked)}
                        className="h-3.5 w-3.5 text-[#C2410C] rounded border-gray-300 focus:ring-orange-700"
                      />
                      <span>Sama dengan Alamat KTP</span>
                    </label>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">:</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.alamatTinggal || ''}
                      onChange={(e) => onChange('alamatTinggal', e.target.value)}
                      disabled={Boolean(formData?.samaDenganKtp)}
                      className={`w-full max-w-[260px] h-[22px] px-1.5 border text-xs focus:outline-none focus:ring-1 focus:ring-orange-700 ${formData?.samaDenganKtp ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#f4fbac] border-[#b7c46b] text-gray-900 focus:bg-[#fffde5]'}`}
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kelurahan/Desa :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kelurahanTinggal || ''}
                      onChange={(e) => onChange('kelurahanTinggal', e.target.value)}
                      disabled={Boolean(formData?.samaDenganKtp)}
                      className={`w-full max-w-[260px] h-[22px] px-1.5 border text-xs focus:outline-none focus:ring-1 focus:ring-orange-700 ${formData?.samaDenganKtp ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#f4fbac] border-[#b7c46b] text-gray-900 focus:bg-[#fffde5]'}`}
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kecamatan :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kecamatanTinggal || ''}
                      onChange={(e) => onChange('kecamatanTinggal', e.target.value)}
                      disabled={Boolean(formData?.samaDenganKtp)}
                      className={`w-full max-w-[260px] h-[22px] px-1.5 border text-xs focus:outline-none focus:ring-1 focus:ring-orange-700 ${formData?.samaDenganKtp ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#f4fbac] border-[#b7c46b] text-gray-900 focus:bg-[#fffde5]'}`}
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Rt / Rw :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.rtTinggal || ''}
                        onChange={(e) => onChange('rtTinggal', e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                        disabled={Boolean(formData?.samaDenganKtp)}
                        placeholder="001"
                        className={`w-14 h-[28px] px-2 border text-gray-900 text-xs text-center font-mono font-semibold rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all ${formData?.samaDenganKtp ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#f4fbac] border-[#b7c46b] focus:bg-[#fffde5]'}`}
                      />
                      <span>/</span>
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.rwTinggal || ''}
                        onChange={(e) => onChange('rwTinggal', e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                        disabled={Boolean(formData?.samaDenganKtp)}
                        placeholder="002"
                        className={`w-14 h-[28px] px-2 border text-gray-900 text-xs text-center font-mono font-semibold rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all ${formData?.samaDenganKtp ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#f4fbac] border-[#b7c46b] focus:bg-[#fffde5]'}`}
                      />
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kodepos :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={5}
                        value={formData?.kodeposTinggal || ''}
                        onChange={(e) => handleKodeposInputChange(e.target.value, 'Tinggal')}
                        onBlur={() => handleKodeposInputBlur('Tinggal')}
                        disabled={Boolean(formData?.samaDenganKtp)}
                        placeholder="Contoh: 42111"
                        className={`w-24 h-[28px] px-2.5 border text-gray-800 text-xs font-mono font-semibold rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all ${formData?.samaDenganKtp ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#f4fbac] border-[#b7c46b] focus:bg-[#fffde5]'}`}
                      />
                      <button
                        type="button"
                        onClick={() => openZipcodeModal('Tinggal')}
                        disabled={Boolean(formData?.samaDenganKtp)}
                        className="h-[22px] px-2 bg-gray-100 hover:bg-gray-200 border border-gray-400 text-[11px] font-medium rounded-xs transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Cari
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kota :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kotaTinggal || ''}
                      onChange={(e) => onChange('kotaTinggal', e.target.value)}
                      disabled={Boolean(formData?.samaDenganKtp)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">No. Telp :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="021"
                        maxLength={4}
                        value={formData?.noTelpArea || ''}
                        onChange={(e) => onChange('noTelpArea', e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                        className="w-14 h-[22px] px-1.5 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-700"
                      />
                      <input
                        type="text"
                        value={formData?.noTelpNumber || ''}
                        onChange={(e) => onChange('noTelpNumber', e.target.value.replace(/[^0-9]/g, '').slice(0, 15))}
                        className="w-32 h-[22px] px-1.5 bg-[#f4fbac] border border-[#b7c46b] text-xs font-mono focus:outline-none focus:ring-1 focus:ring-orange-700 focus:bg-[#fffde5]"
                      />
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">No. Handphone :</td>
                  <td className="p-1.5">
                    <div>
                      <input
                        type="text"
                        value={formData?.noHandphone || ''}
                        onChange={(e) => handleHandphoneChange(e.target.value)}
                        placeholder="Contoh: 081234567890 atau +6281234567890"
                        className={`w-full max-w-[260px] h-[28px] px-2.5 bg-white border ${
                          formData?.noHandphone && !hpValidation.isValid
                            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 text-red-900 bg-red-50/20'
                            : 'bg-[#f4fbac] border-[#b7c46b] focus:bg-[#fffde5] focus:ring-orange-700/20 focus:border-[#C2410C] text-gray-900'
                        } text-xs font-mono rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 transition-all`}
                      />
                      {formData?.noHandphone && !hpValidation.isValid && (
                        <p className="text-[10px] text-red-600 font-medium mt-1 flex items-center gap-1">
                          <span className="font-bold">⚠️</span> {hpValidation.message}
                        </p>
                      )}
                      {formData?.noHandphone && hpValidation.isValid && (
                        <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                          <span>✓</span> Format nomor HP valid ({formData.noHandphone.replace(/[^0-9]/g, '').length} digit)
                        </p>
                      )}
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Alamat E-Mail :</td>
                  <td className="p-1.5">
                    <div>
                      <input
                        type="email"
                        value={formData?.email || ''}
                        onChange={(e) => onChange('email', e.target.value.trim())}
                        placeholder="contoh: nama@domain.com"
                        className={`w-full max-w-[260px] h-[28px] px-2.5 bg-white border ${
                          formData?.email && !emailValidation
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 bg-red-50/20'
                            : 'border-slate-300 focus:ring-orange-700/20 focus:border-[#C2410C] text-gray-800'
                        } text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 transition-all`}
                      />
                      {formData?.email && !emailValidation && (
                        <p className="text-[10px] text-red-600 font-medium mt-1 flex items-center gap-1">
                          <span>⚠️</span> Format email tidak valid (contoh: nama@domain.com)
                        </p>
                      )}
                    </div>
                  </td>
                </tr>

                {isGriya && (
                  <tr>
                    <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Tipe Nasabah :</td>
                    <td className="p-1.5">
                      <select
                        value={formData?.tipeNasabah === '3' ? 'Non Nasabah' : (formData?.tipeNasabah || '')}
                        onChange={(e) => onChange('tipeNasabah', e.target.value)}
                        className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-orange-700/20 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all"
                      >
                        <option value="">- SELECT -</option>
                        {tipeNasabahList.map((t: any) => (
                          <option key={t.rN_CODE || t.code || t.id} value={t.rN_DESC || t.name}>
                            {t.rN_DESC || t.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOMBOL AKSI: Single Centered Black Button "Lanjut" (Sesuai Screenshot Asli)
      ========================================================================= */}
      <div className="flex items-center justify-center pt-2 pb-6">
        <button
          type="button"
          onClick={onLanjut}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-3 px-16 py-3.5 rounded-2xl bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] hover:from-[#9A3412] hover:to-[#D94E1B] active:translate-y-0.5 active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest shadow-[0_8px_24px_rgba(194, 65, 12,0.35),0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(194, 65, 12,0.45)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-orange-400/30"
        >
          <span>{isSubmitting ? 'Menyimpan Draf...' : 'Simpan & Lanjut ke Obyek Pembiayaan'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>


      {/* SearchZipcodeModal Lengkap (7.285 Kecamatan se-Indonesia) */}
      <SearchZipcodeModal
        isOpen={zipcodeModalOpen}
        onClose={() => setZipcodeModalOpen(false)}
        title={`Lookup Wilayah & Kode Pos Alamat ${zipcodeModalTarget === 'Ktp' ? 'KTP' : 'Tempat Tinggal'}`}
        initialQuery={formData?.[ `kodepos${zipcodeModalTarget}` ] || ''}
        onSelect={(z) => {
          const target = zipcodeModalTarget;
          onChange(`kodepos${target}`, z.zipcode);
          onChange(`kelurahan${target}`, z.kelurahan);
          onChange(`kecamatan${target}`, z.kecamatan);
          onChange(`kota${target}`, z.kota);
          setZipcodeModalOpen(false);
        }}
      />

      {/* SearchPartnerModal Lengkap (Developer PKS Rekanan BNI) */}
      <SearchPartnerModal
        isOpen={devModalOpen}
        onClose={() => setDevModalOpen(false)}
        type="DEVELOPER"
        title="Lookup Rekanan Developer & Proyek PKS BNI"
        onSelect={(partner) => {
          onChange('developerCode', partner.code);
          onChange('developerName', partner.name);
          setDevModalOpen(false);
        }}
      />
    </div>
  );
};

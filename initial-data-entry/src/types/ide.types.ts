/**
 * BNI eLO Konsumer - Initial Data Entry (IDE)
 * TypeScript Type Definitions & Form Contracts
 */

export interface ProspectItem {
  id?: string | number;
  noAplikasi?: string;
  noProspek: string;
  namaDebitur: string;
  ktp?: string;
  noKtp?: string;
  produk?: string;
  groupFasilitas?: string;
  cabang?: string;
  status: string;
  tanggalMasuk?: string;
  createdAt?: string;
  updatedAt?: string;
  plafon?: string | number;
  isNew?: boolean;
}

export interface CollateralItem {
  id?: string;
  tipe?: string;
  tipeJaminan?: string;
  subTipeJaminan?: string;
  kategoriPembiayaan?: string;
  jenisProperti?: string;
  tipeProperti?: string;
  nilaiJaminan?: number | string;
  kisaranHarga?: string;
  perkiraanHarga?: string;
  alamatJaminan?: string;
  nomorSertifikat?: string;
  noSertifikat?: string;
  tipeSertifikat?: string;
  luasTanah?: number | string;
  luasBangunan?: number | string;
  namaPemilikAgunan?: string;
  namaPemilik?: string;
  hubDenganDebitur?: string;
  namaDeveloper?: string;
  namaProyek?: string;
  blok?: string;
  nomorRumah?: string;
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  kelurahan?: string;
  kodepos?: string;
  statusAgunan?: string;
  isPrimary?: boolean;
  [key: string]: any;
}

export interface BankAccountItem {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPayroll?: boolean;
  isAutodebet?: boolean;
  currency?: string;
}

export interface OtherLoanItem {
  id?: string;
  bankName: string;
  facilityType: string;
  limit: string | number;
  outstanding: string | number;
  installment: string | number;
  collectibility?: string;
}

export interface CreditCardItem {
  id?: string;
  bankName: string;
  cardNumber: string;
  limit: string | number;
  outstanding?: string | number;
  collectibility?: string;
}

export interface ZipcodeResult {
  zipcode: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi?: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  type: 'DEVELOPER' | 'MITRA_KARYA' | 'INSTITUSI';
  pksNumber?: string;
  projectList?: string[];
  status?: string;
}

export interface ApiResponse<T = any> {
  isSuccess: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface IdeFormData {
  // Tab 0: Source & Produk
  groupFasilitas: string;
  fasilitas: string;
  kodeProgram: string;
  tujuanPembiayaan: string;
  agunanKreditMacet: string;
  nilaiPembiayaan: string;
  selfFinancing: string;
  maksimumKredit: string;
  jangkaWaktu: string;
  appraisal: string;
  asuransiJiwa: string;
  notaris: string;
  investigation: string;
  namaDeveloper: string;
  namaProyek: string;

  noProspek: string;
  channels: string;
  media: string;
  unitPemroses: string;
  regionalSales: string;
  namaSales: string;
  marketingOrgType: string;
  namaOfficer: string;
  salesPoint: string;
  supervisor: string;
  kodeCabangPembukuan: string;
  namaCabangPembukuan: string;

  tipeReferral: string;
  namaPereferral: string;
  noHpPereferral: string;
  noRekPereferral: string;
  cabangPereferral: string;
  catatanReferral: string;

  // Tab 1: Informasi Debitur
  gelarSebelum: string;
  namaDepan: string;
  namaTengah: string;
  namaBelakang: string;
  gelarSesudah: string;
  alamatKtp: string;
  kelurahanKtp: string;
  kecamatanKtp: string;
  rtKtp: string;
  rwKtp: string;
  kodeposKtp: string;
  kotaKtp: string;

  samaDenganKtp: boolean;
  alamatTinggal: string;
  kelurahanTinggal: string;
  kecamatanTinggal: string;
  rtTinggal: string;
  rwTinggal: string;
  kodeposTinggal: string;
  kotaTinggal: string;
  noTelpArea: string;
  noTelpNumber: string;
  noHandphone: string;
  email: string;
  tipeNasabah: string;

  tipeJaminan: string;
  subTipeJaminan: string;
  statusAgunan: string;
  tipeSertifikat: string;

  gelarSebelumNama: string;
  gelarSetelahNama: string;
  panggilan: string;
  jenisKelamin: string;
  tempatLahir: string;
  tglLahirHari: string;
  tglLahirBulan: string;
  tglLahirTahun: string;
  agama: string;
  kebangsaan: string;
  pendidikan: string;
  statusPerkawinan: string;
  statusPerceraian: string;
  statusRumah: string;
  lamaMenetapTahun: string;
  lamaMenetapBulan: string;
  jumlahAnak: string;
  namaIbuKandung: string;
  hubunganBniTahun: string;

  noTelpLainnya: string;
  faxNumber: string;
  jenisIdentitas: string;
  noIdentitas: string;
  tglTerbitIdentitas: string;
  tempatTerbitIdentitas: string;
  masaBerlakuIdentitas: string;
  npwp: string;
  kendaraanDimiliki: string;
  noRekSimpananBni: string;
  skemaAngsuran: string;

  // Tab 2: Pekerjaan Debitur
  tglMulaiBekerjaHari: string;
  tglMulaiBekerjaBulan: string;
  tglMulaiBekerjaTahun: string;
  tipePekerjaan: string;
  jenisPendapatan: string;
  sumberPenghasilan: string;
  kepemilikanPerusahaan: string;
  jenisKerjasamaPks: string;
  polaKerjasama: string;
  jenisKerjasamaPksPerusahaan: string;
  statusPekerjaPemohon: string;
  namaPerusahaan: string;
  alamatPerusahaan1: string;
  alamatPerusahaan2: string;
  rtPerusahaan: string;
  rwPerusahaan: string;
  kodeposPerusahaan: string;
  kotaPerusahaan: string;
  jabatanPekerjaan: string;
  jenisBidangUsaha: string;
  posisi: string;
  departemen: string;
  nip: string;
  umurPensiun: string;
  pendapatanPokok: string;
  pendapatanLain: string;
  asalPendapatanLain: string;
  totalPendapatan: string;
  totalExpenses: string;
  tunjanganHariTua: string;

  tipePerusahaanSekarang: string;
  telpPerusahaanArea: string;
  telpPerusahaanNumber: string;
  telpPerusahaanExt: string;
  telpPerusahaanLainnya: string;
  faxPerusahaan: string;
  emailPerusahaan: string;
  npwpPerusahaan: string;
  persentaseSaham: string;
  lamaBekerjaTahun: string;
  lamaBekerjaBulan: string;
  kodeGroupPerusahaan: string;
  areaPerusahaan: string;

  namaPerusahaanSebelumnya: string;
  alamatPerusahaanSebelumnya1: string;
  alamatPerusahaanSebelumnya2: string;
  telpPerusahaanSebelumnya: string;
  lamaBekerjaSebelumnyaTahun: string;
  lamaBekerjaSebelumnyaBulan: string;
  totalLamaBekerja: string;

  // Tab 3: Data Pasangan
  joinIncomePasangan: boolean;
  gelarSebelumPasangan: string;
  gelarSetelahPasangan: string;
  namaDepanPasangan: string;
  namaTengahPasangan: string;
  namaBelakangPasangan: string;
  jenisKelaminPasangan: string;
  namaIbuKandungPasangan: string;
  alamatKtpPasangan: string;
  kelurahanPasangan: string;
  kecamatanPasangan: string;
  rtPasangan: string;
  rwPasangan: string;
  kodeposPasangan: string;
  kotaPasangan: string;
  noTelpAreaPasangan: string;
  noTelpNumberPasangan: string;
  noHpPasangan: string;
  emailPasangan: string;
  jenisIdentitasPasangan: string;
  noIdentitasPasangan: string;
  tglTerbitIdentitasPasangan: string;
  masaBerlakuIdentitasPasangan: string;
  npwpPasangan: string;

  // Tab 4: Pekerjaan Pasangan
  pekerjaanSamaDenganDebitur: boolean;
  tipePekerjaanPasangan: string;
  jenisPendapatanPasangan: string;
  sumberPenghasilanPasangan: string;
  kepemilikanPerusahaanPasangan: string;
  statusPekerjaPasangan: string;
  namaPerusahaanPasangan: string;
  alamatPerusahaanPasangan1: string;
  alamatPerusahaanPasangan2: string;
  rtPerusahaanPasangan: string;
  rwPerusahaanPasangan: string;
  kodeposPerusahaanPasangan: string;
  kotaPerusahaanPasangan: string;
  telpPerusahaanAreaPasangan: string;
  telpPerusahaanNumberPasangan: string;
  telpPerusahaanExtPasangan: string;
  faxPerusahaanPasangan: string;
  emailPerusahaanPasangan: string;
  npwpPerusahaanPasangan: string;
  jabatanPekerjaanPasangan: string;
  jenisBidangUsahaPasangan: string;
  posisiPasangan: string;
  departemenPasangan: string;
  nipPasangan: string;
  lamaBekerjaTahunPasangan: string;
  lamaBekerjaBulanPasangan: string;
  pendapatanPokokPasangan: string;
  pendapatanLainPasangan: string;
  asalPendapatanLainPasangan: string;
  totalPendapatanPasangan: string;

  // Tab 5: Kontak Emergency
  gelarSebelumEmergency: string;
  gelarSetelahEmergency: string;
  namaLengkapEmergency: string;
  hubunganEmergency: string;
  alamatEmergency: string;
  kelurahanEmergency: string;
  kecamatanEmergency: string;
  rtEmergency: string;
  rwEmergency: string;
  kodeposEmergency: string;
  kotaEmergency: string;
  noTelpAreaEmergency: string;
  noTelpNumberEmergency: string;
  noHpEmergency: string;
  emailEmergency: string;

  // Tab 8: Memo & Catatan
  catatanMemoBaru: string;

  // Index signature for dynamic field access
  [key: string]: any;
}

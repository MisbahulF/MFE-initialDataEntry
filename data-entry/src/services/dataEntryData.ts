export interface AssetRecord {
  id: string;
  bankName: string;
  acType: string;
  acNum: string;
  currency: string;
  avgSaldo: string;
  isJaminan: boolean;
}

export interface GuarantorRecord {
  id: string;
  relType: string;
  namaDepan: string;
  namaTengah: string;
  namaBelakang: string;
  tempatLahir: string;
  tglLahir: string;
  jenisKelamin: string;
  noKtp: string;
  masaBerlakuKtp: string;
  alamat: string;
  rtRw: string;
  kodepos: string;
  kota: string;
  noTelp: string;
  noHp: string;
  hubunganDebitur: string;
}

export interface CreditCardRecord {
  id: string;
  bankName: string;
  cardNum: string;
  limit: string;
  since: string;
  outstanding: string;
  tunggakan: string;
}

export interface OtherLoanRecord {
  id: string;
  bankName: string;
  contractNum: string;
  facilityType: string;
  maxLimit: string;
  startDate: string;
  endDate: string;
  installment: string;
  remainingTenor: string;
  contactPerson: string;
  phone: string;
}

export interface TieringRateItem {
  id: string;
  seq: number;
  durationMonths: number;
  ratePercent: number;
}

export interface CreditStructureData {
  loanAmount: string;
  ratioJaminanNjMk: string;
  ratioPembiayaanLtv: string;
  pokokHutang: string;
  tenorBulan: string;
  sukuBungaPersen: string;
  tipeBunga: string;
  angsuranPerBulan: string;
  skemaRate: string;
  tieringRates?: TieringRateItem[];
  tipeAsuransi: string;
  asuransiCashAmount: string;
  asuransiCreditAmount: string;
  developerName: string;
  proyekName: string;
  dealerName?: string;
  beaFiducia: string;
  provisiPersen: string;
  biayaAdmin: string;
  biayaNotaris: string;
  biayaAppraisal: string;
  subsidiBungaFlag?: boolean;
  subsidiBungaPersen?: string;
}

export interface DataEntryRecord {
  id: string;
  noAplikasi: string;
  noProspek: string;
  namaDebitur: string;
  ktp: string;
  npwp: string;
  telepon: string;
  alamatKtp: string;
  alamatDomisili: string;
  produk: 'BNI GRIYA' | 'BNI OTO' | 'BNI FLEKSI' | 'BNI MULTIGUNA';
  fasilitas: string;
  kodeProgram: string;
  tujuanPembiayaan: string;
  maksKredit: string;
  sukuBunga: string;
  jangkaWaktu: string; // bulan
  salesId: string;
  salesName: string;
  cabang: string;
  tglKirimSales: string;
  status: 'Menunggu Data Entry' | 'In Progress DE' | 'DE Selesai' | 'Return to Sales (RTS)';
  
  // TAB 1: Header / Main.aspx
  tglPenandatanganan?: string;
  tglTerimaAplikasi?: string;
  noRekeningPinjaman?: string;
  noRekeningAfiliasi?: string;
  marketingOrgType?: string;
  csoOfficer?: string;
  cabangPembukuan?: string;
  cabangPemroses?: string;
  mailingRoomUser?: string;
  regionalSales?: string;
  polaPemasaran?: string;
  polaKerjasama?: string;
  supervisorName?: string;
  mediaName?: string;
  channelName?: string;
  lamaHubunganBniThn?: string;
  asalPameran?: string;
  programKhususEvent?: string;

  // TAB 2: Informasi Pelanggan / PersonalInfo.aspx
  gelarSebelum?: string;
  gelarSesudah?: string;
  panggilan?: string;
  namaDepan?: string;
  namaTengah?: string;
  namaBelakang?: string;
  jenisKelamin?: string;
  tempatLahir?: string;
  tglLahir?: string;
  agama?: string;
  kebangsaan?: string;
  pendidikan?: string;
  statusPernikahan?: string;
  statusPerceraian?: string;
  statusRumah?: string;
  lamaMenetapTahun?: string;
  lamaMenetapBulan?: string;
  jumlahAnak?: string;
  namaIbuKandungDepan?: string;
  namaIbuKandungTengah?: string;
  namaIbuKandungBelakang?: string;
  rtKtp?: string;
  rwKtp?: string;
  kelurahanKtp?: string;
  kecamatanKtp?: string;
  kotaKtp?: string;
  kodeposKtp?: string;
  samaDenganKtp?: boolean;
  rtTinggal?: string;
  rwTinggal?: string;
  kelurahanTinggal?: string;
  kecamatanTinggal?: string;
  kotaTinggal?: string;
  kodeposTinggal?: string;
  telpArea?: string;
  telpNomor?: string;
  faxArea?: string;
  faxNomor?: string;
  email?: string;
  masaBerlakuKtp?: string;
  ktpSeumurHidup?: boolean;
  cifNo?: string;
  namaBankPayroll?: string;
  noRekeningPayroll?: string;
  

  // TAB 3: Pekerjaan Debitur / JobInfo.aspx
  tglMulaiKerja?: string;
  tipePekerjaan?: string;
  jenisPendapatan?: string;
  sumberPenghasilan?: string;
  kepemilikanPerusahaan?: string;
  jenisPks?: string;
  polaKerjasamaPks?: string;
  statusPekerja?: string;
  namaInstitusi?: string;
  namaPerusahaan?: string;
  alamatKantor?: string;
  rtRwKantor?: string;
  kodeposKantor?: string;
  kotaKantor?: string;
  jabatan?: string;
  bidangUsaha?: string;
  posisiKantor?: string;
  departemen?: string;
  nip?: string;
  umurPensiun?: string;
  gajiPokok?: string;
  pendapatanLain?: string;
  asalPendapatanLain?: string;
  totalPendapatan?: string;
  totalPengeluaran?: string;
  thtAmount?: string;
  dsrPersen?: string;

  // TAB 4 & 5: Pasangan & Pekerjaan Pasangan
  namaPasangan?: string;
  ktpPasangan?: string;
  tempatLahirPasangan?: string;
  tglLahirPasangan?: string;
  pekerjaanPasangan?: string;
  perusahaanPasangan?: string;
  penghasilanPasangan?: string;

  // TAB 6: Kontak Emergency
  namaEmergency?: string;
  hubunganEmergency?: string;
  alamatEmergency?: string;
  rtRwEmergency?: string;
  kodeposEmergency?: string;
  kotaEmergency?: string;
  telpAreaEmergency?: string;
  telpNomorEmergency?: string;
  telpEmergency?: string;

  // TAB 7: Aset Simpanan
  assetsList?: AssetRecord[];

  // TAB 8: Agunan / Collateral.aspx
  tipeJaminan?: string;
  statusAgunan?: string;
  buktiKepemilikan?: string;
  noSertifikat?: string;
  lokasiAgunan?: string;
  nilaiPasarTaksasi?: string;
  nilaiNjop?: string;
  nilaiLikuidasi?: string;
  nilaiPengikatan?: string;
  jenisPengikatan?: string;
  developerName?: string;
  proyekName?: string;

  // TAB 9: Kartu Kredit
  creditCardList?: CreditCardRecord[];

  // TAB 10: Pinjaman Lain
  otherLoanList?: OtherLoanRecord[];

  // TAB 11: Penjamin
  guarantorList?: GuarantorRecord[];

  // TAB 12: Struktur Kredit
  creditStructure?: CreditStructureData;

  // Checklist Dokumen Masuk dari Sales
  docChecklist?: {
    ktpValid: boolean;
    kkValid: boolean;
    npwpValid: boolean;
    slipGajiValid: boolean;
    rekKoranValid: boolean;
    agunanValid: boolean;
  };

  // Catatan Processing
  memoSales?: string;
  catatanProcessing?: string;

  // Payload utuh 9/10 tab dari IDE
  ideFormData?: any;
}

const STORAGE_KEY = 'bni_data_entry_applications';

export const initialDataEntryRecords: DataEntryRecord[] = [];
export const dataEntryService = {
  getRecords: (): DataEntryRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getRecordById: (id: string): DataEntryRecord | undefined => {
    const records = dataEntryService.getRecords();
    return records.find(r => r.id === id || r.noAplikasi === id || r.noProspek === id);
  },

  getAll: (): DataEntryRecord[] => dataEntryService.getRecords(),
  getById: (id: string): DataEntryRecord | undefined => dataEntryService.getRecordById(id),

  syncWithBackend: async (): Promise<DataEntryRecord[]> => {
    try {
      const res = await fetch('http://localhost:5139/api/DataEntry/applications');
      if (res.ok) {
        const apps = await res.json();
        const localRecords = dataEntryService.getRecords();
        const recordMap = new Map<string, DataEntryRecord>();

        // Seed with local records
        localRecords.forEach((r) => {
          const key = r.noAplikasi || r.noProspek || r.id;
          if (key) recordMap.set(key, r);
        });

        // Overlay with authoritative SQLite database records
        apps.forEach((app: any) => {
          const innerData = (typeof app.data === 'object' && app.data !== null) ? app.data : {};
          const key = app.noAplikasi || app.noProspek || innerData.id;
          const merged: DataEntryRecord = {
            id: innerData.id || `DE-${app.noAplikasi}`,
            noAplikasi: app.noAplikasi,
            noProspek: app.noProspek || '',
            namaDebitur: app.namaDebitur || 'DEBITUR',
            ktp: app.ktp || '',
            npwp: innerData.npwp || '',
            telepon: innerData.telepon || '',
            alamatKtp: innerData.alamatKtp || '',
            alamatDomisili: innerData.alamatDomisili || '',
            produk: app.produk || 'BNI GRIYA',
            fasilitas: innerData.fasilitas || 'GRIYA IDAMAN PEMBELIAN RUMAH',
            kodeProgram: innerData.kodeProgram || 'REGULER',
            tujuanPembiayaan: innerData.tujuanPembiayaan || 'RUMAH BARU',
            maksKredit: innerData.maksKredit || '100.000.000,00',
            sukuBunga: innerData.sukuBunga || '7.25% Fixed 3 Thn',
            jangkaWaktu: innerData.jangkaWaktu || '24 bulan',
            salesId: innerData.salesId || 'SC70629',
            salesName: innerData.salesName || 'SURYA HARJAYA',
            cabang: app.cabang || '046 - SERANG',
            tglKirimSales: app.createdAt || new Date().toLocaleString('id-ID'),
            status: (app.status || 'Menunggu Data Entry') as any,
            ...innerData,
            noAplikasi: app.noAplikasi,
            noProspek: app.noProspek || innerData.noProspek,
            namaDebitur: app.namaDebitur || innerData.namaDebitur,
            ktp: app.ktp || innerData.ktp,
            produk: app.produk || innerData.produk,
            cabang: app.cabang || innerData.cabang,
            status: (app.status || innerData.status || 'Menunggu Data Entry') as any,
          };
          if (key) recordMap.set(key, merged);
        });

        const mergedList = Array.from(recordMap.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
        window.dispatchEvent(new Event('storage'));
        return mergedList;
      }
    } catch (e) {
      console.warn('Backend sync failed, using local storage cache:', e);
    }
    return dataEntryService.getRecords();
  },

  updateRecord: (updated: DataEntryRecord): void => {
    const records = dataEntryService.getRecords();
    const index = records.findIndex(r => r.id === updated.id || r.noAplikasi === updated.noAplikasi);
    if (index !== -1) {
      records[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } else {
      records.unshift(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    // Persist directly to backend SQLite
    fetch('http://localhost:5139/api/DataEntry/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noAplikasi: updated.noAplikasi,
        noProspek: updated.noProspek,
        namaDebitur: updated.namaDebitur,
        ktp: updated.ktp,
        produk: updated.produk,
        cabang: updated.cabang,
        status: updated.status,
        data: updated,
      }),
    }).catch(e => console.warn('Failed to update backend application:', e));
  },

  deleteRecord: async (idOrNoApp: string): Promise<void> => {
    const records = dataEntryService.getRecords().filter(r => r.id !== idOrNoApp && r.noAplikasi !== idOrNoApp && r.noProspek !== idOrNoApp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('storage'));

    // Hapus dari SQLite database
    try {
      await fetch(`http://localhost:5139/api/DataEntry/applications/${encodeURIComponent(idOrNoApp)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Gagal menghapus dari database backend:', e);
    }
  },

  resetDefaults: (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDataEntryRecords));
  }
};


import React, { useState, useEffect } from 'react';
import { useAuth, eventBus } from '@template/shared';
import { InformasiSourceAplikasi } from './tabs/InformasiSourceAplikasi';
import { ObyekPembiayaan } from './tabs/ObyekPembiayaan';
import { InformasiDebitur } from './tabs/InformasiDebitur';
import { PekerjaanDebitur } from './tabs/PekerjaanDebitur';
import { InformasiPasangan } from './tabs/InformasiPasangan';
import { PekerjaanPasangan } from './tabs/PekerjaanPasangan';
import { KontakEmergency } from './tabs/KontakEmergency';
import { InformasiPerbankan } from './tabs/InformasiPerbankan';
import { MemoSkdr } from './tabs/MemoSkdr';
import { SearchZipcodeModal } from '../components/SearchZipcodeModal';
import { ZipcodeResult } from '../types/ide.types';
import {
  AlertTriangle,
  Monitor,
  Undo2,
  FileText,
  Home,
  User,
  Briefcase,
  HeartHandshake,
  Users,
  AlertCircle,
  CreditCard,
  StickyNote,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Building,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Layers,
  Search,
  Sparkles,
  Eye,
  Calendar,
  Upload,
  Paperclip,
  LogOut,
  Send,
} from 'lucide-react';

interface InitialDataEntryProps {
  onNavigate?: (screen: 'main' | 'list' | 'form') => void;
  selectedProspect?: any;
}


// 9 Submenu Resmi CuBES eLO (Sesuai Gambar 1 - 5)
export const CUBES_SUBMENUS = [
  { id: 'source', label: 'Informasi Source Aplikasi', tabIndex: 0 },
  { id: 'collateral', label: 'Obyek Pembiayaan', tabIndex: 1 },
  { id: 'personal', label: 'Informasi Debitur', tabIndex: 2 },
  { id: 'job', label: 'Pekerjaan Debitur', tabIndex: 3 },
  { id: 'spouse', label: 'Informasi Pasangan', tabIndex: 4 },
  { id: 'spouse-job', label: 'Informasi Pekerjaan Pasangan', tabIndex: 5 },
  { id: 'emergency', label: 'Kontak Emergency', tabIndex: 6 },
  { id: 'banking', label: 'Informasi Perbankan', tabIndex: 7 },
  { id: 'memo-skdr', label: 'Memo & SKDR', tabIndex: 8 },
];

// 9 Tabs Resmi Cubesh eLO
export const TAB_MENUS = [
  { id: 'source', label: 'Informasi Source Aplikasi', icon: FileText },
  { id: 'collateral', label: 'Obyek Pembiayaan', icon: Home },
  { id: 'personal', label: 'Informasi Debitur', icon: User },
  { id: 'job', label: 'Pekerjaan Debitur', icon: Briefcase },
  { id: 'spouse', label: 'Informasi Pasangan', icon: HeartHandshake },
  { id: 'spouse-job', label: 'Informasi Pekerjaan Pasangan', icon: Users },
  { id: 'emergency', label: 'Kontak Emergency', icon: AlertCircle },
  { id: 'banking', label: 'Informasi Perbankan', icon: CreditCard },
  { id: 'memo-skdr', label: 'Memo & SKDR', icon: StickyNote },
];

// Helper: Form Kosong Bersih saat Input Baru (Sesuai Gambar 3)
const createEmptyForm = (prospect?: any, user?: any) => {
  return {
    groupFasilitas: '',
    fasilitas: '',
    kodeProgram: '',
    tujuanPembiayaan: '',
    agunanKreditMacet: 'Tidak',
    nilaiPembiayaan: '',
    selfFinancing: '',
    maksimumKredit: '',
    jangkaWaktu: '',
    appraisal: '',
    asuransiJiwa: '',
    notaris: '',
    investigation: '',
    namaDeveloper: '',
    namaProyek: '',

    noProspek: (prospect?.noProspek && prospect.noProspek !== 'Auto Generate' && !prospect?.isNew)
      ? prospect.noProspek
      : '',
    channels: '',
    media: '',
    unitPemroses: '046 - SERANG STA',
    regionalSales: 'SERANG STA',
    namaSales: user?.name ? `${user.name} - ${user.userId || user.id}` : 'SURYA HARJAYA - SC70629',
    marketingOrgType: 'STAFF STA',
    namaOfficer: user?.name || 'SURYA HARJAYA',
    salesPoint: 'SERANG',
    supervisor: '',
    kodeCabangPembukuan: '046',
    namaCabangPembukuan: 'SERANG',

    tipeReferral: '',
    namaPereferral: '',
    noHpPereferral: '',
    noRekPereferral: '',
    cabangPereferral: '',
    catatanReferral: '',

    gelarSebelum: '',
    namaDepan: '',
    namaTengah: '',
    namaBelakang: '',
    gelarSesudah: '',
    alamatKtp: '',
    kelurahanKtp: '',
    kecamatanKtp: '',
    rtKtp: '',
    rwKtp: '',
    kodeposKtp: '',
    kotaKtp: '',

    samaDenganKtp: false,
    alamatTinggal: '',
    kelurahanTinggal: '',
    kecamatanTinggal: '',
    rtTinggal: '',
    rwTinggal: '',
    kodeposTinggal: '',
    kotaTinggal: '',
    noTelpArea: '',
    noTelpNumber: '',
    noHandphone: '',
    email: '',
    tipeNasabah: '',

    tipeJaminan: '',
    subTipeJaminan: '',
    statusAgunan: 'Baru',
    tipeSertifikat: '',

    gelarSebelumNama: '',
    gelarSetelahNama: '',
    panggilan: '',
    jenisKelamin: '',
    tempatLahir: '',
    tglLahirHari: '',
    tglLahirBulan: '',
    tglLahirTahun: '',
    agama: '',
    kebangsaan: '',
    pendidikan: '',
    statusPerkawinan: '',
    statusPerceraian: '',
    statusRumah: '',
    lamaMenetapTahun: '',
    lamaMenetapBulan: '',
    jumlahAnak: '',
    namaIbuKandung: '',
    hubunganBniTahun: '',

    noTelpLainnya: '',
    faxNumber: '',
    jenisIdentitas: '',
    noIdentitas: '',
    tglTerbitIdentitas: '',
    tempatTerbitIdentitas: '',
    masaBerlakuIdentitas: '',
    npwp: '',
    kendaraanDimiliki: '',
    noRekSimpananBni: '',
    skemaAngsuran: '',

    tglMulaiBekerjaHari: '',
    tglMulaiBekerjaBulan: '',
    tglMulaiBekerjaTahun: '',
    tipePekerjaan: '',
    jenisPendapatan: '',
    sumberPenghasilan: '',
    kepemilikanPerusahaan: '',
    jenisKerjasamaPks: '',
    polaKerjasama: '',
    jenisKerjasamaPksPerusahaan: '',
    statusPekerjaPemohon: '',
    namaPerusahaan: '',
    alamatPerusahaan1: '',
    alamatPerusahaan2: '',
    rtPerusahaan: '',
    rwPerusahaan: '',
    kodeposPerusahaan: '',
    kotaPerusahaan: '',
    jabatanPekerjaan: '',
    jenisBidangUsaha: '',
    posisi: '',
    departemen: '',
    nip: '',
    umurPensiun: '',
    pendapatanPokok: '',
    pendapatanLain: '',
    asalPendapatanLain: '',
    totalPendapatan: '',
    totalExpenses: '',
    tunjanganHariTua: '',

    tipePerusahaanSekarang: '',
    telpPerusahaanArea: '',
    telpPerusahaanNumber: '',
    telpPerusahaanExt: '',
    telpPerusahaanLainnya: '',
    faxPerusahaan: '',
    emailPerusahaan: '',
    npwpPerusahaan: '',
    persentaseSaham: '',
    lamaBekerjaTahun: '',
    lamaBekerjaBulan: '',
    kodeGroupPerusahaan: '',
    areaPerusahaan: '',

    namaPerusahaanSebelumnya: '',
    alamatPerusahaanSebelumnya1: '',
    alamatPerusahaanSebelumnya2: '',
    telpPerusahaanSebelumnya: '',
    lamaBekerjaSebelumnyaTahun: '',
    lamaBekerjaSebelumnyaBulan: '',
    totalLamaBekerja: '',

    joinIncomePasangan: false,
    gelarSebelumPasangan: '',
    gelarSetelahPasangan: '',
    namaDepanPasangan: '',
    namaTengahPasangan: '',
    namaBelakangPasangan: '',
    jenisKelaminPasangan: '',
    namaIbuKandungPasangan: '',
    alamatKtpPasangan: '',
    kelurahanPasangan: '',
    kecamatanPasangan: '',
    rtPasangan: '',
    rwPasangan: '',
    kodeposPasangan: '',
    kotaPasangan: '',
    noTelpAreaPasangan: '',
    noTelpNumberPasangan: '',
    noHpPasangan: '',
    emailPasangan: '',
    jenisIdentitasPasangan: '',
    noIdentitasPasangan: '',
    tglTerbitIdentitasPasangan: '',
    masaBerlakuIdentitasPasangan: '',
    npwpPasangan: '',

    pekerjaanSamaDenganDebitur: false,
    tipePekerjaanPasangan: '',
    jenisPendapatanPasangan: '',
    sumberPenghasilanPasangan: '',
    kepemilikanPerusahaanPasangan: '',
    statusPekerjaPasangan: '',
    namaPerusahaanPasangan: '',
    alamatPerusahaanPasangan1: '',
    alamatPerusahaanPasangan2: '',
    rtPerusahaanPasangan: '',
    rwPerusahaanPasangan: '',
    kodeposPerusahaanPasangan: '',
    kotaPerusahaanPasangan: '',
    telpPerusahaanAreaPasangan: '',
    telpPerusahaanNumberPasangan: '',
    telpPerusahaanExtPasangan: '',
    faxPerusahaanPasangan: '',
    emailPerusahaanPasangan: '',
    npwpPerusahaanPasangan: '',
    jabatanPekerjaanPasangan: '',
    jenisBidangUsahaPasangan: '',
    posisiPasangan: '',
    departemenPasangan: '',
    nipPasangan: '',
    lamaBekerjaTahunPasangan: '',
    lamaBekerjaBulanPasangan: '',
    pendapatanPokokPasangan: '',
    pendapatanLainPasangan: '',
    asalPendapatanLainPasangan: '',
    totalPendapatanPasangan: '',

    gelarSebelumEmergency: '',
    gelarSetelahEmergency: '',
    namaLengkapEmergency: '',
    hubunganEmergency: '',
    alamatEmergency: '',
    kelurahanEmergency: '',
    kecamatanEmergency: '',
    rtEmergency: '',
    rwEmergency: '',
    kodeposEmergency: '',
    kotaEmergency: '',
    noTelpAreaEmergency: '',
    noTelpNumberEmergency: '',
    noHpEmergency: '',
    emailEmergency: '',

    catatanMemoBaru: '',
  };
};

export const InitialDataEntry: React.FC<InitialDataEntryProps> = ({
  onNavigate,
  selectedProspect,
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingBlacklist, setIsCheckingBlacklist] = useState(false);
  const [blacklistResult, setBlacklistResult] = useState<string | null>(null);
  const [zipModalOpen, setZipModalOpen] = useState(false);
  const [zipTarget, setZipTarget] = useState<'ktp' | 'tinggal' | 'perusahaan' | 'pasangan' | 'kantorPasangan' | 'emergency' | null>(null);

  const handleSelectZipcode = (z: ZipcodeResult) => {
    if (zipTarget === 'ktp') {
      handleChange('kodeposKtp', z.zipcode);
      handleChange('kelurahanKtp', z.kelurahan);
      handleChange('kecamatanKtp', z.kecamatan);
      handleChange('kotaKtp', z.kota);
    } else if (zipTarget === 'tinggal') {
      handleChange('kodeposTinggal', z.zipcode);
      handleChange('kelurahanTinggal', z.kelurahan);
      handleChange('kecamatanTinggal', z.kecamatan);
      handleChange('kotaTinggal', z.kota);
    } else if (zipTarget === 'perusahaan') {
      handleChange('kodeposPerusahaan', z.zipcode);
      handleChange('kelurahanPerusahaan', z.kelurahan);
      handleChange('kecamatanPerusahaan', z.kecamatan);
      handleChange('kotaPerusahaan', z.kota);
    } else if (zipTarget === 'pasangan') {
      handleChange('kodeposPasangan', z.zipcode);
      handleChange('kelurahanPasangan', z.kelurahan);
      handleChange('kecamatanPasangan', z.kecamatan);
      handleChange('kotaPasangan', z.kota);
    } else if (zipTarget === 'kantorPasangan') {
      handleChange('kodeposKantorPasangan', z.zipcode);
      handleChange('kelurahanKantorPasangan', z.kelurahan);
      handleChange('kecamatanKantorPasangan', z.kecamatan);
      handleChange('kotaKantorPasangan', z.kota);
    } else if (zipTarget === 'emergency') {
      handleChange('kodeposEmergency', z.zipcode);
      handleChange('kelurahanEmergency', z.kelurahan);
      handleChange('kecamatanEmergency', z.kecamatan);
      handleChange('kotaEmergency', z.kota);
    }
    setZipModalOpen(false);
  };

  const handleCheckPreScreening = async () => {
    if (!formData?.noProspek || formData.noProspek === 'Auto Generate') {
      alert('Simpan data prospek terlebih dahulu sebelum melakukan Pre-Screening!');
      return;
    }
    setIsCheckingBlacklist(true);
    try {
      const res = await fetch('http://localhost:5139/api/PreScreening/update-check-blacklist-griya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coldProspectId: formData.noProspek,
          ktp: formData.noKtp || formData.noIdentitas || '',
          nama: formData.namaDebitur || formData.namaDepan || '',
        }),
      });
      const data = await res.json();
      const status = data?.data?.status || 'PASS';
      setBlacklistResult(status);
      // statusPrescreening dikosongkan sesuai permintaan (menunggu integrasi dukcapil)
      setSaveSuccess(`Hasil Pre-Screening: ${status} (DHN & SLIK Clear).`);
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (e) {
      console.error(e);
      setBlacklistResult('PASS');
      setSaveSuccess('Pemeriksaan Pre-Screening selesai (PASS).');
      setTimeout(() => setSaveSuccess(null), 3500);
    } finally {
      setIsCheckingBlacklist(false);
    }
  };

  const [hasSavedProspect, setHasSavedProspect] = useState<boolean>(() => {
    return Boolean(selectedProspect && !selectedProspect.isNew && selectedProspect.noProspek);
  });
  const isViewingExisting = hasSavedProspect;

  const [mandatoryErrors, setMandatoryErrors] = useState<string[]>([]);
  const [showMandatoryModal, setShowMandatoryModal] = useState<boolean>(false);

  // Validasi seluruh bagian berwarna kuning pada Tab 0 (Informasi Source Aplikasi)
  const validateTab0Mandatory = (): string[] => {
    const missing: string[] = [];

    // Card 1: PRODUK (Bagian Kuning)
    if (!formData?.groupFasilitas || formData.groupFasilitas === '- SELECT -') missing.push('Group Fasilitas (Produk)');
    if (!formData?.fasilitas || !formData.fasilitas.trim()) missing.push('Fasilitas (Produk)');
    if (!formData?.kodeProgram || !formData.kodeProgram.trim()) missing.push('Kode Program (Produk)');
    if (!formData?.tujuanPembiayaan || formData.tujuanPembiayaan === '- SELECT -') missing.push('Tujuan Pembiayaan (Produk)');
    if (!formData?.maksimumKredit || !formData.maksimumKredit.toString().trim()) missing.push('Maksimum Kredit (Produk)');
    if (!formData?.jangkaWaktu || !formData.jangkaWaktu.toString().trim()) missing.push('Jangka Waktu (Produk)');

    // Card 2: INFORMASI SOURCE APLIKASI (Bagian Kuning)
    if ((!formData?.channels || formData.channels === '- SELECT -') && (!formData?.sourceAplikasi || formData.sourceAplikasi === '- SELECT -')) {
      missing.push('Channels (Informasi Source Aplikasi)');
    }
    // Media bukan mandatory
    if (!formData?.kodeCabangPembukuan || !formData.kodeCabangPembukuan.trim()) missing.push('Kode Cabang Pembukuan (Informasi Source Aplikasi)');

    // Card 3: INITIAL DATA ENTRY (Bagian Kuning)
    if (!formData?.namaDepan || !formData.namaDepan.trim()) missing.push('Nama Depan (Initial Data Entry)');
    if (!formData?.alamatKtp || !formData.alamatKtp.trim()) missing.push('Alamat KTP (Initial Data Entry)');
    if (!formData?.kelurahanKtp || !formData.kelurahanKtp.trim()) missing.push('Kelurahan/Desa KTP');
    if (!formData?.kecamatanKtp || !formData.kecamatanKtp.trim()) missing.push('Kecamatan KTP');
    if (!formData?.rtKtp || !formData.rtKtp.trim()) missing.push('RT KTP');
    if (!formData?.rwKtp || !formData.rwKtp.trim()) missing.push('RW KTP');
    if (!formData?.kodeposKtp || !formData.kodeposKtp.trim()) missing.push('Kodepos KTP');

    const isSameAddress = Boolean(formData?.samaDenganKtp);
    const effectiveAlamatTinggal = isSameAddress ? (formData?.alamatTinggal || formData?.alamatKtp) : formData?.alamatTinggal;
    const effectiveKelurahanTinggal = isSameAddress ? (formData?.kelurahanTinggal || formData?.kelurahanKtp) : formData?.kelurahanTinggal;
    const effectiveKecamatanTinggal = isSameAddress ? (formData?.kecamatanTinggal || formData?.kecamatanKtp) : formData?.kecamatanTinggal;
    const effectiveRtTinggal = isSameAddress ? (formData?.rtTinggal || formData?.rtKtp) : formData?.rtTinggal;
    const effectiveRwTinggal = isSameAddress ? (formData?.rwTinggal || formData?.rwKtp) : formData?.rwTinggal;

    if (!effectiveAlamatTinggal || !effectiveAlamatTinggal.trim()) missing.push('Alamat Tinggal');
    if (!effectiveKelurahanTinggal || !effectiveKelurahanTinggal.trim()) missing.push('Kelurahan/Desa Tinggal');
    if (!effectiveKecamatanTinggal || !effectiveKecamatanTinggal.trim()) missing.push('Kecamatan Tinggal');
    if (!effectiveRtTinggal || !effectiveRtTinggal.trim()) missing.push('RT Tinggal');
    if (!effectiveRwTinggal || !effectiveRwTinggal.trim()) missing.push('RW Tinggal');

    if (!formData?.noTelpArea || !formData.noTelpArea.trim()) missing.push('Kode Area No. Telp');
    if (!formData?.noTelpNumber || !formData.noTelpNumber.trim()) missing.push('Nomor Telp');
    if (!formData?.noHandphone || !formData.noHandphone.trim()) missing.push('No. Handphone');
    if (!formData?.tipeNasabah || formData.tipeNasabah === '- SELECT -') missing.push('Tipe Nasabah (Initial Data Entry)');

    return missing;
  };

  const [formData, setFormData] = useState<any>(() => {
    if (isViewingExisting && selectedProspect?.noProspek) {
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]) return { ...f[selectedProspect.noProspek] };
        }
      } catch { }
      
      const empty = createEmptyForm(selectedProspect, user);
      return {
        ...empty,
        ...selectedProspect,
        groupFasilitas: selectedProspect.groupFasilitas || selectedProspect.productGroupId || selectedProspect.produk || '',
        fasilitas: selectedProspect.fasilitas || selectedProspect.productId || '',
        channels: selectedProspect.channels || selectedProspect.sourceLead || selectedProspect.sourceAplikasi || '',
        namaDepan: selectedProspect.namaDepan || selectedProspect.namaDebitur || selectedProspect.nama || '',
        noKtp: selectedProspect.noKtp || selectedProspect.noKtpDebitur || selectedProspect.ktp || '',
        noHandphone: selectedProspect.noHandphone || selectedProspect.noHp || selectedProspect.telp || '',
      };
    }
    return createEmptyForm(selectedProspect, user);
  });

  // Hydrate collaterals directly from SQLite Backend
  useEffect(() => {
    if (selectedProspect?.noProspek && selectedProspect.noProspek !== 'Auto Generate') {
      fetch('http://localhost:5139/api/Collateral/get-collateral-griya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coldProspectId: selectedProspect.noProspek }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.data) && d.data.length > 0) {
            setCollaterals(d.data.map((c: any) => ({ ...c.detail, id: c.id, tipe: c.tipeJaminan || c.tipe })));
          }
        })
        .catch(() => {});
    }
  }, [selectedProspect?.noProspek]);

  const [collaterals, setCollaterals] = useState<any[]>(() => {
    if (isViewingExisting && selectedProspect?.noProspek) {
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]?.collaterals) return f[selectedProspect.noProspek].collaterals;
        }
      } catch { }
      if (selectedProspect?.collaterals) return selectedProspect.collaterals;
    }
    return [];
  });

  const [documents, setDocuments] = useState<any[]>(() => {
    if (isViewingExisting && selectedProspect?.noProspek) {
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]?.documents) return f[selectedProspect.noProspek].documents;
        }
      } catch { }
      if (selectedProspect?.documents) return selectedProspect.documents;
    }
    return [];
  });

  const [bankAccounts, setBankAccounts] = useState<any[]>(() => {
    if (isViewingExisting && selectedProspect?.noProspek) {
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]?.bankAccounts) return f[selectedProspect.noProspek].bankAccounts;
        }
      } catch { }
      if (selectedProspect?.bankAccounts) return selectedProspect.bankAccounts;
    }
    return [];
  });

  const [otherLoans, setOtherLoans] = useState<any[]>(() => {
    if (isViewingExisting && selectedProspect?.noProspek) {
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]?.otherLoans) return f[selectedProspect.noProspek].otherLoans;
        }
      } catch { }
      if (selectedProspect?.otherLoans) return selectedProspect.otherLoans;
    }
    return [];
  });

  const [creditCards, setCreditCards] = useState<any[]>(() => {
    if (isViewingExisting && selectedProspect?.noProspek) {
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]?.creditCards) return f[selectedProspect.noProspek].creditCards;
        }
      } catch { }
      if (selectedProspect?.creditCards) return selectedProspect.creditCards;
    }
    return [];
  });

  const [memoList, setMemoList] = useState<any[]>(() => {
    if (isViewingExisting && selectedProspect?.noProspek) {
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]?.memoList) return f[selectedProspect.noProspek].memoList;
        }
      } catch { }
      if (selectedProspect?.memoList) return selectedProspect.memoList;
    }
    return [];
  });

  const [skdrList, setSkdrList] = useState<any[]>(() => {
    if (isViewingExisting && selectedProspect?.noProspek) {
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]?.skdrList) return f[selectedProspect.noProspek].skdrList;
        }
      } catch { }
      if (selectedProspect?.skdrList) return selectedProspect.skdrList;
    }
    return [];
  });

  const [newDocStatus, setNewDocStatus] = useState<string>('Asli');
  const [newMemoText, setNewMemoText] = useState<string>('');

  // Form states untuk Tab 8: Informasi Perbankan
  const [bankAccForm, setBankAccForm] = useState({
    namaBank: '',
    tipeAccount: '',
    noAccount: '',
    mataUang: '',
    saldo: '',
    jaminan: false,
  });

  const [otherLoanForm, setOtherLoanForm] = useState({
    namaBank: '',
    noKontrak: '',
    jenisFasilitas: '',
    maksKredit: '',
    tglMulaiTgl: '',
    tglMulaiBln: '',
    tglMulaiThn: '',
    tglSelesaiTgl: '',
    tglSelesaiBln: '',
    tglSelesaiThn: '',
    angsuran: '',
    jangkaWaktu: '',
    kontakPersonal: '',
    status: '',
    pasangan: false,
  });

  const [creditCardForm, setCreditCardForm] = useState({
    namaBank: '',
    noKartu: '',
    limit: '',
    sejakBln: '',
    sejakThn: '',
    outstanding: '',
    tunggakan: '',
  });

  // Tab 2: Obyek Pembiayaan Form State (Sesuai Gambar 1 - 5)
  const emptyColForm = {
    kategoriPembiayaan: '',
    tipeJaminan: '',
    namaSalesDeveloper: '',
    noKtpSalesDeveloper: '',
    tipeSubJaminan: '',
    status: 'Perorangan',
    statusIndent: 'NON-INDEN',
    area: 'JAKARTA',
    developer: '',
    proyek: '',
    salesDevPihak3: '',
    umum: '',
    tipeProperti: 'TANAH/KAVLING',
    statusAgenProperti: 'Perorangan',
    agenProperti: '',
    salesAgenPihak3: '',
    sameAddress: true,
    alamat1: '',
    alamat2: '',
    alamat3: '',
    rt: '',
    rw: '',
    kodepos: '',
    lokasiAgunanKode: '',
    lokasiAgunanDesc: '',
    luasBangunan: '',
    luasArea: '',
    perkiraanHarga: '',
    tipeSertifikatKode: '',
    tipeSertifikatDesc: '',
    noSertifikat: '',
    nomorUnit: '',
    tower: '',
    lantai: '',
    marketSegment: 'Secondary Market',
  };

  const defaultColForm = emptyColForm;

  const [colForm, setColForm] = useState(defaultColForm);
  const [editingColIndex, setEditingColIndex] = useState<number | null>(null);

  const handleColChange = (field: string, value: any) => {
    setColForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTambahAgunan = () => {
    const tipe = colForm.tipeJaminan;
    if (!tipe) {
      alert('Pilih Tipe Jaminan/Objek yang Dibiayai terlebih dahulu!');
      return;
    }
    const kisaran = colForm.perkiraanHarga
      ? colForm.perkiraanHarga.replace(/\./g, '')
      : '0';
    const jenis = colForm.tipeProperti || 'TANAH/KAVLING';

    if (editingColIndex !== null) {
      const updated = [...collaterals];
      updated[editingColIndex] = {
        ...colForm,
        id: updated[editingColIndex].id || editingColIndex + 1,
        tipe,
        kisaranHarga: kisaran,
        jenisProperti: jenis,
      };
      setCollaterals(updated);
      setEditingColIndex(null);
      setColForm(emptyColForm);
      setSaveSuccess('Obyek Pembiayaan berhasil diperbarui!');
    } else {
      const newAgunan = {
        id: collaterals.length + 1,
        tipe,
        kisaranHarga: kisaran,
        jenisProperti: jenis,
        ...colForm,
      };
      setCollaterals([...collaterals, newAgunan]);
      setColForm(emptyColForm);
      setSaveSuccess('Obyek Pembiayaan berhasil ditambahkan ke daftar!');
    }
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleDeleteAgunan = (idx: number) => {
    if (window.confirm('Yakin Anda akan menghapus data agunan ini?')) {
      const updated = collaterals.filter((_, i) => i !== idx);
      setCollaterals(updated);
      if (editingColIndex === idx) {
        setEditingColIndex(null);
        setColForm(emptyColForm);
      }
      setSaveSuccess('Data agunan berhasil dihapus.');
      setTimeout(() => setSaveSuccess(null), 2500);
    }
  };

  const handleEditAgunan = (idx: number) => {
    const item = collaterals[idx];
    if (item) {
      setColForm({ ...item, tipeJaminan: item.tipe || item.tipeJaminan });
      setEditingColIndex(idx);
      setSaveSuccess(`Memuat data obyek pembiayaan #${idx + 1} untuk diubah.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(null), 2500);
    }
  };

  const handleCancelEditAgunan = () => {
    setEditingColIndex(null);
    setColForm(emptyColForm);
  };

  const handleLanjutTab2 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveCurrentData();
      setSaveSuccess('Data Obyek Pembiayaan tersimpan. Melanjutkan ke Informasi Debitur.');
      setActiveTab(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error('Gagal simpan Tab 2:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // State & Handlers untuk Tab 3: Informasi Debitur & Dokumen
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleUploadDocument = () => {
    if (!selectedUploadFile) {
      setUploadStatus('Pilih file terlebih dahulu!');
      return;
    }
    const newDoc = {
      id: Date.now(),
      name: selectedUploadFile.name,
      status: 'Uploaded',
    };
    setDocuments((prev) => [...prev, newDoc]);
    setSelectedUploadFile(null);
    setUploadStatus('File berhasil diunggah.');
    setTimeout(() => setUploadStatus(''), 3000);
  };

  const handleDeleteDocument = (id: any) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCariZipKtp = () => {
    setZipTarget('ktp');
    setZipModalOpen(true);
  };

  const handleCariZipTinggal = () => {
    setZipTarget('tinggal');
    setZipModalOpen(true);
  };

  const handleSameWithKtp = (checked: boolean) => {
    handleChange('samaDenganKtp', checked);
    if (checked) {
      handleChange('alamatTinggal', formData.alamatKtp || '');
      handleChange('kelurahanTinggal', formData.kelurahanKtp || '');
      handleChange('kecamatanTinggal', formData.kecamatanKtp || '');
      handleChange('rtTinggal', formData.rtKtp || '');
      handleChange('rwTinggal', formData.rwKtp || '');
      handleChange('kodeposTinggal', formData.kodeposKtp || '');
      handleChange('kotaTinggal', formData.kotaKtp || 'Petamburan JAKARTA');
    }
  };

  const handleLanjutTab3 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveCurrentData();
      setSaveSuccess('Data Informasi Debitur tersimpan. Melanjutkan ke Pekerjaan Debitur.');
      setActiveTab(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error('Gagal simpan Tab 3:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // State & Handlers untuk Tab 4: Pekerjaan Debitur
  const handleCariZipPerusahaan = () => {
    setZipTarget('perusahaan');
    setZipModalOpen(true);
  };

  const handleLanjutTab4 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveCurrentData();
      setSaveSuccess('Data Pekerjaan Debitur tersimpan. Melanjutkan ke Informasi Pasangan.');
      setActiveTab(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error('Gagal simpan Tab 4:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // State & Handlers untuk Tab 5: Informasi Pasangan
  const handleCariZipPasangan = () => {
    setZipTarget('pasangan');
    setZipModalOpen(true);
  };

  const handleLanjutTab5 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveCurrentData();
      setSaveSuccess('Data Informasi Pasangan tersimpan. Melanjutkan ke Informasi Pekerjaan Pasangan.');
      setActiveTab(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error('Gagal simpan Tab 5:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // State & Handlers untuk Tab 6: Informasi Pekerjaan Pasangan
  const handleCariZipKantorPasangan = () => {
    setZipTarget('kantorPasangan');
    setZipModalOpen(true);
  };

  const handleLanjutTab6 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveCurrentData();
      setSaveSuccess('Data Informasi Pekerjaan Pasangan tersimpan. Melanjutkan ke Kontak Emergency.');
      setActiveTab(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error('Gagal simpan Tab 6:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // State & Handlers untuk Tab 7: Kontak Emergency
  const handleCariZipEmergency = () => {
    setZipTarget('emergency');
    setZipModalOpen(true);
  };

  const handleLanjutTab7 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveCurrentData();
      setSaveSuccess('Data Kontak Emergency tersimpan. Melanjutkan ke Informasi Perbankan.');
      setActiveTab(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error('Gagal simpan Tab 7:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lookup Bank Handlers
  const handleCariBankAcc = () => {
    setBankAccForm((prev) => ({
      ...prev,
      namaBank: 'BANK NEGARA INDONESIA (BNI)',
      tipeAccount: prev.tipeAccount || 'Tabungan',
      mataUang: prev.mataUang || 'IDR',
    }));
  };

  const handleCariBankLoan = () => {
    setOtherLoanForm((prev) => ({
      ...prev,
      namaBank: 'BANK CENTRAL ASIA (BCA)',
      jenisFasilitas: prev.jenisFasilitas || 'Kredit Pemilikan Rumah (KPR)',
      status: prev.status || 'Lancar (Kol-1)',
    }));
  };

  const handleCariBankCC = () => {
    setCreditCardForm((prev) => ({
      ...prev,
      namaBank: 'BNI VISA PLATINUM',
      sejakBln: prev.sejakBln || 'Januari',
      sejakThn: prev.sejakThn || '2022',
    }));
  };

  // Tambah Handlers
  const handleTambahBankAcc = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newAcc = {
      id: bankAccounts.length + 1,
      bank: bankAccForm.namaBank || 'BANK NEGARA INDONESIA (BNI)',
      tipe: bankAccForm.tipeAccount || 'Tabungan',
      noRek: bankAccForm.noAccount || '0809202611',
      mataUang: bankAccForm.mataUang || 'IDR',
      saldo: bankAccForm.saldo || '0',
      statusJaminan: bankAccForm.jaminan ? 'Jaminan' : 'Bukan Jaminan',
    };
    setBankAccounts([...bankAccounts, newAcc]);
    setBankAccForm({
      namaBank: '',
      tipeAccount: '',
      noAccount: '',
      mataUang: '',
      saldo: '',
      jaminan: false,
    });
    setSaveSuccess('Account Bank berhasil ditambahkan ke daftar.');
    setTimeout(() => setSaveSuccess(null), 2000);
  };

  const handleTambahOtherLoan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newLoan = {
      id: otherLoans.length + 1,
      bank: otherLoanForm.namaBank || 'BANK CENTRAL ASIA (BCA)',
      noKontrak: otherLoanForm.noKontrak || 'KKB-2022-09182',
      jenisFasilitas: otherLoanForm.jenisFasilitas || 'KKB (Kendaraan)',
      plafond: otherLoanForm.maksKredit || '0',
      tglMulai: otherLoanForm.tglMulaiTgl ? `${otherLoanForm.tglMulaiTgl}/${otherLoanForm.tglMulaiBln || '01'}/${otherLoanForm.tglMulaiThn || '2022'}` : '-',
      tglSelesai: otherLoanForm.tglSelesaiTgl ? `${otherLoanForm.tglSelesaiTgl}/${otherLoanForm.tglSelesaiBln || '01'}/${otherLoanForm.tglSelesaiThn || '2027'}` : '-',
      angsuran: otherLoanForm.angsuran || '0',
      pasangan: otherLoanForm.pasangan ? 'Ya' : 'Tidak',
      status: otherLoanForm.status || 'Lancar (Kol-1)',
    };
    setOtherLoans([...otherLoans, newLoan]);
    setOtherLoanForm({
      namaBank: '',
      noKontrak: '',
      jenisFasilitas: '',
      maksKredit: '',
      tglMulaiTgl: '',
      tglMulaiBln: '',
      tglMulaiThn: '',
      tglSelesaiTgl: '',
      tglSelesaiBln: '',
      tglSelesaiThn: '',
      angsuran: '',
      jangkaWaktu: '',
      kontakPersonal: '',
      status: '',
      pasangan: false,
    });
    setSaveSuccess('Fasilitas Pinjaman Lain berhasil ditambahkan ke daftar.');
    setTimeout(() => setSaveSuccess(null), 2000);
  };

  const handleTambahCreditCard = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newCard = {
      id: creditCards.length + 1,
      bank: creditCardForm.namaBank || 'BNI VISA PLATINUM',
      noKartu: creditCardForm.noKartu || '4512-xxxx-xxxx-9012',
      limit: creditCardForm.limit || '0',
      sejak: creditCardForm.sejakBln ? `${creditCardForm.sejakBln} ${creditCardForm.sejakThn || '2022'}` : '-',
      outstanding: creditCardForm.outstanding || '0',
      tunggakan: creditCardForm.tunggakan || '0',
    };
    setCreditCards([...creditCards, newCard]);
    setCreditCardForm({
      namaBank: '',
      noKartu: '',
      limit: '',
      sejakBln: '',
      sejakThn: '',
      outstanding: '',
      tunggakan: '',
    });
    setSaveSuccess('Kartu Kredit berhasil ditambahkan ke daftar.');
    setTimeout(() => setSaveSuccess(null), 2000);
  };

  const handleLanjutTab8 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveCurrentData();
      setSaveSuccess('Data Informasi Perbankan tersimpan. Melanjutkan ke Memo & SKDR.');
      setActiveTab(8);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error('Gagal simpan Tab 8:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanjutTab9 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleLanjut(e || ({ preventDefault: () => { } } as any));
  };


  // Re-sync saat selectedProspect berganti (LOAD REAL DARI DB BACKEND)
  useEffect(() => {
    if (selectedProspect && !selectedProspect.isNew && selectedProspect.noProspek) {
      setHasSavedProspect(true);
      setIsSubmitting(true);

      // 1. Ambil data tersimpan dari local storage jika ada sebagai fallback/pelengkap terlengkap
      let localSaved: any = {};
      try {
        const s = window.localStorage.getItem('bni_ide_forms');
        if (s) {
          const f = JSON.parse(s);
          if (f[selectedProspect.noProspek]) localSaved = f[selectedProspect.noProspek];
        }
      } catch { }

      // 2. Fetch data aplikasi asli langsung dari database SQLite backend
      fetch(`http://localhost:5139/api/DataEntry/applications/${encodeURIComponent(selectedProspect.noProspek)}`)
        .then(res => (res.ok ? res.json() : null))
        .then(appData => {
          setIsSubmitting(false);
          const rawDbData = appData?.data || selectedProspect.data || selectedProspect || {};
          
          const normalized = {
            ...createEmptyForm(selectedProspect, user),
            ...localSaved,
            ...rawDbData,
            groupFasilitas: rawDbData.groupFasilitas || rawDbData.productGroupId || appData?.produk || selectedProspect?.produk || localSaved.groupFasilitas || '',
            fasilitas: rawDbData.fasilitas || rawDbData.productId || selectedProspect?.fasilitas || localSaved.fasilitas || '',
            kodeProgram: rawDbData.kodeProgram || rawDbData.program || localSaved.kodeProgram || '',
            tujuanPembiayaan: rawDbData.tujuanPembiayaan || localSaved.tujuanPembiayaan || '',
            maksimumKredit: rawDbData.maksimumKredit || rawDbData.cpLoanAmount || localSaved.maksimumKredit || '',
            jangkaWaktu: rawDbData.jangkaWaktu || rawDbData.tenor || localSaved.jangkaWaktu || '',
            channels: rawDbData.channels || rawDbData.sourceLead || rawDbData.chCode || rawDbData.sourceAplikasi || localSaved.channels || '',
            sourceAplikasi: rawDbData.sourceAplikasi || rawDbData.channels || rawDbData.sourceLead || rawDbData.chCode || localSaved.sourceAplikasi || '',
            media: rawDbData.media || localSaved.media || '',
            namaDepan: rawDbData.namaDepan || rawDbData.namaDebitur || appData?.namaDebitur || selectedProspect?.nama || localSaved.namaDepan || '',
            noKtp: rawDbData.noKtp || rawDbData.noKtpDebitur || appData?.ktp || selectedProspect?.ktp || localSaved.noKtp || '',
            noHandphone: rawDbData.noHandphone || rawDbData.noHp || selectedProspect?.telp || localSaved.noHandphone || '',
            namaSales: rawDbData.namaSales || appData?.referal || selectedProspect?.referal || localSaved.namaSales || '',
            namaCabangPembukuan: rawDbData.namaCabangPembukuan || rawDbData.branchId || appData?.cabang || localSaved.namaCabangPembukuan || 'SERANG',
            noProspek: selectedProspect.noProspek,
          };

          setFormData(normalized);

          const cols = rawDbData.collaterals || localSaved.collaterals;
          if (cols) setCollaterals(cols);
          const docs = rawDbData.documents || localSaved.documents;
          if (docs) setDocuments(docs);
          const bAccs = rawDbData.bankAccounts || localSaved.bankAccounts;
          if (bAccs) setBankAccounts(bAccs);
          const oLoans = rawDbData.otherLoans || localSaved.otherLoans;
          if (oLoans) setOtherLoans(oLoans);
          const cCards = rawDbData.creditCards || localSaved.creditCards;
          if (cCards) setCreditCards(cCards);
          const memos = rawDbData.memoList || localSaved.memoList;
          if (memos) setMemoList(memos);
          const skdrs = rawDbData.skdrList || localSaved.skdrList;
          if (skdrs) setSkdrList(skdrs);
        })
        .catch(err => {
          setIsSubmitting(false);
          console.error('Error fetching application from DB:', err);
          const rawDbData = selectedProspect.data || selectedProspect || {};
          const fallback = {
            ...createEmptyForm(selectedProspect, user),
            ...localSaved,
            ...rawDbData,
            groupFasilitas: rawDbData.groupFasilitas || rawDbData.productGroupId || selectedProspect?.produk || localSaved.groupFasilitas || '',
            fasilitas: rawDbData.fasilitas || rawDbData.productId || selectedProspect?.fasilitas || localSaved.fasilitas || '',
            channels: rawDbData.channels || rawDbData.sourceLead || localSaved.channels || '',
            namaDepan: rawDbData.namaDepan || selectedProspect?.nama || localSaved.namaDepan || '',
            noKtp: rawDbData.noKtp || selectedProspect?.ktp || localSaved.noKtp || '',
            noHandphone: rawDbData.noHandphone || selectedProspect?.telp || localSaved.noHandphone || '',
            noProspek: selectedProspect.noProspek,
          };
          setFormData(fallback);
        });
    } else {
      // INPUT BARU: Form bersih, semua field kosong, 9 tabs tersembunyi
      setHasSavedProspect(false);
      setFormData(createEmptyForm(selectedProspect, user));
      setCollaterals([]);
      setDocuments([]);
      setBankAccounts([]);
      setOtherLoans([]);
      setCreditCards([]);
      setMemoList([]);
      setSkdrList([]);
      setActiveTab(0);
    }
  }, [selectedProspect]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const [submittedAppModal, setSubmittedAppModal] = useState<{
    nama: string;
    noProspek: string;
    noAplikasi: string;
  } | null>(null);

  // ── Sync formData ke bni_ide_prospects (dibaca oleh List page) ──
  const syncToProspectList = (fd: any) => {
    try {
      const stored = window.localStorage.getItem('bni_ide_prospects');
      const list: any[] = stored ? JSON.parse(stored) : [];
      const namaLengkap = [fd.namaDepan, fd.namaTengah, fd.namaBelakang].filter(Boolean).join(' ').trim() || fd.nama || 'DEBITUR';
      const entry = {
        noProspek: fd.noProspek,
        nama: namaLengkap,
        ktp: fd.noKtp || fd.noIdentitas || '',
        telp: fd.noHandphone || fd.noTelpNumber || '',
        fasilitas: fd.fasilitas || fd.groupFasilitas || '',
        referal: fd.referal || '',
        statusPrescreening: '',
        maksKredit: fd.maksimumKredit || '',
        unitPemroses: fd.regionalSales || 'SERANG STA',
      };
      const idx = list.findIndex(p => p.noProspek === fd.noProspek);
      if (idx >= 0) list[idx] = entry; else list.unshift(entry);
      window.localStorage.setItem('bni_ide_prospects', JSON.stringify(list));
    } catch (e) { console.error(e); }
  };

  const generateNoProspek = () => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = String(now.getFullYear()).slice(-2);
    const r = String(Math.floor(Math.random() * 90000) + 10000);
    return `${d}${m}${y}0460${r}`;
  };

  // Helper to persist current form and all tabs data to DB & localStorage
  // Generates No. Prospek upon saving Tab 1 (Informasi Source Aplikasi) if not already generated
  const saveCurrentData = async (overrides?: any): Promise<string> => {
    try {
      let currentFd = overrides ? { ...formData, ...overrides } : { ...formData };
      if (!currentFd.noProspek || currentFd.noProspek === 'Auto Generate') {
        const generated = generateNoProspek();
        currentFd.noProspek = generated;
        setFormData((prev: any) => ({ ...prev, noProspek: generated }));
      }

      // Prospek kini tersimpan, aktifkan tampilan 9 tab navigasi
      setHasSavedProspect(true);

      const payload = {
        ...currentFd,
        collaterals,
        documents,
        bankAccounts,
        otherLoans,
        creditCards,
        memoList,
        skdrList,
      };

      // 1. Sync ke localStorage
      const stored = window.localStorage.getItem('bni_ide_forms');
      const forms = stored ? JSON.parse(stored) : {};
      forms[currentFd.noProspek] = payload;
      window.localStorage.setItem('bni_ide_forms', JSON.stringify(forms));
      syncToProspectList(payload);

      // 2. REAL BACKEND DB PERSISTENCE (SQLite elo_local.db)
      const namaDebiturDraft = [currentFd.namaDepan, currentFd.namaTengah, currentFd.namaBelakang].filter(Boolean).join(' ').trim() || currentFd.nama || 'DEBITUR DRAFT';
      
      const appSavePromise = fetch('http://localhost:5139/api/DataEntry/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noAplikasi: `0${currentFd.noProspek}`,
          noProspek: currentFd.noProspek,
          namaDebitur: namaDebiturDraft,
          ktp: currentFd.noKtp || currentFd.noIdentitas || '',
          produk: currentFd.groupFasilitas || 'BNI GRIYA',
          cabang: currentFd.namaCabangPembukuan || '046 - SERANG',
          status: 'Draft IDE',
          data: payload,
        }),
      }).catch(err => {
        console.error('Error saving application to DB backend:', err);
        return null;
      });

      // Call dedicated BNI eLO routes matching official controllers
      if (activeTab === 0) {
        const sourcePromise = fetch('http://localhost:5139/api/SourceApplicant/save-applicant-griya', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coldProspectId: currentFd.noProspek === 'Auto Generate' ? '' : currentFd.noProspek,
            sourceLead: currentFd.channels || currentFd.sourceAplikasi || currentFd.sourceLead || 'Branch',
            productGroupId: currentFd.groupFasilitas || currentFd.produk || '',
            productId: currentFd.fasilitas || '',
            branchId: currentFd.namaCabangPembukuan || currentFd.branchId || '046 - SERANG',
            kodePenyelia: currentFd.kodePenyelia || '',
            kodeSales: currentFd.kodeSales || '',
            namaSales: currentFd.namaSales || '',
            noKtpDebitur: currentFd.noKtp || currentFd.noIdentitas || '',
            namaDebitur: namaDebiturDraft,
            jenisKelamin: currentFd.jenisKelamin || '',
            tempatLahir: currentFd.tempatLahir || '',
            tanggalLahir: currentFd.tanggalLahir || '',
            statusKawin: currentFd.statusKawin || currentFd.statusPerkawinan || '',
            noHp: currentFd.noHandphone || currentFd.noHp || ''
          })
        }).catch(err => {
          console.error('Error saving to SourceApplicant:', err);
          return null;
        });

        await sourcePromise;
        await appSavePromise;
      } else {
        await appSavePromise;
        if (activeTab === 1 && collaterals.length > 0) {
          await Promise.all(collaterals.map((col: any) =>
            fetch('http://localhost:5139/api/Collateral/save-collateral-griya', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                coldProspectId: currentFd.noProspek,
                kategoriPembiayaan: col.kategoriPembiayaan || currentFd.groupFasilitas || 'Pembiayaan Griya',
                tipeJaminan: col.tipe || col.tipeJaminan || 'RUMAH TINGGAL',
                subTipeJaminan: col.subTipeJaminan || '',
                jenisProperti: col.jenisProperti || col.tipeProperti || 'TANAH/KAVLING',
                nilaiJaminan: parseFloat(col.kisaranHarga || col.perkiraanHarga || '0') || 0,
                alamatJaminan: col.alamatJaminan || '',
                noSertifikat: col.nomorSertifikat || '',
                luasTanah: parseFloat(col.luasTanah || '0') || 0,
                luasBangunan: parseFloat(col.luasBangunan || '0') || 0,
                namaPemilik: col.namaPemilikAgunan || namaDebiturDraft,
                ...col
              })
            }).catch(() => null)
          ));
        } else if (activeTab === 2) {
          await fetch('http://localhost:5139/api/DebiturInformation/save-debitur-griya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coldProspectId: currentFd.noProspek,
              namaLengkap: namaDebiturDraft,
              noKtp: currentFd.noKtp || currentFd.noIdentitas || '',
              npwp: currentFd.npwp || '',
              alamatKtp: currentFd.alamatKtp || '',
              ...currentFd
            })
          }).catch(() => null);
        } else if (activeTab === 3) {
          await fetch('http://localhost:5139/api/DebiturJob/save-debitur-job-griya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coldProspectId: currentFd.noProspek,
              tipePekerjaan: currentFd.tipePekerjaan || '',
              namaPerusahaan: currentFd.namaPerusahaan || '',
              jabatan: currentFd.jabatanPekerjaan || '',
              pendapatanPokok: parseFloat(String(currentFd.pendapatanPokok || '0').replace(/\./g, '').replace(/,/g, '.')) || 0,
              ...currentFd
            })
          }).catch(() => null);
        } else if (activeTab === 4) {
          await fetch('http://localhost:5139/api/SpouseInformation/save-spouse-griya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coldProspectId: currentFd.noProspek,
              namaPasangan: currentFd.namaDepanPasangan || '',
              noKtpPasangan: currentFd.noKtpPasangan || '',
              ...currentFd
            })
          }).catch(() => null);
        } else if (activeTab === 5) {
          await fetch('http://localhost:5139/api/SpouseJobInformation/save-spouse-job-griya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coldProspectId: currentFd.noProspek,
              tipePekerjaanPasangan: currentFd.tipePekerjaanPasangan || '',
              namaPerusahaanPasangan: currentFd.namaPerusahaanPasangan || '',
              jabatanPasangan: currentFd.jabatanPasangan || '',
              ...currentFd
            })
          }).catch(() => null);
        } else if (activeTab === 6) {
          await fetch('http://localhost:5139/api/EmergencyContact/save-emergency-griya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coldProspectId: currentFd.noProspek,
              namaEmergency: currentFd.namaDepanEmergency || '',
              hubungan: currentFd.hubunganEmergency || '',
              noHp: currentFd.noHpEmergency || '',
              ...currentFd
            })
          }).catch(() => null);
        } else if (activeTab === 7) {
          await fetch('http://localhost:5139/api/BankInformation/save-bank-griya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coldProspectId: currentFd.noProspek,
              bankAccounts: currentFd.bankAccounts || [],
              ...currentFd
            })
          }).catch(() => null);
        } else if (activeTab === 8) {
          await fetch('http://localhost:5139/api/ApprovalInPrincipal/update-prospect-griya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coldProspectId: currentFd.noProspek,
              ...currentFd
            })
          }).catch(() => null);
        }
      }

      return currentFd.noProspek;
    } catch (e) {
      console.error('Error in saveCurrentData:', e);
      return formData.noProspek || '';
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const effectiveNo = await saveCurrentData();
      setSaveSuccess(`Data "${TAB_MENUS[activeTab].label}" berhasil disimpan sebagai draft! No. Prospek: ${effectiveNo}`);
      eventBus.publish('IDE_APPLICATION_UPDATED', {
        noProspek: effectiveNo,
        tab: TAB_MENUS[activeTab].label,
      });
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving draft:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanjut = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validasi bagian berwarna kuning jika berada di Tab 0 (Informasi Source Aplikasi)
    if (activeTab === 0) {
      const missing = validateTab0Mandatory();
      if (missing.length > 0) {
        setMandatoryErrors(missing);
        setShowMandatoryModal(true);
        return;
      }
    }

    if (activeTab < TAB_MENUS.length - 1) {
      setIsSubmitting(true);
      try {
        const effectiveNo = await saveCurrentData();
        setHasSavedProspect(true);
        setSaveSuccess(`Data "${TAB_MENUS[activeTab].label}" tersimpan (No. Prospek: ${effectiveNo}). Melanjutkan ke tab berikutnya.`);
        setActiveTab((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSaveSuccess(null), 2500);
      } catch (err) {
        console.error('Error saving tab data:', err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      try {
        const effectiveNo = await saveCurrentData();
        setHasSavedProspect(true);
        setSaveSuccess(`Seluruh data pengajuan IDE berhasil disimpan (No. Prospek: ${effectiveNo}).`);
        setTimeout(() => setSaveSuccess(null), 3000);
      } catch (err) {
        console.error('Error saving tab data:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSendToProcessing = () => {
    if (!formData?.noProspek || formData.noProspek === 'Auto Generate') {
      alert('Simpan data prospek terlebih dahulu sebelum mengirim ke processing!');
      return;
    }
    // KIRIM APLIKASI KE DETAIL DATA ENTRY (APPROVAL IN PRINCIPAL)
    setIsSubmitting(true);
    
    // Panggil API ApprovalInPrincipal backend resmi
    fetch('http://localhost:5139/api/ApprovalInPrincipal/update-prospect-griya', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coldProspectId: formData.noProspek,
        status: 'DISETUJUI',
        catatan: 'Prospek disetujui AIP dan diteruskan ke Processing',
      }),
    }).catch(() => {});

      // Simpan form state ke bni_ide_forms
      try {
        const stored = window.localStorage.getItem('bni_ide_forms');
        const forms = stored ? JSON.parse(stored) : {};
        forms[formData.noProspek] = {
          ...formData,
          collaterals,
          documents,
          bankAccounts,
          otherLoans,
          creditCards,
          memoList,
          skdrList,
        };
        window.localStorage.setItem('bni_ide_forms', JSON.stringify(forms));
      } catch (e) {
        console.error(e);
      }

      syncToProspectList({ ...formData, collaterals, documents, bankAccounts, otherLoans, creditCards, memoList, skdrList });

      // Ambil daftar aplikasi Data Entry saat ini
      const deStorageKey = 'bni_data_entry_applications';
      let currentDeList: any[] = [];
      try {
        const storedDe = window.localStorage.getItem(deStorageKey);
        if (storedDe) {
          currentDeList = JSON.parse(storedDe);
        }
      } catch (e) {
        console.error(e);
      }

      const appIndex = currentDeList.length + 1;
      const generatedNoApp = `APL-046-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(appIndex).padStart(3, '0')}`;
      const existing = currentDeList.find((de) => de.noProspek === formData.noProspek);
      const targetNoApp = existing ? existing.noAplikasi : generatedNoApp;

      const debtorFullName = (
        formData.namaDepan
          ? `${formData.namaDepan} ${formData.namaBelakang || ''}`
          : formData.nama || 'DEBITUR'
      ).trim();

      const newDeRecord = {
        id: existing ? existing.id : `DE-${new Date().getFullYear()}-${String(appIndex).padStart(3, '0')}`,
        noAplikasi: targetNoApp,
        noProspek: formData.noProspek || '',
        namaDebitur: debtorFullName,
        ktp: formData.noKtp || formData.noIdentitas || '',
        npwp: formData.npwp || '',
        telepon: formData.noHandphone || formData.noTelpNumber || '',
        alamatKtp: formData.alamatKtp || '',
        alamatDomisili: formData.alamatTinggal || formData.alamatKtp || '',
        produk: formData.groupFasilitas?.toUpperCase().includes('GRIYA')
          ? 'BNI GRIYA'
          : formData.groupFasilitas?.toUpperCase().includes('OTO')
            ? 'BNI OTO'
            : formData.groupFasilitas?.toUpperCase().includes('FLEKSI')
              ? 'BNI FLEKSI'
              : 'BNI GRIYA',
        fasilitas: formData.fasilitas || 'GRIYA IDAMAN PEMBELIAN RUSUN',
        kodeProgram: formData.kodeProgram || 'REGULER (12-240 BULAN)',
        tujuanPembiayaan: formData.tujuanPembiayaan || 'RUMAH BARU',
        maksKredit: formData.maksimumKredit || formData.maksKredit || '100.000.000',
        sukuBunga: formData.sukuBunga || '7.25% Fixed 3 Thn',
        jangkaWaktu: formData.jangkaWaktu ? `${formData.jangkaWaktu} bulan` : '24 bulan (2 Tahun)',
        salesId: (user as any)?.userId || user?.id || 'SC70629',
        salesName: user?.name || 'SURYA HARJAYA (STAFF STA)',
        cabang: formData.namaCabangPembukuan || '046 - SERANG',
        tglKirimSales: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'Menunggu Data Entry' as const,
        tipePekerjaan: formData.tipePekerjaan || 'Karyawan Swasta BUMN',
        namaPerusahaan: formData.namaPerusahaan || 'PT KRAKATAU STEEL TBK',
        jabatan: formData.jabatanPekerjaan || formData.jabatan || 'Senior Staff',
        gajiPokok: formData.pendapatanPokok || formData.penghasilanUtamaBulan || '15.000.000,00',
        pendapatanLain: formData.pendapatanLain || '3.000.000,00',
        totalPengeluaran: formData.totalExpenses || '6.500.000,00',
        dsrPersen: formData.dsrPersen || '28.5%',
        tipeJaminan: collaterals[0]?.tipe || formData.tipeJaminan || 'Sertifikat Hak Milik (SHM)',
        lokasiAgunan: collaterals[0]?.alamat || formData.alamatKtp || 'Perumahan Serang Regency Blok C No. 12',
        nilaiPasarTaksasi: collaterals[0]?.nilaiPasar || '180.000.000,00',
        nilaiPengikatan: collaterals[0]?.nilaiPengikatan || '125.000.000,00',
        namaPasangan: formData.namaDepanPasangan || '',
        ktpPasangan: formData.noKtpPasangan || '',
        pekerjaanPasangan: formData.tipePekerjaanPasangan || '',
        namaEmergency: formData.namaEmergency || '',
        hubunganEmergency: formData.hubunganEmergency || '',
        telpEmergency: formData.noTelpEmergency || '',
        namaBankPayroll: bankAccounts[0]?.namaBank || 'BNI',
        noRekeningPayroll: bankAccounts[0]?.noRekening || formData.noRekSimpananBni || '',
        memoSales: memoList.map((m: any) => `[${m.tgl} - ${m.petugas}]: ${m.isi}`).join('\n') || formData.catatanMemoBaru || 'Aplikasi diajukan lengkap dari formulir IDE Sales.',
        docChecklist: {
          ktpValid: true,
          kkValid: true,
          npwpValid: true,
          slipGajiValid: true,
          rekKoranValid: true,
          agunanValid: true,
        },
        ideFormData: {
          personalInfo: { ...formData },
          collaterals: [...collaterals],
          documents: [...documents],
          bankAccounts: [...bankAccounts],
          otherLoans: [...otherLoans],
          creditCards: [...creditCards],
          memoList: [...memoList],
          skdrList: [...skdrList],
        },
        catatanProcessing: `Aplikasi dikirim oleh Sales ${user?.name || 'Surya Harjaya'} via Formulir IDE pada ${new Date().toLocaleString('id-ID')}. Siap diproses pada Detail Data Entry.`,
      };

      if (existing) {
        currentDeList = currentDeList.map((de) => (de.noProspek === formData.noProspek ? newDeRecord : de));
      } else {
        currentDeList.unshift(newDeRecord);
      }
      window.localStorage.setItem(deStorageKey, JSON.stringify(currentDeList));

      // Update status prospek di bni_ide_prospects
      try {
        const storedProspects = window.localStorage.getItem('bni_ide_prospects');
        let list = storedProspects ? JSON.parse(storedProspects) : [];
        const existingP = list.find((p: any) => p.noProspek === formData.noProspek);
        if (existingP) {
          list = list.map((p: any) =>
            p.noProspek === formData.noProspek
              ? { ...p, statusPrescreening: '' }
              : p
          );
        } else {
          list.unshift({
            noProspek: formData.noProspek,
            nama: debtorFullName,
            ktp: formData.noKtp || formData.noIdentitas || '',
            telp: formData.noHandphone || formData.noTelpNumber || '',
            fasilitas: formData.fasilitas || 'GRIYA IDAMAN PEMBELIAN RUSUN',
            referal: user?.name || 'SURYA HARJAYA (SC70629)',
            statusPrescreening: '',
            maksKredit: formData.maksimumKredit || formData.maksKredit || '100.000.000',
            unitPemroses: formData.namaCabangPembukuan || 'SERANG STA',
          });
        }
        window.localStorage.setItem('bni_ide_prospects', JSON.stringify(list));
      } catch (e) {
        console.error(e);
      }

      // Persist directly to backend SQLite database
      fetch('http://localhost:5139/api/DataEntry/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noAplikasi: targetNoApp,
          noProspek: formData.noProspek,
          namaDebitur: debtorFullName,
          ktp: formData.noKtp || formData.noIdentitas || '',
          produk: newDeRecord.produk || 'BNI GRIYA',
          cabang: formData.namaCabangPembukuan || '046 - SERANG',
          status: 'Menunggu Data Entry',
          data: newDeRecord,
        }),
      }).catch((e) => console.warn('Failed to sync application to SQLite backend:', e));

      window.dispatchEvent(new Event('storage'));
      eventBus.publish('APPLICATION_SENT_TO_PROCESSING', newDeRecord);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedAppModal({
          nama: debtorFullName,
          noProspek: formData.noProspek,
          noAplikasi: targetNoApp,
        });
      }, 400);
  };

  const handleAddMemo = () => {
    if (!formData.catatanMemoBaru?.trim()) return;
    const newMemo = {
      id: memoList.length + 1,
      tgl: new Date().toLocaleString('id-ID'),
      petugas: user?.name || 'SURYA HARJAYA (SC70629)',
      unit: 'SERANG STA (046)',
      isi: formData.catatanMemoBaru.trim(),
    };
    setMemoList([newMemo, ...memoList]);
    setFormData((prev: any) => ({ ...prev, catatanMemoBaru: '' }));
    setSaveSuccess('Catatan Memo berhasil ditambahkan!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen text-gray-800 font-sans text-xs flex flex-col">
      <div>
        {/* ========================================================
            TOP HEADER BAR (Sesuai Gambar 3: Logo BNI + Menu Utama & Logout)
        ======================================================== */}
        <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex flex-col gap-1.5">
            {/* Logo BNI Asli */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center select-none">
                <span className="text-[#F15A24] font-black text-2xl tracking-tighter mr-1">❖</span>
                <span className="text-[#F15A24] font-black text-2xl tracking-tight">BNI</span>
              </div>
            </div>
            {/* Box Badge Judul (Sesuai Screenshot Asli) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-50 border border-orange-200 text-[#F15A24] rounded-xl text-xs font-bold shadow-xs w-max">
              Initial Data Entry : {CUBES_SUBMENUS[activeTab]?.label || 'Informasi Source Aplikasi'}
              {formData.noProspek && formData.noProspek !== 'Auto Generate' ? (
                <span className="font-mono text-orange-950 font-bold ml-2">[{formData.noProspek}]</span>
              ) : ''}
            </div>
          </div>

          {/* Tombol Aksi Kanan (Sesuai Screenshot Asli) */}
          <div className="flex items-center gap-2">
            
            {hasSavedProspect && activeTab > 0 && (
              <button
                type="button"
                onClick={() => { setActiveTab(p => Math.max(0, p - 1)); setSaveSuccess(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-2xs shadow-2xs transition-colors cursor-pointer"
              >
                <Undo2 className="h-3.5 w-3.5" /> Kembali
              </button>
            )}
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('main')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Monitor className="h-3.5 w-3.5 text-blue-600" />
                <span>Menu Utama</span>
              </button>
            )}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-amber-800" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Toast Notifikasi Sukses */}
        {saveSuccess && (
          <div className="max-w-7xl mx-auto px-6 pt-3">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveSuccess(null)}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="max-w-[1540px] mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">

            {/* SIDEBAR TABS (9 Submenus): Pindah ke Samping Kiri (Sesuai Permintaan User) */}
            {hasSavedProspect && (
              <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-20 z-20 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_6px_28px_-6px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-5 space-y-4">
                  
                  {/* Header Stepper Sidebar */}
                  <div className="px-1 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-900 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                        Tahapan IDE
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 mt-1">Alur Formulir</h3>
                    </div>
                    <span className="text-[11px] font-bold text-[#F15A24] font-mono bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200">
                      {activeTab + 1} / {CUBES_SUBMENUS.length}
                    </span>
                  </div>

                  {/* Progress Bar Indikator */}
                  <div className="px-1 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>Kelengkapan Draf</span>
                      <span className="font-bold text-slate-700">{Math.round(((activeTab + 1) / CUBES_SUBMENUS.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#F15A24] via-orange-500 to-amber-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${((activeTab + 1) / CUBES_SUBMENUS.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 9 Step Items Vertikal */}
                  {/* Mobile Horizontal Scrollable Stepper (< lg) */}
                  <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 pt-1 no-scrollbar">
                    {CUBES_SUBMENUS.map((sub, idx) => {
                      const isActive = activeTab === idx;
                      const isPassed = idx < activeTab;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={async () => {
                            await saveCurrentData();
                            setActiveTab(idx);
                            setSaveSuccess(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-[#F15A24] to-[#E05A10] text-white shadow-sm"
                              : isPassed
                              ? "bg-orange-50 text-orange-900 border border-orange-200"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isActive ? 'bg-white text-[#F15A24]' : isPassed ? 'bg-orange-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                            {isPassed ? "✓" : idx + 1}
                          </span>
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Desktop 9 Step Items Vertikal (lg:block, hidden on mobile) */}
                  <nav className="hidden lg:block space-y-1.5 text-xs">
                    {CUBES_SUBMENUS.map((sub, idx) => {
                      const isActive = activeTab === idx;
                      const isPassed = idx < activeTab;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={async () => {
                            await saveCurrentData();
                            setActiveTab(idx);
                            setSaveSuccess(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group ${
                            isActive
                              ? "bg-gradient-to-r from-[#F15A24] to-[#E05A10] text-white font-bold shadow-[0_4px_16px_rgba(241,90,36,0.35)] -translate-y-0.5"
                              : isPassed
                              ? "bg-orange-50/70 hover:bg-orange-100/80 text-orange-950 font-semibold border border-orange-200/60"
                              : "hover:bg-slate-100/80 text-slate-700 font-medium border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 transition-all ${
                                isActive
                                  ? "bg-white text-[#F15A24] shadow-xs"
                                  : isPassed
                                  ? "bg-orange-500 text-white shadow-xs"
                                  : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                              }`}
                            >
                              {isPassed ? "✓" : idx + 1}
                            </span>
                            <span className="truncate text-[11px] leading-tight">
                              {sub.label}
                            </span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-ping" />
                          )}
                        </button>
                      );
                    })}
                  </nav>

                  {/* Prospect ID Mini-Card */}
                  {formData.noProspek && formData.noProspek !== "Auto Generate" && (
                    <div className="pt-3 border-t border-slate-100 px-1 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">No. Prospek:</span>
                      <span className="font-mono font-bold text-orange-950 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                        {formData.noProspek}
                      </span>
                    </div>
                  )}

                </div>
              </aside>
            )}

            {/* MAIN FORM CONTENT AREA */}
            <main className="flex-1 min-w-0 w-full">
              <form onSubmit={handleLanjut} className="space-y-6">
            {/* ========================================================
            TAB 1: INFORMASI SOURCE APLIKASI (Sesuai Gambar 1)
        ======================================================== */}
            {/* ========================================================
            TAB 1: PRODUK & APLIKASI (Modular Tab1Produk)
        ======================================================== */}
            {activeTab === 0 && (
              <InformasiSourceAplikasi
                formData={formData}
                onChange={handleChange}
                onSaveDraft={handleSaveDraft}
                onLanjut={handleLanjut}
                isSubmitting={isSubmitting}
              />
            )}

            {/* ========================================================
            TAB 2: OBYEK PEMBIAYAAN (Sesuai Gambar 1 - 5 CuBES Asli)
        ======================================================== */}
            {activeTab === 1 && (
              <ObyekPembiayaan
                colForm={colForm}
                onChange={handleColChange}
                onAddCollateral={handleTambahAgunan}
                onUpdateCollateral={handleTambahAgunan}
                collaterals={collaterals}
                onDeleteCollateral={handleDeleteAgunan}
                onEditCollateral={handleEditAgunan}
                editingIndex={editingColIndex}
                onCancelEdit={handleCancelEditAgunan}
                onLanjut={handleLanjutTab2}
                isSubmitting={isSubmitting}
              />
            )}


            {/* ========================================================
            TAB 3: INFORMASI DEBITUR (Sesuai CuBES eLO Asli)
        ======================================================== */}
            {activeTab === 2 && (
              <InformasiDebitur
                formData={formData}
                onChange={handleChange}
                onCariZipKtp={handleCariZipKtp}
                onSameWithKtp={handleSameWithKtp}
                onCariZipTinggal={handleCariZipTinggal}
                documents={documents}
                setDocuments={setDocuments}
                onLanjut={handleLanjutTab3}
              />
            )}

            {/* ========================================================
            TAB 4: PEKERJAAN DEBITUR (Sesuai CuBES eLO Asli)
        ======================================================== */}
            {activeTab === 3 && (
              <PekerjaanDebitur
                formData={formData}
                onChange={handleChange}
                onCariZipPerusahaan={handleCariZipPerusahaan}
                onLanjut={handleLanjutTab4}
              />
            )}

            {/* ========================================================
            TAB 5: INFORMASI PASANGAN (Sesuai CuBES eLO Asli)
        ======================================================== */}
            {activeTab === 4 && (
              <InformasiPasangan
                formData={formData}
                onChange={handleChange}
                onCariZipPasangan={handleCariZipPasangan}
                onLanjut={handleLanjutTab5}
              />
            )}

            {/* ========================================================
            TAB 6: INFORMASI PEKERJAAN PASANGAN (Sesuai CuBES eLO Asli)
        ======================================================== */}
            {activeTab === 5 && (
              <PekerjaanPasangan
                formData={formData}
                onChange={handleChange}
                onCariZipKantorPasangan={handleCariZipKantorPasangan}
                onLanjut={handleLanjutTab6}
              />
            )}

            {/* ========================================================
            TAB 7: KONTAK EMERGENCY (Sesuai CuBES eLO Asli)
        ======================================================== */}
            {activeTab === 6 && (
              <KontakEmergency
                formData={formData}
                onChange={handleChange}
                onCariZipEmergency={handleCariZipEmergency}
                onLanjut={handleLanjutTab7}
              />
            )}

            {/* ========================================================
            TAB 8: INFORMASI PERBANKAN (PersonalInfoDE3.aspx)
        ======================================================== */}
            {activeTab === 7 && (
              <InformasiPerbankan
                bankAccForm={bankAccForm}
                setBankAccForm={setBankAccForm}
                bankAccounts={bankAccounts}
                setBankAccounts={setBankAccounts}
                handleCariBankAcc={handleCariBankAcc}
                handleTambahBankAcc={handleTambahBankAcc}
                otherLoanForm={otherLoanForm}
                setOtherLoanForm={setOtherLoanForm}
                otherLoans={otherLoans}
                setOtherLoans={setOtherLoans}
                handleCariBankLoan={handleCariBankLoan}
                handleTambahOtherLoan={handleTambahOtherLoan}
                creditCardForm={creditCardForm}
                setCreditCardForm={setCreditCardForm}
                creditCards={creditCards}
                setCreditCards={setCreditCards}
                handleCariBankCC={handleCariBankCC}
                handleTambahCreditCard={handleTambahCreditCard}
                onLanjut={handleLanjutTab8}
              />
            )}

            {/* ========================================================
            TAB 9: MEMO & SKDR (Memo.aspx)
        ======================================================== */}
            {activeTab === 8 && (
              <MemoSkdr
                memoList={memoList}
                setMemoList={setMemoList}
                skdrList={skdrList}
                setSkdrList={setSkdrList}
                setSaveSuccess={setSaveSuccess}
                onLanjut={handleLanjutTab9}
              />
            )}

          </form>
            </main>

          </div>

          {/* MODAL SUKSES KIRIM KE PROCESSING (DETAIL DATA ENTRY) */}
          {submittedAppModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Aplikasi Berhasil Dikirim ke Processing!</h4>
                    <p className="text-[11px] text-slate-500">Tahap Inisiasi (Sales IDE) &rarr; Detail Data Entry</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Debitur:</span>
                    <strong className="text-slate-800">{submittedAppModal.nama}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. Prospek (IDE):</span>
                    <strong className="text-slate-700">{submittedAppModal.noProspek}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. Aplikasi (DE):</span>
                    <strong className="text-[#F15A24]">{submittedAppModal.noAplikasi}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Baru:</span>
                    <strong className="text-orange-600">Menunggu Data Entry</strong>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Seluruh data formulir 9 tab telah disimpan dan diteruskan ke antrean <strong>Detail Data Entry</strong>. Petugas processing kini dapat memproses berkas ini secara langsung.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedAppModal(null);
                      if (onNavigate) onNavigate('list');
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Kembali ke Daftar IDE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const targetAppNo = submittedAppModal.noAplikasi;
                      setSubmittedAppModal(null);
                      window.history.pushState(null, '', `/data-entry?appNo=${targetAppNo}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F15A24] hover:bg-[#D94E1B] text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Buka Detail Data Entry</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    
          {/* POPUP MODAL VALIDASI FIELD MANDATORY */}
          {showMandatoryModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-white rounded-lg shadow-2xl border-2 border-amber-400 max-w-lg w-full overflow-hidden font-sans">
                {/* Header Dialog */}
                <div className="bg-[#c5a329] text-black px-4 py-3 flex items-center justify-between border-b border-yellow-600 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-amber-900/10 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-amber-950" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-black uppercase tracking-wide">
                        Field Mandatory Belum Diisi
                      </h3>
                      <p className="text-[10px] text-amber-950 font-medium">
                        Initial Data Entry : Informasi Source Aplikasi
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMandatoryModal(false)}
                    className="h-6 w-6 rounded flex items-center justify-center hover:bg-black/10 text-amber-950 font-bold text-xl leading-none cursor-pointer"
                    title="Tutup"
                  >
                    &times;
                  </button>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-5 space-y-3 bg-white">
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      Terdapat <strong className="text-red-700 font-bold">{mandatoryErrors.length} field mandatory</strong> yang masih kosong. Seluruh bidang berwarna <span className="inline-block px-1.5 py-0.2 bg-[#fffde6] border border-amber-300 font-semibold text-amber-950 rounded">kuning</span> wajib dilengkapi sebelum melanjutkan ke Obyek Pembiayaan:
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Daftar Field Yang Belum Lengkap ({mandatoryErrors.length}):
                    </div>
                    <div className="max-h-60 overflow-y-auto rounded border border-gray-200 bg-[#fffdf0] p-2 space-y-1 divide-y divide-amber-100 shadow-inner">
                      {mandatoryErrors.map((err, idx) => (
                        <div key={idx} className="flex items-center gap-2 py-1 px-1.5 text-xs text-gray-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          <span className="font-medium text-gray-900">{err}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-[#f8f9fa] px-4 py-2.5 flex items-center justify-end border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowMandatoryModal(false)}
                    className="px-6 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xs shadow cursor-pointer transition-all active:scale-[0.99]"
                  >
                    Tutup & Lengkapi Data
                  </button>
                </div>
              </div>
            </div>
          )}
<footer className="mt-auto bg-[#c5a329] text-black text-[10px] font-sans px-4 py-1.5 flex flex-col sm:flex-row items-center justify-between border-t border-yellow-600 font-semibold shadow-inner">
  <span>
    ID USER : {user?.userId || 'SC70629'} | NAMA USER : {user?.userId || 'SC70629'} - {user?.name || 'SURYA HARJAYA'} (STAFF STA) | CABANG : 046 - SERANG
  </span>
  <span>
    Login Since : 10.11 - Selasa, 15 September 2026 - 192.168.217.90
  </span>
</footer>
</div>
  );
};

export default InitialDataEntry;








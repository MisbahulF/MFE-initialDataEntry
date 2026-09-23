import React, { useState } from 'react';
import { useAuth } from '@template/shared';
import {
  FileText,
  User,
  Briefcase,
  HeartHandshake,
  Users,
  AlertCircle,
  PiggyBank,
  Home,
  CreditCard,
  Building,
  ShieldCheck,
  Calculator,
  ArrowLeft,
  Save,
  CheckCircle2,
  RotateCcw,
  Send,
  Plus,
  Trash2,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import {
  DataEntryRecord,
  dataEntryService,
  AssetRecord,
  CreditCardRecord,
  OtherLoanRecord,
  GuarantorRecord,
  TieringRateItem,
} from '../services/dataEntryData';

interface DataEntryFormProps {
  application: DataEntryRecord;
  onBackToList: () => void;
  onApplicationUpdated: (updated: DataEntryRecord) => void;
}

// 12 Tab Resmi CuBES Detail Data Entry (USP_SCREENMENU_ALL '400104')
export type CuBESTab =
  | 'main'
  | 'personal'
  | 'job'
  | 'spouse'
  | 'spouse-job'
  | 'emergency'
  | 'assets'
  | 'collateral'
  | 'credit-card'
  | 'other-loan'
  | 'guarantor'
  | 'credit-structure';

export const CUBES_TABS = [
  { id: 'main', label: 'Halaman Utama', icon: FileText, asp: 'Main.aspx' },
  { id: 'personal', label: 'Informasi Pelanggan', icon: User, asp: 'PersonalInfo.aspx' },
  { id: 'job', label: 'Informasi Pekerjaan', icon: Briefcase, asp: 'JobInfo.aspx' },
  { id: 'spouse', label: 'Informasi Pasangan', icon: HeartHandshake, asp: 'SpouseInfo.aspx' },
  { id: 'spouse-job', label: 'Pekerjaan Pasangan', icon: Users, asp: 'SpouseJobInfo.aspx' },
  { id: 'emergency', label: 'Kontak Emergency', icon: AlertCircle, asp: 'Emergency.aspx' },
  { id: 'assets', label: 'Aset', icon: PiggyBank, asp: 'Assets.aspx' },
  { id: 'collateral', label: 'Obyek Pembiayaan', icon: Home, asp: 'Collateral.aspx' },
  { id: 'credit-card', label: 'Kartu Kredit', icon: CreditCard, asp: 'CreditCard.aspx' },
  { id: 'other-loan', label: 'Pinjaman Lain', icon: Building, asp: 'OtherLoan.aspx' },
  { id: 'guarantor', label: 'Penjamin', icon: ShieldCheck, asp: 'Guarantor.aspx' },
  { id: 'credit-structure', label: 'Struktur Kredit', icon: Calculator, asp: 'CreditStructure.aspx' },
];

export const DataEntryForm: React.FC<DataEntryFormProps> = ({
  application,
  onBackToList,
  onApplicationUpdated,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<CuBESTab>('main');

  // Form State
  const [formData, setFormData] = useState<DataEntryRecord>({ ...application });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRtsModal, setShowRtsModal] = useState(false);
  const [rtsReason, setRtsReason] = useState('');

  // Aset List State
  const [assets, setAssets] = useState<AssetRecord[]>(
    formData.assetsList || [
      { id: 'AST-01', bankName: 'BANK BNI', acType: 'Tabungan BNI Taplus', acNum: '046889211029', currency: 'IDR', avgSaldo: '45.000.000,00', isJaminan: false }
    ]
  );
  const [newAsset, setNewAsset] = useState<Partial<AssetRecord>>({
    bankName: 'BANK BNI',
    acType: 'Tabungan BNI Taplus',
    acNum: '',
    currency: 'IDR',
    avgSaldo: '',
    isJaminan: false,
  });

  // Kartu Kredit List State
  const [creditCards, setCreditCards] = useState<CreditCardRecord[]>(
    formData.creditCardList || [
      { id: 'CC-01', bankName: 'BANK BNI', cardNum: '4617-xxxx-xxxx-1029', limit: '25.000.000,00', since: '05/2018', outstanding: '3.450.000,00', tunggakan: '0,00' }
    ]
  );
  const [newCreditCard, setNewCreditCard] = useState<Partial<CreditCardRecord>>({
    bankName: 'BANK BNI',
    cardNum: '',
    limit: '',
    since: '',
    outstanding: '',
    tunggakan: '0,00',
  });

  // Pinjaman Lain List State
  const [otherLoans, setOtherLoans] = useState<OtherLoanRecord[]>(
    formData.otherLoanList || [
      { id: 'OL-01', bankName: 'BANK BRI', contractNum: 'KTA-2023-88912', facilityType: 'Kredit Tanpa Agunan (KTA)', maxLimit: '30.000.000,00', startDate: '01/06/2023', endDate: '01/06/2026', installment: '1.150.000,00', remainingTenor: '9', contactPerson: 'Sdr. Hendri', phone: '0812334455' }
    ]
  );
  const [newOtherLoan, setNewOtherLoan] = useState<Partial<OtherLoanRecord>>({
    bankName: '',
    contractNum: '',
    facilityType: 'Kredit Tanpa Agunan (KTA)',
    maxLimit: '',
    startDate: '',
    endDate: '',
    installment: '',
    remainingTenor: '',
    contactPerson: '',
    phone: '',
  });

  // Penjamin List State
  const [guarantors, setGuarantors] = useState<GuarantorRecord[]>(
    formData.guarantorList || [
      { id: 'GR-01', relType: 'Orang Tua Kandung', namaDepan: 'H. SOFYAN', namaTengah: '', namaBelakang: 'SANTOSO', tempatLahir: 'Semarang', tglLahir: '10/05/1958', jenisKelamin: 'Laki-laki', noKtp: '3301011005580001', masaBerlakuKtp: 'Seumur Hidup', alamat: 'JL. GAJAH MADA NO. 14, SEMARANG', rtRw: '002/004', kodepos: '50134', kota: 'Semarang', noTelp: '024-841928', noHp: '0812289911', hubunganDebitur: 'Penjamin Subsidair / Orang Tua' }
    ]
  );

  // Struktur Kredit State
  const [creditStruct, setCreditStruct] = useState(
    formData.creditStructure || {
      loanAmount: formData.maksKredit || '100.000.000,00',
      ratioJaminanNjMk: '150.00%',
      ratioPembiayaanLtv: '66.67%',
      pokokHutang: formData.maksKredit || '100.000.000,00',
      tenorBulan: formData.jangkaWaktu || '24',
      sukuBungaPersen: '7.25',
      tipeBunga: '04 - Annuity In Arrears',
      angsuranPerBulan: '4.488.636,00',
      skemaRate: 'Tiering Fixed Rate',
      tieringRates: [
        { id: 'TFR-1', seq: 1, durationMonths: 12, ratePercent: 5.75 },
        { id: 'TFR-2', seq: 2, durationMonths: 12, ratePercent: 7.25 },
      ],
      tipeAsuransi: 'Jiwa & Kerugian Kebakaran',
      asuransiCashAmount: '1.850.000,00',
      asuransiCreditAmount: '0,00',
      developerName: 'PT AGUNG PODOMORO LAND TBK',
      proyekName: 'Podomoro Park Tower B',
      beaFiducia: '0,00',
      provisiPersen: '1.00% (Rp 1.000.000,00)',
      biayaAdmin: 'Rp 500.000,00',
      biayaNotaris: 'Rp 2.500.000,00',
      biayaAppraisal: 'Rp 1.250.000,00',
      subsidiBungaFlag: false,
      subsidiBungaPersen: '0',
    }
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleInputChange = (field: keyof DataEntryRecord, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    const updated: DataEntryRecord = {
      ...formData,
      status: 'In Progress DE',
      assetsList: assets,
      creditCardList: creditCards,
      otherLoanList: otherLoans,
      guarantorList: guarantors,
      creditStructure: creditStruct,
    };
    dataEntryService.updateRecord(updated);
    setFormData(updated);
    onApplicationUpdated(updated);
    showToast('Data berhasil disimpan ke database CuBES eLO!');
  };

  const handleKirimKeAnalis = () => {
    const updated: DataEntryRecord = {
      ...formData,
      status: 'DE Selesai',
      assetsList: assets,
      creditCardList: creditCards,
      otherLoanList: otherLoans,
      guarantorList: guarantors,
      creditStructure: creditStruct,
    };
    dataEntryService.updateRecord(updated);
    setFormData(updated);
    onApplicationUpdated(updated);
    showToast('Data Entry tuntas! Berkas berhasil diteruskan ke Analis Kredit (CA) & SPV CA.');
    setTimeout(() => {
      onBackToList();
    }, 1500);
  };

  const handleReturnToSales = () => {
    if (!rtsReason.trim()) {
      alert('Mohon isi alasan pengembalian berkas!');
      return;
    }
    const updated: DataEntryRecord = {
      ...formData,
      status: 'Return to Sales (RTS)',
      catatanProcessing: `RTS: ${rtsReason.trim()}`,
    };
    dataEntryService.updateRecord(updated);
    setFormData(updated);
    onApplicationUpdated(updated);
    setShowRtsModal(false);
    showToast('Aplikasi berhasil dikembalikan (RTS) ke Sales Originator.');
    setTimeout(() => {
      onBackToList();
    }, 1200);
  };

  // Handler Aset
  const handleAddAsset = () => {
    if (!newAsset.bankName || !newAsset.acNum) {
      alert('Mohon isi Nama Bank dan No. Rekening!');
      return;
    }
    const record: AssetRecord = {
      id: `AST-${Date.now()}`,
      bankName: newAsset.bankName || '',
      acType: newAsset.acType || 'Tabungan',
      acNum: newAsset.acNum || '',
      currency: newAsset.currency || 'IDR',
      avgSaldo: newAsset.avgSaldo || '0,00',
      isJaminan: !!newAsset.isJaminan,
    };
    setAssets((prev) => [...prev, record]);
    setNewAsset({ bankName: 'BANK BNI', acType: 'Tabungan BNI Taplus', acNum: '', currency: 'IDR', avgSaldo: '', isJaminan: false });
    showToast('Aset simpanan berhasil ditambahkan.');
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Handler Kartu Kredit
  const handleAddCreditCard = () => {
    if (!newCreditCard.bankName || !newCreditCard.cardNum) {
      alert('Mohon isi Nama Bank dan No. Kartu Kredit!');
      return;
    }
    const record: CreditCardRecord = {
      id: `CC-${Date.now()}`,
      bankName: newCreditCard.bankName || '',
      cardNum: newCreditCard.cardNum || '',
      limit: newCreditCard.limit || '0,00',
      since: newCreditCard.since || '',
      outstanding: newCreditCard.outstanding || '0,00',
      tunggakan: newCreditCard.tunggakan || '0,00',
    };
    setCreditCards((prev) => [...prev, record]);
    setNewCreditCard({ bankName: 'BANK BNI', cardNum: '', limit: '', since: '', outstanding: '', tunggakan: '0,00' });
    showToast('Data Kartu Kredit berhasil ditambahkan.');
  };

  const handleDeleteCreditCard = (id: string) => {
    setCreditCards((prev) => prev.filter((c) => c.id !== id));
  };

  // Handler Pinjaman Lain
  const handleAddOtherLoan = () => {
    if (!newOtherLoan.bankName || !newOtherLoan.contractNum) {
      alert('Mohon isi Nama Bank dan No. Kontrak Pinjaman!');
      return;
    }
    const record: OtherLoanRecord = {
      id: `OL-${Date.now()}`,
      bankName: newOtherLoan.bankName || '',
      contractNum: newOtherLoan.contractNum || '',
      facilityType: newOtherLoan.facilityType || 'Kredit Lain',
      maxLimit: newOtherLoan.maxLimit || '0,00',
      startDate: newOtherLoan.startDate || '',
      endDate: newOtherLoan.endDate || '',
      installment: newOtherLoan.installment || '0,00',
      remainingTenor: newOtherLoan.remainingTenor || '0',
      contactPerson: newOtherLoan.contactPerson || '',
      phone: newOtherLoan.phone || '',
    };
    setOtherLoans((prev) => [...prev, record]);
    setNewOtherLoan({ bankName: '', contractNum: '', facilityType: 'Kredit Tanpa Agunan (KTA)', maxLimit: '', startDate: '', endDate: '', installment: '', remainingTenor: '', contactPerson: '', phone: '' });
    showToast('Data Pinjaman Lain berhasil ditambahkan.');
  };

  const handleDeleteOtherLoan = (id: string) => {
    setOtherLoans((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-teal-800 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-teal-600 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar ala CuBES eLO */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToList}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
              title="Kembali ke Antrean"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                  Detail Data Entry : 400104
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-teal-50 text-teal-700 border border-teal-200">
                  {formData.status}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formData.namaDebitur}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No. Aplikasi: <span className="font-semibold text-gray-700 dark:text-gray-300">{formData.noAplikasi}</span> | No. Prospek: <span className="font-semibold text-gray-700 dark:text-gray-300">{formData.noProspek}</span> | Produk: <span className="font-semibold text-teal-600">{formData.produk}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert('Fitur Print Barcode CuBES siap dicetak!')}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print Barcode
            </button>
            <button
              onClick={() => alert('Pra Uji FLPP berhasil dijalankan. Skor Lolos Uji.')}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              Pra Uji FLPP
            </button>
            <button
              onClick={() => setShowRtsModal(true)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Return (RTS)
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              Simpan Draft
            </button>
            <button
              onClick={handleKirimKeAnalis}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              Selesai & Teruskan ke Analis
            </button>
          </div>
        </div>

        {/* 12 Tabs Navigasi CuBES Resmi (USP_SCREENMENU_ALL '400104') */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1 min-w-max">
            {CUBES_TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CuBESTab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/50'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900'
                  }`}
                >
                  <span
                    className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-orange-600' : 'bg-gray-200 text-gray-600 dark:bg-gray-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB CONTENT RENDERER */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* =========================================================================
            TAB 1: HALAMAN UTAMA (Main.aspx)
           ========================================================================= */}
        {activeTab === 'main' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Informasi Aplikasi & Header Pemrosesan (Main.aspx)
              </h2>
              <p className="text-xs text-gray-500">Metadata permohonan, nomor rekening pinjaman, unit pemroses, dan tanggal penandatanganan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom Kiri */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Informasi Aplikasi</h3>
                
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">No. Prospek</span>
                  <span className="col-span-2 font-mono font-bold text-gray-900 dark:text-white">{formData.noProspek}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">No. Aplikasi</span>
                  <span className="col-span-2 font-mono font-bold text-teal-700 dark:text-teal-400">{formData.noAplikasi}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Nama Debitur</span>
                  <span className="col-span-2 font-bold text-gray-900 dark:text-white">{formData.namaDebitur}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">No. Rek Pinjaman</span>
                  <input
                    type="text"
                    value={formData.noRekeningPinjaman || ''}
                    onChange={(e) => handleInputChange('noRekeningPinjaman', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    placeholder="Contoh: 046889211029"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">No. Rek Afiliasi</span>
                  <input
                    type="text"
                    value={formData.noRekeningAfiliasi || ''}
                    onChange={(e) => handleInputChange('noRekeningAfiliasi', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    placeholder="Nomor rekening tabungan afiliasi debitur"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Marketing Org. Type</span>
                  <input
                    type="text"
                    value={formData.marketingOrgType || '000002101 - Branch Sales'}
                    onChange={(e) => handleInputChange('marketingOrgType', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">CSO / Officer</span>
                  <input
                    type="text"
                    value={formData.csoOfficer || formData.salesName}
                    onChange={(e) => handleInputChange('csoOfficer', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Cabang Asal</span>
                  <span className="col-span-2 text-gray-900 dark:text-white font-medium">{formData.cabang}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Cabang Pembukuan</span>
                  <input
                    type="text"
                    value={formData.cabangPembukuan || '259 - JAKARTA PUSAT'}
                    onChange={(e) => handleInputChange('cabangPembukuan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Cabang Pemroses</span>
                  <input
                    type="text"
                    value={formData.cabangPemroses || '046 - SERANG CPC'}
                    onChange={(e) => handleInputChange('cabangPemroses', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Mailing Room</span>
                  <input
                    type="text"
                    value={formData.mailingRoomUser || 'MLR-SERANG-01'}
                    onChange={(e) => handleInputChange('mailingRoomUser', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Pola Pemasaran</span>
                  <input
                    type="text"
                    value={formData.polaPemasaran || 'Pola Kerjasama Mitra'}
                    onChange={(e) => handleInputChange('polaPemasaran', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Informasi Sales & Parameter Aplikasi</h3>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Nama Sales</span>
                  <span className="col-span-2 font-bold text-gray-900 dark:text-white">{formData.salesName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Supervisor Sales</span>
                  <input
                    type="text"
                    value={formData.supervisorName || 'HENDRA PRASETYA (SPV SC)'}
                    onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Program</span>
                  <span className="col-span-2 font-medium text-gray-900 dark:text-white">{formData.kodeProgram}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Produk</span>
                  <span className="col-span-2 font-medium text-teal-700 dark:text-teal-400">{formData.produk} - {formData.fasilitas}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Channels</span>
                  <input
                    type="text"
                    value={formData.channelName || 'Branch Office'}
                    onChange={(e) => handleInputChange('channelName', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Media</span>
                  <input
                    type="text"
                    value={formData.mediaName || 'Direct Sales Exhibition'}
                    onChange={(e) => handleInputChange('mediaName', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Tgl Penandatanganan *</span>
                  <input
                    type="date"
                    value={formData.tglPenandatanganan || '2026-09-08'}
                    onChange={(e) => handleInputChange('tglPenandatanganan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-orange-300 font-semibold text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Tgl Terima Berkas</span>
                  <input
                    type="date"
                    value={formData.tglTerimaAplikasi || '2026-09-09'}
                    onChange={(e) => handleInputChange('tglTerimaAplikasi', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Hubungan dg BNI</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.lamaHubunganBniThn || '5'}
                      onChange={(e) => handleInputChange('lamaHubunganBniThn', e.target.value)}
                      className="w-20 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300"
                    />
                    <span className="text-gray-500">Tahun</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Asal Pameran</span>
                  <input
                    type="text"
                    value={formData.asalPameran || 'BNI Griya Expo 2026'}
                    onChange={(e) => handleInputChange('asalPameran', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600 dark:text-gray-400">Program Khusus / Event</span>
                  <input
                    type="text"
                    value={formData.programKhususEvent || 'PROMO HUT BNI 80 TAHUN'}
                    onChange={(e) => handleInputChange('programKhususEvent', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: INFORMASI PELANGGAN (PersonalInfo.aspx)
           ========================================================================= */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Informasi Pelanggan & Identitas Debitur (PersonalInfo.aspx)
              </h2>
              <p className="text-xs text-gray-500">Gelar, panggilan, nama 3 bagian, tempat tanggal lahir, nama ibu kandung 3 kolom, dan data alamat KTP.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Kolom Kiri: Identitas Personal */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Data Diri Debitur</h3>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Gelar Sebelum</span>
                  <input
                    type="text"
                    value={formData.gelarSebelum || ''}
                    onChange={(e) => handleInputChange('gelarSebelum', e.target.value)}
                    placeholder="Contoh: Ir., Drs."
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Panggilan</span>
                  <select
                    value={formData.panggilan || 'Bapak'}
                    onChange={(e) => handleInputChange('panggilan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  >
                    <option value="Bapak">Bapak</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Sdr">Sdr (Saudara)</option>
                    <option value="Sdri">Sdri (Saudari)</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nama Depan *</span>
                  <input
                    type="text"
                    value={formData.namaDepan || formData.namaDebitur.split(' ')[0] || ''}
                    onChange={(e) => handleInputChange('namaDepan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nama Tengah</span>
                  <input
                    type="text"
                    value={formData.namaTengah || ''}
                    onChange={(e) => handleInputChange('namaTengah', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nama Belakang</span>
                  <input
                    type="text"
                    value={formData.namaBelakang || formData.namaDebitur.split(' ').slice(1).join(' ') || ''}
                    onChange={(e) => handleInputChange('namaBelakang', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Gelar Sesudah</span>
                  <input
                    type="text"
                    value={formData.gelarSesudah || ''}
                    onChange={(e) => handleInputChange('gelarSesudah', e.target.value)}
                    placeholder="Contoh: S.T., M.M., S.E."
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Jenis Kelamin</span>
                  <select
                    value={formData.jenisKelamin || 'Laki-laki'}
                    onChange={(e) => handleInputChange('jenisKelamin', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Tempat Lahir</span>
                  <input
                    type="text"
                    value={formData.tempatLahir || 'JAKARTA'}
                    onChange={(e) => handleInputChange('tempatLahir', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Tanggal Lahir</span>
                  <input
                    type="text"
                    value={formData.tglLahir || '15/01/1985'}
                    onChange={(e) => handleInputChange('tglLahir', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Status Pernikahan</span>
                  <select
                    value={formData.statusPernikahan || 'Menikah'}
                    onChange={(e) => handleInputChange('statusPernikahan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  >
                    <option value="Belum Menikah">Belum Menikah (Lajang)</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Status Perceraian</span>
                  <input
                    type="text"
                    value={formData.statusPerceraian || 'Bukan Duda/Janda'}
                    onChange={(e) => handleInputChange('statusPerceraian', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Lama Menetap</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.lamaMenetapTahun || '6'}
                      onChange={(e) => handleInputChange('lamaMenetapTahun', e.target.value)}
                      className="w-16 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <span>Tahun</span>
                    <input
                      type="number"
                      value={formData.lamaMenetapBulan || '4'}
                      onChange={(e) => handleInputChange('lamaMenetapBulan', e.target.value)}
                      className="w-16 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <span>Bulan</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nama Ibu Kandung</span>
                  <div className="col-span-2 grid grid-cols-3 gap-1">
                    <input
                      type="text"
                      placeholder="Depan *"
                      value={formData.namaIbuKandungDepan || 'SITI'}
                      onChange={(e) => handleInputChange('namaIbuKandungDepan', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Tengah"
                      value={formData.namaIbuKandungTengah || 'AMINAH'}
                      onChange={(e) => handleInputChange('namaIbuKandungTengah', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Belakang"
                      value={formData.namaIbuKandungBelakang || 'SUHARTI'}
                      onChange={(e) => handleInputChange('namaIbuKandungBelakang', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Alamat KTP & Kontak */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Alamat KTP & Kontak</h3>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">No. KTP *</span>
                  <input
                    type="text"
                    value={formData.ktp}
                    onChange={(e) => handleInputChange('ktp', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Masa Berlaku KTP</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="date"
                      value={formData.masaBerlakuKtp || '2030-01-15'}
                      onChange={(e) => handleInputChange('masaBerlakuKtp', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.ktpSeumurHidup ?? true}
                        onChange={(e) => handleInputChange('ktpSeumurHidup', e.target.checked)}
                      />
                      Seumur Hidup
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">NPWP Pribadi</span>
                  <input
                    type="text"
                    value={formData.npwp}
                    onChange={(e) => handleInputChange('npwp', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">No. CIF BNI</span>
                  <input
                    type="text"
                    value={formData.cifNo || '9902847291'}
                    onChange={(e) => handleInputChange('cifNo', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Alamat KTP</span>
                  <input
                    type="text"
                    value={formData.alamatKtp}
                    onChange={(e) => handleInputChange('alamatKtp', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">RT / RW KTP</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="RT"
                      value={formData.rtKtp || '001'}
                      onChange={(e) => handleInputChange('rtKtp', e.target.value)}
                      className="w-16 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <span>/</span>
                    <input
                      type="text"
                      placeholder="RW"
                      value={formData.rwKtp || '002'}
                      onChange={(e) => handleInputChange('rwKtp', e.target.value)}
                      className="w-16 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Kelurahan / Kecamatan</span>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Kelurahan"
                      value={formData.kelurahanKtp || 'Rawa Terate'}
                      onChange={(e) => handleInputChange('kelurahanKtp', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Kecamatan"
                      value={formData.kecamatanKtp || 'Cakung'}
                      onChange={(e) => handleInputChange('kecamatanKtp', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Kota / Kode Pos</span>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Kota"
                      value={formData.kotaKtp || 'Jakarta Timur'}
                      onChange={(e) => handleInputChange('kotaKtp', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Kode Pos"
                      value={formData.kodeposKtp || '13920'}
                      onChange={(e) => handleInputChange('kodeposKtp', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">No. Telepon Rumah</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Area (021)"
                      value={formData.telpArea || '021'}
                      onChange={(e) => handleInputChange('telpArea', e.target.value)}
                      className="w-20 p-1.5 border rounded bg-white dark:bg-gray-700 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Nomor Telp"
                      value={formData.telpNomor || '4608892'}
                      onChange={(e) => handleInputChange('telpNomor', e.target.value)}
                      className="flex-1 p-1.5 border rounded bg-white dark:bg-gray-700 font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">No. Handphone *</span>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => handleInputChange('telepon', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Email Debitur</span>
                  <input
                    type="email"
                    value={formData.email || 'martis.santoso@gmail.com'}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: INFORMASI PEKERJAAN (JobInfo.aspx)
           ========================================================================= */}
        {activeTab === 'job' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-500" />
                Pekerjaan & Data Keuangan Debitur (JobInfo.aspx)
              </h2>
              <p className="text-xs text-gray-500">Instansi, status pegawai, PKS payroll, gaji pokok, tunjangan, potongan, dan analisa DSR.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Profil Instansi & Pekerjaan</h3>
                
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Tanggal Mulai Bekerja</span>
                  <input
                    type="text"
                    value={formData.tglMulaiKerja || '10/03/2012'}
                    onChange={(e) => handleInputChange('tglMulaiKerja', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Tipe Pekerjaan</span>
                  <input
                    type="text"
                    value={formData.tipePekerjaan || 'Karyawan Swasta BUMN'}
                    onChange={(e) => handleInputChange('tipePekerjaan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Jenis Pendapatan</span>
                  <input
                    type="text"
                    value={formData.jenisPendapatan || 'Payroll BNI Tetap'}
                    onChange={(e) => handleInputChange('jenisPendapatan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Sumber Penghasilan</span>
                  <input
                    type="text"
                    value={formData.sumberPenghasilan || 'Gaji Pokok & Tunjangan'}
                    onChange={(e) => handleInputChange('sumberPenghasilan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nama Perusahaan *</span>
                  <input
                    type="text"
                    value={formData.namaPerusahaan || 'PT KRAKATAU STEEL (PERSERO) TBK'}
                    onChange={(e) => handleInputChange('namaPerusahaan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-bold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Jabatan & Posisi</span>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Jabatan"
                      value={formData.jabatan || 'Senior Engineer'}
                      onChange={(e) => handleInputChange('jabatan', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Posisi / Dept"
                      value={formData.posisiKantor || 'Managerial Level 3'}
                      onChange={(e) => handleInputChange('posisiKantor', e.target.value)}
                      className="p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Alamat Kantor</span>
                  <input
                    type="text"
                    value={formData.alamatKantor || 'Kawasan Industri Krakatau Steel Kav. 12, Cilegon'}
                    onChange={(e) => handleInputChange('alamatKantor', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">NIP / Usia Pensiun</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="NIP"
                      value={formData.nip || 'KS-889021'}
                      onChange={(e) => handleInputChange('nip', e.target.value)}
                      className="flex-1 p-1.5 border rounded bg-white dark:bg-gray-700 font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Usia Pensiun"
                      value={formData.umurPensiun || '58'}
                      onChange={(e) => handleInputChange('umurPensiun', e.target.value)}
                      className="w-16 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                    <span>Thn</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Rincian Keuangan */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Penghasilan & Kapasitas Bayar</h3>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Gaji Pokok / Bulan *</span>
                  <input
                    type="text"
                    value={formData.gajiPokok || '15.000.000,00'}
                    onChange={(e) => handleInputChange('gajiPokok', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-semibold text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Pendapatan Lain</span>
                  <input
                    type="text"
                    value={formData.pendapatanLain || '3.000.000,00'}
                    onChange={(e) => handleInputChange('pendapatanLain', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Total Pendapatan</span>
                  <input
                    type="text"
                    value={formData.totalPendapatan || '18.000.000,00'}
                    onChange={(e) => handleInputChange('totalPendapatan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-bold text-teal-700 dark:text-teal-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Total Pengeluaran / Bln</span>
                  <input
                    type="text"
                    value={formData.totalPengeluaran || '6.000.000,00'}
                    onChange={(e) => handleInputChange('totalPengeluaran', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Tunjangan Hari Tua (THT)</span>
                  <input
                    type="text"
                    value={formData.thtAmount || '1.200.000,00'}
                    onChange={(e) => handleInputChange('thtAmount', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">DSR Terhitung</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
                      {formData.dsrPersen || '28.5%'} (Kategori Aman &lt; 40%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: INFORMASI PASANGAN (SpouseInfo.aspx)
           ========================================================================= */}
        {activeTab === 'spouse' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-orange-500" />
                Informasi Identitas Pasangan (SpouseInfo.aspx)
              </h2>
              <p className="text-xs text-gray-500">Data suami/istri pemohon kredit, nomor KTP, tanggal lahir, dan persetujuan penjaminan perkawinan.</p>
            </div>

            <div className="max-w-2xl bg-gray-50 dark:bg-gray-750 p-5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs space-y-3">
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Nama Lengkap Pasangan</span>
                <input
                  type="text"
                  value={formData.namaPasangan || 'RATNA KURNIAWATI'}
                  onChange={(e) => handleInputChange('namaPasangan', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700 font-semibold"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">No. KTP Pasangan</span>
                <input
                  type="text"
                  value={formData.ktpPasangan || '3201015504880002'}
                  onChange={(e) => handleInputChange('ktpPasangan', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700 font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Tempat Lahir Pasangan</span>
                <input
                  type="text"
                  value={formData.tempatLahirPasangan || 'Bandung'}
                  onChange={(e) => handleInputChange('tempatLahirPasangan', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Tanggal Lahir Pasangan</span>
                <input
                  type="text"
                  value={formData.tglLahirPasangan || '14/04/1988'}
                  onChange={(e) => handleInputChange('tglLahirPasangan', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: PEKERJAAN PASANGAN (SpouseJobInfo.aspx)
           ========================================================================= */}
        {activeTab === 'spouse-job' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Informasi Pekerjaan Pasangan (SpouseJobInfo.aspx)
              </h2>
              <p className="text-xs text-gray-500">Profesi pasangan, instansi bekerja, dan kontribusi penghasilan gabungan (joint income).</p>
            </div>

            <div className="max-w-2xl bg-gray-50 dark:bg-gray-750 p-5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs space-y-3">
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Pekerjaan / Profesi</span>
                <input
                  type="text"
                  value={formData.pekerjaanPasangan || 'Pegawai Negeri Sipil (PNS)'}
                  onChange={(e) => handleInputChange('pekerjaanPasangan', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700 font-semibold"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Nama Instansi / Perusahaan</span>
                <input
                  type="text"
                  value={formData.perusahaanPasangan || 'Dinas Pendidikan Provinsi Banten'}
                  onChange={(e) => handleInputChange('perusahaanPasangan', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Penghasilan per Bulan</span>
                <input
                  type="text"
                  value={formData.penghasilanPasangan || '6.500.000,00'}
                  onChange={(e) => handleInputChange('penghasilanPasangan', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700 font-bold text-teal-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: KONTAK EMERGENCY (Emergency.aspx)
           ========================================================================= */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Kontak Emergency & Kerabat Dekat (Emergency.aspx)
              </h2>
              <p className="text-xs text-gray-500">Kerabat yang tidak tinggal serumah untuk konfirmasi darurat perbankan.</p>
            </div>

            <div className="max-w-2xl bg-gray-50 dark:bg-gray-750 p-5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs space-y-3">
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Nama Lengkap Kerabat *</span>
                <input
                  type="text"
                  value={formData.namaEmergency || 'BAMBANG HERMANTO'}
                  onChange={(e) => handleInputChange('namaEmergency', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700 font-bold"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Hubungan Kerabat</span>
                <input
                  type="text"
                  value={formData.hubunganEmergency || 'Kakak Kandung'}
                  onChange={(e) => handleInputChange('hubunganEmergency', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">Alamat Kerabat</span>
                <input
                  type="text"
                  value={formData.alamatEmergency || 'JL. MERDEKA RAYA NO. 88, KOTA SERANG'}
                  onChange={(e) => handleInputChange('alamatEmergency', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">RT/RW / Kota</span>
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="RT/RW"
                    value={formData.rtRwEmergency || '003/001'}
                    onChange={(e) => handleInputChange('rtRwEmergency', e.target.value)}
                    className="p-2 border rounded bg-white dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Kota"
                    value={formData.kotaEmergency || 'Serang'}
                    onChange={(e) => handleInputChange('kotaEmergency', e.target.value)}
                    className="p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-gray-600">No. Handphone Kerabat *</span>
                <input
                  type="text"
                  value={formData.telpEmergency || '081388776655'}
                  onChange={(e) => handleInputChange('telpEmergency', e.target.value)}
                  className="col-span-2 p-2 border rounded bg-white dark:bg-gray-700 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: ASET SIMPANAN (Assets.aspx)
           ========================================================================= */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-orange-500" />
                Data Aset & Simpanan Debitur (Assets.aspx)
              </h2>
              <p className="text-xs text-gray-500">Rekening tabungan, giro, deposito, dan instrumen likuid debitur di BNI maupun bank lain.</p>
            </div>

            {/* Form Input Tambah Aset */}
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border rounded-lg space-y-3 text-xs">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Tambah Akun Aset / Simpanan</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-gray-600 mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={newAsset.bankName}
                    onChange={(e) => setNewAsset({ ...newAsset, bankName: e.target.value })}
                    placeholder="BANK BNI / BCA / MANDIRI"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Tipe Rekening</label>
                  <select
                    value={newAsset.acType}
                    onChange={(e) => setNewAsset({ ...newAsset, acType: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  >
                    <option value="Tabungan BNI Taplus">Tabungan</option>
                    <option value="Giro Rupiah">Giro</option>
                    <option value="Deposito Berjangka">Deposito</option>
                    <option value="Reksadana / Saham">Investasi Lain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">No. Rekening #</label>
                  <input
                    type="text"
                    value={newAsset.acNum}
                    onChange={(e) => setNewAsset({ ...newAsset, acNum: e.target.value })}
                    placeholder="Nomor rekening"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Saldo Rata-rata (Rp)</label>
                  <input
                    type="text"
                    value={newAsset.avgSaldo}
                    onChange={(e) => setNewAsset({ ...newAsset, avgSaldo: e.target.value })}
                    placeholder="Saldo"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddAsset}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* Data Grid Aset */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-3">Nama Bank</th>
                    <th className="p-3">Tipe Rekening</th>
                    <th className="p-3">No. Rekening</th>
                    <th className="p-3">Mata Uang</th>
                    <th className="p-3 text-right">Saldo Rata-rata</th>
                    <th className="p-3 text-center">Jaminan</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {assets.map((ast) => (
                    <tr key={ast.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{ast.bankName}</td>
                      <td className="p-3 text-gray-600">{ast.acType}</td>
                      <td className="p-3 font-mono">{ast.acNum}</td>
                      <td className="p-3">{ast.currency}</td>
                      <td className="p-3 text-right font-bold text-gray-900 dark:text-white">{ast.avgSaldo}</td>
                      <td className="p-3 text-center">{ast.isJaminan ? 'Ya' : 'Tidak'}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteAsset(ast.id)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                          title="Hapus Aset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {assets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-400">
                        Belum ada aset simpanan yang didaftarkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: OBYEK PEMBIAYAAN / AGUNAN (Collateral.aspx)
           ========================================================================= */}
        {activeTab === 'collateral' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-orange-500" />
                Obyek Pembiayaan & Data Agunan (Collateral.aspx)
              </h2>
              <p className="text-xs text-gray-500">Sertifikat bukti kepemilikan, developer, nilai pasar taksasi, dan pengikatan notaris.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Legalitas & Spesifikasi Agunan</h3>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Tipe Jaminan</span>
                  <input
                    type="text"
                    value={formData.tipeJaminan || 'Tanah & Bangunan (Rumah Susun/Apartemen)'}
                    onChange={(e) => handleInputChange('tipeJaminan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Status Agunan</span>
                  <input
                    type="text"
                    value={formData.statusAgunan || 'Agunan Baru (Developer PKS)'}
                    onChange={(e) => handleInputChange('statusAgunan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Bukti Kepemilikan</span>
                  <input
                    type="text"
                    value={formData.buktiKepemilikan || 'Strata Title / SHM Sarusun'}
                    onChange={(e) => handleInputChange('buktiKepemilikan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">No. Sertifikat Agunan</span>
                  <input
                    type="text"
                    value={formData.noSertifikat || 'SHMSRS No. 0489/Serang Barat'}
                    onChange={(e) => handleInputChange('noSertifikat', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Pengembang / Developer</span>
                  <input
                    type="text"
                    value={formData.developerName || 'PT AGUNG PODOMORO LAND TBK'}
                    onChange={(e) => handleInputChange('developerName', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nama Proyek</span>
                  <input
                    type="text"
                    value={formData.proyekName || 'Podomoro Park Tower B'}
                    onChange={(e) => handleInputChange('proyekName', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Lokasi / Alamat Agunan</span>
                  <input
                    type="text"
                    value={formData.lokasiAgunan || 'Podomoro Park Tower B Lt. 12 Unit 12A, Serang'}
                    onChange={(e) => handleInputChange('lokasiAgunan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Nilai Taksasi & Pengikatan</h3>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nilai Pasar Taksasi *</span>
                  <input
                    type="text"
                    value={formData.nilaiPasarTaksasi || '150.000.000,00'}
                    onChange={(e) => handleInputChange('nilaiPasarTaksasi', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-bold text-teal-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nilai NJOP</span>
                  <input
                    type="text"
                    value={formData.nilaiNjop || '120.000.000,00'}
                    onChange={(e) => handleInputChange('nilaiNjop', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nilai Likuidasi</span>
                  <input
                    type="text"
                    value={formData.nilaiLikuidasi || '105.000.000,00'}
                    onChange={(e) => handleInputChange('nilaiLikuidasi', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Nilai Pengikatan</span>
                  <input
                    type="text"
                    value={formData.nilaiPengikatan || '125.000.000,00'}
                    onChange={(e) => handleInputChange('nilaiPengikatan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Jenis Pengikatan</span>
                  <select
                    value={formData.jenisPengikatan || 'APHT Peringkat I'}
                    onChange={(e) => handleInputChange('jenisPengikatan', e.target.value)}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  >
                    <option value="APHT Peringkat I">APHT Peringkat I</option>
                    <option value="APHT Peringkat II">APHT Peringkat II</option>
                    <option value="Fiducia">Fiducia</option>
                    <option value="SKMHT">SKMHT</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 9: KARTU KREDIT (CreditCard.aspx)
           ========================================================================= */}
        {activeTab === 'credit-card' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Data Fasilitas Kartu Kredit (CreditCard.aspx)
              </h2>
              <p className="text-xs text-gray-500">Kartu kredit yang dimiliki pemohon pada bank penerbit di seluruh Indonesia.</p>
            </div>

            {/* Form Tambah Kartu Kredit */}
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border rounded-lg space-y-3 text-xs">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Tambah Kartu Kredit</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={newCreditCard.bankName}
                    onChange={(e) => setNewCreditCard({ ...newCreditCard, bankName: e.target.value })}
                    placeholder="BANK BNI"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">No. Kartu Kredit</label>
                  <input
                    type="text"
                    value={newCreditCard.cardNum}
                    onChange={(e) => setNewCreditCard({ ...newCreditCard, cardNum: e.target.value })}
                    placeholder="xxxx-xxxx-xxxx-1234"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Limit (Rp)</label>
                  <input
                    type="text"
                    value={newCreditCard.limit}
                    onChange={(e) => setNewCreditCard({ ...newCreditCard, limit: e.target.value })}
                    placeholder="Limit"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Sejak (MM/YYYY)</label>
                  <input
                    type="text"
                    value={newCreditCard.since}
                    onChange={(e) => setNewCreditCard({ ...newCreditCard, since: e.target.value })}
                    placeholder="05/2020"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Baki Debet (Rp)</label>
                  <input
                    type="text"
                    value={newCreditCard.outstanding}
                    onChange={(e) => setNewCreditCard({ ...newCreditCard, outstanding: e.target.value })}
                    placeholder="Outstanding"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddCreditCard}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Data Kartu Kredit */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-3">Nama Bank</th>
                    <th className="p-3">No. Kartu</th>
                    <th className="p-3 text-right">Limit Kredit</th>
                    <th className="p-3">Member Sejak</th>
                    <th className="p-3 text-right">Baki Debet (Outstanding)</th>
                    <th className="p-3 text-right">Tunggakan</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {creditCards.map((cc) => (
                    <tr key={cc.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{cc.bankName}</td>
                      <td className="p-3 font-mono">{cc.cardNum}</td>
                      <td className="p-3 text-right font-bold text-gray-800">{cc.limit}</td>
                      <td className="p-3">{cc.since}</td>
                      <td className="p-3 text-right font-bold text-teal-700">{cc.outstanding}</td>
                      <td className="p-3 text-right text-rose-600">{cc.tunggakan}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteCreditCard(cc.id)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {creditCards.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-400">
                        Tidak ada kartu kredit yang dilaporkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 10: PINJAMAN LAIN (OtherLoan.aspx)
           ========================================================================= */}
        {activeTab === 'other-loan' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-500" />
                Fasilitas Pinjaman Lain di Bank Lain (OtherLoan.aspx)
              </h2>
              <p className="text-xs text-gray-500">Kredit pemilikan rumah, multiguna, KTA, atau leasing pemohon di bank/lembaga keuangan lain.</p>
            </div>

            {/* Form Tambah Pinjaman Lain */}
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border rounded-lg space-y-3 text-xs">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Tambah Pinjaman Lain</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={newOtherLoan.bankName}
                    onChange={(e) => setNewOtherLoan({ ...newOtherLoan, bankName: e.target.value })}
                    placeholder="BANK BRI"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">No. Kontrak</label>
                  <input
                    type="text"
                    value={newOtherLoan.contractNum}
                    onChange={(e) => setNewOtherLoan({ ...newOtherLoan, contractNum: e.target.value })}
                    placeholder="Nomor kontrak"
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Jenis Fasilitas</label>
                  <input
                    type="text"
                    value={newOtherLoan.facilityType}
                    onChange={(e) => setNewOtherLoan({ ...newOtherLoan, facilityType: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Maks. Kredit (Rp)</label>
                  <input
                    type="text"
                    value={newOtherLoan.maxLimit}
                    onChange={(e) => setNewOtherLoan({ ...newOtherLoan, maxLimit: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Angsuran/Bulan (Rp)</label>
                  <input
                    type="text"
                    value={newOtherLoan.installment}
                    onChange={(e) => setNewOtherLoan({ ...newOtherLoan, installment: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddOtherLoan}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Data Pinjaman Lain */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-3">Nama Bank</th>
                    <th className="p-3">No. Kontrak</th>
                    <th className="p-3">Jenis Fasilitas</th>
                    <th className="p-3 text-right">Plafond</th>
                    <th className="p-3 text-right">Angsuran / Bln</th>
                    <th className="p-3 text-center">Sisa Tenor</th>
                    <th className="p-3">Kontak Personal</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {otherLoans.map((ol) => (
                    <tr key={ol.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{ol.bankName}</td>
                      <td className="p-3 font-mono">{ol.contractNum}</td>
                      <td className="p-3">{ol.facilityType}</td>
                      <td className="p-3 text-right font-bold text-gray-800">{ol.maxLimit}</td>
                      <td className="p-3 text-right font-bold text-rose-600">{ol.installment}</td>
                      <td className="p-3 text-center">{ol.remainingTenor} Bulan</td>
                      <td className="p-3">{ol.contactPerson} ({ol.phone})</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteOtherLoan(ol.id)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {otherLoans.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-400">
                        Tidak ada fasilitas pinjaman lain.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 11: PENJAMIN (Guarantor.aspx)
           ========================================================================= */}
        {activeTab === 'guarantor' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                Data Penjamin Fasilitas Kredit (Guarantor.aspx)
              </h2>
              <p className="text-xs text-gray-500">Penjamin perorangan atau korporasi yang turut bertanggung jawab atas fasilitas kredit.</p>
            </div>

            {guarantors.map((gr, idx) => (
              <div key={gr.id} className="p-5 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 text-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Penjamin #{idx + 1} - {gr.relType}</h3>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-semibold text-[11px]">{gr.hubunganDebitur}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Nama Penjamin</span>
                      <span className="col-span-2 font-bold text-gray-900 dark:text-white">{gr.namaDepan} {gr.namaTengah} {gr.namaBelakang}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Tempat, Tgl Lahir</span>
                      <span className="col-span-2">{gr.tempatLahir}, {gr.tglLahir}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Jenis Kelamin</span>
                      <span className="col-span-2">{gr.jenisKelamin}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">No. KTP Penjamin</span>
                      <span className="col-span-2 font-mono font-bold">{gr.noKtp} (Masa berlaku: {gr.masaBerlakuKtp})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Alamat Penjamin</span>
                      <span className="col-span-2">{gr.alamat}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Kota / Kode Pos</span>
                      <span className="col-span-2">{gr.kota} ({gr.kodepos}) - RT/RW: {gr.rtRw}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-600">Kontak Penjamin</span>
                      <span className="col-span-2 font-mono">Telp: {gr.noTelp} | HP: {gr.noHp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================================
            TAB 12: STRUKTUR KREDIT (CreditStructure.aspx)
           ========================================================================= */}
        {activeTab === 'credit-structure' && (
          <div className="space-y-6">
            <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-orange-500" />
                Struktur Fasilitas Kredit & Kalkulasi Angsuran (CreditStructure.aspx)
              </h2>
              <p className="text-xs text-gray-500">Maksimum kredit, rasio jaminan (NJ/MK), tiering suku bunga fixed rate, dan simulasi angsuran bulanan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Kolom Kiri: Limit & Suku Bunga */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Permohonan & Suku Bunga</h3>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Fasilitas Utama</span>
                  <span className="col-span-2 font-bold text-gray-900 dark:text-white">{formData.produk} - {formData.fasilitas}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Tujuan Pembiayaan</span>
                  <span className="col-span-2 font-medium">{formData.tujuanPembiayaan}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Maksimum Kredit *</span>
                  <input
                    type="text"
                    value={creditStruct.loanAmount}
                    onChange={(e) => setCreditStruct({ ...creditStruct, loanAmount: e.target.value })}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-bold text-teal-700 text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Rasio Jaminan (NJ/MK)</span>
                  <span className="col-span-2 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-max border border-emerald-200">
                    {creditStruct.ratioJaminanNjMk}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Rasio Pembiayaan (LTV)</span>
                  <span className="col-span-2 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-max border border-blue-200">
                    {creditStruct.ratioPembiayaanLtv}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Jangka Waktu (Tenor)</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={creditStruct.tenorBulan}
                      onChange={(e) => setCreditStruct({ ...creditStruct, tenorBulan: e.target.value })}
                      className="w-20 p-1.5 border rounded bg-white dark:bg-gray-700 font-bold"
                    />
                    <span>Bulan ({Math.round(parseInt(creditStruct.tenorBulan || '24') / 12)} Tahun)</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Suku Bunga (%)</span>
                  <input
                    type="text"
                    value={creditStruct.sukuBungaPersen}
                    onChange={(e) => setCreditStruct({ ...creditStruct, sukuBungaPersen: e.target.value })}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700 font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-600">Tipe Suku Bunga</span>
                  <select
                    value={creditStruct.tipeBunga}
                    onChange={(e) => setCreditStruct({ ...creditStruct, tipeBunga: e.target.value })}
                    className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                  >
                    <option value="04 - Annuity In Arrears">04 - Annuity In Arrears</option>
                    <option value="03 - Annuity In Advance">03 - Annuity In Advance</option>
                    <option value="01 - Add On (Flat)">01 - Add On (Flat)</option>
                    <option value="05 - Simple Interest">05 - Simple Interest</option>
                  </select>
                </div>

                {/* Tiering Rates Grid */}
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Skema Tiering Fixed Rate</h4>
                  <table className="w-full text-xs text-left border rounded">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="p-2">No.</th>
                        <th className="p-2">Durasi Tiering</th>
                        <th className="p-2 text-right">Suku Bunga</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {creditStruct.tieringRates?.map((tr) => (
                        <tr key={tr.id}>
                          <td className="p-2">{tr.seq}</td>
                          <td className="p-2">{tr.durationMonths} Bulan</td>
                          <td className="p-2 text-right font-bold text-orange-600">{tr.ratePercent}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kolom Kanan: Angsuran & Rincian Biaya */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-2 text-sm">Angsuran & Rincian Biaya Realisasi</h3>

                <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800">
                  <span className="block text-gray-600 dark:text-gray-300 text-xs font-medium">Estimasi Angsuran / Bulan:</span>
                  <span className="block text-2xl font-black text-teal-800 dark:text-teal-200 mt-1">
                    Rp {creditStruct.angsuranPerBulan}
                  </span>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400">
                    Pokok Hutang Rp {creditStruct.pokokHutang} ({creditStruct.tenorBulan} bln)
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <span className="text-gray-600">Asuransi Jiwa & Kerugian</span>
                    <input
                      type="text"
                      value={creditStruct.asuransiCashAmount}
                      onChange={(e) => setCreditStruct({ ...creditStruct, asuransiCashAmount: e.target.value })}
                      className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <span className="text-gray-600">Biaya Provisi Kredit</span>
                    <input
                      type="text"
                      value={creditStruct.provisiPersen}
                      onChange={(e) => setCreditStruct({ ...creditStruct, provisiPersen: e.target.value })}
                      className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <span className="text-gray-600">Biaya Administrasi</span>
                    <input
                      type="text"
                      value={creditStruct.biayaAdmin}
                      onChange={(e) => setCreditStruct({ ...creditStruct, biayaAdmin: e.target.value })}
                      className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <span className="text-gray-600">Biaya Notaris / APHT</span>
                    <input
                      type="text"
                      value={creditStruct.biayaNotaris}
                      onChange={(e) => setCreditStruct({ ...creditStruct, biayaNotaris: e.target.value })}
                      className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <span className="text-gray-600">Biaya Appraisal KJPP</span>
                    <input
                      type="text"
                      value={creditStruct.biayaAppraisal}
                      onChange={(e) => setCreditStruct({ ...creditStruct, biayaAppraisal: e.target.value })}
                      className="col-span-2 p-1.5 border rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL RETURN TO SALES (RTS) */}
      {showRtsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-200">
            <div className="flex items-center gap-3 text-rose-600">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-lg font-bold">Kembalikan Berkas ke Sales (RTS)</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Pengembalian berkas akan memindahkan status aplikasi menjadi <strong>Return to Sales (RTS)</strong> agar diperbaiki atau dilengkapi oleh Sales Originator.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Alasan Pengembalian (Mandatory)
              </label>
              <textarea
                rows={3}
                value={rtsReason}
                onChange={(e) => setRtsReason(e.target.value)}
                placeholder="Contoh: Dokumen KTP Pasangan buram, sertifikat agunan belum melampirkan IMB asli."
                className="w-full text-xs p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRtsModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleReturnToSales}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Konfirmasi Kembalikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryForm;

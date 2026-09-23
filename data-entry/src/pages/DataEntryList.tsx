import React, { useState, useEffect } from 'react';
import { useAuth, eventBus } from '@template/shared';
import {
  Search,
  RotateCcw,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  FileCheck2,
  Check,
  Building,
  User,
  LogOut,
  Home,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  FileSpreadsheet,
  Upload,
  KeyRound,
  FileText,
  ClipboardCheck,
  Layers,
  Sparkles,
  RefreshCw,
  FolderOpen,
  HelpCircle,
  Inbox,
  UserCheck,
  Sliders,
} from 'lucide-react';
import { dataEntryService, type DataEntryRecord } from '../services/dataEntryData';
import { DtboWorkspace } from './DtboWorkspace';
import { DuplicateCheckWorkspace } from './DuplicateCheckWorkspace';
import { DetailDataEntryWorkspace } from './DetailDataEntryWorkspace';

interface DataEntryListProps {
  onSelectApplication: (app: DataEntryRecord) => void;
  onNavigateHome?: () => void;
}

// Sub-menu types for Loan Processing sidebar
type ProcessingMenuId =
  | 'home'
  | 'detail-de'
  | 'dtbo'
  | 'dtbo-update'
  | 'duplicate-check'
  | 'verification'
  | 'scoring'
  | 'skdr'
  | 'eform-griya'
  | 'instan-approval'
  | 'hasil-upload'
  | 'send-cad'
  | 'upload-edd';
const PROCESSING_MENU_ITEMS: {
  id: ProcessingMenuId;
  label: string;
  hasSubmenu?: boolean;
}[] = [
  { id: 'dtbo', label: 'Document To Be Obtained (DTBO)', hasSubmenu: true },
  { id: 'duplicate-check', label: 'Duplicate Checking', hasSubmenu: false },
  { id: 'detail-de', label: 'Detail Data Entry', hasSubmenu: false },
  { id: 'verification', label: 'Verification', hasSubmenu: true },
  { id: 'scoring', label: 'Scoring & Limit Setting', hasSubmenu: false },
  { id: 'skdr', label: 'Perubahan SKDR', hasSubmenu: false },
  { id: 'eform-griya', label: 'Eform Griya', hasSubmenu: true },
  { id: 'instan-approval', label: 'Instan Approval', hasSubmenu: true },
  { id: 'hasil-upload', label: 'Hasil Upload', hasSubmenu: false },
  { id: 'send-cad', label: 'Send to Credit Administrator', hasSubmenu: false },
  { id: 'upload-edd', label: 'Upload Dokumen EDD', hasSubmenu: false },
];


export const DataEntryList: React.FC<DataEntryListProps> = ({
  onSelectApplication,
  onNavigateHome,
}) => {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState<DataEntryRecord[]>([]);

  // Initialize activeMenu from URL query param ?menu=... or default to 'detail-de'
  const getInitialMenu = (): ProcessingMenuId => {
    try {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('menu') as ProcessingMenuId;
      if (m) return m;
    } catch {}
    return 'detail-de';
  };

  const [activeMenu, setActiveMenu] = useState<ProcessingMenuId>(getInitialMenu);

  // Top header Facilities dropdown state
  const [showFacilitiesDropdown, setShowFacilitiesDropdown] = useState(false);
  const [showInquirySubmenu, setShowInquirySubmenu] = useState(false);
  const [activeInquiryModal, setActiveInquiryModal] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Search Filters for Detail Data Entry queue
  const [filterNama, setFilterNama] = useState('');
  const [filterNoApp, setFilterNoApp] = useState('');
  const [filterKtp, setFilterKtp] = useState('');
  const [filterFasilitas, setFilterFasilitas] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Duplicate Check tool state
  const [dupKtpInput, setDupKtpInput] = useState('');
  const [dupResult, setDupResult] = useState<any>(null);

  // DTBO tool state
  const [dtboFilter, setDtboFilter] = useState('ALL');
  const [transferredProspect, setTransferredProspect] = useState<any>(null);
  const [showDtboFlyout, setShowDtboFlyout] = useState(false);

  useEffect(() => {
    const refreshData = () => setRecords(dataEntryService.getAll());
    refreshData();
    // Sync with SQLite backend
    dataEntryService.syncWithBackend().then(synced => {
      if (synced && synced.length > 0) setRecords(synced);
    });
    window.addEventListener('storage', refreshData);
    const unsubSent = eventBus.subscribe('APPLICATION_SENT_TO_PROCESSING', refreshData);
    const unsubUpdated = eventBus.subscribe('IDE_APPLICATION_UPDATED', refreshData);

    // Sync menu with Shell sidebar events and browser back/forward
    const handleMenuChange = (m: string) => {
      if (m) setActiveMenu(m as ProcessingMenuId);
    };
    const unsubMenu = eventBus.subscribe('DATA_ENTRY_MENU_SELECT', handleMenuChange);

    const onPopState = () => {
      const p = new URLSearchParams(window.location.search).get('menu') as ProcessingMenuId;
      if (p) setActiveMenu(p);
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('storage', refreshData);
      if (typeof unsubSent === 'function') unsubSent();
      if (typeof unsubUpdated === 'function') unsubUpdated();
      if (typeof unsubMenu === 'function') unsubMenu();
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const switchMenu = (menuId: ProcessingMenuId) => {
    setActiveMenu(menuId);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('menu', menuId);
      window.history.pushState(null, '', url.toString());
    } catch {}
    eventBus.publish('DATA_ENTRY_MENU_SELECT', menuId);
  };

  const handleReset = () => {
    setFilterNama('');
    setFilterNoApp('');
    setFilterKtp('');
    setFilterFasilitas('ALL');
    setFilterStatus('ALL');
  };

  const filteredRecords = records.filter((r) => {
    if (filterNama && !r.namaDebitur.toLowerCase().includes(filterNama.toLowerCase())) return false;
    if (filterNoApp && !r.noAplikasi.toLowerCase().includes(filterNoApp.toLowerCase()) && !r.noProspek.includes(filterNoApp)) return false;
    if (filterKtp && !r.ktp.includes(filterKtp)) return false;
    if (filterFasilitas !== 'ALL' && r.produk !== filterFasilitas) return false;
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  const countMenunggu = records.filter((r) => r.status === 'Menunggu Data Entry').length;
  const countInProgress = records.filter((r) => r.status === 'In Progress DE').length;
  const countSelesai = records.filter((r) => r.status === 'DE Selesai').length;

  // Navigasi ke Marketing (Initial Data Entry) jika user klik tab Marketing di atas
  const handleGoToMarketing = () => {
    window.history.pushState(null, '', '/initial-data-entry');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const anyUser = user as any;
  const userCode = anyUser?.userId || 'SC70629';
  const userName = user?.name ? user.name.toUpperCase() : 'SURYA HARJAYA (STAFF STA)';
  const userBranch = anyUser?.branch || '046 - SERANG';

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      {/* =========================================================================
          1. HEADER ATAS (BNI LOGO + TEAL BAR LOAN PROCESSING & FACILITIES DROPDOWN)
      ========================================================================= */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        {/* Brand Bar */}
        <div className="w-full px-4 sm:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={onNavigateHome}>
              <span className="font-black text-2xl tracking-tighter text-[#e65100]">BNI</span>
              <span className="text-xs font-bold text-teal-800 tracking-wider border-l border-slate-300 pl-2">
                electronic Loan Origination (eLO)
              </span>
            </div>

            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200 uppercase">
              Modul Processing
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Links: Main | Marketing | Processing | Fleksi Channel */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={handleGoToMarketing}
                className="text-slate-600 hover:text-[#c2185b] hover:underline cursor-pointer transition-colors"
                title="Pindah ke Halaman Main / Menu Utama"
              >
                Main
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleGoToMarketing}
                className="text-slate-600 hover:text-[#c2185b] hover:underline cursor-pointer transition-colors"
                title="Pindah ke Portal Sales / IDE"
              >
                Marketing
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-[#E05A10] font-bold underline decoration-2 cursor-default">
                Processing
              </span>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleGoToMarketing}
                className="text-slate-600 hover:text-[#c2185b] hover:underline cursor-pointer transition-colors"
              >
                Fleksi Channel
              </button>
            </div>

            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Kembali ke Menu Utama"
              >
                <Home className="h-3.5 w-3.5 text-teal-600" />
                <span className="hidden md:inline">Menu Utama</span>
              </button>
            )}

            <button
              type="button"
              onClick={logout}
              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Teal Sub-Bar Khas BNI Cubesh (Loan Processing & Facilities Dropdown) */}
        <div className="bg-[#005E5D] text-white px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs font-semibold relative">
          <div className="flex items-center gap-4">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              Loan Processing Workspace
            </span>

            {/* Dropdown Facilities */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFacilitiesDropdown(!showFacilitiesDropdown)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded hover:bg-white/15 transition-colors cursor-pointer text-teal-100 hover:text-white"
              >
                <span>Facilities</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* Menu Dropdown Facilities */}
              {showFacilitiesDropdown && (
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs animate-fade-in">
                  {/* Item 1: Inquiry with Submenu */}
                  <div
                    className="relative group px-3 py-2 hover:bg-teal-50 cursor-pointer flex items-center justify-between text-slate-700 font-semibold"
                    onMouseEnter={() => setShowInquirySubmenu(true)}
                    onMouseLeave={() => setShowInquirySubmenu(false)}
                  >
                    <span className="flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5 text-teal-600" />
                      Inquiry
                    </span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />

                    {/* Flyout Submenu Inquiry */}
                    {showInquirySubmenu && (
                      <div className="absolute left-full top-0 ml-1 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-fade-in">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInquiryModal('status');
                            setShowFacilitiesDropdown(false);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-teal-50 text-xs text-slate-700 hover:text-teal-900 block"
                        >
                          Inquiry Application by Status
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInquiryModal('bni-life');
                            setShowFacilitiesDropdown(false);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-teal-50 text-xs text-slate-700 hover:text-teal-900 block"
                        >
                          Inquiry Feedback BNI Life
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInquiryModal('prescreening');
                            setShowFacilitiesDropdown(false);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-teal-50 text-xs text-slate-700 hover:text-teal-900 block"
                        >
                          Inquiry Application PreScreening
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Item 2: Change Password */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(true);
                      setShowFacilitiesDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-teal-100 font-mono hidden md:block">
            Cabang Serang (046) &bull; Mode: Processing / Data Entry
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. AREA KERJA UTAMA DENGAN SIDEBAR TEAL CUBESH (Sesuai Gambar 1)
      ========================================================================= */}
      <div className="flex-1 flex w-full min-h-[calc(100vh-140px)]">
        {/* SIDEBAR TEAL LOAN PROCESSING (Sesuai Gambar 1) */}
        <aside className="w-56 sm:w-64 bg-[#007B7A] text-white shrink-0 border-r border-teal-900/30 flex flex-col z-20 select-none shadow-md">
          {/* Header Sidebar: Loan Processing */}
          <button
            type="button"
            onClick={() => switchMenu('home')}
            className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between border-b border-teal-600/40 hover:bg-[#006867] transition-colors cursor-pointer ${
              activeMenu === 'home' ? 'bg-[#005e5d] font-bold border-l-4 border-amber-400' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-xs bg-[#e65100]"></span>
              <span className="text-white text-xs font-bold tracking-wide">
                Loan Processing
              </span>
            </div>
          </button>

          {/* Menu Items List */}
          <nav className="flex-1 py-1 space-y-0.5 relative">
            {PROCESSING_MENU_ITEMS.map((item) => {
              const isDtboItem = item.id === 'dtbo';
              const isActive =
                activeMenu === item.id ||
                (isDtboItem && (activeMenu === 'dtbo' || activeMenu === 'dtbo-update'));

              return (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => {
                    if (isDtboItem) setShowDtboFlyout(true);
                  }}
                  onMouseLeave={() => {
                    if (isDtboItem) setShowDtboFlyout(false);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isDtboItem) {
                        switchMenu('dtbo-update');
                      } else {
                        switchMenu(item.id);
                      }
                    }}
                    className={`w-full text-left px-3.5 py-2 text-[11.5px] font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#005e5d] text-amber-300 font-bold border-l-4 border-amber-400'
                        : 'text-teal-50 hover:bg-[#006867] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="h-1 w-1.5 rounded-xs bg-red-400 shrink-0"></span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.hasSubmenu && (
                        <span className="text-[11px] font-bold text-teal-300">
                          &rsaquo;&rsaquo;
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Flyout Submenu Khas Gambar 1 untuk DTBO */}
                  {isDtboItem && (showDtboFlyout || isActive) && (
                    <div className="absolute left-full top-0 ml-0.5 z-30 flex items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchMenu('dtbo-update');
                        }}
                        className="bg-[#007B7A] hover:bg-[#005e5d] text-white px-3 py-2 text-[11.5px] font-bold whitespace-nowrap shadow-lg border-l-2 border-amber-400 flex items-center gap-1.5 cursor-pointer rounded-r-md transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-xs bg-amber-300 shrink-0"></span>
                        <span>DTBO Update</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* WORKSPACE AREA (CANVAS KANAN) */}
        <main className="flex-1 min-w-0 bg-[#f7f9fa] p-4 sm:p-6 overflow-x-auto space-y-6">
          {/* ===================================================
              VIEW 0: HOME / LANDING (TAMPILAN AWAL SESUAI GAMBAR)
          =================================================== */}
          {activeMenu === 'home' && (
            <div className="space-y-6">
              {/* Header Breadcrumb */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs text-[#005E5D] font-semibold flex items-center gap-1.5">
                    <span>PROMPT eLO</span>
                    <span>&rsaquo;</span>
                    <strong>Loan Processing Workspace</strong>
                  </div>
                  <h1 className="text-xl font-black text-slate-900 mt-0.5">
                    Loan Processing &bull; Data Entry Portal
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-[#005E5D] border border-teal-200">
                    Cabang Serang (046)
                  </span>
                </div>
              </div>

              {/* Welcome Card Khas CuBES eLO */}
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-xs bg-white">
                <div className="bg-[#005E5D] px-5 py-2.5 flex items-center justify-between">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">
                    PROMPT FACILITIES : LOAN PROCESSING
                  </span>
                  <span className="text-[10.5px] text-teal-100 font-mono">
                    User: {userCode} ({userName})
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-gray-800">
                      Selamat Datang di Modul Loan Processing (Data Entry) CuBES eLO
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                      Modul ini digunakan untuk pengecekan kelengkapan berkas, verifikasi data nasabah, dan input detail data permohonan kredit yang dikirimkan oleh sales melalui Initial Data Entry (IDE). Silakan pilih salah satu menu di panel samping atau gunakan pintasan di bawah ini.
                    </p>
                  </div>

                  {/* Quick Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Detail Data Entry */}
                    <div
                      onClick={() => switchMenu('detail-de')}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#005E5D] hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-10 w-10 rounded-lg bg-teal-50 text-[#005E5D] flex items-center justify-center group-hover:bg-[#005E5D] group-hover:text-white transition-colors">
                            <ClipboardCheck className="h-5 w-5" />
                          </div>
                          {countMenunggu > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#E05A10] border border-orange-200">
                              {countMenunggu} Menunggu
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#005E5D] transition-colors">
                          Detail Data Entry
                        </h3>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          Antrean aplikasi masuk dari Sales (IDE) untuk diproses entri data pembiayaan lengkap.
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#005E5D]">
                        <span>Buka Antrean</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* DTBO */}
                    <div
                      onClick={() => switchMenu('dtbo')}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#005E5D] hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="h-10 w-10 rounded-lg bg-teal-50 text-[#005E5D] flex items-center justify-center group-hover:bg-[#005E5D] group-hover:text-white transition-colors">
                          <FolderOpen className="h-5 w-5" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#005E5D] transition-colors">
                          Document To Be Obtained (DTBO)
                        </h3>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          Monitoring dokumen wajib, kelengkapan legalitas identitas, agunan, dan syarat kredit.
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#005E5D]">
                        <span>Buka DTBO Tracker</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Duplicate Check */}
                    <div
                      onClick={() => switchMenu('duplicate-check')}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#005E5D] hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="h-10 w-10 rounded-lg bg-teal-50 text-[#005E5D] flex items-center justify-center group-hover:bg-[#005E5D] group-hover:text-white transition-colors">
                          <UserCheck className="h-5 w-5" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#005E5D] transition-colors">
                          Duplicate Checking
                        </h3>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          Cek identitas dan NIK ganda calon debitur pada basis data kredit internal BNI.
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#005E5D]">
                        <span>Cek Duplikasi</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Verification */}
                    <div
                      onClick={() => switchMenu('verification')}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#005E5D] hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="h-10 w-10 rounded-lg bg-teal-50 text-[#005E5D] flex items-center justify-center group-hover:bg-[#005E5D] group-hover:text-white transition-colors">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#005E5D] transition-colors">
                          Verification &amp; Scoring
                        </h3>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          Verifikasi data tempat kerja, lingkungan debitur, dan perhitungan limit scoring kredit.
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#005E5D]">
                        <span>Buka Verifikasi</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Eform Griya */}
                    <div
                      onClick={() => switchMenu('eform-griya')}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#005E5D] hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="h-10 w-10 rounded-lg bg-teal-50 text-[#005E5D] flex items-center justify-center group-hover:bg-[#005E5D] group-hover:text-white transition-colors">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#005E5D] transition-colors">
                          Eform Griya
                        </h3>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          Daftar permohonan kredit KPR BNI Griya yang masuk melalui portal digital online nasabah.
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#005E5D]">
                        <span>Buka Eform Inbox</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              VIEW 1: DETAIL DATA ENTRY WORKSPACE (SESUAI GAMBAR 1 & 2)
          =================================================== */}
          {activeMenu === 'detail-de' && (
            <DetailDataEntryWorkspace onNavigateHome={onNavigateHome} />
          )}

          {/* ===================================================
              VIEW 2: DOCUMENT TO BE OBTAINED (DTBO) WORKSPACE (SESUAI GAMBAR 2, 3, 4)
          =================================================== */}
          {(activeMenu === 'dtbo' || activeMenu === 'dtbo-update') && (
            <DtboWorkspace
              onNavigateToDuplicateCheck={(prospect) => {
                setTransferredProspect(prospect);
                switchMenu('duplicate-check');
              }}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* ===================================================
              VIEW 3: DUPLICATE CHECKING WORKSPACE (SESUAI GAMBAR 1, 2, 3)
          =================================================== */}
          {activeMenu === 'duplicate-check' && (
            <DuplicateCheckWorkspace
              initialProspect={transferredProspect}
              onNavigateToDetailDe={(record) => {
                switchMenu('detail-de');
              }}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* ===================================================
              VIEW 4: VERIFICATION WORKSPACE
          =================================================== */}
          {activeMenu === 'verification' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs text-teal-700 font-semibold">Loan Processing &rsaquo; Verification</div>
                  <h1 className="text-xl font-black text-slate-900 mt-0.5">
                    Modul Verifikasi &amp; Assignment Lapangan
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => switchMenu('detail-de')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  &larr; Kembali ke Detail Data Entry
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">1. Verification Assignment</h3>
                  <p className="text-xs text-slate-500">Penugasan petugas verifikasi telepon &amp; survei tempat kerja.</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    3 Tugas Aktif
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">2. Appraisal Agunan</h3>
                  <p className="text-xs text-slate-500">Penilaian fisik agunan tanah/bangunan oleh petugas penilai.</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    2 Agunan Dalam Penilaian
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">3. Investigation Khusus</h3>
                  <p className="text-xs text-slate-500">Pemeriksaan riwayat usaha &amp; konfirmasi keaslian dokumen.</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    Selesai 100%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              VIEW 5: SCORING & LIMIT SETTING
          =================================================== */}
          {activeMenu === 'scoring' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs text-teal-700 font-semibold">Loan Processing &rsaquo; Scoring &amp; Limit Setting</div>
                  <h1 className="text-xl font-black text-slate-900 mt-0.5">
                    Hasil Scoring Mesin &amp; Penetapan Limit Kredit
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => switchMenu('detail-de')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  &larr; Kembali ke Detail Data Entry
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-2">
                  <div className="font-bold text-teal-900 text-sm">Metrik Scoring eLO Rating Engine:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div><span className="text-slate-500 text-[10px] block">Credit Score:</span><strong>740 (Sangat Baik)</strong></div>
                    <div><span className="text-slate-500 text-[10px] block">Rasio DSR Maks:</span><strong>38.2% (&lt; 50%)</strong></div>
                    <div><span className="text-slate-500 text-[10px] block">Rekomendasi Plafon:</span><strong className="text-teal-800">Rp 850.000.000</strong></div>
                    <div><span className="text-slate-500 text-[10px] block">Tingkat Risiko:</span><strong className="text-emerald-700">Low Risk (Hijau)</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              VIEW 6: EFORM GRIYA INBOX
          =================================================== */}
          {activeMenu === 'eform-griya' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs text-teal-700 font-semibold">Loan Processing &rsaquo; Eform Griya</div>
                  <h1 className="text-xl font-black text-slate-900 mt-0.5">
                    Inbox Griya Eform (Pengajuan Online Nasabah)
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => switchMenu('detail-de')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  &larr; Kembali ke Detail Data Entry
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <p className="text-xs text-slate-600">
                  Daftar pengajuan kredit KPR BNI Griya yang masuk melalui portal digital / eForm BNI:
                </p>
                <div className="p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <strong>Faisal Rahman</strong>
                    <div className="text-[11px] text-slate-500 font-mono">EFORM-2026-09-0881 &bull; Griya Subsidi &bull; Rp 168.000.000</div>
                  </div>
                  <button className="px-3 py-1 rounded bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 cursor-pointer">
                    Tarik ke Antrean DE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              VIEW 7: WORKSPACE LAINNYA (GENERIC WRAPPER)
          =================================================== */}
          {['skdr', 'instan-approval', 'hasil-upload', 'send-cad', 'upload-edd'].includes(activeMenu) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs text-teal-700 font-semibold">Loan Processing Workspace</div>
                  <h1 className="text-xl font-black text-slate-900 mt-0.5 uppercase">
                    {activeMenu.replace('-', ' ')}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => switchMenu('detail-de')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  &larr; Kembali ke Detail Data Entry
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-200">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Modul {activeMenu.toUpperCase()} Siap Digunakan
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Modul ini terhubung langsung dengan alur pemrosesan data entry dan credit underwriting Cabang Serang.
                </p>
                <button
                  type="button"
                  onClick={() => switchMenu('detail-de')}
                  className="mt-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 cursor-pointer"
                >
                  Buka Antrean Detail Data Entry
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          3. FOOTER AREA (HELPDESK KHAS GAMBAR & STATUS BAR KUNING CUBESH)
      ========================================================================= */}
      <div className="bg-white border-t border-slate-200">
        <div className="w-full text-center py-2.5 text-xs text-slate-800 font-medium">
          Telp. Helpdesk : (021) 572-9899, 9339, 9680, 9676 (Fax : 021-5703242)
        </div>

        <div className="w-full bg-[#fff9c4] text-gray-900 px-4 sm:px-6 py-2 text-[11px] font-bold font-mono flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-[#fff59d] shadow-2xs">
          <div className="truncate">
            ID USER : <span className="text-[#005E5D]">{userCode}</span> | NAMA USER : <span className="text-[#005E5D]">{userCode.slice(0, 5)} - {userName}</span> | CABANG : <span className="text-[#005E5D]">{userBranch}</span>
          </div>

          <div className="truncate text-right text-gray-700">
            Login Since : 14.00 - Selasa, 15 September 2026 - 192.168.217.40
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL INQUIRY FACILITIES (STATUS, BNI LIFE, PRESCREENING)
      ========================================================================= */}
      {activeInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {activeInquiryModal === 'status'
                  ? 'Inquiry Application by Status'
                  : activeInquiryModal === 'bni-life'
                  ? 'Inquiry Feedback BNI Life'
                  : 'Inquiry Application PreScreening'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveInquiryModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Pencarian data inquiry menyeluruh untuk pelacakan berkas aplikasi pinjaman eLO.
            </p>

            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Masukkan nomor aplikasi atau NIK..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => alert('Hasil inquiry ditemukan: Berkas aktif dalam proses underwriting.')}
                className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
              >
                Cari Data
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setActiveInquiryModal(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL GANTI PASSWORD
      ========================================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Ganti Password Pengguna</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Password pengguna berhasil diperbarui!');
                setShowPasswordModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password Saat Ini</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password saat ini"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryList;

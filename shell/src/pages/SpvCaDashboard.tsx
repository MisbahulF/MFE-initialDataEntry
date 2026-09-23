import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Users,
  Search,
  FileX,
  Phone,
  KeyRound,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Headphones,
  Check,
  FileCheck2,
  FileText,
  PieChart,
  BarChart3,
  Sliders,
  X,
  AlertTriangle,
  Layers,
  Building,
} from 'lucide-react';

interface ApplicationItem {
  id: string;
  prospectNo: string;
  applicantName: string;
  product: 'BNI GRIYA' | 'BNI OTO' | 'BNI FLEKSI' | 'BNI MULTIGUNA';
  plafond: string;
  tenor: string;
  submitDate: string;
  status: 'Menunggu Distribusi' | 'Didistribusikan' | 'In Verification' | 'Scoring Review' | 'Proposal Review';
  assignedCa?: string;
  priority: 'Normal' | 'Tinggi' | 'Prioritas';
}

export const SpvCaDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Navigation Dropdowns State
  const [activeDropdown, setActiveDropdown] = useState<'loan' | 'facilities' | 'mis' | null>(null);

  // Active Tab / View
  const [activeTab, setActiveTab] = useState<'overview' | 'distribusi' | 'proposal' | 'scoring' | 'reports'>('overview');

  // Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showDistribusiModal, setShowDistribusiModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [selectedCaTarget, setSelectedCaTarget] = useState<string>('CA55012 - Budi Pratama');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Daftar Analis Kredit (CA) di Cabang Serang
  const caOfficers = [
    { id: 'CA55012', name: 'Budi Pratama (CA 1)', load: '4 Berkas Aktif', status: 'Available' },
    { id: 'CA55013', name: 'Rian Setiawan (CA 2)', load: '6 Berkas Aktif', status: 'Available' },
    { id: 'CA55014', name: 'Fajar Nugraha (CA 3)', load: '7 Berkas Aktif', status: 'Busy' },
  ];

  // Data Antrean Berkas SPV CA
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'APP-2026-001',
      prospectNo: 'PRM-046-260909-001',
      applicantName: 'ACHMAD KUSUMA WIJAYA',
      product: 'BNI GRIYA',
      plafond: 'Rp 650.000.000',
      tenor: '15 Tahun',
      submitDate: '09/09/2026 08:30',
      status: 'Menunggu Distribusi',
      priority: 'Prioritas',
    },
    {
      id: 'APP-2026-002',
      prospectNo: 'PRM-046-260909-002',
      applicantName: 'DEWI ANGGRAENI PUTRI',
      product: 'BNI FLEKSI',
      plafond: 'Rp 150.000.000',
      tenor: '5 Tahun',
      submitDate: '09/09/2026 09:15',
      status: 'Menunggu Distribusi',
      priority: 'Normal',
    },
    {
      id: 'APP-2026-003',
      prospectNo: 'PRM-046-260908-019',
      applicantName: 'BAMBANG HERMANTO',
      product: 'BNI OTO',
      plafond: 'Rp 280.000.000',
      tenor: '4 Tahun',
      submitDate: '08/09/2026 14:10',
      status: 'Proposal Review',
      assignedCa: 'Budi Pratama (CA 1)',
      priority: 'Tinggi',
    },
    {
      id: 'APP-2026-004',
      prospectNo: 'PRM-046-260908-015',
      applicantName: 'SITI NURHALIZA',
      product: 'BNI MULTIGUNA',
      plafond: 'Rp 450.000.000',
      tenor: '8 Tahun',
      submitDate: '08/09/2026 11:20',
      status: 'Scoring Review',
      assignedCa: 'Rian Setiawan (CA 2)',
      priority: 'Normal',
    },
    {
      id: 'APP-2026-005',
      prospectNo: 'PRM-046-260908-009',
      applicantName: 'HENDRA PRASETYO',
      product: 'BNI GRIYA',
      plafond: 'Rp 1.200.000.000',
      tenor: '20 Tahun',
      submitDate: '08/09/2026 09:40',
      status: 'Proposal Review',
      assignedCa: 'Budi Pratama (CA 1)',
      priority: 'Prioritas',
    },
    {
      id: 'APP-2026-006',
      prospectNo: 'PRM-046-260907-031',
      applicantName: 'RATNA SARIDAH',
      product: 'BNI FLEKSI',
      plafond: 'Rp 75.000.000',
      tenor: '3 Tahun',
      submitDate: '07/09/2026 16:00',
      status: 'In Verification',
      assignedCa: 'Fajar Nugraha (CA 3)',
      priority: 'Normal',
    },
  ]);

  const handleAssignCa = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'Didistribusikan',
              assignedCa: selectedCaTarget,
            }
          : app
      )
    );
    setShowDistribusiModal(false);
    setSelectedApp(null);
    setActionNotice(`Aplikasi berhasil didistribusikan kepada ${selectedCaTarget}!`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleApproveProposal = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'Didistribusikan',
              priority: 'Normal',
            }
          : app
      )
    );
    setActionNotice('Proposal kredit telah disetujui SPV CA dan diteruskan ke Komite Kredit / Pemimpin Cabang!');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const pendingDistribusi = applications.filter((a) => a.status === 'Menunggu Distribusi').length;
  const pendingProposal = applications.filter((a) => a.status === 'Proposal Review').length;
  const inScoring = applications.filter((a) => a.status === 'Scoring Review').length;
  const inVerification = applications.filter((a) => a.status === 'In Verification').length;

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between"
      onClick={() => setActiveDropdown(null)}
    >
      {/* ========================================================
          1. HEADER ATAS KHAS BNI eLO (Persis 4 Gambar Referensi)
      ======================================================== */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        {/* Brand Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tighter text-[#e65100]">BNI</span>
              <span className="text-xs font-bold text-teal-800 tracking-wider border-l border-slate-300 pl-2">
                electronic Loan Origination (eLO)
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              PORTAL PENYELIA STA / SPV CA
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right hidden md:block">
              <div className="font-bold text-slate-900">{user?.name || '43963 - AMARULLOH (PENYELIA STA)'}</div>
              <div className="text-[11px] text-slate-500">Cabang: 046 - SERANG &bull; ID: 43963KF</div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </div>

        {/* TEAL NAVIGATION BAR (Persis Bar Hijau/Teal Cubesh pada Gambar 1, 2, 3, 4) */}
        <div className="bg-[#008080] text-white shadow-md relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-semibold">
            {/* Menu Navigasi Kiri */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Menu 1: LOAN PROCESSING (Dropdown Gambar 2) */}
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'loan' ? null : 'loan');
                }}
              >
                <button
                  type="button"
                  className={`px-3.5 py-2.5 flex items-center gap-1.5 hover:bg-[#006666] transition-colors cursor-pointer ${
                    activeDropdown === 'loan' ? 'bg-[#006666]' : ''
                  }`}
                >
                  <FileCheck2 className="h-3.5 w-3.5 text-amber-300" />
                  <span>Loan Processing</span>
                  <ChevronDown className="h-3 w-3 opacity-80" />
                </button>

                {/* Dropdown Menu Loan Processing */}
                {activeDropdown === 'loan' && (
                  <div className="absolute left-0 top-full mt-0 w-60 bg-[#008080] border border-teal-600 shadow-xl rounded-b-lg overflow-hidden py-1 z-50 text-white animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('overview');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center justify-between text-xs cursor-pointer border-b border-teal-700/50"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-amber-300 text-[10px]">â– </span>
                        Verification
                      </span>
                      <ChevronRight className="h-3 w-3 text-teal-300" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('scoring');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center gap-2 text-xs cursor-pointer border-b border-teal-700/50"
                    >
                      <span className="text-amber-300 text-[10px]">â– </span>
                      Scoring &amp; Limit Setting
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('proposal');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center justify-between text-xs cursor-pointer border-b border-teal-700/50"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-amber-300 text-[10px]">â– </span>
                        Credit Proposal
                      </span>
                      {pendingProposal > 0 && (
                        <span className="px-1.5 py-0.2 bg-amber-400 text-teal-950 font-bold rounded-full text-[10px]">
                          {pendingProposal}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('distribusi');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center justify-between text-xs cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold text-amber-200">
                        <span className="text-amber-300 text-[10px]">â– </span>
                        Distribusi Aplikasi
                      </span>
                      {pendingDistribusi > 0 && (
                        <span className="px-1.5 py-0.2 bg-orange-500 text-white font-bold rounded-full text-[10px]">
                          {pendingDistribusi}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Menu 2: FACILITIES (Dropdown Gambar 3) */}
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'facilities' ? null : 'facilities');
                }}
              >
                <button
                  type="button"
                  className={`px-3.5 py-2.5 flex items-center gap-1.5 hover:bg-[#006666] transition-colors cursor-pointer ${
                    activeDropdown === 'facilities' ? 'bg-[#006666]' : ''
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-amber-300" />
                  <span>Facilities</span>
                  <ChevronDown className="h-3 w-3 opacity-80" />
                </button>

                {/* Dropdown Menu Facilities */}
                {activeDropdown === 'facilities' && (
                  <div className="absolute left-0 top-full mt-0 w-60 bg-[#008080] border border-teal-600 shadow-xl rounded-b-lg overflow-hidden py-1 z-50 text-white animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('overview');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center justify-between text-xs cursor-pointer border-b border-teal-700/50"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-amber-300 text-[10px]">â– </span>
                        Inquiry
                      </span>
                      <ChevronRight className="h-3 w-3 text-teal-300" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(true);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center gap-2 text-xs cursor-pointer border-b border-teal-700/50"
                    >
                      <span className="text-amber-300 text-[10px]">â– </span>
                      Change Password
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        alert('Modul Reject/Cancel Application dibuka. Masukkan Nomor Aplikasi untuk memproses.');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center gap-2 text-xs cursor-pointer"
                    >
                      <span className="text-amber-300 text-[10px]">â– </span>
                      Reject/Cancel Application
                    </button>
                  </div>
                )}
              </div>

              {/* Menu 3: MIS REPORT (Dropdown Gambar 4) */}
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'mis' ? null : 'mis');
                }}
              >
                <button
                  type="button"
                  className={`px-3.5 py-2.5 flex items-center gap-1.5 hover:bg-[#006666] transition-colors cursor-pointer ${
                    activeDropdown === 'mis' ? 'bg-[#006666]' : ''
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5 text-amber-300" />
                  <span>MIS Report</span>
                  <ChevronDown className="h-3 w-3 opacity-80" />
                </button>

                {/* Dropdown Menu MIS Report */}
                {activeDropdown === 'mis' && (
                  <div className="absolute left-0 top-full mt-0 w-64 bg-[#008080] border border-teal-600 shadow-xl rounded-b-lg overflow-hidden py-1 z-50 text-white animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('reports');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center gap-2 text-xs cursor-pointer border-b border-teal-700/50"
                    >
                      <span className="text-amber-300 text-[10px]">â– </span>
                      Loan Processing Reports
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('reports');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center gap-2 text-xs cursor-pointer border-b border-teal-700/50"
                    >
                      <span className="text-amber-300 text-[10px]">â– </span>
                      Report Cancel by Bank
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('reports');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#006666] flex items-center justify-between text-xs cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-amber-300 text-[10px]">â– </span>
                        Monitoring
                      </span>
                      <ChevronRight className="h-3 w-3 text-teal-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Kanan: Logout & Channel Links */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-teal-100 font-medium">
                <span className="hover:underline cursor-pointer">Processing</span>
                <span>|</span>
                <span className="hover:underline cursor-pointer">Fleksi eChannel</span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 flex items-center gap-1.5 hover:bg-[#006666] text-amber-200 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. KONTEN UTAMA (MODERN ENTERPRISE WORKSPACE)
      ======================================================== */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        {/* Action Toast Alert */}
        {actionNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* HERO WELCOME BANNER (Supervisor Credit Analyst) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-[#005E6A] text-white p-6 sm:p-8 shadow-md border border-teal-700/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-teal-100 border border-white/20">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                  SPV CA Portal &bull; Loan Processing
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                  Cabang Serang (046)
                </span>
                <span className="text-xs text-teal-200/80 font-mono">ID: 43963KF</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Selamat Datang,{' '}
                <span className="text-amber-300">{user?.name || '43963 - AMARULLOH (PENYELIA STA)'}</span>
              </h1>

              <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
                Portal Supervisi Analis Kredit <strong>electronic Loan Origination (eLO) BNI</strong>. Kelola
                distribusi berkas, approval credit proposal, verifikasi agunan, dan monitoring SLA kinerja analis.
              </p>
            </div>

            {/* Quick Action Buttons for SPV */}
            <div className="flex items-center gap-3 flex-wrap lg:justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('distribusi')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 text-xs font-bold shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-slate-900" />
                Distribusi Aplikasi ({pendingDistribusi})
                <ArrowRight className="h-4 w-4 text-slate-900" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('proposal')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileCheck2 className="h-4 w-4 text-teal-300" />
                Review Proposal ({pendingProposal})
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            KPI METRIC CARDS (Antrean Berkas Pemrosesan Kredit)
        ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div
            onClick={() => setActiveTab('distribusi')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer hover:border-amber-400 group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold">Menunggu Distribusi</span>
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            </div>
            <div className="text-2xl font-extrabold text-orange-600">{pendingDistribusi}</div>
            <div className="text-[11px] text-slate-400 mt-1">Siap dialokasikan ke CA</div>
          </div>

          <div
            onClick={() => setActiveTab('proposal')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer hover:border-amber-400 group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold">Review Proposal</span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600">{pendingProposal}</div>
            <div className="text-[11px] text-slate-400 mt-1">Butuh rekomendasi SPV</div>
          </div>

          <div
            onClick={() => setActiveTab('scoring')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer hover:border-teal-400 group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold">Scoring &amp; Limit</span>
              <span className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-blue-600">{inScoring}</div>
            <div className="text-[11px] text-slate-400 mt-1">Kalkulasi DSR &amp; RAC</div>
          </div>

          <div
            onClick={() => setActiveTab('overview')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer hover:border-teal-400 group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold">Verifikasi Dokumen</span>
              <span className="h-2 w-2 rounded-full bg-teal-500" />
            </div>
            <div className="text-2xl font-extrabold text-teal-700">{inVerification}</div>
            <div className="text-[11px] text-slate-400 mt-1">SLIK OJK &amp; Cek Lapangan</div>
          </div>

          <div
            onClick={() => setActiveTab('reports')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer hover:border-teal-400 group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold">Total Pipeline</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{applications.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Berkas aktif cabang</div>
          </div>
        </div>

        {/* ========================================================
            SUB-VIEW: TAB PILIHAN (Distribusi / Proposal / Overview)
        ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
                {activeTab === 'distribusi' ? (
                  <Send className="h-4 w-4" />
                ) : activeTab === 'proposal' ? (
                  <FileCheck2 className="h-4 w-4" />
                ) : (
                  <Layers className="h-4 w-4" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {activeTab === 'distribusi'
                    ? 'DISTRIBUSI APLIKASI KREDIT KEPADA ANALIS'
                    : activeTab === 'proposal'
                    ? 'REVIEW PERSETUJUAN CREDIT PROPOSAL'
                    : activeTab === 'scoring'
                    ? 'MONITORING SCORING & LIMIT SETTING'
                    : activeTab === 'reports'
                    ? 'MIS REPORT & KINERJA ANALIS CABANG'
                    : 'DAFTAR BERKAS PINJAMAN AKTIF (LOAN PROCESSING)'}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Data antrean terpadu Cabang Serang (046) &bull; Mode Supervisi SPV CA
                </p>
              </div>
            </div>

            {/* View Switcher Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                Semua Berkas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('distribusi')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'distribusi' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                <span>Distribusi</span>
                {pendingDistribusi > 0 && (
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('proposal')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'proposal' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                <span>Proposal</span>
                {pendingProposal > 0 && (
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                MIS Report
              </button>
            </div>
          </div>

          {/* TABEL ANTREAN BERKAS / WORKLIST */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200 uppercase text-[11px]">
                  <th className="py-3 px-3">No. Prospek</th>
                  <th className="py-3 px-3">Nama Calon Debitur</th>
                  <th className="py-3 px-3">Produk</th>
                  <th className="py-3 px-3">Plafond Diajukan</th>
                  <th className="py-3 px-3">Tenor</th>
                  <th className="py-3 px-3">Status Saat Ini</th>
                  <th className="py-3 px-3">Analis (CA) Ditugaskan</th>
                  <th className="py-3 px-3 text-center">Aksi SPV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications
                  .filter((item) => {
                    if (activeTab === 'distribusi') return item.status === 'Menunggu Distribusi';
                    if (activeTab === 'proposal') return item.status === 'Proposal Review';
                    if (activeTab === 'scoring') return item.status === 'Scoring Review';
                    return true;
                  })
                  .map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-slate-600">{app.prospectNo}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {app.applicantName}
                        {app.priority === 'Prioritas' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-red-100 text-red-700">
                            VIP
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          {app.product}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-900">{app.plafond}</td>
                      <td className="py-3 px-3 text-slate-500">{app.tenor}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            app.status === 'Menunggu Distribusi'
                              ? 'bg-orange-100 text-orange-800 border border-orange-200'
                              : app.status === 'Proposal Review'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : app.status === 'Scoring Review'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {app.assignedCa || <span className="text-slate-400 italic">Belum Dialokasikan</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {app.status === 'Menunggu Distribusi' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedApp(app);
                              setShowDistribusiModal(true);
                            }}
                            className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] shadow-2xs cursor-pointer flex items-center gap-1 mx-auto"
                          >
                            <Send className="h-3 w-3" />
                            Alokasikan CA
                          </button>
                        ) : app.status === 'Proposal Review' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApproveProposal(app.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                              title="Setujui Rekomendasi"
                            >
                              Setujui
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Proposal untuk ${app.applicantName} dikembalikan ke Analis untuk klarifikasi.`);
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] cursor-pointer"
                              title="Kembalikan ke Analis"
                            >
                              Revisi
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Melihat berkas aplikasi ${app.prospectNo} (${app.applicantName}).`);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-[11px] cursor-pointer"
                          >
                            Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================
            DAFTAR ANALIS KREDIT CABANG SERANG (Load Monitoring)
        ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monitoring Beban Kerja Analis Kredit (CA) - Cabang Serang
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">3 Analis Aktif Bertugas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {caOfficers.map((ca) => (
              <div key={ca.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{ca.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    {ca.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">User ID: {ca.id}</div>
                <div className="text-[11px] font-semibold text-teal-700 pt-1">{ca.load}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            SEKSI HELPDESK RESMI (Persis Teks pada Gambar 1, 2, 3, 4)
        ======================================================== */}
        <div className="bg-gradient-to-r from-slate-100 via-white to-slate-100 rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">
                Pusat Bantuan &amp; Helpdesk eLO Consumer BNI
              </h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Divisi Pemrosesan &amp; Penagihan Kredit Konsumer (Divisi CLN &amp; OTI)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-[11px] font-mono text-slate-700">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <Phone className="h-3.5 w-3.5 text-teal-600" />
              <span>(021) 572-9899, 9339, 9680, 9676</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-slate-400">Fax:</span>
              <span>021-5703242</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BOTTOM STATUS BAR (Persis Status Bar Bawah Gambar 1, 2, 3, 4)
      ======================================================== */}
      <div className="bg-slate-900 text-slate-300 text-xs px-6 py-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 font-mono">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            ID USER : <strong className="text-white">43963KF</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span>
            NAMA USER : <strong className="text-white">43963 - AMARULLOH (PENYELIA STA)</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span>
            CABANG : <strong className="text-white">046 - SERANG</strong>
          </span>
        </div>

        <div className="text-slate-400 text-[11px]">
          Login Since : 10.42 Rabu, 09 September 2026 &bull; IP: 192.168.217.90
        </div>
      </div>

      {/* ========================================================
          MODAL: ALOKASIKAN BERKAS KE ANALIS KREDIT (CA)
      ======================================================== */}
      {showDistribusiModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Distribusi Berkas Aplikasi</h3>
                  <p className="text-[11px] text-slate-500">Tugaskan analis kredit untuk memproses</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDistribusiModal(false);
                  setSelectedApp(null);
                }}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Prospek:</span>
                <span className="font-mono font-bold text-slate-800">{selectedApp.prospectNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Pemohon:</span>
                <span className="font-bold text-slate-900">{selectedApp.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Produk:</span>
                <span className="font-semibold text-teal-800">{selectedApp.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plafond:</span>
                <span className="font-mono font-bold text-orange-600">{selectedApp.plafond}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pilih Analis Kredit (Credit Analyst) Tujuan:
              </label>
              <select
                value={selectedCaTarget}
                onChange={(e) => setSelectedCaTarget(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 font-medium"
              >
                {caOfficers.map((ca) => (
                  <option key={ca.id} value={`${ca.id} - ${ca.name}`}>
                    {ca.name} â€” {ca.load}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowDistribusiModal(false);
                  setSelectedApp(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleAssignCa(selectedApp.id)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                Konfirmasi Alokasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: GANTI PASSWORD SPV
      ======================================================== */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Ganti Password Penyelia (SPV CA)</h3>
                  <p className="text-[11px] text-slate-500">Perbarui kata sandi akun eLO Anda</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordSuccess(false);
                }}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Password Berhasil Diperbarui!</h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordSuccess(false);
                  }}
                  className="mt-2 px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPasswordSuccess(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password Lama</label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password lama"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpvCaDashboard;


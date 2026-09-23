import React from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  ShieldCheck,
  Building,
  Mail,
  Award,
  Search,
  CheckCircle2,
  Headphones,
  Phone,
  LogOut,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RolePortalDashboardProps {
  roleCode: 'ca' | 'mailingroom' | 'pemimpin' | 'adc';
}

const ROLE_DETAILS = {
  ca: {
    title: 'Credit Analyst (CA) Portal',
    sub: 'Analisis Kelayakan Kredit, Penilaian Scoring, SLIK OJK & Pembuatan Credit Proposal',
    badge: 'ANALIS KREDIT',
    icon: Search,
    color: 'from-blue-900 to-indigo-950',
    stats: [
      { label: 'Berkas Masuk dari SPV', val: '4 Berkas' },
      { label: 'Analisis SLIK & DHN', val: '2 Selesai' },
      { label: 'Proposal Sedang Disusun', val: '2 Berkas' },
      { label: 'Siap Dikirim ke SPV', val: '1 Berkas' },
    ],
  },
  mailingroom: {
    title: 'Mailing Room Portal',
    sub: 'Penerimaan, Registrasi Dokumen Fisik, Verifikasi Kelengkapan Awal & Ekspedisi Berkas',
    badge: 'MAILING ROOM',
    icon: Mail,
    color: 'from-amber-900 to-orange-950',
    stats: [
      { label: 'Dokumen Diterima Hari Ini', val: '28 Berkas' },
      { label: 'Scan & Registrasi', val: '22 Selesai' },
      { label: 'Menunggu Serah Terima Sales', val: '6 Berkas' },
      { label: 'Siap Distribusi Unit CA', val: '14 Berkas' },
    ],
  },
  pemimpin: {
    title: 'Portal Pemimpin Cabang (Branch Manager)',
    sub: 'Persetujuan Komite Kredit, Monitoring Realisasi Target & Portfolio Risiko Cabang',
    badge: 'PEMIMPIN CABANG',
    icon: Award,
    color: 'from-emerald-950 to-teal-950',
    stats: [
      { label: 'Menunggu Putusan Komite', val: '3 Proposal' },
      { label: 'Disetujui Bulan Ini', val: 'Rp 14,8 Milyar' },
      { label: 'Realisasi Target Bulanan', val: '87.4%' },
      { label: 'NPL Konsumer Cabang', val: '0.82%' },
    ],
  },
  adc: {
    title: 'Appraisal & Document Checking (ADC) Portal',
    sub: 'Penilaian Agunan Properti/Kendaraan, Pemeriksaan Yuridis Sertifikat & Notaris',
    badge: 'APPRAISAL & DC',
    icon: Building,
    color: 'from-slate-900 to-stone-900',
    stats: [
      { label: 'Antrean Taksasi Agunan', val: '7 Objek' },
      { label: 'Kunjungan Lapangan', val: '3 Terjadwal' },
      { label: 'Verifikasi Notaris/BPN', val: '5 Selesai' },
      { label: 'Laporan Selesai (SKDR)', val: '4 Berkas' },
    ],
  },
};

export const RolePortalDashboard: React.FC<RolePortalDashboardProps> = ({ roleCode }) => {
  const { user, logout } = useAuth();
  const config = ROLE_DETAILS[roleCode] || ROLE_DETAILS.ca;
  const IconComp = config.icon;

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 font-sans text-slate-800 flex flex-col justify-between p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* HERO BANNER */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${config.color} text-white p-6 sm:p-8 shadow-md border border-white/10`}>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-teal-100 border border-white/20">
                  <IconComp className="h-3.5 w-3.5 text-amber-300" />
                  {config.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-200 border border-orange-400/30">
                  Cabang Serang (046)
                </span>
                <span className="text-xs text-teal-200/80 font-mono">ID: {user?.id || user?.userId || 'USER'}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Selamat Datang, <span className="text-amber-300">{user?.name || 'Petugas Bank'}</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                {config.sub}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="h-4 w-4 text-red-300" />
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {config.stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2">{stat.val}</div>
            </div>
          ))}
        </div>

        {/* WORKSPACE CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Ruang Kerja Petugas {config.badge}
              </h3>
              <p className="text-xs text-slate-500">Antrean tugas aktif dan dokumen yang memerlukan perhatian</p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
              Sesi Aktif &bull; Online
            </span>
          </div>

          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-200">
              <IconComp className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Modul Spesifik {config.title} Siap Digunakan</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Seluruh data transaksi dan antrean berkas terhubung dengan sistem core loan origination eLO BNI.
            </p>
          </div>
        </div>

        {/* HELPDESK */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Helpdesk eLO Consumer BNI:</span>{' '}
              <span className="text-slate-600 font-mono">(021) 572-9899, 9339, 9680 (Fax: 021-5703242)</span>
            </div>
          </div>
          <div className="text-slate-500 text-[11px]">
            Login Since: 09/09/2026 &bull; Cabang: 046 - SERANG
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePortalDashboard;


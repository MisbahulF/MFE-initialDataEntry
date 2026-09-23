import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@template/shared';
import {
  FilePlus, Clock, Send, Users, Search, FileX, Phone as PhoneIcon,
  KeyRound, LogOut, Home, Car, Layers, Briefcase, Building2, X,
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp,
  User, ExternalLink
} from 'lucide-react';

interface MainPromptProps {
  onNavigate: (screen: 'main' | 'list' | 'form', prospectData?: any) => void;
}

const PRODUCTS = [
  { id: 'griya',   label: 'BNI GRIYA',           icon: Home,      desc: 'Kredit Pemilikan Rumah (KPR) Baru, Secondary & Refinancing' },
  { id: 'oto',     label: 'BNI OTO',             icon: Car,       desc: 'Pembiayaan Kendaraan Bermotor roda dua & empat' },
  { id: 'multi',   label: 'BNI MULTIGUNA',       icon: Layers,    desc: 'Kredit konsumtif agunan properti untuk segala kebutuhan' },
  { id: 'fleksi',  label: 'BNI FLEKSI',          icon: Briefcase, desc: 'Kredit Tanpa Agunan (KTA) untuk pegawai berpayroll BNI' },
  { id: 'griyamg', label: 'BNI GRIYA MULTIGUNA', icon: Building2, desc: 'Fasilitas top-up dan penambahan limit kredit griya' },
];

const ALL_FACILITIES = [
  { id: 'input',   label: 'Input Aplikasi',      icon: FilePlus,   cat: 'Marketing',  desc: 'Pendaftaran & Draf IDE Baru', isPrimary: true },
  { id: 'pending', label: 'Pending Data',         icon: Clock,      cat: 'Processing', desc: 'Daftar Aplikasi Tertunda' },
  { id: 'kirim',   label: 'Kirim Aplikasi',       icon: Send,       cat: 'Processing', desc: 'Penerusan Berkas ke AIP' },
  { id: 'skk',     label: 'Monitoring SKK',       icon: Users,      cat: 'Processing', desc: 'Pemantauan Surat Keputusan' },
  { id: 'status',  label: 'Status Aplikasi',      icon: Search,     cat: 'Marketing',  desc: 'Lacak Status Real-time' },
  { id: 'tolak',   label: 'Surat Penolakan',      icon: FileX,      cat: 'Processing', desc: 'Daftar Penolakan Berkas' },
  { id: 'hp',      label: 'Update Nomor HP',      icon: PhoneIcon,  cat: 'Marketing',  desc: 'Perubahan Kontak Debitur' },
];

const CATS = ['Semua', 'Marketing', 'Processing'] as const;
type Cat = typeof CATS[number];

export const MainPrompt: React.FC<MainPromptProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cat, setCat] = useState<Cat>('Semua');
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const anyUser = user as any;
  const userCode   = anyUser?.userId || anyUser?.username || user?.id || '902214';
  const userName   = anyUser?.name || anyUser?.fullName || user?.name || 'SURYA HARJAYA';
  const userBranch = anyUser?.branch || anyUser?.branchCode || '046 - SERANG STA';

  const loginTime = '22/09/2026 08:30:15';
  const ipAddress = '10.24.112.5';

  const facilities = cat === 'Semua'
    ? ALL_FACILITIES
    : ALL_FACILITIES.filter(f => f.cat === cat);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-800 antialiased selection:bg-teal-500 selection:text-white">

      {/* ── TOP GLASS HEADER BAR (3D ELEVATED) ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#005E5D] via-[#006e6d] to-[#004847] flex items-center justify-center shadow-[0_4px_12px_rgba(0,94,93,0.35)] border border-teal-400/30">
              <span className="text-white font-black text-xs tracking-tight">BNI</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">PROMPT eLO Konsumer</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{userBranch}</span>
            </div>
          </div>

          {/* User Profile Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100/80 border border-slate-200 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-[#005E5D]/10 text-[#005E5D] flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">{userName}</span>
                <span className="text-[10px] font-mono text-slate-500">{userCode}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPwdModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden md:inline">Ubah Password</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#E05A10] to-[#c94d0a] hover:from-[#c94d0a] hover:to-[#b04006] rounded-xl shadow-[0_2px_10px_rgba(224,90,16,0.3)] hover:shadow-[0_4px_14px_rgba(224,90,16,0.4)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN DASHBOARD BODY (WIDE & AIRY) ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── 3D HERO BANNER: INITIAL DATA ENTRY ACCESS ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005E5D] via-[#006e6d] to-[#004847] text-white p-7 sm:p-9 shadow-[0_14px_35px_-8px_rgba(0,94,93,0.4)] border border-teal-400/20">
          {/* Ambient 3D spheres */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 -mb-20 w-64 h-64 rounded-full bg-[#E05A10]/25 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-teal-100 border border-white/20 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Modul Utama Konsumer (PRM)
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight drop-shadow-xs">
                Electronic Loan Origination (PROMPT eLO)
              </h1>
              <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed">
                Platform digital terpadu untuk pemrosesan kredit konsumer BNI Griya & Fleksi. Registrasi draf baru, simulasi angsuran, verifikasi data debitur, dan integrasi otomatis.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => onNavigate('list')}
                className="inline-flex items-center justify-center gap-2.5 bg-[#E05A10] hover:bg-[#c94f0c] text-white px-7 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(224,90,16,0.4)] hover:shadow-[0_8px_26px_rgba(224,90,16,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer"
              >
                <FilePlus className="w-4 h-4" />
                <span>Mulai Input IDE (Baru)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 3D ELEVATED SECTION: PRODUK SIMULASI ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#005E5D] flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Produk & Fasilitas Kredit</h2>
                <p className="text-[11px] text-slate-500">Pilih jenis produk konsumer untuk informasi dan simulasi perhitungan</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/70 w-max">
              5 Produk Konsumer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {PRODUCTS.map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onNavigate('list')}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60 hover:from-teal-50/40 hover:to-white hover:border-[#005E5D]/40 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 group-hover:bg-[#005E5D] text-[#005E5D] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="block text-xs font-bold text-slate-800 group-hover:text-[#005E5D] transition-colors">
                      {p.label}
                    </span>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-[#005E5D]">
                    <span>Simulasi</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3D ELEVATED SECTION: PROMPT FACILITIES HUB ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_6px_28px_-6px_rgba(0,0,0,0.07)] p-6 space-y-5">
          
          {/* Header & Segmented Category Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">PROMPT Facilities Hub</h2>
                <p className="text-[11px] text-slate-500">Menu pemrosesan, investigasi data, dan manajemen operasional aplikasi</p>
              </div>
            </div>

            {/* 3D Segmented Category Pills */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              {CATS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    if (c === 'Processing') {
                      window.history.pushState(null, '', '/data-entry');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      navigate('/data-entry');
                    } else {
                      setCat(c as Cat);
                    }
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    cat === c
                      ? 'bg-white text-[#005E5D] shadow-xs scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Tactile Facility Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {facilities.map(f => {
              const Icon = f.icon;
              const isInput = f.id === 'input';

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onNavigate('list')}
                  className={`relative p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-between text-center group cursor-pointer ${
                    isInput
                      ? 'bg-gradient-to-b from-orange-50/60 to-white border-orange-200/90 shadow-[0_4px_16px_rgba(224,90,16,0.15)] hover:shadow-[0_12px_28px_rgba(224,90,16,0.25)] hover:-translate-y-1.5'
                      : 'bg-gradient-to-b from-white to-slate-50/70 border-slate-200/80 shadow-2xs hover:shadow-lg hover:-translate-y-1.5 hover:border-teal-500/40'
                  }`}
                >
                  {isInput && (
                    <span className="absolute -top-2.5 bg-gradient-to-r from-[#E05A10] to-orange-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                      Utama
                    </span>
                  )}

                  {/* 3D Embossed Icon Tile */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm group-hover:scale-110 mb-3 ${
                    isInput
                      ? 'bg-gradient-to-br from-[#E05A10] to-[#f97316] text-white shadow-[0_4px_14px_rgba(224,90,16,0.4)]'
                      : 'bg-gradient-to-br from-teal-500 to-[#005E5D] text-white shadow-[0_4px_12px_rgba(0,94,93,0.3)]'
                  }`}>
                    <Icon className="w-6 h-6 drop-shadow-xs" />
                  </div>

                  <div className="space-y-1 w-full">
                    <span className="block text-xs font-bold text-slate-800 group-hover:text-[#005E5D] transition-colors leading-tight">
                      {f.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">
                      {f.cat}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* ── HELPDESK & SUPPORT BANNER ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-[#005E5D]">
              <PhoneIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800">Pusat Bantuan & Helpdesk IT eLO:</span>
              <span className="ml-1 text-slate-500 font-mono">(021) 572-9899 / 9339 / 9680</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Standar Operasional eLO BNI Konsumer &bull; v2.6-2026</span>
          </div>
        </div>

      </main>

      {/* ── 3D FOOTER STATUS BAR ── */}
      <footer className="bg-gradient-to-r from-[#004847] via-[#005E5D] to-[#004847] text-teal-100 text-[11px] font-mono px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-teal-600/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>ID USER: <strong className="text-white">{userCode}</strong> &bull; NAMA: <strong className="text-white">{userName}</strong> &bull; CABANG: <strong className="text-white">{userBranch}</strong></span>
        </div>
        <div className="text-[10px] text-teal-200/80">
          Login Since: {loginTime} &nbsp;|&nbsp; Host: {ipAddress}
        </div>
      </footer>

      {/* ── CHANGE PASSWORD MODAL ── */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-scale-up">
            <div className="bg-gradient-to-r from-[#005E5D] to-[#004847] px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold text-sm">Ubah Password Akun</h3>
              <button
                type="button"
                onClick={() => setShowPwdModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Password Lama',   val: oldPwd,     set: setOldPwd     },
                { label: 'Password Baru',   val: newPwd,     set: setNewPwd     },
                { label: 'Konfirmasi Baru', val: confirmPwd, set: setConfirmPwd },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{f.label}</label>
                  <input
                    type="password"
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-[#005E5D] focus:bg-white transition-all shadow-xs"
                  />
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setShowPwdModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => setShowPwdModal(false)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#005E5D] to-[#004847] rounded-xl shadow-[0_2px_10px_rgba(0,94,93,0.3)] hover:shadow-[0_4px_14px_rgba(0,94,93,0.4)] transition-all cursor-pointer"
              >
                Simpan Password
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MainPrompt;

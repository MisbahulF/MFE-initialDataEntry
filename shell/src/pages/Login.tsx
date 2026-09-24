import React, { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Phone, Mail, AlertCircle, ShieldCheck, Sparkles, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const [showPwd, setShowPwd]   = useState(false);
  const [userId,  setUserId]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('User ID tidak boleh kosong.');
      return;
    }
    if (!password) {
      setError('Password tidak boleh kosong.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(userId.trim(), password);
    } catch (err: any) {
      setError(err?.message || 'Login gagal. Periksa kembali User ID dan Password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-[#fff8f5] to-[#fbf4f0] flex flex-col font-sans text-slate-800 relative overflow-hidden selection:bg-[#F15A24] selection:text-white">
      {/* Subtle 3D Decorative Orbs in Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#F15A24]/15 to-orange-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#E05A10]/15 to-orange-200/30 blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-6 py-2.5 flex items-center justify-between text-xs text-slate-500 z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700 tracking-wider uppercase text-[10px]">
            BNI eLO — Electronic Loan Origination System
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Layanan Operasional 07.00 – 20.00 WIB
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 z-10">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-stretch">

          {/* LEFT: Login form with 3D Card Depth */}
          <div className="flex-1 min-w-0 bg-white/90 backdrop-blur-xl border border-white/80 rounded-2xl p-7 sm:p-9 shadow-[0_12px_40px_-10px_rgba(241,90,36,0.15),0_2px_6px_rgba(0,0,0,0.04)] relative">
            {/* Ambient top highlight */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#F15A24] to-transparent rounded-full opacity-70" />

            {/* Brand Header */}
            <div className="mb-7">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#F15A24] to-[#D94E1B] flex items-center justify-center shrink-0 shadow-[0_6px_16px_rgba(241,90,36,0.35)] ring-2 ring-orange-500/20 transform hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-black text-base tracking-tighter drop-shadow-xs">BNI</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-orange-950 font-bold uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      Sistem Kredit Konsumer
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight mt-0.5">
                    PROMPT <span className="text-[#F15A24]">eLO</span>
                  </h1>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Portal terintegrasi pemrosesan aplikasi kredit konsumer (Initial Data Entry & Approval in Principal).
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>User ID / NIP</span>
                  <span className="text-[10px] text-slate-400 font-normal">Contoh: SC70629</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    placeholder="Masukkan User ID Anda"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-orange-500/20 focus:border-[#F15A24] focus:bg-white transition-all shadow-xs"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-400 font-normal">Kerahasiaan terjaga</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan Password Anda"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-orange-500/20 focus:border-[#F15A24] focus:bg-white transition-all shadow-xs"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-3 shadow-xs">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* 3D Elevated Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#F15A24] via-[#F37021] to-[#E05A10] hover:from-[#E05A10] hover:to-[#D94E1B] active:scale-[0.99] text-white font-bold text-xs tracking-wide uppercase rounded-xl transition-all shadow-[0_4px_14px_rgba(241,90,36,0.35)] hover:shadow-[0_6px_20px_rgba(241,90,36,0.45)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menghubungkan ke server...
                  </span>
                ) : (
                  'Masuk ke Sistem eLO'
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Keamanan Standar Perbankan ISO 27001</span>
              <span className="font-mono text-[10px] text-slate-500">v2.6-2026</span>
            </div>
          </div>

          {/* RIGHT: Help / Contact Card with Layered Depth */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E05A10]" /> Pusat Bantuan & Kontak
              </p>

              {/* CLN Card */}
              <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
                <div className="border-b border-slate-100 pb-2 mb-2.5">
                  <p className="text-xs font-bold text-slate-800">Divisi CLN</p>
                  <p className="text-[10px] text-slate-500">User ID, Reset Password & Hak Akses</p>
                </div>
                <div className="space-y-2 text-[11px]">
                  <a href="tel:02150836555" className="flex items-center gap-2 text-slate-600 hover:text-[#F15A24] transition-colors group">
                    <div className="p-1 rounded-md bg-orange-50 text-[#F15A24] group-hover:bg-[#F15A24] group-hover:text-white transition-colors">
                      <Phone className="h-3 w-3" />
                    </div>
                    <span className="font-mono text-xs">021-50836555</span>
                  </a>
                  <a href="mailto:userid_consumer.RTC@bni.co.id" className="flex items-center gap-2 text-slate-600 hover:text-[#F15A24] transition-colors group">
                    <div className="p-1 rounded-md bg-orange-50 text-[#F15A24] group-hover:bg-[#F15A24] group-hover:text-white transition-colors">
                      <Mail className="h-3 w-3" />
                    </div>
                    <span className="truncate text-[10px]">userid_consumer.RTC@bni.co.id</span>
                  </a>
                </div>
              </div>

              {/* OTI Card */}
              <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
                <div className="border-b border-slate-100 pb-2 mb-2.5">
                  <p className="text-xs font-bold text-slate-800">Divisi OTI — Helpdesk Teknis</p>
                  <p className="text-[10px] text-slate-500">Kendala Jaringan, Sinkronisasi & Server</p>
                </div>
                <div className="space-y-2 text-[11px]">
                  {[
                    { name: 'M. Fadli Rachman', phone: '021-29946000', email: 'hde.monitoring@bni.co.id' },
                    { name: 'Dessy Yuniarti',   phone: '021-29946000', email: 'hde.monitoring@bni.co.id' },
                  ].map(pic => (
                    <div key={pic.name} className="border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                      <p className="font-semibold text-slate-700 text-[11px] mb-1">{pic.name}</p>
                      <a href={`tel:${pic.phone.replace(/-/g,'')}`} className="flex items-center gap-1.5 text-slate-500 hover:text-[#F15A24] transition-colors">
                        <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-mono text-[10px]">{pic.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md px-6 py-3 text-[11px] text-slate-500 flex items-center justify-between z-10">
        <span>&copy; PT Bank Negara Indonesia (Persero) Tbk. Hak Cipta Dilindungi.</span>
        <span className="hidden sm:block font-mono text-[10px] text-slate-400">PROMPT eLO Konsumer &bull; Confidential &bull; v2.6</span>
      </footer>
    </div>
  );
};

export default Login;

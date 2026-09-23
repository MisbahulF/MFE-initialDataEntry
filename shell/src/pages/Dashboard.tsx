import React from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  FileEdit, 
  FileCheck2, 
  ShieldCheck, 
  UserCheck, 
  Search, 
  Award, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  Clock, 
  CheckCircle2 
} from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickModules = [
    {
      title: "Initial Data Entry (IDE)",
      desc: "Input dan kelola draf permohonan kredit baru (BNI Griya, Fleksi, dsb).",
      href: "/initial-data-entry",
      icon: FileEdit,
      color: "from-teal-600 to-emerald-700",
      badge: "Aktif",
      count: "12 Draf",
      highlight: true
    },
    {
      title: "Detail Data Entry (DDE)",
      desc: "Lengkapi data mendalam calon debitur, verifikasi dokumen, dan scoring.",
      href: "#",
      icon: FileCheck2,
      color: "from-blue-600 to-indigo-700",
      badge: "Processing",
      count: "5 Berkas"
    },
    {
      title: "Verification & Appraisal",
      desc: "Taksasi agunan tanah/bangunan dan investigasi lapangan calon debitur.",
      href: "#",
      icon: UserCheck,
      color: "from-amber-600 to-orange-700",
      badge: "Appraisal",
      count: "3 Menunggu"
    },
    {
      title: "BI Checking / SLIK OJK",
      desc: "Pengecekan riwayat kolektibilitas dan blacklist nasabah terpadu.",
      href: "#",
      icon: Search,
      color: "from-purple-600 to-violet-700",
      badge: "OJK SLIK",
      count: "Realtime"
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Top Welcome Header with Ambient Glow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif & Terhubung
            </span>
            <span className="text-xs text-slate-400 font-mono">046 - SERANG STA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Selamat Datang{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sistem Pemrosesan Kredit Konsumer BNI (electronic Loan Origination - PROMPT eLO).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/initial-data-entry"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005E5D] to-[#004847] hover:from-[#004e4d] hover:to-[#003837] active:scale-[0.99] text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide shadow-[0_4px_14px_rgba(0,94,93,0.35)] hover:shadow-[0_6px_20px_rgba(0,94,93,0.45)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <FileEdit className="w-4 h-4" />
            <span>Mulai Input IDE</span>
          </Link>
        </div>
      </div>

      {/* Hero Card: Initial Data Entry 3D Highlight */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005E5D] via-[#006f6e] to-[#004847] text-white p-7 sm:p-9 shadow-[0_12px_35px_-8px_rgba(0,94,93,0.4)] border border-teal-400/20">
        {/* Decorative 3D Spheres */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-20 w-60 h-60 rounded-full bg-[#E05A10]/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-teal-100 border border-white/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#f97316]" /> Modul Utama Konsumer (PRM)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight drop-shadow-xs">
              Initial Data Entry (IDE) &mdash; Griya &amp; Fleksi
            </h2>
            <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed">
              Formulir pengajuan kredit konsumer baru dengan integrasi otomatis kode pos, validasi field mandatory, dan persistensi database lokal secara instan.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <Link
              to="/initial-data-entry"
              className="inline-flex items-center justify-center gap-2 bg-[#E05A10] hover:bg-[#c94f0c] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(224,90,16,0.4)] hover:shadow-[0_6px_22px_rgba(224,90,16,0.55)] hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Buka Formulir IDE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of 3D Elevated Module Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#005E5D]" /> Alur Pemrosesan Aplikasi Kredit
          </h2>
          <span className="text-xs text-slate-400 font-normal">Pilih modul untuk navigasi cepat</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickModules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.title}
                to={m.href}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#005E5D] transition-colors mb-1.5">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#005E5D] font-semibold">
                  <span>{m.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

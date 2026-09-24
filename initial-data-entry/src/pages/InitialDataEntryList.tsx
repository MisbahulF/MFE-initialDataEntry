import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, storage, STORAGE_KEYS, Badge } from '@template/shared';
import { Home, LogOut, Search, RotateCcw, Plus, ChevronRight, AlertCircle } from 'lucide-react';

export interface ProspectItem {
  noProspek: string;
  nama: string;
  ktp: string;
  telp: string;
  fasilitas: string;
  referal: string;
  statusPrescreening: string;
  maksKredit?: string;
  unitPemroses?: string;
}

interface InitialDataEntryListProps {
  onNavigate: (screen: 'main' | 'list' | 'form', prospectData?: any) => void;
}

const STATUS_COLOR: Record<string, string> = {
  'REJECT': 'bg-red-50 text-red-700 border-red-200',
  'Terkirim': 'bg-orange-50 text-teal-700 border-orange-200',
};

export const InitialDataEntryList: React.FC<InitialDataEntryListProps> = ({ onNavigate }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [filterNama, setFilterNama] = useState('');
  const [filterKtp, setFilterKtp] = useState('');
  const [filterTelp, setFilterTelp] = useState('');
  const [filterFasilitas, setFilterFasilitas] = useState('ALL');
  const [filterSumber, setFilterSumber] = useState('ALL');
  const [hasSearched, setHasSearched] = useState(false);
  const [prospects, setProspects] = useState<ProspectItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadProspectsData = async (doSearch: boolean = false) => {
    let res: ProspectItem[] = [];
    try {
      const response = await fetch('http://localhost:5139/api/DataEntry/applications');
      if (response.ok) {
        const apps = await response.json();
        const fromBackend: ProspectItem[] = apps.map((app: any) => ({
          noProspek: app.noProspek || app.noAplikasi,
          nama: app.namaDebitur,
          ktp: app.ktp || '',
          telp: app.data?.noHandphone || app.data?.telepon || app.data?.telp || '',
          fasilitas: app.data?.fasilitas || app.produk || 'BNI GRIYA',
          referal: app.data?.namaSales || app.data?.salesName || 'STAFF SALES (STA)',
          statusPrescreening: '', // Dikosongkan sesuai permintaan (pengecekan dukcapil/prescreening)
          maksKredit: app.data?.maksimumKredit || app.data?.maksKredit || '-',
          unitPemroses: app.cabang || 'SERANG STA (046)',
        }));

        // Authoritative source of truth: Backend SQLite Database
        res = fromBackend;
        storage.setJSON(STORAGE_KEYS.IDE_PROSPECTS, res);
      } else {
        res = (storage.getJSON<ProspectItem[]>(STORAGE_KEYS.IDE_PROSPECTS) || []).map(p => ({ ...p, statusPrescreening: '' }));
      }
    } catch {
      res = (storage.getJSON<ProspectItem[]>(STORAGE_KEYS.IDE_PROSPECTS) || []).map(p => ({ ...p, statusPrescreening: '' }));
    }

    if (doSearch) {
      if (filterNama.trim()) { const q = filterNama.trim().toLowerCase(); res = res.filter(p => p.nama.toLowerCase().includes(q) || p.noProspek.toLowerCase().includes(q)); }
      if (filterKtp.trim()) res = res.filter(p => p.ktp.includes(filterKtp.trim()));
      if (filterTelp.trim()) res = res.filter(p => p.telp.includes(filterTelp.trim()));
      if (filterFasilitas !== 'ALL') res = res.filter(p => p.fasilitas.toUpperCase().includes(filterFasilitas.toUpperCase()));
      showToast(`Ditemukan ${res.length} data prospek.`);
    }

    setProspects(res);
  };

  React.useEffect(() => {
    loadProspectsData(false);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    loadProspectsData(true);
  };

  const handleClear = () => {
    setFilterNama(''); setFilterKtp(''); setFilterTelp('');
    setFilterFasilitas('ALL'); setFilterSumber('ALL');
    setProspects([]); setHasSearched(false);
    showToast('Filter dikosongkan.');
  };

  const handleDelete = async (noProspek: string, nama: string) => {
    if (!window.confirm(`Hapus prospek ${nama} (${noProspek})?`)) return;
    const updated = prospects.filter(p => p.noProspek !== noProspek);
    setProspects(updated);
    storage.setJSON(STORAGE_KEYS.IDE_PROSPECTS, updated);
    try {
      const formsStr = storage.retrieve(STORAGE_KEYS.IDE_FORMS);
      if (formsStr) {
        const forms = JSON.parse(formsStr);
        delete forms[noProspek];
        storage.setJSON(STORAGE_KEYS.IDE_FORMS, forms);
      }
    } catch { }

    // Hapus secara riil dari database SQLite lokal
    try {
      await fetch(`http://localhost:5139/api/DataEntry/applications/${encodeURIComponent(noProspek)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Gagal menghapus dari database SQLite:', e);
    }

    showToast(`Prospek ${nama} berhasil dihapus dari database.`);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-gray-800 flex flex-col text-sm">

      {/* ── Top Nav ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <div className="h-7 w-7 rounded bg-[#F15A24] flex items-center justify-center shrink-0">
            <span className="text-white font-black text-[10px] tracking-tight">BNI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F15A24]">PROMPT eLO</span>
            <span className="text-gray-300 text-xs">›</span>
            <span className="text-xs text-gray-500 font-medium">Initial Data Entry List</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onNavigate('main')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
            <Home className="h-3.5 w-3.5" /> Menu Utama
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#E05A10] hover:bg-[#c94d0a] rounded-lg transition-colors">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-4">

        {/* Toast */}
        {toast && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-900 text-xs px-4 py-2.5 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {toast}
          </div>
        )}

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('form', { isNew: true })}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#F15A24] hover:bg-[#D94E1B] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Input Baru
          </button>
          <button
            onClick={() => onNavigate('form', { isNew: true, isFlpp: true, fasilitas: 'GRIYA FLPP PEMERINTAH' })}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#F15A24] text-[#F15A24] hover:bg-orange-50 text-xs font-semibold rounded-lg transition-colors"
          >
            FLPP
          </button>
        </div>

        {/* Search card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-gradient-to-r from-[#F15A24] to-[#E05A10] px-5 py-3">
            <span className="text-white text-xs font-bold uppercase tracking-widest">Kriteria Pencarian</span>
          </div>
          <form onSubmit={handleSearch} className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                { label: 'Nama Debitur', val: filterNama, set: setFilterNama, type: 'text', ph: '' },
                { label: 'No. KTP', val: filterKtp, set: setFilterKtp, type: 'text', ph: '' },
                { label: 'No. Telp', val: filterTelp, set: setFilterTelp, type: 'text', ph: '' },
              ].map(f => (
                <div key={f.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="sm:w-28 text-xs font-semibold text-slate-700 sm:text-right shrink-0">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.ph}
                    className="flex-1 w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F15A24]/20 focus:border-[#F15A24] transition"
                  />
                </div>
              ))}

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <label className="sm:w-28 text-xs font-semibold text-slate-700 sm:text-right shrink-0">Fasilitas</label>
                <select
                  value={filterFasilitas}
                  onChange={e => setFilterFasilitas(e.target.value)}
                  className="flex-1 w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F15A24]/20 focus:border-[#F15A24] transition"
                >
                  <option value="ALL">— Semua —</option>
                  <option value="GRIYA">BNI Griya</option>
                  <option value="OTO">BNI Oto</option>
                  <option value="MULTIGUNA">BNI Multiguna</option>
                  <option value="FLEKSI">BNI Fleksi</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <label className="sm:w-28 text-xs font-semibold text-slate-700 sm:text-right shrink-0">Sumber Data</label>
                <select
                  value={filterSumber}
                  onChange={e => setFilterSumber(e.target.value)}
                  className="flex-1 w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F15A24]/20 focus:border-[#F15A24] transition"
                >
                  <option value="ALL">All</option>
                  <option value="BRANCH">Branch</option>
                  <option value="DIGITAL">Digital</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-[11px] text-[#E05A10] italic">
                {hasSearched ? `${prospects.length} data ditemukan` : 'Klik "Cari" untuk menampilkan data →'}
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={handleClear} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <RotateCcw className="h-3 w-3" /> Kosongkan
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-5 py-1.5 text-xs font-semibold text-white bg-[#F15A24] hover:bg-[#D94E1B] rounded-lg transition-colors">
                  <Search className="h-3 w-3" /> Cari
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-gradient-to-r from-[#F15A24] to-[#E05A10] px-5 py-3">
            <span className="text-white text-xs font-bold uppercase tracking-widest">List Prospek</span>
          </div>

          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
              <Search className="h-10 w-10 text-gray-200" />
              <p className="text-xs text-center">
                Silakan klik tombol <strong className="text-[#F15A24]">"Cari"</strong> di atas untuk menampilkan data prospek.<br />
                Atau klik <button onClick={() => onNavigate('form', { isNew: true })} className="text-[#F15A24] underline font-semibold">Input Baru</button> untuk memulai pencatatan.
              </p>
            </div>
          ) : prospects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <AlertCircle className="h-8 w-8 text-gray-200" />
              <p className="text-xs">Tidak ada data yang sesuai filter pencarian.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-[#F15A24] to-[#E05A10] text-white">
                    {['No. Prospek', 'Nama', 'No. KTP', 'No. Telp', 'Fasilitas', 'Referal', 'Status Prescreening', 'Fungsi'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((p, i) => (
                    <tr key={p.noProspek} className={`border-b border-gray-100 hover:bg-orange-50/40 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                      <td className="px-3 py-2 font-mono text-[#F15A24] font-semibold whitespace-nowrap cursor-pointer hover:underline" onClick={() => onNavigate('form', { ...p, isNew: false })}>{p.noProspek}</td>
                      <td className="px-3 py-2 font-semibold text-gray-800">{p.nama}</td>
                      <td className="px-3 py-2 font-mono text-gray-600">{p.ktp}</td>
                      <td className="px-3 py-2 font-mono text-gray-600">{p.telp}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-[160px] truncate">{p.fasilitas}</td>
                      <td className="px-3 py-2 text-gray-400">{p.referal || '—'}</td>
                      <td className="px-3 py-2">
                        {p.statusPrescreening ? (
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${STATUS_COLOR[p.statusPrescreening] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {p.statusPrescreening}
                          </span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onNavigate('form', { ...p, isNew: false })}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-white bg-[#F15A24] hover:bg-[#D94E1B] rounded-md transition-colors"
                          >
                            Buka <ChevronRight className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.noProspek, p.nama)}
                            className="px-2.5 py-1 text-[10px] font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InitialDataEntryList;

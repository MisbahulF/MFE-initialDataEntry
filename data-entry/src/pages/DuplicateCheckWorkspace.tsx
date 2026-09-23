import React, { useState, useEffect } from 'react';
import { useAuth, storage, STORAGE_KEYS, Badge } from '@template/shared';
import {
  Home,
  LogOut,
  CheckCircle2,
  X,
  RotateCcw,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  CornerDownLeft,
} from 'lucide-react';

export interface DupeCandidateRecord {
  noAplikasi: string;
  noProspek?: string;
  nama: string;
  tglLahir: string;
  ktp: string;
  npwp?: string;
  produk: string;
  alamat?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  ibuKandung?: string;
  noRef?: string;
  pasanganNama?: string;
  pasanganTglLahir?: string;
  pasanganKtp?: string;
  pasanganNpwp?: string;
  checkedAt?: string;
}

interface DuplicateCheckWorkspaceProps {
  onNavigateToDetailDe: (record?: any) => void;
  onNavigateHome?: () => void;
  initialProspect?: any;
}

export const DuplicateCheckWorkspace: React.FC<DuplicateCheckWorkspaceProps> = ({
  onNavigateToDetailDe,
  onNavigateHome,
  initialProspect,
}) => {
  const { logout } = useAuth();

  // Screen: 'list' (Gambar 1) | 'detail' (Gambar 2)
  const [screen, setScreen] = useState<'list' | 'detail'>('list');
  const [candidates, setCandidates] = useState<DupeCandidateRecord[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<DupeCandidateRecord | null>(null);

  // Search Filters (Gambar 1)
  const [filterNama, setFilterNama] = useState('');
  const [filterNoApp, setFilterNoApp] = useState('');
  const [filterKtp, setFilterKtp] = useState('');
  const [filterTglLahir, setFilterTglLahir] = useState('');

  // Model Pengecekan (Gambar 2)
  const [tipePengecekan, setTipePengecekan] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [checkExisting, setCheckExisting] = useState(true);
  const [checkBlacklist, setCheckBlacklist] = useState(true);

  // Form Fields State (Gambar 2)
  const [nameFirst, setNameFirst] = useState('');
  const [nameMiddle, setNameMiddle] = useState('');
  const [nameLast, setNameLast] = useState('');
  const [tglLahirDay, setTglLahirDay] = useState('16');
  const [tglLahirMonth, setTglLahirMonth] = useState('September');
  const [tglLahirYear, setTglLahirYear] = useState('1989');
  const [tglKtpDay, setTglKtpDay] = useState('1');
  const [tglKtpMonth, setTglKtpMonth] = useState('Januari');
  const [tglKtpYear, setTglKtpYear] = useState('2013');
  const [formKtp, setFormKtp] = useState('');
  const [formAlamat, setFormAlamat] = useState('');
  const [formKelurahan, setFormKelurahan] = useState('');
  const [formKecamatan, setFormKecamatan] = useState('');
  const [formKota, setFormKota] = useState('');
  const [formNpwp, setFormNpwp] = useState('');
  const [formIbuKandung, setFormIbuKandung] = useState('');
  const [formNoRef, setFormNoRef] = useState('');

  // Pasangan Fields (Gambar 2)
  const [pasanganNama, setPasanganNama] = useState('');
  const [pasanganTglLahir, setPasanganTglLahir] = useState('');
  const [pasanganKtp, setPasanganKtp] = useState('');
  const [pasanganNpwp, setPasanganNpwp] = useState('');

  // Modal Hasil Blacklist / Duplicate (Gambar 3)
  const [showResultModal, setShowResultModal] = useState(false);
  const [processNo, setProcessNo] = useState('R15092026000001');
  const [hasRunCheck, setHasRunCheck] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Muat kandidat dari localStorage (hasil transfer dari DTBO) digabung dengan SEED
  const loadCandidates = () => {
    const combined: DupeCandidateRecord[] = [];

    // 1. Ambil dari localStorage (aplikasi yang dikirim dari IDE atau DTBO)
    try {
      const s = storage.retrieve(STORAGE_KEYS.DE_APPLICATIONS);
      if (s) {
        const apps = JSON.parse(s);
        apps.forEach((app: any) => {
          // Buat nomor aplikasi seragam format Gambar 1
          const appNo = app.noAplikasi || `0${app.noProspek?.slice(0, 16) || '70520240604600001'}`;
          combined.push({
            noAplikasi: appNo,
            noProspek: app.noProspek || '',
            nama: app.namaDebitur || app.nama || '',
            tglLahir: app.tglLahir || '',
            ktp: app.ktp || '',
            npwp: app.npwp || '',
            produk: app.produk || app.kodeProgram || '',
            alamat: app.alamat || '',
            kelurahan: app.kelurahan || '',
            kecamatan: app.kecamatan || '',
            kota: app.kota || '',
            ibuKandung: app.namaIbuKandung || '',
            pasanganNama: app.pasanganNama || '',
            pasanganTglLahir: app.pasanganTglLahir || '',
            pasanganKtp: app.pasanganKtp || '',
            pasanganNpwp: app.pasanganNpwp || '',
          });
        });
      }
    } catch {}

    

    setCandidates(combined);
  };

  useEffect(() => {
    loadCandidates();
    window.addEventListener('storage', loadCandidates);
    return () => window.removeEventListener('storage', loadCandidates);
  }, []);

  // Jika ada initialProspect yang baru masuk dari DTBO Update, langsung jadikan kandidat teratas
  useEffect(() => {
    if (initialProspect) {
      showToast(`Data prospek ${initialProspect.nama || ''} (${initialProspect.noProspek || ''}) diterima di Duplicate Checking.`);
      if (initialProspect.ktp) {
        setFilterKtp(initialProspect.ktp);
      }
    }
  }, [initialProspect]);

  // Handle klik "Detil" pada tabel (Gambar 1 -> Gambar 2)
  const handleOpenDetail = (cand: DupeCandidateRecord) => {
    setSelectedCandidate(cand);
    setHasRunCheck(false);

    // Pecah nama menjadi first, middle, last name
    const parts = (cand.nama || '').trim().split(/\s+/);
    setNameFirst(parts[0] || '');
    setNameMiddle(parts.length > 2 ? parts.slice(1, -1).join(' ') : (parts[1] || ''));
    setNameLast(parts.length > 1 ? parts[parts.length - 1] : '');

    // Parse tgl lahir jika ada
    if (cand.tglLahir && cand.tglLahir.includes('/')) {
      const p = cand.tglLahir.split('/');
      setTglLahirDay(p[0] || '16');
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const mIdx = parseInt(p[1], 10) - 1;
      setTglLahirMonth(monthNames[mIdx] || 'September');
      setTglLahirYear(p[2] || '1989');
    } else {
      setTglLahirDay('16');
      setTglLahirMonth('September');
      setTglLahirYear('1989');
    }

    setFormKtp(cand.ktp || '3578101609890004');
    setFormAlamat(cand.alamat || 'JL MAHONI 1 NO 67 TAMAN ROYAL');
    setFormKelurahan(cand.kelurahan || 'TANAH TINGGI');
    setFormKecamatan(cand.kecamatan || 'TANGERANG');
    setFormKota(cand.kota || 'JAKARTA');
    setFormNpwp(cand.npwp || '454791609619000');
    setFormIbuKandung(cand.ibuKandung || 'SITI AFIAH');
    setFormNoRef(cand.noRef || '');

    setPasanganNama(cand.pasanganNama || 'NINDYASANTI NOURMA EKAPUTRI');
    setPasanganTglLahir(cand.pasanganTglLahir || '16/02/1997');
    setPasanganKtp(cand.pasanganKtp || '3518115602970003');
    setPasanganNpwp(cand.pasanganNpwp || '');

    setScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle klik "Check Duplicate / Blacklist" (Gambar 2 -> Gambar 3)
  const handleRunCheckDuplicate = () => {
    const now = new Date();
    const dStr = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
    const randSeq = String(Math.floor(100000 + Math.random() * 900000));
    setProcessNo(`R${dStr}${randSeq.slice(0, 6)}`);

    setHasRunCheck(true);
    setShowResultModal(true);
  };

  // Handle klik "Update Status" setelah pengecekan (Gambar 2 -> Antrean Detail Data Entry)
  const handleUpdateStatus = () => {
    if (!selectedCandidate) return;

    if (!hasRunCheck) {
      const confirmContinue = window.confirm(
        'Pengecekan Duplicate / Blacklist belum dijalankan.\nApakah Anda ingin menjalankan pengecekan terlebih dahulu?'
      );
      if (confirmContinue) {
        handleRunCheckDuplicate();
        return;
      }
    }

    // Perbarui status prospek/aplikasi ke tahap "Detail Data Entry"
    try {
      const s = storage.retrieve(STORAGE_KEYS.DE_APPLICATIONS);
      let apps = s ? JSON.parse(s) : [];
      const foundIdx = apps.findIndex((app: any) =>
        app.noAplikasi === selectedCandidate.noAplikasi ||
        (selectedCandidate.noProspek && app.noProspek === selectedCandidate.noProspek) ||
        app.namaDebitur === selectedCandidate.nama
      );

      if (foundIdx !== -1) {
        apps[foundIdx] = {
          ...apps[foundIdx],
          status: 'Menunggu Input',
          statusDupeCheck: 'LOLOS (BERSIH)',
          stage: 'Detail Data Entry',
          dupeCheckAt: new Date().toISOString(),
        };
      } else {
        apps.unshift({
          id: `DE-${Date.now()}`,
          noAplikasi: selectedCandidate.noAplikasi,
          noProspek: selectedCandidate.noProspek || selectedCandidate.noAplikasi,
          namaDebitur: selectedCandidate.nama,
          ktp: selectedCandidate.ktp,
          npwp: selectedCandidate.npwp || '454791609619000',
          telepon: '081234567890',
          alamatKtp: selectedCandidate.alamat || 'JL MAHONI 1 NO 67 TAMAN ROYAL',
          alamatDomisili: selectedCandidate.alamat || 'JL MAHONI 1 NO 67 TAMAN ROYAL',
          produk: selectedCandidate.produk || 'BNI GRIYA',
          fasilitas: selectedCandidate.produk || 'GRIYA IDAMAN PEMBELIAN RUMAH TINGGAL',
          kodeProgram: 'REGULER (12-240 BULAN)',
          tujuanPembiayaan: 'RUMAH BARU',
          maksKredit: '250.000.000,00',
          sukuBunga: '7.25% Fixed 3 Thn',
          jangkaWaktu: '120',
          salesId: 'SC70629',
          salesName: 'SURYA HARJAYA - SC70629',
          cabang: '046 - SERANG',
          tglKirimSales: new Date().toLocaleDateString('id-ID'),
          status: 'Menunggu Input',
          statusDupeCheck: 'LOLOS (BERSIH)',
          stage: 'Detail Data Entry',
          dupeCheckAt: new Date().toISOString(),
        });
      }
      storage.setJSON(STORAGE_KEYS.DE_APPLICATIONS, apps);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error saving to bni_data_entry_applications:', e);
    }

    showToast(`Status Duplicate Checking untuk ${selectedCandidate.nama} berhasil diperbarui! Berkas dipindahkan ke Antrean Detail Data Entry.`);

    // Alihkan langsung ke Detail Data Entry sesuai instruksi user
    setTimeout(() => {
      onNavigateToDetailDe(selectedCandidate);
    }, 500);
  };

  // Filter daftar calon debitur (Gambar 1)
  const filteredCandidates = candidates.filter(c => {
    if (filterNama.trim() && !c.nama.toLowerCase().includes(filterNama.trim().toLowerCase())) return false;
    if (filterNoApp.trim() && !c.noAplikasi.toLowerCase().includes(filterNoApp.trim().toLowerCase())) return false;
    if (filterKtp.trim() && !c.ktp.includes(filterKtp.trim())) return false;
    return true;
  });

  return (
    <div className="w-full font-sans text-gray-800 space-y-4 animate-fade-in select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#005E5D] text-white px-5 py-3 rounded-xl shadow-xl border border-teal-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: LIST BLACKLIST / DUPLICATE CHECKING (SESUAI GAMBAR 1)
      ========================================================================= */}
      {screen === 'list' && (
        <div className="space-y-4">
          {/* Top Title Bar Khas Gambar 1 */}
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#e8f5e9] text-[#005E5D] font-bold text-xs rounded border border-[#c8e6c9]">
                Loan Processing : List Blacklist
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onNavigateHome && (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Home className="h-3.5 w-3.5 text-[#005E5D]" />
                  <span>Menu Utama</span>
                </button>
              )}
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1 bg-[#E05A10] hover:bg-[#c94d0a] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Form Kriteria Pencarian (Sesuai Gambar 1) */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-2 text-center text-white text-xs font-bold uppercase tracking-wider">
              KRITERIA PENCARIAN
            </div>
            <div className="p-5 space-y-2.5 text-xs">
              <div className="flex items-center">
                <label className="w-32 text-right pr-3 font-semibold text-gray-700">Nama :</label>
                <input
                  type="text"
                  value={filterNama}
                  onChange={(e) => setFilterNama(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs focus:outline-none focus:ring-1 focus:ring-[#007B7A]"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-3 font-semibold text-gray-700">No. Aplikasi :</label>
                <input
                  type="text"
                  value={filterNoApp}
                  onChange={(e) => setFilterNoApp(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs focus:outline-none focus:ring-1 focus:ring-[#007B7A]"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-3 font-semibold text-gray-700">No. KTP :</label>
                <input
                  type="text"
                  value={filterKtp}
                  onChange={(e) => setFilterKtp(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs focus:outline-none focus:ring-1 focus:ring-[#007B7A]"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-3 font-semibold text-gray-700">Tanggal Lahir :</label>
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={filterTglLahir}
                  onChange={(e) => setFilterTglLahir(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs focus:outline-none focus:ring-1 focus:ring-[#007B7A]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-red-600 font-semibold italic flex items-center gap-1">
                  Klik untuk mencari data &rarr;
                </span>
                <button
                  type="button"
                  onClick={() => loadCandidates()}
                  className="px-6 py-1 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          {/* Tabel DAFTAR CALON DEBITUR (Sesuai Gambar 1) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-2 text-center text-white text-xs font-bold uppercase tracking-wider">
              DAFTAR CALON DEBITUR
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E05A10] text-white text-[11px] font-bold border-b border-orange-700">
                    <th className="px-3 py-2 border-r border-orange-600/50">No. Aplikasi</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Nama</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Tanggal Lahir</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">No. KTP</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">NPWP</th>
                    <th className="px-3 py-2 text-center w-20">Fungsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCandidates.map((cand, idx) => (
                    <tr
                      key={cand.noAplikasi || idx}
                      className={`transition-colors hover:bg-teal-50/50 ${
                        idx % 2 === 1 ? 'bg-[#fffde7]' : 'bg-white'
                      }`}
                    >
                      <td className="px-3 py-2 font-mono text-gray-700 border-r border-gray-200">
                        {cand.noAplikasi}
                      </td>
                      <td className="px-3 py-2 font-bold text-gray-900 border-r border-gray-200">
                        {cand.nama}
                      </td>
                      <td className="px-3 py-2 font-mono text-gray-700 border-r border-gray-200">
                        {cand.tglLahir}
                      </td>
                      <td className="px-3 py-2 font-mono text-gray-700 border-r border-gray-200">
                        {cand.ktp}
                      </td>
                      <td className="px-3 py-2 font-mono text-gray-700 border-r border-gray-200">
                        {cand.npwp || '-'}
                      </td>
                      <td className="px-3 py-2 text-center font-bold">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(cand)}
                          className="text-blue-700 hover:text-blue-900 hover:underline cursor-pointer text-xs"
                        >
                          Detil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">
                        Tidak ada data calon debitur yang sesuai kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Khas Gambar 1 */}
            <div className="bg-[#fffde7] px-4 py-1.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600 font-bold">
              <div className="flex items-center gap-2">
                <span className="text-blue-700 cursor-pointer underline">1</span>
                <span className="text-blue-700 cursor-pointer underline">2</span>
              </div>
              <div className="text-[11px] text-gray-500 font-normal">
                Menampilkan {filteredCandidates.length} dari {candidates.length} calon debitur
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DETAIL PENGECEKAN REAL TIME (SESUAI GAMBAR 2)
      ========================================================================= */}
      {screen === 'detail' && selectedCandidate && (
        <div className="space-y-4">
          {/* Top Title Bar Khas Gambar 2 */}
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#e8f5e9] text-[#005E5D] font-bold text-xs rounded border border-[#c8e6c9]">
                Loan Processing : Pengecekan Real Time
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScreen('list')}
                className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CornerDownLeft className="h-3.5 w-3.5 text-[#005E5D]" />
                <span>Kembali ke List</span>
              </button>
              {onNavigateHome && (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Home className="h-3.5 w-3.5 text-[#005E5D]" />
                  <span>Menu Utama</span>
                </button>
              )}
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1 bg-[#E05A10] hover:bg-[#c94d0a] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* 1. INFORMASI PELANGGAN (Sesuai Gambar 2) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-1.5 text-center text-white text-xs font-bold uppercase tracking-wider">
              INFORMASI PELANGGAN
            </div>
            <div className="p-3 text-xs divide-y divide-gray-100 font-medium">
              <div className="grid grid-cols-1 md:grid-cols-12 py-1.5 items-center">
                <span className="md:col-span-3 text-right pr-4 font-semibold text-gray-600">No. Aplikasi :</span>
                <span className="md:col-span-9 font-bold text-gray-900 font-mono">{selectedCandidate.noAplikasi}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 py-1.5 items-center">
                <span className="md:col-span-3 text-right pr-4 font-semibold text-gray-600">Nama :</span>
                <span className="md:col-span-9 font-bold text-gray-900">{selectedCandidate.nama}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 py-1.5 items-center">
                <span className="md:col-span-3 text-right pr-4 font-semibold text-gray-600">Produk :</span>
                <span className="md:col-span-9 font-bold text-gray-900">{selectedCandidate.produk}</span>
              </div>
            </div>
          </div>

          {/* 2. MODEL PENGECEKAN (Sesuai Gambar 2) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-1.5 text-center text-white text-xs font-bold uppercase tracking-wider">
              MODEL PENGECEKAN
            </div>
            <div className="p-3 text-xs space-y-2 font-medium">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                <span className="md:col-span-3 text-right pr-4 font-semibold text-gray-600">Tipe Pelanggan :</span>
                <span className="md:col-span-9 font-bold text-gray-900">Personal</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                <span className="md:col-span-3 text-right pr-4 font-semibold text-gray-600">Tipe Pengecekan :</span>
                <div className="md:col-span-9 flex items-center gap-6">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tipePengecekan"
                      checked={tipePengecekan === 'Basic'}
                      onChange={() => setTipePengecekan('Basic')}
                      className="text-[#007B7A] focus:ring-[#007B7A]"
                    />
                    <span>Basic</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tipePengecekan"
                      checked={tipePengecekan === 'Intermediate'}
                      onChange={() => setTipePengecekan('Intermediate')}
                      className="text-[#007B7A] focus:ring-[#007B7A]"
                    />
                    <span className="font-bold">Intermediate</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tipePengecekan"
                      checked={tipePengecekan === 'Advanced'}
                      onChange={() => setTipePengecekan('Advanced')}
                      className="text-[#007B7A] focus:ring-[#007B7A]"
                    />
                    <span>Advanced</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                <span className="md:col-span-3 text-right pr-4 font-semibold text-gray-600">Pengecekan Untuk :</span>
                <div className="md:col-span-9 flex items-center gap-6">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkExisting}
                      onChange={(e) => setCheckExisting(e.target.checked)}
                      className="h-4 w-4 text-[#007B7A] rounded border-gray-300 focus:ring-[#007B7A]"
                    />
                    <span className="font-semibold">Existing Customer</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkBlacklist}
                      onChange={(e) => setCheckBlacklist(e.target.checked)}
                      className="h-4 w-4 text-[#007B7A] rounded border-gray-300 focus:ring-[#007B7A]"
                    />
                    <span className="font-semibold">Blacklisted / Blacklist Customer</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3 & 4. DUA KOLOM: INFORMASI CALON DEBITUR & INFORMASI PASANGAN (Sesuai Gambar 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Kolom Kiri: INFORMASI SMART DIGI -> INFORMASI CALON DEBITUR */}
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div className="bg-[#005e5d] text-white px-3 py-1 text-[11px] font-bold">
                  INFORMASI SMART DIGI
                </div>
                <div className="bg-[#007B7A] px-3 py-1.5 text-center text-white text-xs font-bold uppercase tracking-wider">
                  INFORMASI CALON DEBITUR
                </div>

                <div className="p-3 text-xs space-y-2 font-medium">
                  {/* Nama 3 kolom */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">Nama :</label>
                    <div className="flex-1 flex gap-1.5">
                      <input
                        type="text"
                        value={nameFirst}
                        onChange={(e) => setNameFirst(e.target.value)}
                        className="w-1/3 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={nameMiddle}
                        onChange={(e) => setNameMiddle(e.target.value)}
                        className="w-1/3 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={nameLast}
                        onChange={(e) => setNameLast(e.target.value)}
                        className="w-1/3 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Tanggal Lahir */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">Tanggal Lahir :</label>
                    <div className="flex-1 flex gap-1.5 items-center">
                      <input
                        type="text"
                        value={tglLahirDay}
                        onChange={(e) => setTglLahirDay(e.target.value)}
                        className="w-12 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs text-center"
                      />
                      <select
                        value={tglLahirMonth}
                        onChange={(e) => setTglLahirMonth(e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs"
                      >
                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={tglLahirYear}
                        onChange={(e) => setTglLahirYear(e.target.value)}
                        className="w-16 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs text-center"
                      />
                    </div>
                  </div>

                  {/* No. KTP */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">No. KTP :</label>
                    <input
                      type="text"
                      value={formKtp}
                      onChange={(e) => setFormKtp(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-mono font-bold"
                    />
                  </div>

                  {/* Tanggal Pembuatan KTP */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">Tanggal Pembuatan :</label>
                    <div className="flex-1 flex gap-1.5 items-center">
                      <input
                        type="text"
                        value={tglKtpDay}
                        onChange={(e) => setTglKtpDay(e.target.value)}
                        className="w-12 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs text-center"
                      />
                      <select
                        value={tglKtpMonth}
                        onChange={(e) => setTglKtpMonth(e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs"
                      >
                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={tglKtpYear}
                        onChange={(e) => setTglKtpYear(e.target.value)}
                        className="w-16 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs text-center"
                      />
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">Alamat :</label>
                    <input
                      type="text"
                      value={formAlamat}
                      onChange={(e) => setFormAlamat(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs"
                    />
                  </div>

                  {/* Kelurahan */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">Kelurahan/Desa :</label>
                    <input
                      type="text"
                      value={formKelurahan}
                      onChange={(e) => setFormKelurahan(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs"
                    />
                  </div>

                  {/* Kecamatan */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">Kecamatan :</label>
                    <input
                      type="text"
                      value={formKecamatan}
                      onChange={(e) => setFormKecamatan(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs"
                    />
                  </div>

                  {/* Kota */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">Kota :</label>
                    <input
                      type="text"
                      value={formKota}
                      onChange={(e) => setFormKota(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs"
                    />
                  </div>

                  {/* NPWP */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">NPWP :</label>
                    <input
                      type="text"
                      value={formNpwp}
                      onChange={(e) => setFormNpwp(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-mono"
                    />
                  </div>

                  {/* Ibu Kandung */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold">Nama Ibu Kandung :</label>
                    <input
                      type="text"
                      value={formIbuKandung}
                      onChange={(e) => setFormIbuKandung(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-bold"
                    />
                  </div>

                  {/* No Ref */}
                  <div className="flex items-center">
                    <label className="w-36 text-right pr-3 text-gray-600 font-semibold leading-tight">No. Referensi Calon Debitur :</label>
                    <input
                      type="text"
                      value={formNoRef}
                      onChange={(e) => setFormNoRef(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: INFORMASI AUTO FRAUD CHECK -> INFORMASI PASANGAN */}
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div className="bg-[#005e5d] text-white px-3 py-1 text-[11px] font-bold">
                  INFORMASI AUTO FRAUD CHECK
                </div>
                <div className="bg-[#007B7A] px-3 py-1.5 text-center text-white text-xs font-bold uppercase tracking-wider">
                  INFORMASI PASANGAN
                </div>

                <div className="p-3 text-xs space-y-2 font-medium">
                  {/* Nama Pasangan */}
                  <div className="flex items-center">
                    <label className="w-28 text-right pr-3 text-gray-600 font-semibold">Nama :</label>
                    <input
                      type="text"
                      value={pasanganNama}
                      onChange={(e) => setPasanganNama(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-bold"
                    />
                  </div>

                  {/* Tanggal Lahir Pasangan */}
                  <div className="flex items-center">
                    <label className="w-28 text-right pr-3 text-gray-600 font-semibold">Tanggal Lahir :</label>
                    <input
                      type="text"
                      value={pasanganTglLahir}
                      onChange={(e) => setPasanganTglLahir(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-mono"
                    />
                  </div>

                  {/* No. KTP Pasangan */}
                  <div className="flex items-center">
                    <label className="w-28 text-right pr-3 text-gray-600 font-semibold">No. KTP :</label>
                    <input
                      type="text"
                      value={pasanganKtp}
                      onChange={(e) => setPasanganKtp(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-mono font-bold"
                    />
                  </div>

                  {/* NPWP Pasangan */}
                  <div className="flex items-center">
                    <label className="w-28 text-right pr-3 text-gray-600 font-semibold">NPWP :</label>
                    <input
                      type="text"
                      value={pasanganNpwp}
                      onChange={(e) => setPasanganNpwp(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Catatan Status Pengecekan */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs">
                {hasRunCheck ? (
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">Duplicate Check: LOLOS (BERSIH)</span>
                      <p className="text-[11px] text-emerald-700">Calon debitur belum pernah terdaftar macet atau blacklist.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="text-[11px]">Silakan klik <strong>Check Duplicate / Blacklist</strong> terlebih dahulu sebelum melakukan update status.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tombol Aksi Bawah (Sesuai Gambar 2: Check Duplicate & Update Status) */}
          <div className="bg-white p-3 rounded-lg border border-gray-300 flex items-center justify-center gap-4 shadow-xs">
            <button
              type="button"
              onClick={handleRunCheckDuplicate}
              className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer active:scale-95 shadow-xs"
            >
              Check Duplicate / Blacklist
            </button>

            <button
              type="button"
              onClick={handleUpdateStatus}
              className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer active:scale-95 shadow-xs"
            >
              Update Status
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: MODAL POPUP HASIL BLACKLIST (SESUAI GAMBAR 3)
      ========================================================================= */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-lg border border-gray-400 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
            {/* Header Popup Window Sesuai Gambar 3 */}
            <div className="bg-[#e8f5e9] border-b border-gray-300 px-4 py-2 flex items-center justify-between">
              <span className="text-[#005E5D] font-bold text-xs">
                Loan Processing : Hasil Blacklist
              </span>
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs font-bold text-gray-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <CornerDownLeft className="h-3 w-3 text-blue-600" />
                <span>Kembali</span>
              </button>
            </div>

            {/* Tabel HASIL PENGECEKAN BLACKLIST (Sesuai Gambar 3) */}
            <div className="p-4 space-y-4">
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="bg-[#007B7A] px-3 py-1.5 text-center text-white text-xs font-bold uppercase tracking-wider">
                  HASIL PENGECEKAN BLACKLIST
                </div>
                <table className="w-full text-left text-xs border-collapse divide-y divide-gray-200 font-medium">
                  <tbody>
                    <tr className="bg-white">
                      <td className="w-40 px-3 py-2 font-semibold text-gray-600 border-r border-gray-200">No. Process :</td>
                      <td className="px-3 py-2 font-mono font-bold text-blue-700">{processNo}</td>
                    </tr>
                    <tr className="bg-[#fffde7]">
                      <td className="px-3 py-2 font-semibold text-gray-600 border-r border-gray-200">Status :</td>
                      <td className="px-3 py-2 font-bold text-gray-800">Successfull Run</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-3 py-2 font-semibold text-gray-600 border-r border-gray-200">Tipe Pengecekan :</td>
                      <td className="px-3 py-2 font-bold text-gray-800">{tipePengecekan}</td>
                    </tr>
                    <tr className="bg-[#fffde7]">
                      <td className="px-3 py-2 font-semibold text-gray-600 border-r border-gray-200">Againsts :</td>
                      <td className="px-3 py-2 text-gray-800 font-semibold">Existing Customer, Blacklist Customer</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-3 py-2 font-semibold text-gray-600 border-r border-gray-200">Hasil Duplicate :</td>
                      <td className="px-3 py-2 font-bold text-emerald-700">" Calon debitur belum pernah ada</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tombol Tutup Sesuai Gambar 3 */}
              <div className="bg-gray-50 py-2.5 px-4 border-t border-gray-200 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="px-10 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer active:scale-95 shadow-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuplicateCheckWorkspace;

import React, { useState, useEffect } from 'react';
import { useAuth, storage, STORAGE_KEYS, Badge } from '@template/shared';
import { dataEntryService } from '../services/dataEntryData';
import {
  Search,
  Check,
  X,
  RotateCcw,
  Plus,
  Home,
  LogOut,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';

export interface DtboDocItem {
  id: number;
  nama: string;
  mandatory: boolean; // true = "Ya", false = "Tidak"
  avail: boolean;
  deskripsi: string;
}

export interface DtboDocumentMaker {
  id: string;
  tanggal: string;
  pembuat: string;
}

export const OFFICIAL_DTBO_DOCUMENTS: DtboDocItem[] = [
  { id: 1,  nama: 'APLIKASI PERMOHONAN KREDIT', mandatory: true, avail: false, deskripsi: '' },
  { id: 2,  nama: 'ASLI SLIP GAJI PEMOHON/SURAT KETERANGAN PENGHASILAN', mandatory: true, avail: false, deskripsi: '' },
  { id: 3,  nama: 'ASLI SURAT KETERANGAN MASA KERJA (BAGI PEGAWAI AKTIF)', mandatory: false, avail: false, deskripsi: '' },
  { id: 4,  nama: 'PAS FOTO 4 X 6 PEMOHON DAN ISTRI/SUAMI', mandatory: false, avail: false, deskripsi: '' },
  { id: 5,  nama: 'ASLI SURAT PERNYATAAN DEVELOPER DAN NOTARIS UNTUK MENYERAHKAN SERTIFIKAT (APABILA SEDANG DALAM PROSES BALIK NAMA/PEMECAHAN SERTIFIKAT)', mandatory: true, avail: false, deskripsi: '' },
  { id: 6,  nama: 'ASLI SURAT PERNYATAAN PENGURUSAN NPWP (APABILA SEDANG DALAM PROSES PENGURUSAN)', mandatory: false, avail: false, deskripsi: '' },
  { id: 7,  nama: 'FOTOCOPY PBB SATUAN UNIT RUMAH / IMB INDUK YANG TERAKHIR', mandatory: true, avail: false, deskripsi: '' },
  { id: 8,  nama: 'ASLI SLIP GAJI/SURAT KETERANGAN PENGHASILAN SUAMI/ISTRI PEMOHON (UNTUK JOINT INCOME)', mandatory: false, avail: false, deskripsi: '' },
  { id: 9,  nama: 'FOTO COPY SURAT KETERANGAN MASA PENSIUN (APABILA JATUH TEMPO KREDIT MELEBIHI USIA 55 THN)', mandatory: false, avail: false, deskripsi: '' },
  { id: 10, nama: 'FOTOCOPY KARTU KELUARGA', mandatory: false, avail: false, deskripsi: '' },
  { id: 11, nama: 'ASLI BUKTI / KETERANGAN PENGHASILAN LAINNYA', mandatory: false, avail: false, deskripsi: '' },
  { id: 12, nama: 'SURAT KETERANGAN PENDAFTARAN TANAH', mandatory: true, avail: false, deskripsi: '' },
  { id: 13, nama: 'FOTOCOPY IMB SATUAN UNIT RUMAH / IMB INDUK YANG DILEGALISIR OLEH INSTANSI YG BERWENANG', mandatory: false, avail: false, deskripsi: '' },
  { id: 14, nama: 'FOTOCOPY KARTU TANDA PENDUDUK SUAMI/ISTRI PEMOHON', mandatory: true, avail: false, deskripsi: '' },
  { id: 15, nama: 'FOTOCOPY REKENING TABUNGAN 3 BULAN TERAKHIR SUAMI/ISTRI (UNTUK JOIN INCOME)', mandatory: false, avail: false, deskripsi: '' },
  { id: 16, nama: 'SURAT IJIN PRINSIP MEMBANGUN (APABILA IMB DALAM PROSES)', mandatory: false, avail: false, deskripsi: '' },
  { id: 17, nama: 'ASLI SURAT PENAWARAN DARI DEVR. OPMS ATAU PENJUAL', mandatory: true, avail: false, deskripsi: '' },
  { id: 18, nama: 'FOTO COPY SURAT KETERANGAN MASA KERJA DI TEMPAT BEKERJA SEBELUMNYA (UNTUK MASA KERJA < 2 THN)', mandatory: false, avail: false, deskripsi: '' },
  { id: 19, nama: 'FOTOCOPY NOMOR POKOK WAJIB PAJAK PERORANGAN', mandatory: false, avail: false, deskripsi: '' },
];

export interface DtboProspectRecord {
  id: string;
  noProspek: string;
  noAplikasi?: string;
  nama: string;
  tglLahir: string;
  ktp: string;
  tglDokumen: string;
  program: string;
  produk: string;
  salesInitial: string;
}

interface DtboWorkspaceProps {
  onNavigateToDuplicateCheck: (prospect: any) => void;
  onNavigateHome?: () => void;
}

export const DtboWorkspace: React.FC<DtboWorkspaceProps> = ({
  onNavigateToDuplicateCheck,
  onNavigateHome,
}) => {
  const { user, logout } = useAuth();

  // Screen: 'list' (Gambar 2) | 'detail' (Gambar 3 & 4)
  const [screen, setScreen] = useState<'list' | 'detail'>('list');
  const [selectedProspect, setSelectedProspect] = useState<DtboProspectRecord | null>(null);

  // Search Filters (Gambar 2)
  const [filterNama, setFilterNama] = useState('');
  const [filterNoProspek, setFilterNoProspek] = useState('');
  const [filterKtp, setFilterKtp] = useState('');
  const [filterTglLahir, setFilterTglLahir] = useState('');

  // Daftar prospek
  const [prospects, setProspects] = useState<DtboProspectRecord[]>([]);

  // State untuk Detail (Gambar 3 & 4)
  const [makers, setMakers] = useState<DtboDocumentMaker[]>([]);
  const [selectedMakerIndex, setSelectedMakerIndex] = useState<number>(0);
  const [documents, setDocuments] = useState<DtboDocItem[]>(OFFICIAL_DTBO_DOCUMENTS);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Muat data dari localStorage (hasil kiriman dari Initial Data Entry)
  const loadProspectsData = () => {
    const combined: DtboProspectRecord[] = [];

    // 1. Baca dari bni_data_entry_applications (hasil klik Simpan & Kirim ke Processing di IDE)
    try {
      const apps = storage.getJSON<any[]>(STORAGE_KEYS.DE_APPLICATIONS);
      if (apps && Array.isArray(apps)) {
        apps.forEach((app: any) => {
          combined.push({
            id: app.id || app.noAplikasi || app.noProspek || '',
            noProspek: app.noProspek || '',
            noAplikasi: app.noAplikasi || '',
            nama: app.namaDebitur || app.nama || '',
            tglLahir: app.tglLahir || '',
            ktp: app.ktp || '',
            tglDokumen: app.tglMasuk || '',
            program: app.kodeProgram || '',
            produk: app.produk || app.fasilitas || '',
            salesInitial: app.salesName || '',
          });
        });
      }
    } catch (e) {
      console.error('Error loading bni_data_entry_applications:', e);
    }

    // 2. Baca dari bni_ide_prospects (jika ada data prospek baru)
    try {
      const s = storage.retrieve(STORAGE_KEYS.IDE_PROSPECTS);
      if (s) {
        const ideList = JSON.parse(s);
        ideList.forEach((p: any) => {
          if (!combined.some(c => c.noProspek === p.noProspek)) {
            combined.push({
              id: `ide-${p.noProspek}`,
              noProspek: p.noProspek,
              noAplikasi: `APL-046-${p.noProspek.slice(-6)}`,
              nama: p.nama || 'DEBITUR IDE',
              tglLahir: '16-10-1990',
              ktp: p.ktp || '3201019010160002',
              tglDokumen: new Date().toLocaleDateString('id-ID'),
              program: 'BNI Griya Swadana',
              produk: p.fasilitas || 'BNI GRIYA',
              salesInitial: p.referal || 'SURYA HARJAYA - SC70629',
            });
          }
        });
      }
    } catch (e) {}

    setProspects(combined);
  };

  useEffect(() => {
    loadProspectsData();
    dataEntryService.syncWithBackend().then(() => loadProspectsData());
    window.addEventListener('storage', loadProspectsData);
    return () => window.removeEventListener('storage', loadProspectsData);
  }, []);

  // Filter daftar prospek
  const filteredProspects = prospects.filter(p => {
    if (filterNama.trim() && !p.nama.toLowerCase().includes(filterNama.trim().toLowerCase())) return false;
    if (filterNoProspek.trim() && !p.noProspek.toLowerCase().includes(filterNoProspek.trim().toLowerCase())) return false;
    if (filterKtp.trim() && !p.ktp.includes(filterKtp.trim())) return false;
    return true;
  });

  // Saat klik "Lihat" dari salah satu baris di tabel (Gambar 2 -> Gambar 3)
  const handleOpenDetail = (p: DtboProspectRecord) => {
    setSelectedProspect(p);

    // Ambil riwayat checklist tersimpan untuk prospek ini jika pernah disimpan
    const storageKey = `bni_dtbo_record_${p.noProspek}`;
    let savedData: any = null;
    try {
      const s = localStorage.getItem(storageKey);
      if (s) savedData = JSON.parse(s);
    } catch {}

    const now = new Date();
    const timeStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}.${String(now.getMinutes()).padStart(2,'0')}.${String(now.getSeconds()).padStart(2,'0')}`;

    if (savedData && savedData.makers && savedData.makers.length > 0) {
      setMakers(savedData.makers);
      setSelectedMakerIndex(savedData.selectedMakerIndex || 0);
      setDocuments(savedData.documents || OFFICIAL_DTBO_DOCUMENTS);
      setIsSaved(Boolean(savedData.isSaved));
    } else {
      // Row 1 awal: nama sales yang menginput data tersebut di initial data entry
      const initialSales = p.salesInitial || 'BOY HASBIBULLAH';
      const initialDate = p.tglDokumen ? `${p.tglDokumen} 13.48.24` : timeStr;

      setMakers([
        {
          id: 'maker-1',
          tanggal: initialDate,
          pembuat: initialSales,
        },
      ]);
      setSelectedMakerIndex(0);
      setDocuments(OFFICIAL_DTBO_DOCUMENTS.map(d => ({ ...d, avail: false, deskripsi: '' })));
      setIsSaved(false);
    }

    setScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Saat klik "Append": Ditake-over dengan sales/petugas yang baru
  const handleAppendMaker = () => {
    const now = new Date();
    const timeStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}.${String(now.getMinutes()).padStart(2,'0')}.${String(now.getSeconds()).padStart(2,'0')}`;

    // Nama sales baru yang mengambil alih (bisa dari akun login atau default 'YULIA DWI CAHYA')
    const newOfficerName = user?.name ? user.name.toUpperCase() : 'YULIA DWI CAHYA';

    const newMakerItem: DtboDocumentMaker = {
      id: `maker-${makers.length + 1}`,
      tanggal: timeStr,
      pembuat: newOfficerName,
    };

    const updatedMakers = [...makers, newMakerItem];
    setMakers(updatedMakers);
    // Pindahkan radio ke baris kedua / baris baru
    setSelectedMakerIndex(updatedMakers.length - 1);
    showToast(`Dokumen berhasil di-append oleh ${newOfficerName}. Silakan centang dokumen yang mandatory.`);
  };

  // Toggle checklist checkbox
  const handleToggleDoc = (docId: number) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, avail: !d.avail } : d))
    );
  };

  // Ubah deskripsi dokumen
  const handleDescChange = (docId: number, desc: string) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, deskripsi: desc } : d))
    );
  };

  // Klik "Simpan": Checklist berubah dari checkbox menjadi ikon centang/silang (Gambar 4)
  const handleSaveChecklist = () => {
    if (!selectedProspect) return;

    setIsSaved(true);

    const storageKey = `bni_dtbo_record_${selectedProspect.noProspek}`;
    const payload = {
      noProspek: selectedProspect.noProspek,
      makers,
      selectedMakerIndex,
      documents,
      isSaved: true,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.error(e);
    }

    showToast('Data checklist DTBO berhasil disimpan! Tampilan checklist kini terkunci.');
  };

  // Klik "Update Status": Data berpindah ke Duplicate Checking
  const handleUpdateStatus = () => {
    if (!selectedProspect) return;

    // Pastikan dokumen mandatory telah dicentang
    const mandatoryMissing = documents.filter(d => d.mandatory && !d.avail);
    if (mandatoryMissing.length > 0) {
      const confirmContinue = window.confirm(
        `Perhatian: Ada ${mandatoryMissing.length} dokumen MANDATORY yang belum dicentang (Avail = Tidak).\n\nApakah Anda tetap ingin memvalidasi dan memindahkan berkas ke Duplicate Checking?`
      );
      if (!confirmContinue) return;
    }

    // Update status di localStorage bni_data_entry_applications & bni_ide_prospects
    try {
      const s = storage.retrieve(STORAGE_KEYS.DE_APPLICATIONS);
      if (s) {
        let apps = JSON.parse(s);
        apps = apps.map((app: any) =>
          app.noProspek === selectedProspect.noProspek
            ? { ...app, statusDtbo: 'SELESAI', status: 'In Progress DE', stage: 'Duplicate Checking' }
            : app
        );
        storage.setJSON(STORAGE_KEYS.DE_APPLICATIONS, apps);
      }
    } catch {}

    showToast(`Status DTBO berhasil diperbarui! Berkas ${selectedProspect.nama} (${selectedProspect.noProspek}) dipindahkan ke Duplicate Checking.`);

    // Alihkan ke Duplicate Checking dengan data debitur ini
    setTimeout(() => {
      onNavigateToDuplicateCheck({
        noProspek: selectedProspect.noProspek,
        nama: selectedProspect.nama,
        ktp: selectedProspect.ktp,
        noAplikasi: selectedProspect.noAplikasi,
      });
    }, 400);
  };

  const userCode = (user as any)?.userId || 'SC70583';
  const userName = user?.name ? user.name.toUpperCase() : 'BOY HASBIBULLAH (STAFF STA)';
  const userBranch = (user as any)?.branch || '046 - SERANG';

  return (
    <div className="w-full font-sans text-gray-800 space-y-4 animate-fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#005E5D] text-white px-5 py-3 rounded-xl shadow-xl border border-teal-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: DTBO UPDATE (LIST PAGE - SESUAI GAMBAR 2)
      ========================================================================= */}
      {screen === 'list' && (
        <div className="space-y-4 p-2 sm:p-4">
          {/* Top Title Bar Khas Gambar 2 */}
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#e8f5e9] text-[#005E5D] font-bold text-xs rounded border border-[#c8e6c9]">
                DTBO : Update
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onNavigateHome && (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Home className="h-3.5 w-3.5 text-[#005E5D]" />
                  <span>Menu Utama</span>
                </button>
              )}
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1 bg-[#E05A10] hover:bg-[#c94d0a] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Form Kriteria Pencarian (Sesuai Gambar 2) */}
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
                <label className="w-32 text-right pr-3 font-semibold text-gray-700">No. Prospek :</label>
                <input
                  type="text"
                  value={filterNoProspek}
                  onChange={(e) => setFilterNoProspek(e.target.value)}
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
                  onClick={() => loadProspectsData()}
                  className="px-6 py-1 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          {/* Tabel Daftar Prospek (Sesuai Gambar 2) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-2 text-center text-white text-xs font-bold uppercase tracking-wider">
              DAFTAR PROSPEK
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E05A10] text-white text-[11px] font-bold border-b border-orange-700">
                    <th className="px-3 py-2 border-r border-orange-600/50">No. Prospek</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Nama</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Tanggal Lahir</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">No. KTP</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Tanggal Dokumen</th>
                    <th className="px-3 py-2 text-center">Fungsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {filteredProspects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Tidak ada data prospek yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredProspects.map((item, idx) => (
                      <tr
                        key={item.id || item.noProspek}
                        className={`transition-colors hover:bg-teal-50/50 ${
                          idx % 2 === 1 ? 'bg-[#fffde7]/60' : 'bg-white'
                        }`}
                      >
                        <td className="px-3 py-2 font-mono text-gray-800 border-r border-gray-200">
                          {item.noProspek}
                        </td>
                        <td className="px-3 py-2 font-semibold text-gray-900 border-r border-gray-200">
                          {item.nama}
                        </td>
                        <td className="px-3 py-2 text-gray-600 border-r border-gray-200">
                          {item.tglLahir}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-700 border-r border-gray-200">
                          {item.ktp}
                        </td>
                        <td className="px-3 py-2 text-gray-600 border-r border-gray-200">
                          {item.tglDokumen}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="text-[#005E5D] hover:underline font-bold cursor-pointer"
                          >
                            Lihat
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-white px-4 py-2 text-[11px] text-gray-600 border-t border-gray-200 flex items-center justify-between">
              <span>Menampilkan {filteredProspects.length} data prospek</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#005E5D]">
                <span className="px-2 py-0.5 border border-[#005E5D] bg-teal-50 rounded">1</span>
                <span className="px-2 py-0.5 border border-gray-200 hover:bg-gray-50 rounded cursor-pointer">2</span>
                <span className="px-2 py-0.5 border border-gray-200 hover:bg-gray-50 rounded cursor-pointer">3</span>
                <span className="px-2 py-0.5 border border-gray-200 hover:bg-gray-50 rounded cursor-pointer">4</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DTBO DETAIL (SESUAI GAMBAR 3 & GAMBAR 4)
      ========================================================================= */}
      {screen === 'detail' && selectedProspect && (
        <div className="space-y-4 p-2 sm:p-4">
          {/* Top Title Bar Khas Gambar 3 */}
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#e8f5e9] text-[#005E5D] font-bold text-xs rounded border border-[#c8e6c9]">
                DTBO : Detail
              </span>
              <span className="text-xs text-gray-400 font-mono">|</span>
              <span className="text-xs font-semibold text-gray-700">
                Debitur: <strong className="text-gray-900">{selectedProspect.nama}</strong> ({selectedProspect.noProspek})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScreen('list')}
                className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                &larr; <span>Daftar DTBO</span>
              </button>
              {onNavigateHome && (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Home className="h-3.5 w-3.5 text-[#005E5D]" />
                  <span>Menu Utama</span>
                </button>
              )}
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1 bg-[#E05A10] hover:bg-[#c94d0a] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* 1. INFORMASI PELANGGAN (Sesuai Gambar 3) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-2 text-center text-white text-xs font-bold uppercase tracking-wider">
              INFORMASI PELANGGAN
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
              <div className="flex items-center">
                <span className="w-48 text-right pr-3 font-semibold text-gray-600 shrink-0">
                  No. Prospek / No. Aplikasi :
                </span>
                <span className="font-mono font-bold text-gray-900 truncate">
                  {selectedProspect.noProspek} {selectedProspect.noAplikasi ? `/ ${selectedProspect.noAplikasi}` : ''}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-40 text-right pr-3 font-semibold text-gray-600 shrink-0">
                  Program :
                </span>
                <span className="font-semibold text-gray-900">
                  {selectedProspect.program || 'BNI Balai DDSN Ngawi'}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-48 text-right pr-3 font-semibold text-gray-600 shrink-0">
                  Nama Calon Debitur :
                </span>
                <span className="font-bold text-[#005E5D] uppercase">
                  {selectedProspect.nama}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-40 text-right pr-3 font-semibold text-gray-600 shrink-0">
                  Produk :
                </span>
                <span className="font-semibold text-gray-900">
                  {selectedProspect.produk || 'FLPP'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. DAFTAR DOKUMEN (Pembuat History & Tombol Append - Sesuai Gambar 3) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-2 text-center text-white text-xs font-bold uppercase tracking-wider">
              DAFTAR DOKUMEN
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E05A10] text-white text-[11px] font-bold border-b border-orange-700">
                    <th className="w-12 px-3 py-2 text-center border-r border-orange-600/50">Pilih</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Tanggal Dokumen</th>
                    <th className="px-3 py-2">Pembuat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {makers.map((m, idx) => (
                    <tr
                      key={m.id || idx}
                      className={selectedMakerIndex === idx ? 'bg-teal-50/60 font-semibold' : 'bg-white'}
                    >
                      <td className="px-3 py-2 text-center border-r border-gray-200">
                        <input
                          type="radio"
                          name="selectedMaker"
                          checked={selectedMakerIndex === idx}
                          onChange={() => setSelectedMakerIndex(idx)}
                          className="text-[#007B7A] focus:ring-[#007B7A] cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2 font-mono text-gray-700 border-r border-gray-200">
                        {m.tanggal}
                      </td>
                      <td className="px-3 py-2 text-gray-900 font-bold uppercase">
                        {m.pembuat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Tombol Append (Khas Gambar 3: Ditake-over oleh sales/petugas baru) */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-center">
              <button
                type="button"
                onClick={handleAppendMaker}
                className="px-8 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5 text-amber-400" />
                <span>Append</span>
              </button>
            </div>
          </div>

          {/* 3. INFORMASI DOKUMEN (Checklist 19 Dokumen - Gambar 3 & 4) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-2 text-center text-white text-xs font-bold uppercase tracking-wider">
              INFORMASI DOKUMEN
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E05A10] text-white text-[11px] font-bold border-b border-orange-700">
                    <th className="w-10 px-2.5 py-2 text-center border-r border-orange-600/50">No</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Dokumen</th>
                    <th className="w-24 px-3 py-2 text-center border-r border-orange-600/50">Mandatory</th>
                    <th className="w-20 px-3 py-2 text-center border-r border-orange-600/50">Avail.</th>
                    <th className="px-3 py-2">Deskripsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {documents.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      className={`transition-colors hover:bg-teal-50/40 ${
                        idx % 2 === 1 ? 'bg-[#fffde7]/60' : 'bg-white'
                      }`}
                    >
                      <td className="px-2.5 py-1.5 text-center text-gray-500 border-r border-gray-200 font-mono">
                        {doc.id}
                      </td>
                      <td className="px-3 py-1.5 text-gray-800 border-r border-gray-200 leading-tight">
                        <span className={doc.mandatory ? 'font-bold text-gray-900' : ''}>
                          {doc.nama}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-center border-r border-gray-200 font-semibold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10.5px] ${
                            doc.mandatory ? 'text-red-700 font-bold' : 'text-gray-500'
                          }`}
                        >
                          {doc.mandatory ? 'Ya' : 'Tidak'}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-center border-r border-gray-200">
                        {/* Jika BELUM klik simpan: Tampilkan Checkbox (Sesuai Gambar 3) */}
                        {!isSaved ? (
                          <input
                            type="checkbox"
                            checked={doc.avail}
                            onChange={() => handleToggleDoc(doc.id)}
                            className="h-4 w-4 text-[#007B7A] rounded border-gray-300 focus:ring-[#007B7A] cursor-pointer"
                          />
                        ) : (
                          /* Jika SUDAH klik simpan: Tampilkan Ikon Checklist Centang / Silang (Sesuai Gambar 4) */
                          doc.avail ? (
                            <span className="inline-flex items-center justify-center font-bold text-emerald-600 text-sm">
                              &#10004;
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center font-bold text-red-600 text-sm">
                              &#10006;
                            </span>
                          )
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={doc.deskripsi}
                          disabled={isSaved}
                          onChange={(e) => handleDescChange(doc.id, e.target.value)}
                          placeholder={isSaved ? '' : 'Catatan nomor/dokumen...'}
                          className={`w-full px-2 py-0.5 text-xs rounded border border-gray-300 ${
                            isSaved ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800'
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tombol Aksi Bawah (Simpan, Kembali ke Cabang, Update Status - Sesuai Gambar 3 & 4) */}
            <div className="bg-gray-50 p-3 border-t border-gray-200 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleSaveChecklist}
                className="px-8 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Simpan
              </button>

              {isSaved && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSaved(false);
                    showToast('Mode ubah checklist aktif. Silakan sesuaikan kembali centang dokumen.');
                  }}
                  className="px-6 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  Ubah Checklist
                </button>
              )}

              <button
                type="button"
                onClick={() => setScreen('list')}
                className="px-8 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Kembali ke Cabang
              </button>

              <button
                type="button"
                onClick={handleUpdateStatus}
                className="px-8 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Update Status</span>
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
  );
};

export default DtboWorkspace;

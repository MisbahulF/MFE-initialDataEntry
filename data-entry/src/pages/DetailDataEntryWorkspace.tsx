import React, { useState, useEffect } from 'react';
import { useAuth, storage, STORAGE_KEYS, Badge, getApiBaseUrl } from '@template/shared';
const API_BASE = getApiBaseUrl();
import {
  Home,
  LogOut,
  CheckCircle2,
  CornerDownLeft,
  Search,
} from 'lucide-react';

export interface DataEntryCandidateRecord {
  noAplikasi: string;
  noProspek?: string;
  nama: string;
  tglLahir: string;
  noIdentitas: string;
  produk?: string;
  cabang?: string;
  sales?: string;
  noRekPinjaman?: string;
  noRekAfiliasi?: string;
  marketingOrgType?: string;
  cso?: string;
  cabangPemroses?: string;
  mailingRoom?: string;
  regionalSales?: string;
  polaPemasaran?: string;
  polaKerjasama?: string;
  kategoriPerusahaan?: string;
  agunanKreditMacet?: string;
  tipeNasabah?: string;
  supervisor?: string;
  program?: string;
  channels?: string;
  media?: string;
  tglPenandatangananDay?: string;
  tglPenandatangananMonth?: string;
  tglPenandatangananYear?: string;
  tglTerima?: string;
  hubunganBni?: string;
  cabangPembukuan?: string;
  asalPameran?: string;
  skema?: string;
  subSkema?: string;
  jenisPendapatan?: string;
  programKhusus?: string;
}

interface DetailDataEntryWorkspaceProps {
  onNavigateHome?: () => void;
}

export const DetailDataEntryWorkspace: React.FC<DetailDataEntryWorkspaceProps> = ({
  onNavigateHome,
}) => {
  const { logout } = useAuth();

  // Screen: 'list' (Gambar 1) | 'detail' (Gambar 2)
  const [screen, setScreen] = useState<'list' | 'detail'>('list');
  const [candidates, setCandidates] = useState<DataEntryCandidateRecord[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<DataEntryCandidateRecord | null>(null);

  // Active Submenu Tab in Detail View (Gambar 2)
  const [activeTab, setActiveTab] = useState<string>('Halaman Utama');

  // Search Filters (Gambar 1)
  const [filterNoApp, setFilterNoApp] = useState('');
  const [filterNama, setFilterNama] = useState('');
  const [filterNoIdentitas, setFilterNoIdentitas] = useState('');
  const [filterTglLahir, setFilterTglLahir] = useState('');

  // Form Fields State (Gambar 2)
  const [formNoRekPinjaman, setFormNoRekPinjaman] = useState('');
  const [formNoRekAfiliasi, setFormNoRekAfiliasi] = useState('23723812313');
  const [formMarketingOrg, setFormMarketingOrg] = useState('000002101');
  const [formCso, setFormCso] = useState('');
  const [formCabang, setFormCabang] = useState('SERANG');
  const [formCabangPemroses, setFormCabangPemroses] = useState('KC SERANG');
  const [formMailingRoom, setFormMailingRoom] = useState('E. HUSNIA');
  const [formRegionalSales, setFormRegionalSales] = useState('SERANG STA');
  const [formPolaPemasaran, setFormPolaPemasaran] = useState('');
  const [formPolaKerjasama, setFormPolaKerjasama] = useState('Pola Kerjasama');
  const [formKategoriPerusahaan, setFormKategoriPerusahaan] = useState('PTN');
  const [formAgunanKreditMacet, setFormAgunanKreditMacet] = useState('Tidak');
  const [formTipeNasabah, setFormTipeNasabah] = useState('Non Nasabah');

  // Form Fields Kanan (Gambar 2)
  const [formNamaSales, setFormNamaSales] = useState('E. HUSNIA');
  const [formSupervisor, setFormSupervisor] = useState('');
  const [formProgram, setFormProgram] = useState('REGULER');
  const [formProduk, setFormProduk] = useState('GRIYA IDAMAN TAKEOVER RUMAH TINGGAL');
  const [formChannels, setFormChannels] = useState('Branch');
  const [formMedia, setFormMedia] = useState('');
  const [formTglSignDay, setFormTglSignDay] = useState('18');
  const [formTglSignMonth, setFormTglSignMonth] = useState('Agustus');
  const [formTglSignYear, setFormTglSignYear] = useState('2026');
  const [formTglTerima, setFormTglTerima] = useState('18-Agu-2026');
  const [formHubunganBni, setFormHubunganBni] = useState('1');
  const [formCabangPembukuan, setFormCabangPembukuan] = useState('SERANG');
  const [formAsalPameran, setFormAsalPameran] = useState('');
  const [formSkema, setFormSkema] = useState('');
  const [formSubSkema, setFormSubSkema] = useState('');
  const [formJenisPendapatan, setFormJenisPendapatan] = useState('');
  const [formProgramKhusus, setFormProgramKhusus] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Muat data dari localStorage (hasil kiriman dari Duplicate Checking & DTBO) digabung dengan Seed
  const loadCandidatesData = () => {
    const combined: DataEntryCandidateRecord[] = [];

    // 1. Ambil dari bni_data_entry_applications (hasil dari Duplicate Checking / IDE / DTBO)
    try {
      const s = storage.retrieve(STORAGE_KEYS.DE_APPLICATIONS);
      if (s) {
        const apps = JSON.parse(s);
        apps.forEach((app: any) => {
          combined.push({
            noAplikasi: app.noAplikasi || '',
            noProspek: app.noProspek || '',
            nama: app.namaDebitur || app.nama || '',
            tglLahir: app.tglLahir || '',
            noIdentitas: app.ktp || '',
            produk: app.produk || app.fasilitas || '',
            cabang: app.cabang || '',
            sales: app.salesName || '',
            noRekPinjaman: app.noRekeningPinjaman || '',
            noRekAfiliasi: app.noRekeningAfiliasi || '',
            marketingOrgType: app.marketingOrgType || '',
            cso: app.csoOfficer || '',
            cabangPemroses: app.cabangPemroses || '',
            mailingRoom: app.mailingRoomUser || '',
            regionalSales: app.regionalSales || '',
            polaPemasaran: app.polaPemasaran || '',
            polaKerjasama: app.polaKerjasama || '',
            kategoriPerusahaan: app.kategoriPerusahaan || '',
            agunanKreditMacet: app.agunanKreditMacet || '',
            tipeNasabah: app.tipeNasabah || '',
            supervisor: app.namaSupervisor || '',
            program: app.kodeProgram || '',
            channels: app.channel || '',
            media: app.media || '',
            tglPenandatangananDay: app.tglPenandatangananDay || '',
            tglPenandatangananMonth: app.tglPenandatangananMonth || '',
            tglPenandatangananYear: app.tglPenandatangananYear || '',
            tglTerima: app.tglTerimaAplikasi || '',
            hubunganBni: app.hubunganBni || '',
            cabangPembukuan: app.cabangPembukuan || '',
            asalPameran: app.asalPameran || '',
            skema: app.skema || '',
            subSkema: app.subSkema || '',
            jenisPendapatan: app.jenisPendapatan || '',
            programKhusus: app.programKhusus || '',
          });
        });
      }
    } catch (e) {
      console.error(e);
    }

    setCandidates(combined);
  };

  useEffect(() => {
    loadCandidatesData();
    window.addEventListener('storage', loadCandidatesData);
    return () => window.removeEventListener('storage', loadCandidatesData);
  }, []);

  // Handle klik "Detail" pada tabel (Gambar 1 -> Gambar 2)
  const handleOpenDetail = (cand: DataEntryCandidateRecord) => {
    setSelectedCandidate(cand);
    setActiveTab('Halaman Utama');

    setFormNoRekPinjaman(cand.noRekPinjaman || '');
    setFormNoRekAfiliasi(cand.noRekAfiliasi || '23723812313');
    setFormMarketingOrg(cand.marketingOrgType || '000002101');
    setFormCso(cand.cso || '');
    setFormCabang(cand.cabang || 'SERANG');
    setFormCabangPemroses(cand.cabangPemroses || 'KC SERANG');
    setFormMailingRoom(cand.mailingRoom || 'E. HUSNIA');
    setFormRegionalSales(cand.regionalSales || 'SERANG STA');
    setFormPolaPemasaran(cand.polaPemasaran || '');
    setFormPolaKerjasama(cand.polaKerjasama || 'Pola Kerjasama');
    setFormKategoriPerusahaan(cand.kategoriPerusahaan || 'PTN');
    setFormAgunanKreditMacet(cand.agunanKreditMacet || 'Tidak');
    setFormTipeNasabah(cand.tipeNasabah || 'Non Nasabah');

    setFormNamaSales(cand.sales || 'E. HUSNIA');
    setFormSupervisor(cand.supervisor || '');
    setFormProgram(cand.program || 'REGULER');
    setFormProduk(cand.produk || 'GRIYA IDAMAN TAKEOVER RUMAH TINGGAL');
    setFormChannels(cand.channels || 'Branch');
    setFormMedia(cand.media || '');
    setFormTglSignDay(cand.tglPenandatangananDay || '18');
    setFormTglSignMonth(cand.tglPenandatangananMonth || 'Agustus');
    setFormTglSignYear(cand.tglPenandatangananYear || '2026');
    setFormTglTerima(cand.tglTerima || '18-Agu-2026');
    setFormHubunganBni(cand.hubunganBni || '1');
    setFormCabangPembukuan(cand.cabangPembukuan || 'SERANG');
    setFormAsalPameran(cand.asalPameran || '');
    setFormSkema(cand.skema || '');
    setFormSubSkema(cand.subSkema || '');
    setFormJenisPendapatan(cand.jenisPendapatan || '');
    setFormProgramKhusus(cand.programKhusus || '');

    setScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simpan data di Halaman Utama (Gambar 2)
  const handleSaveDetail = () => {
    if (!selectedCandidate) return;

    try {
      const s = storage.retrieve(STORAGE_KEYS.DE_APPLICATIONS);
      let apps = s ? JSON.parse(s) : [];
      const foundIdx = apps.findIndex((app: any) =>
        app.noAplikasi === selectedCandidate.noAplikasi ||
        app.noProspek === selectedCandidate.noProspek
      );

      const updatedPayload = {
        noRekeningPinjaman: formNoRekPinjaman,
        noRekeningAfiliasi: formNoRekAfiliasi,
        marketingOrgType: formMarketingOrg,
        csoOfficer: formCso,
        cabang: formCabang,
        cabangPemroses: formCabangPemroses,
        mailingRoomUser: formMailingRoom,
        regionalSales: formRegionalSales,
        polaPemasaran: formPolaPemasaran,
        polaKerjasama: formPolaKerjasama,
        kategoriPerusahaan: formKategoriPerusahaan,
        agunanKreditMacet: formAgunanKreditMacet,
        tipeNasabah: formTipeNasabah,
        salesName: formNamaSales,
        namaSupervisor: formSupervisor,
        kodeProgram: formProgram,
        produk: formProduk,
        channel: formChannels,
        media: formMedia,
        tglTerimaAplikasi: formTglTerima,
        hubunganBni: formHubunganBni,
        cabangPembukuan: formCabangPembukuan,
        asalPameran: formAsalPameran,
        skema: formSkema,
        subSkema: formSubSkema,
        jenisPendapatan: formJenisPendapatan,
        programKhusus: formProgramKhusus,
        status: 'Data Entry Lengkap',
        updatedAt: new Date().toISOString(),
      };

      if (foundIdx !== -1) {
        apps[foundIdx] = { ...apps[foundIdx], ...updatedPayload };
      } else {
        apps.unshift({
          id: `DE-${Date.now()}`,
          noAplikasi: selectedCandidate.noAplikasi,
          noProspek: selectedCandidate.noProspek || '18082026046W0011',
          namaDebitur: selectedCandidate.nama,
          ktp: selectedCandidate.noIdentitas,
          ...updatedPayload,
        });
      }

      storage.setJSON(STORAGE_KEYS.DE_APPLICATIONS, apps);
      window.dispatchEvent(new Event('storage'));

      // Persist to backend SQLite
      const savedRecord = foundIdx !== -1 ? apps[foundIdx] : apps[0];
      if (savedRecord) {
        fetch(`${API_BASE}/DataEntry/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            noAplikasi: savedRecord.noAplikasi,
            noProspek: savedRecord.noProspek,
            namaDebitur: savedRecord.namaDebitur || savedRecord.nama,
            ktp: savedRecord.ktp || savedRecord.noIdentitas,
            produk: savedRecord.produk || 'BNI GRIYA',
            cabang: savedRecord.cabang || '046 - SERANG',
            status: savedRecord.status || 'Data Entry Lengkap',
            data: savedRecord,
          }),
        }).catch(err => console.warn('Save to backend failed:', err));
      }

      showToast('Data Halaman Utama aplikasi berhasil disimpan!');
    } catch (e) {
      console.error(e);
      showToast('Gagal menyimpan data.');
    }
  };

  // Filter daftar data entry (Gambar 1)
  const filteredCandidates = candidates.filter(c => {
    if (filterNoApp.trim() && !c.noAplikasi.toLowerCase().includes(filterNoApp.trim().toLowerCase())) return false;
    if (filterNama.trim() && !c.nama.toLowerCase().includes(filterNama.trim().toLowerCase())) return false;
    if (filterNoIdentitas.trim() && !c.noIdentitas.includes(filterNoIdentitas.trim())) return false;
    return true;
  });

  const SUBMENU_TABS = [
    'Halaman Utama',
    'Informasi Pelanggan',
    'Informasi Pekerjaan',
    'Informasi Pasangan',
    'Informasi Pekerjaan Pasangan',
    'Kontak Emergency',
    'Aset',
    'Kartu Kredit',
    'Pinjaman Lain',
    'Obyek Pembiayaan',
    'Struktur Kredit',
    'Penjamin',
    'Memo',
    'BNI Instan',
  ];

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
          VIEW 1: DAFTAR DATA ENTRY (SESUAI GAMBAR 1)
      ========================================================================= */}
      {screen === 'list' && (
        <div className="space-y-4">
          {/* Top Title Bar Khas Gambar 1 */}
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#e8f5e9] text-[#005E5D] font-bold text-xs rounded border border-[#c8e6c9]">
                Daftar Data Entry
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateHome?.()}
                className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CornerDownLeft className="h-3.5 w-3.5 text-blue-600" />
                <span>Kembali</span>
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

          {/* Form Kriteria Pencarian (Sesuai Gambar 1) */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-2 text-center text-white text-xs font-bold uppercase tracking-wider">
              KRETERIA PENCARIAN
            </div>
            <div className="p-5 space-y-2.5 text-xs">
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
                <label className="w-32 text-right pr-3 font-semibold text-gray-700">Nama :</label>
                <input
                  type="text"
                  value={filterNama}
                  onChange={(e) => setFilterNama(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs focus:outline-none focus:ring-1 focus:ring-[#007B7A]"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-3 font-semibold text-gray-700">No. Identitas :</label>
                <input
                  type="text"
                  value={filterNoIdentitas}
                  onChange={(e) => setFilterNoIdentitas(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs focus:outline-none focus:ring-1 focus:ring-[#007B7A]"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-3 font-semibold text-gray-700">Tanggal Lahir :</label>
                <div className="flex-1 flex gap-2">
                  <select
                    className="px-2.5 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs focus:outline-none focus:ring-1 focus:ring-[#007B7A]"
                  >
                    <option value="">--Select--</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                  </select>
                  <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    value={filterTglLahir}
                    onChange={(e) => setFilterTglLahir(e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded border border-gray-300 bg-[#fffef7] text-xs focus:outline-none focus:ring-1 focus:ring-[#007B7A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-red-600 font-semibold italic flex items-center gap-1">
                  Klik untuk mencari data &rarr;
                </span>
                <button
                  type="button"
                  onClick={() => loadCandidatesData()}
                  className="px-6 py-1 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          {/* Tabel DAFTAR DATA ENTRY (Sesuai Gambar 1) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-2 text-center text-white text-xs font-bold uppercase tracking-wider">
              DAFTAR DATA ENTRY
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E05A10] text-white text-[11px] font-bold border-b border-orange-700">
                    <th className="px-3 py-2 border-r border-orange-600/50">No. Aplikasi</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Nama</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">Tanggal Lahir</th>
                    <th className="px-3 py-2 border-r border-orange-600/50">No. Identitas</th>
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
                        {cand.noIdentitas || '-'}
                      </td>
                      <td className="px-3 py-2 text-center font-bold">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(cand)}
                          className="text-blue-700 hover:text-blue-900 hover:underline cursor-pointer text-xs"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 italic">
                        Tidak ada berkas data entry yang sesuai kriteria pencarian.
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
                Menampilkan {filteredCandidates.length} dari {candidates.length} berkas data entry
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DETAIL DATA ENTRY - HALAMAN UTAMA (SESUAI GAMBAR 2)
      ========================================================================= */}
      {screen === 'detail' && selectedCandidate && (
        <div className="space-y-4">
          {/* Top Title Bar Khas Gambar 2 */}
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#e8f5e9] text-[#005E5D] font-bold text-xs rounded border border-[#c8e6c9]">
                Data Entry : {activeTab}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScreen('list')}
                className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CornerDownLeft className="h-3.5 w-3.5 text-blue-600" />
                <span>Kembali</span>
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

          {/* Submenu Tabs Khas Gambar 2 */}
          <div className="bg-white border-b border-gray-300 px-3 py-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
            {SUBMENU_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab !== 'Halaman Utama') {
                      showToast(`Modul tab "${tab}" dipilih.`);
                    }
                  }}
                  className={`cursor-pointer transition-colors ${
                    isActive
                      ? 'text-[#E05A10] font-bold underline decoration-2 underline-offset-4'
                      : 'text-blue-700 hover:text-blue-900 hover:underline'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Card: INFORMASI APLIKASI (Sesuai Gambar 2) */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-xs">
            <div className="bg-[#007B7A] px-4 py-1.5 text-center text-white text-xs font-bold uppercase tracking-wider">
              INFORMASI APLIKASI
            </div>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2 text-xs font-medium divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              {/* Kolom Kiri (16 baris sesuai Gambar 2) */}
              <div className="space-y-1.5 pr-0 lg:pr-4">
                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">No. Prospek:</span>
                  <span className="flex-1 font-mono font-bold text-gray-900">{selectedCandidate.noProspek || '18082026046W0011'}</span>
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">No. Aplikasi:</span>
                  <span className="flex-1 font-mono font-bold text-gray-900">{selectedCandidate.noAplikasi}</span>
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Nama Debitur:</span>
                  <span className="flex-1 font-bold text-gray-900 uppercase">{selectedCandidate.nama}</span>
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">No. Rek Pinjaman:</span>
                  <input
                    type="text"
                    value={formNoRekPinjaman}
                    onChange={(e) => setFormNoRekPinjaman(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs font-mono"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">No. Rek Afiliasi:</span>
                  <input
                    type="text"
                    value={formNoRekAfiliasi}
                    onChange={(e) => setFormNoRekAfiliasi(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs font-mono"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Marketing Org. Type:</span>
                  <input
                    type="text"
                    value={formMarketingOrg}
                    onChange={(e) => setFormMarketingOrg(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">CSO:</span>
                  <input
                    type="text"
                    value={formCso}
                    onChange={(e) => setFormCso(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Cabang:</span>
                  <input
                    type="text"
                    value={formCabang}
                    onChange={(e) => setFormCabang(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Cabang Pemroses:</span>
                  <input
                    type="text"
                    value={formCabangPemroses}
                    onChange={(e) => setFormCabangPemroses(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Mailing Room:</span>
                  <input
                    type="text"
                    value={formMailingRoom}
                    onChange={(e) => setFormMailingRoom(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Regional Sales / Agensi:</span>
                  <input
                    type="text"
                    value={formRegionalSales}
                    onChange={(e) => setFormRegionalSales(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Pola Pemasaran:</span>
                  <input
                    type="text"
                    value={formPolaPemasaran}
                    onChange={(e) => setFormPolaPemasaran(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Pola Kerjasama:</span>
                  <input
                    type="text"
                    value={formPolaKerjasama}
                    onChange={(e) => setFormPolaKerjasama(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Kategori Perusahaan:</span>
                  <input
                    type="text"
                    value={formKategoriPerusahaan}
                    onChange={(e) => setFormKategoriPerusahaan(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Agunan Kredit Macet:</span>
                  <input
                    type="text"
                    value={formAgunanKreditMacet}
                    onChange={(e) => setFormAgunanKreditMacet(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Tipe Nasabah:</span>
                  <input
                    type="text"
                    value={formTipeNasabah}
                    onChange={(e) => setFormTipeNasabah(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>
              </div>

              {/* Kolom Kanan (15 baris sesuai Gambar 2) */}
              <div className="space-y-1.5 pl-0 lg:pl-4 pt-2 lg:pt-0">
                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Nama Sales:</span>
                  <input
                    type="text"
                    value={formNamaSales}
                    onChange={(e) => setFormNamaSales(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs font-bold"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Nama Supervisor:</span>
                  <input
                    type="text"
                    value={formSupervisor}
                    onChange={(e) => setFormSupervisor(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Program:</span>
                  <input
                    type="text"
                    value={formProgram}
                    onChange={(e) => setFormProgram(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs font-bold"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Produk:</span>
                  <input
                    type="text"
                    value={formProduk}
                    onChange={(e) => setFormProduk(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs font-bold text-gray-900"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Channels:</span>
                  <input
                    type="text"
                    value={formChannels}
                    onChange={(e) => setFormChannels(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Media:</span>
                  <input
                    type="text"
                    value={formMedia}
                    onChange={(e) => setFormMedia(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                {/* Tanggal Penandatanganan */}
                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Tanggal Penandatanganan:</span>
                  <div className="flex-1 flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={formTglSignDay}
                      onChange={(e) => setFormTglSignDay(e.target.value)}
                      className="w-12 px-2 py-0.5 rounded border border-gray-300 bg-[#fffef7] text-xs text-center"
                    />
                    <select
                      value={formTglSignMonth}
                      onChange={(e) => setFormTglSignMonth(e.target.value)}
                      className="px-2 py-0.5 rounded border border-gray-300 bg-[#fffef7] text-xs"
                    >
                      {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={formTglSignYear}
                      onChange={(e) => setFormTglSignYear(e.target.value)}
                      className="w-16 px-2 py-0.5 rounded border border-gray-300 bg-[#fffef7] text-xs text-center"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Tanggal Terima:</span>
                  <input
                    type="text"
                    value={formTglTerima}
                    onChange={(e) => setFormTglTerima(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs font-mono"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Hubungan dengan BNI:</span>
                  <input
                    type="text"
                    value={formHubunganBni}
                    onChange={(e) => setFormHubunganBni(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Cabang Pembukuan:</span>
                  <input
                    type="text"
                    value={formCabangPembukuan}
                    onChange={(e) => setFormCabangPembukuan(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Asal Pameran:</span>
                  <input
                    type="text"
                    value={formAsalPameran}
                    onChange={(e) => setFormAsalPameran(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Skema:</span>
                  <input
                    type="text"
                    value={formSkema}
                    onChange={(e) => setFormSkema(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Sub Skema:</span>
                  <input
                    type="text"
                    value={formSubSkema}
                    onChange={(e) => setFormSubSkema(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Jenis Pendapatan:</span>
                  <input
                    type="text"
                    value={formJenisPendapatan}
                    onChange={(e) => setFormJenisPendapatan(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-44 text-right pr-3 text-gray-700 font-semibold">Program Khusus / Event:</span>
                  <input
                    type="text"
                    value={formProgramKhusus}
                    onChange={(e) => setFormProgramKhusus(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-gray-300 rounded bg-[#fffef7] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan Khas Gambar 2 */}
            <div className="bg-gray-50 py-2.5 px-4 border-t border-gray-200 flex justify-center">
              <button
                type="button"
                onClick={handleSaveDetail}
                className="px-12 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded transition-colors cursor-pointer active:scale-95 shadow-xs"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailDataEntryWorkspace;

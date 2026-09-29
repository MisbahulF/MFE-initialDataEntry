import React, { useState } from 'react';
import { StickyNote, Plus, Printer, CheckCircle, FileText } from 'lucide-react';
import { TextareaField, useAuth } from '@template/shared';

export interface MemoSkdrProps {
  memoList: any[];
  setMemoList?: React.Dispatch<React.SetStateAction<any[]>>;
  skdrList: any[];
  setSkdrList?: React.Dispatch<React.SetStateAction<any[]>>;
  setSaveSuccess?: (msg: string | null) => void;
  onLanjut?: (e?: React.FormEvent) => void;
  formData?: any;
  cabangName?: string;
}

export const MemoSkdr: React.FC<MemoSkdrProps> = ({
  memoList = [],
  setMemoList,
  skdrList = [],
  setSkdrList,
  setSaveSuccess,
  onLanjut,
  formData,
  cabangName = 'KC JAKARTA PUSAT (001)',
}) => {
  const { user } = useAuth();
  const [newMemoText, setNewMemoText] = useState('');
  const [showAipPrintPreview, setShowAipPrintPreview] = useState(false);

  const currentUserLabel = user?.name
    ? `${user.userId || ''} (${user.name})`.trim()
    : 'Sales / Analis BNI';

  const handleAddMemo = () => {
    if (!newMemoText.trim()) return;
    const newM = {
      id: memoList.length + 1,
      tgl: new Date().toISOString().split('T')[0],
      user: currentUserLabel,
      text: newMemoText.trim(),
    };
    if (setMemoList) setMemoList([...memoList, newM]);
    setNewMemoText('');
    if (setSaveSuccess) {
      setSaveSuccess('Catatan memo berhasil ditambahkan.');
      setTimeout(() => setSaveSuccess(null), 2000);
    }
  };

  const handlePrintAIP = () => {
    setShowAipPrintPreview(true);
  };

  const namaDebitur = formData?.namaDebitur || formData?.namaDepan || 'Nasabah BNI';
  const noProspek = formData?.noProspek || 'IDE-2026-0001';
  const namaProduk = formData?.namaProduk || 'BNI GRIYA IDAMAN';
  const namaProgram = formData?.namaProgram || 'BNI Griya Reguler';
  const plafon = Number(formData?.nilaiPermohonan) || 850000000;
  const tenorTahun = formData?.jangkaWaktuTahun || 15;
  const unitCabang = formData?.cabang || cabangName;

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* 1. SEKSI CuBES: APPROVAL IN PRINCIPAL (ApprovalInPrincipal.aspx) */}
      <div className="bg-white border border-emerald-300 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-4 py-2.5 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-300" />
            <span>Persetujuan Secara Prinsip (Approval In Principal - AIP)</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">CuBES AIP Engine</span>
        </div>

        <div className="p-4 space-y-4 bg-emerald-50/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white p-3 rounded-lg border border-emerald-200">
            <div>
              <span className="text-gray-500 font-semibold">No. Prospek: </span>
              <span className="font-mono font-bold text-gray-900 text-sm">{noProspek}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold">Nama Pemohon: </span>
              <span className="font-bold text-gray-900">{namaDebitur}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold">Status Prinsip: </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                DISETUJUI SECARA PRINSIP
              </span>
            </div>
          </div>

          {/* DataGrid Fasilitas Pinjaman Yang Disetujui Secara Prinsip (CuBES: DatGrd) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#1e293b] text-white font-bold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-2.5 text-center w-12 border-r border-slate-700">No</th>
                    <th className="p-2.5 border-r border-slate-700">Fasilitas Pinjaman Disetujui Prinsipil</th>
                    <th className="p-2.5 text-right border-r border-slate-700">Plafon Maksimal</th>
                    <th className="p-2.5 text-center border-r border-slate-700">Tenor</th>
                    <th className="p-2.5 border-r border-slate-700">Program / Skema Bunga</th>
                    <th className="p-2.5 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  <tr className="hover:bg-emerald-50/40">
                    <td className="p-2.5 text-center font-mono font-bold border-r border-gray-200">1</td>
                    <td className="p-2.5 font-bold text-gray-900 border-r border-gray-200">
                      {namaProduk}
                      <div className="text-[10px] text-gray-500 font-normal">Kredit Konsumer Griya BNI</div>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-800 border-r border-gray-200">
                      Rp {plafon.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2.5 text-center border-r border-gray-200">{tenorTahun} Tahun</td>
                    <td className="p-2.5 border-r border-gray-200">
                      <span className="font-semibold text-gray-700">{namaProgram}</span>
                      <div className="text-[10px] text-gray-500">Fixed 1 Thn 1.79%, Floating SBDK</div>
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={handlePrintAIP}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                      >
                        <Printer className="h-3 w-3" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-2 text-xs text-gray-700">
            <span className="font-bold text-emerald-800">Instruksi Pemohon:</span>
            <span>Silahkan datang ke kantor cabang:</span>
            <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300 font-mono">
              {unitCabang}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. REFERAL MEMO (CuBES: Memo.aspx) */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xs">
          <StickyNote className="h-4 w-4 text-orange-300" />
          <span>Referal Memo &amp; Catatan Analis (Initial Data Entry)</span>
        </div>

        <div className="p-4 space-y-4 bg-[#f8fafb]">
          <div className="flex flex-col md:flex-row items-end gap-3 bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex-1 w-full">
              <TextareaField
                label="Tambah Catatan Memo Baru"
                value={newMemoText}
                onChange={(e) => setNewMemoText(e.target.value)}
                placeholder="Ketik catatan sales / analis mengenai aplikasi ini..."
                rows={2}
              />
            </div>
            <button
              type="button"
              onClick={handleAddMemo}
              className="px-5 py-2.5 bg-[#C2410C] hover:bg-[#D94E1B] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs text-xs shrink-0 mb-1 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Simpan Memo
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#d35400] text-white font-bold border-b border-[#b33e00]">
                  <tr>
                    <th className="p-2 text-center w-12 border-r border-[#b33e00]">No</th>
                    <th className="p-2 w-32 border-r border-[#b33e00]">Tanggal</th>
                    <th className="p-2 w-52 border-r border-[#b33e00]">User / Pejabat</th>
                    <th className="p-2">Uraian Catatan Memo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {memoList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-400 italic bg-white">
                        (Belum ada catatan memo pada prospek ini)
                      </td>
                    </tr>
                  ) : (
                    memoList.map((m, i) => (
                      <tr key={m.id || i} className="hover:bg-amber-50/30">
                        <td className="p-2 text-center font-mono text-gray-800 border-r border-gray-200">{i + 1}</td>
                        <td className="p-2 font-mono text-gray-600 border-r border-gray-200">{m.tgl}</td>
                        <td className="p-2 font-semibold text-gray-900 border-r border-gray-200">{m.user}</td>
                        <td className="p-2 text-gray-700">{m.text}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. SKDR (Surat Keterangan Diberikan Rekomendasi) */}
          <div className="pt-2">
            <h5 className="font-bold text-xs text-orange-950 uppercase tracking-wider mb-2">
              Surat Keterangan Diberikan Rekomendasi (SKDR)
            </h5>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#d35400] text-white font-bold border-b border-[#b33e00]">
                    <tr>
                      <th className="p-2 text-center w-12 border-r border-[#b33e00]">No</th>
                      <th className="p-2 w-32 border-r border-[#b33e00]">Tanggal SKDR</th>
                      <th className="p-2 border-r border-[#b33e00]">Keterangan SKDR</th>
                      <th className="p-2 border-r border-[#b33e00]">Penjelasan Rekomendasi</th>
                      <th className="p-2 text-center w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {skdrList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-gray-400 italic bg-white">
                          (Belum ada data SKDR)
                        </td>
                      </tr>
                    ) : (
                      skdrList.map((s, i) => (
                        <tr key={s.id || i} className="hover:bg-amber-50/30">
                          <td className="p-2 text-center font-mono text-gray-800 border-r border-gray-200">{i + 1}</td>
                          <td className="p-2 font-mono text-gray-600 border-r border-gray-200">{s.tgl}</td>
                          <td className="p-2 font-semibold text-gray-900 border-r border-gray-200">{s.keterangan}</td>
                          <td className="p-2 text-gray-700 border-r border-gray-200">{s.penjelasan}</td>
                          <td className="p-2 text-center font-bold text-emerald-700">{s.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PRINT PREVIEW SURAT AIP */}
      {showAipPrintPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-700" />
                <h4 className="font-bold text-sm text-slate-900 uppercase">
                  Surat Persetujuan Prinsip Penyediaan Kredit (AIP)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAipPrintPreview(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 font-serif text-[11px] leading-relaxed text-gray-800">
              <div className="text-center font-bold text-sm text-gray-900 tracking-wide pb-2 border-b">
                PT. BANK NEGARA INDONESIA (PERSERO) TBK
                <div className="text-[10px] font-sans font-normal text-gray-500">Unit Bisnis Kredit Konsumer</div>
              </div>
              <p>
                Berdasarkan evaluasi awal atas permohonan kredit yang diajukan oleh Sdr/Sdri <strong>{namaDebitur}</strong> dengan No. Prospek <strong>{noProspek}</strong>, dengan ini BNI memberikan Persetujuan Prinsip (Approval In Principal) sebagai berikut:
              </p>
              <div className="bg-white p-3 border rounded space-y-1 font-sans text-xs">
                <div className="flex justify-between"><span>Produk:</span><strong>{namaProduk}</strong></div>
                <div className="flex justify-between"><span>Plafon Maksimal:</span><strong className="text-emerald-800 font-mono">Rp {plafon.toLocaleString('id-ID')}</strong></div>
                <div className="flex justify-between"><span>Jangka Waktu:</span><strong>{tenorTahun} Tahun</strong></div>
                <div className="flex justify-between"><span>Suku Bunga:</span><strong>Fixed 1 Thn 1.79%, Floating SBDK</strong></div>
                <div className="flex justify-between"><span>Cabang Pelaksana:</span><strong className="font-mono">{unitCabang}</strong></div>
              </div>
              <p className="text-[10px] text-gray-500 italic">
                * Surat ini merupakan persetujuan prinsip awal (AIP) dan bukan merupakan Perjanjian Kredit final. Pencairan kredit tunduk pada pemenuhan persyaratan dokumen dan akad kredit di kantor cabang BNI.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowAipPrintPreview(false);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Printer className="h-4 w-4" /> Cetak Sekarang
              </button>
              <button
                type="button"
                onClick={() => setShowAipPrintPreview(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOMBOL UTAMA CuBES: FINISH / SELESAI INITIAL DATA ENTRY */}
      {onLanjut && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={onLanjut}
            className="px-14 py-3 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Finish &amp; Selesaikan Initial Data Entry</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoSkdr;

import React, { useState } from 'react';
import { StickyNote, Plus } from 'lucide-react';
import { TextareaField, useAuth } from '@template/shared';

export interface MemoSkdrProps {
  memoList: any[];
  setMemoList?: React.Dispatch<React.SetStateAction<any[]>>;
  skdrList: any[];
  setSkdrList?: React.Dispatch<React.SetStateAction<any[]>>;
  setSaveSuccess?: (msg: string | null) => void;
  onLanjut?: (e?: React.FormEvent) => void;
}

export const MemoSkdr: React.FC<MemoSkdrProps> = ({
  memoList = [],
  setMemoList,
  skdrList = [],
  setSkdrList,
  setSaveSuccess,
  onLanjut,
}) => {
  const { user } = useAuth();
  const [newMemoText, setNewMemoText] = useState('');

  const currentUserLabel = user?.name
    ? `${user.userId || ''} (${user.name})`.trim()
    : 'User';

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

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#F15A24] via-[#F37021] to-[#E05A10] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xs">
          <StickyNote className="h-4 w-4 text-orange-300" />
          <span>REFERAL MEMO &amp; CATATAN ANALIS</span>
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
              className="px-5 py-2.5 bg-[#F15A24] hover:bg-[#D94E1B] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs text-xs shrink-0 mb-1 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Simpan Memo
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto w-full"><table className="w-full text-xs text-left border-collapse">
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
                    <tr key={m.id || i} className="hover:bg-white">
                      <td className="p-2 text-center font-mono text-gray-800 border-r border-gray-200">{i + 1}</td>
                      <td className="p-2 font-mono text-gray-600 border-r border-gray-200">{m.tgl}</td>
                      <td className="p-2 font-semibold text-gray-900 border-r border-gray-200">{m.user}</td>
                      <td className="p-2 text-gray-700">{m.text}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table></div>
          </div>

          <div className="pt-2">
            <h5 className="font-bold text-xs text-orange-950 uppercase tracking-wider mb-2">
              Surat Keterangan Diberikan Rekomendasi (SKDR)
            </h5>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="overflow-x-auto w-full"><table className="w-full text-xs text-left border-collapse">
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
                      <tr key={s.id || i} className="hover:bg-white">
                        <td className="p-2 text-center font-mono text-gray-800 border-r border-gray-200">{i + 1}</td>
                        <td className="p-2 font-mono text-gray-600 border-r border-gray-200">{s.tgl}</td>
                        <td className="p-2 font-semibold text-gray-900 border-r border-gray-200">{s.keterangan}</td>
                        <td className="p-2 text-gray-700 border-r border-gray-200">{s.penjelasan}</td>
                        <td className="p-2 text-center font-bold text-emerald-700">{s.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table></div>
            </div>
          </div>
        </div>
      </div>

      {onLanjut && (
        <div className="flex justify-center py-2">
          <button
            type="button"
            onClick={onLanjut}
            className="px-12 py-2 bg-[#F15A24] hover:bg-[#D94E1B] text-white font-bold text-xs tracking-wider rounded border border-orange-800 shadow-md cursor-pointer active:scale-95"
          >
            Simpan Data Pengajuan
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoSkdr;

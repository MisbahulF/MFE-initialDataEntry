import React, { useState, useMemo } from 'react';
import { Search, Building, Handshake, X, Check, Filter } from 'lucide-react';
import { PartnerItem } from '../types/ide.types';
import {
  MASTER_DEVELOPERS_INDONESIA,
  MASTER_MITRA_KARYA_INDONESIA,
  MASTER_APPRAISAL_INDONESIA,
} from '../data/masterPartners';

interface SearchPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (partner: { code: string; name: string; project?: string; pks?: string }) => void;
  type?: 'DEVELOPER' | 'MITRA_KARYA' | 'APPRAISAL';
  title?: string;
  initialQuery?: string;
}

export const SearchPartnerModal: React.FC<SearchPartnerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  type = 'DEVELOPER',
  title,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);

  const defaultTitle =
    type === 'DEVELOPER'
      ? 'Lookup Rekanan Developer & Proyek PKS'
      : type === 'MITRA_KARYA'
      ? 'Lookup Mitra Karya / Institusi Payroll ASN & BUMN'
      : 'Lookup Rekanan Jasa Penilai (KJPP / Appraisal)';

  const activeTitle = title || defaultTitle;

  const dataset = useMemo(() => {
    if (type === 'DEVELOPER') {
      return MASTER_DEVELOPERS_INDONESIA.map((d) => ({
        code: d.id,
        name: d.name,
        extra: (d.projectList || []).join(', '),
        pks: d.pksNumber,
        status: d.status,
      }));
    }
    if (type === 'MITRA_KARYA') {
      return MASTER_MITRA_KARYA_INDONESIA.map((m) => ({
        code: m.id,
        name: m.name,
        extra: m.status,
        pks: m.pksNumber,
        status: m.status,
      }));
    }
    return MASTER_APPRAISAL_INDONESIA.map((a) => ({
      code: a.code,
      name: a.name,
      extra: a.type,
      pks: 'PKS/BNI/APPRAISAL',
      status: 'AKTIF',
    }));
  }, [type]);

  const filtered = useMemo(() => {
    if (!query || !query.trim()) return dataset;
    const q = query.trim().toLowerCase();
    return dataset.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.extra.toLowerCase().includes(q) ||
        item.pks.toLowerCase().includes(q)
    );
  }, [dataset, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/60 rounded-lg text-[#C2410C]">
              {type === 'DEVELOPER' ? (
                <Building className="w-5 h-5 text-[#C2410C]" />
              ) : (
                <Handshake className="w-5 h-5 text-[#C2410C]" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{activeTitle}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Data Mitra Rekanan Resmi Terdaftar di Sistem CuBES BNI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Cari nama ${type === 'DEVELOPER' ? 'developer / proyek' : 'mitra / institusi'} atau kode PKS...`}
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] text-slate-800 dark:text-slate-100"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
              <span>Hasil Pencarian:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filtered.length} mitra ditemukan
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  Data tidak ditemukan. Coba gunakan kata kunci lain.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase sticky top-0 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 pl-3">Kode</th>
                      <th className="p-2.5">Nama Rekanan / Institusi</th>
                      <th className="p-2.5">
                        {type === 'DEVELOPER' ? 'Daftar Proyek Perumahan' : 'Kategori / Keterangan'}
                      </th>
                      <th className="p-2.5">No. PKS</th>
                      <th className="p-2.5 pr-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                    {filtered.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-orange-50/70 dark:hover:bg-slate-800/70 transition cursor-pointer"
                        onClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                      >
                        <td className="p-2.5 pl-3 font-mono font-bold text-[#C2410C] whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs truncate">
                          {item.extra}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">{item.pks}</td>
                        <td className="p-2.5 pr-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(item);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded text-[11px] font-semibold shadow-xs transition"
                          >
                            <Check className="w-3 h-3" /> Pilih
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

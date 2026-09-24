import React, { useState, useEffect } from 'react';
import { Search, Building2, X, Check, Award } from 'lucide-react';
import { PartnerItem } from '../types/ide.types';
import { referenceService } from '../services/referenceService';

interface SearchItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: PartnerItem) => void;
  type?: 'DEVELOPER' | 'MITRA_KARYA';
  title?: string;
  initialQuery?: string;
}

export const SearchItemModal: React.FC<SearchItemModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  type = 'DEVELOPER',
  title,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PartnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const displayTitle = title || (type === 'DEVELOPER' ? 'Lookup Developer Rekanan PKS' : 'Lookup Instansi Mitra Karya BNI');

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [isOpen, initialQuery, type]);

  const handleSearch = async (q: string) => {
    setIsLoading(true);
    try {
      const data = await referenceService.searchPartners(q, type);
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#f15a24]/10 rounded-lg text-[#f15a24]">
              <Building2 className="w-5 h-5 text-[#f15a24]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{displayTitle}</h3>
              <p className="text-xs text-slate-500">Pilih mitra/developer yang memiliki kerjasama aktif dengan BNI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Cari nama institusi / developer / proyek..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a24] text-slate-800 dark:text-slate-100"
              autoFocus
            />
          </div>
        </div>

        {/* Results List */}
        <div className="p-6 pt-3 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-slate-500">Memuat data mitra...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400">Data mitra tidak ditemukan.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                <tr>
                  <th className="p-2.5 rounded-l-md">Kode / ID</th>
                  <th className="p-2.5">Nama Rekanan / Mitra</th>
                  <th className="p-2.5">No PKS</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 rounded-r-md text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {results.map((p, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/50 dark:hover:bg-slate-800/60 transition">
                    <td className="p-2.5 font-mono text-slate-500">{p.id}</td>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-800 dark:text-slate-100">{p.name}</div>
                      {p.projectList && p.projectList.length > 0 && (
                        <div className="text-[11px] text-slate-400">Proyek: {p.projectList.join(', ')}</div>
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-[11px]">{p.pksNumber || '-'}</td>
                    <td className="p-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        <Award className="w-3 h-3" /> {p.status || 'AKTIF'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => {
                          onSelect(p);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#f15a24] hover:bg-[#e05a10] text-white rounded text-xs font-semibold shadow-sm transition"
                      >
                        <Check className="w-3.5 h-3.5" /> Pilih
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

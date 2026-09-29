import React, { useState, useMemo } from 'react';
import { Search, Building2, X, Check, Filter } from 'lucide-react';
import { MASTER_BANK_INDONESIA, BankItem, searchBank } from '../data/masterBankBi';

interface SearchBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bank: BankItem) => void;
  title?: string;
  initialQuery?: string;
}

type BankCategoryFilter = 'ALL' | 'BUMN' | 'SWASTA_NASIONAL' | 'BPD' | 'SYARIAH' | 'ASING';

export const SearchBankModal: React.FC<SearchBankModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Lookup Data Bank di Indonesia',
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<BankCategoryFilter>('ALL');

  const filteredBanks = useMemo(() => {
    let list = searchBank(query, 100);
    if (categoryFilter !== 'ALL') {
      list = list.filter((b) => b.kategori === categoryFilter);
    }
    return list;
  }, [query, categoryFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/60 rounded-lg text-[#C2410C]">
              <Building2 className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Daftar Lengkap Bank Resmi Terdaftar di Bank Indonesia &amp; OJK
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

        {/* Search & Category Filter */}
        <div className="p-4 space-y-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama bank, singkatan, atau kode kliring BI (contoh: BCA, BNI, Mandiri, 014)..."
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

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-0.5">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Kategori:
            </span>
            {(
              [
                { id: 'ALL', label: 'Semua Bank' },
                { id: 'BUMN', label: 'Bank BUMN / Himbara' },
                { id: 'SWASTA_NASIONAL', label: 'Swasta Nasional' },
                { id: 'BPD', label: 'BPD Se-Indonesia' },
                { id: 'SYARIAH', label: 'Bank Syariah' },
                { id: 'ASING', label: 'Bank Asing' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-0.5 rounded-full font-medium transition whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-[#C2410C] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
              <span>Hasil Pencarian:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filteredBanks.length} bank ditemukan
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {filteredBanks.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  Bank &quot;{query}&quot; tidak ditemukan. Coba periksa kata kunci Anda.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase sticky top-0 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 pl-3">Sandi BI</th>
                      <th className="p-2.5">Nama Bank</th>
                      <th className="p-2.5">Singkatan</th>
                      <th className="p-2.5">Kategori</th>
                      <th className="p-2.5 pr-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                    {filteredBanks.map((b, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-orange-50/70 dark:hover:bg-slate-800/70 transition cursor-pointer"
                        onClick={() => {
                          onSelect(b);
                          onClose();
                        }}
                      >
                        <td className="p-2.5 pl-3 font-mono font-bold text-[#C2410C] whitespace-nowrap">
                          {b.code}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">{b.name}</td>
                        <td className="p-2.5 font-semibold text-slate-700 dark:text-slate-300">{b.shortName}</td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {b.kategori}
                          </span>
                        </td>
                        <td className="p-2.5 pr-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(b);
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

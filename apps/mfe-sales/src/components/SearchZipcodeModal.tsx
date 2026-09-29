import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, X, Check, Layers, Filter, Compass } from 'lucide-react';
import { ZipcodeResult } from '../types/ide.types';
import { referenceService } from '../services/referenceService';
import {
  MASTER_KECAMATAN_INDONESIA,
  getAllProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
  KecamatanItem,
} from '../data/masterKecamatan';

interface SearchZipcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: ZipcodeResult) => void;
  title?: string;
  initialQuery?: string;
}

type SearchMode = 'keyword' | 'hierarchy';
type FilterScope = 'all' | 'kecamatan' | 'kodepos' | 'kota';

export const SearchZipcodeModal: React.FC<SearchZipcodeModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Lookup Wilayah & Kode Pos Indonesia',
  initialQuery = '',
}) => {
  const [activeMode, setActiveMode] = useState<SearchMode>('keyword');
  const [filterScope, setFilterScope] = useState<FilterScope>('all');
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ZipcodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hierarchy filter states (Provinsi -> Kota -> Kecamatan)
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const allProvinces = useMemo(() => getAllProvinces(), []);
  const availableCities = useMemo(() => {
    if (!selectedProvince) return [];
    return getCitiesByProvince(selectedProvince);
  }, [selectedProvince]);

  const availableDistricts = useMemo(() => {
    if (!selectedCity) return [];
    return getDistrictsByCity(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      if (!initialQuery) {
        handleSearch('', 'all');
      }
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (!isOpen || activeMode !== 'keyword') return;
    const timer = setTimeout(() => {
      handleSearch(query, filterScope);
    }, 200);
    return () => clearTimeout(timer);
  }, [isOpen, query, filterScope, activeMode]);

  const handleSearch = async (q: string, scope: FilterScope) => {
    setIsLoading(true);
    try {
      const trimmed = q.trim().toLowerCase();

      // If scope is specifically 'kecamatan', filter directly on 7,285 kecamatan dataset
      if (scope === 'kecamatan') {
        const filtered = MASTER_KECAMATAN_INDONESIA.filter((k) =>
          trimmed ? k.kecamatan.toLowerCase().includes(trimmed) : true
        ).slice(0, 50);

        setResults(
          filtered.map((k) => ({
            zipcode: k.kodepos,
            kelurahan: k.kecamatan,
            kecamatan: k.kecamatan,
            kota: k.kota,
            provinsi: k.provinsi,
          }))
        );
        return;
      }

      // If scope is specifically 'kodepos', filter by kodepos
      if (scope === 'kodepos') {
        const filtered = MASTER_KECAMATAN_INDONESIA.filter((k) =>
          trimmed ? k.kodepos.includes(trimmed) : true
        ).slice(0, 50);

        setResults(
          filtered.map((k) => ({
            zipcode: k.kodepos,
            kelurahan: k.kecamatan,
            kecamatan: k.kecamatan,
            kota: k.kota,
            provinsi: k.provinsi,
          }))
        );
        return;
      }

      // If scope is specifically 'kota', filter by kota
      if (scope === 'kota') {
        const filtered = MASTER_KECAMATAN_INDONESIA.filter((k) =>
          trimmed ? k.kota.toLowerCase().includes(trimmed) : true
        ).slice(0, 50);

        setResults(
          filtered.map((k) => ({
            zipcode: k.kodepos,
            kelurahan: k.kecamatan,
            kecamatan: k.kecamatan,
            kota: k.kota,
            provinsi: k.provinsi,
          }))
        );
        return;
      }

      // Scope 'all': query backend (which queries 83.762 villages & kecamatan in SQLite)
      const data = await referenceService.searchZipcode(trimmed);
      setResults(data);
    } catch {
      // Fallback to local kecamatan
      const fallback = MASTER_KECAMATAN_INDONESIA.slice(0, 20).map((k) => ({
        zipcode: k.kodepos,
        kelurahan: k.kecamatan,
        kecamatan: k.kecamatan,
        kota: k.kota,
        provinsi: k.provinsi,
      }));
      setResults(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDistrictFromHierarchy = (district: KecamatanItem) => {
    onSelect({
      zipcode: district.kodepos,
      kelurahan: district.kecamatan,
      kecamatan: district.kecamatan,
      kota: district.kota,
      provinsi: district.provinsi,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/60 rounded-lg text-[#C2410C]">
              <Compass className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Data Lengkap Se-Indonesia (38 Provinsi, 514 Kota/Kab, 7.285 Kecamatan, 83.762 Desa)
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

        {/* Mode Selector Tabs (Pencarian Cepat vs Filter Berjenjang CuBES) */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveMode('keyword')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeMode === 'keyword'
                ? 'border-[#C2410C] text-[#C2410C]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Pencarian Teks (Kecamatan / Kodepos / Wilayah)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('hierarchy')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeMode === 'hierarchy'
                ? 'border-[#C2410C] text-[#C2410C]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Filter Berjenjang (Provinsi &rarr; Kota &rarr; Kecamatan)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {activeMode === 'keyword' ? (
            <>
              {/* Search Bar + Scope Pills */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ketik nama Kecamatan, Kelurahan, Kota, atau 5 Digit Kodepos (contoh: Cilandak, Serpong, 42111)..."
                    className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] text-slate-800 dark:text-slate-100"
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

                {/* Scope Filter Pills */}
                <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-1">
                  <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Filter:
                  </span>
                  {(
                    [
                      { id: 'all', label: 'Semua Wilayah' },
                      { id: 'kecamatan', label: 'Khusus Kecamatan (7.285)' },
                      { id: 'kodepos', label: 'Khusus Kode Pos' },
                      { id: 'kota', label: 'Khusus Kota / Kabupaten' },
                    ] as const
                  ).map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setFilterScope(scope.id)}
                      className={`px-2.5 py-1 rounded-full font-medium transition whitespace-nowrap ${
                        filterScope === scope.id
                          ? 'bg-[#C2410C] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {scope.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Hasil Pencarian Wilayah:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {isLoading ? 'Mencari...' : `${results.length} data ditemukan`}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-10 text-xs text-slate-500">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-[#C2410C] border-t-transparent mb-2"></div>
                      <div>Mencari wilayah di seluruh Indonesia...</div>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-400">
                      Data wilayah &quot;{query}&quot; tidak ditemukan. Coba periksa ejaan atau gunakan tab Filter Berjenjang.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase sticky top-0 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-2.5 pl-3">Kodepos</th>
                          <th className="p-2.5">Kecamatan</th>
                          <th className="p-2.5">Kelurahan / Desa</th>
                          <th className="p-2.5">Kota / Kabupaten</th>
                          <th className="p-2.5">Provinsi</th>
                          <th className="p-2.5 pr-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                        {results.map((r, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-orange-50/70 dark:hover:bg-slate-800/70 transition cursor-pointer"
                            onClick={() => {
                              onSelect(r);
                              onClose();
                            }}
                          >
                            <td className="p-2.5 pl-3 font-mono font-bold text-[#C2410C] whitespace-nowrap">
                              {r.zipcode || '-'}
                            </td>
                            <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">
                              {r.kecamatan || '-'}
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-300">
                              {r.kelurahan || '-'}
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-300">
                              {r.kota || '-'}
                            </td>
                            <td className="p-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                              {r.provinsi || '-'}
                            </td>
                            <td className="p-2.5 pr-3 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelect(r);
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
            </>
          ) : (
            /* Mode Hierarchy (Provinsi -> Kota -> Kecamatan) */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
                {/* 1. Pilih Provinsi */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    1. Provinsi (38 Provinsi):
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setSelectedCity('');
                    }}
                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {allProvinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Pilih Kota / Kabupaten */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    2. Kota / Kabupaten (514 Kab/Kota):
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedProvince}
                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-[#C2410C] focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400"
                  >
                    <option value="">
                      {!selectedProvince ? '-- Pilih Provinsi Terlebih Dahulu --' : '-- Pilih Kota / Kabupaten --'}
                    </option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Daftar Kecamatan di Kota yang Dipilih */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Daftar Kecamatan di {selectedCity || 'Kota yang dipilih'}:
                  </span>
                  <span className="text-slate-500 font-medium">
                    {availableDistricts.length} kecamatan tersedia
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {!selectedCity ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Silakan pilih Provinsi dan Kota/Kabupaten di atas untuk menampilkan seluruh kecamatan.
                    </div>
                  ) : availableDistricts.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Tidak ada data kecamatan untuk kota ini.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase sticky top-0 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-2.5 pl-3">Kecamatan</th>
                          <th className="p-2.5">Kode Pos</th>
                          <th className="p-2.5">Kota / Kab</th>
                          <th className="p-2.5">Provinsi</th>
                          <th className="p-2.5 pr-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                        {availableDistricts.map((dist, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-orange-50/70 dark:hover:bg-slate-800/70 transition cursor-pointer"
                            onClick={() => handleSelectDistrictFromHierarchy(dist)}
                          >
                            <td className="p-2.5 pl-3 font-bold text-slate-900 dark:text-slate-100">
                              {dist.kecamatan}
                            </td>
                            <td className="p-2.5 font-mono font-bold text-[#C2410C]">
                              {dist.kodepos || '-'}
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-300">{dist.kota}</td>
                            <td className="p-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                              {dist.provinsi}
                            </td>
                            <td className="p-2.5 pr-3 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectDistrictFromHierarchy(dist);
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
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
            Klik baris atau tombol <strong>Pilih</strong> untuk mengisi otomatis field alamat &amp; kodepos
          </div>
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

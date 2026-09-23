import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SearchableOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SearchableOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '- SELECT -',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search text with selected value when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[260px] inline-block font-sans text-xs">
      {/* Box Tampilan Input */}
      <div
        className={`flex items-center justify-between border border-amber-300/80 h-[28px] px-2.5 rounded-lg transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus-within:border-[#007B83] focus-within:ring-2 focus-within:ring-teal-500/25 ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-[#fffde6] cursor-pointer focus-within:ring-1 focus-within:ring-teal-500'
        } ${className}`}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
      >
        <span className={`w-full truncate ${!value ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
          {value || placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setSearch('');
              }}
              className="text-gray-400 hover:text-gray-700 text-sm leading-none cursor-pointer px-0.5"
              title="Hapus pilihan"
            >
              &times;
            </button>
          )}
          <ChevronDown
            className={`h-3 w-3 text-gray-600 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Floating Dropdown List dengan Live Search Bar */}
      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 top-[32px] w-full min-w-[280px] max-w-[360px] bg-white border border-slate-200 shadow-2xl max-h-64 overflow-hidden flex flex-col rounded-xl z-50">
          {/* Kotak Input Search */}
          <div className="p-1.5 bg-[#f5f8f8] border-b border-gray-300">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ketik untuk mencari..."
              className="w-full h-[28px] px-2.5 bg-white border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* List Pilihan */}
          <div className="overflow-y-auto divide-y divide-gray-100 flex-1 max-h-52">
            {/* Opsi Reset: - SELECT - */}
            <div
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className={`px-2 py-1 text-xs cursor-pointer hover:bg-teal-50 text-gray-500 italic ${
                !value ? 'bg-teal-100/60 font-semibold text-teal-900' : ''
              }`}
            >
              - SELECT -
            </div>

            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.label);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1.5 text-xs cursor-pointer hover:bg-teal-50 text-gray-800 transition-colors ${
                    value === opt.label ? 'bg-teal-100 font-semibold text-teal-900' : ''
                  }`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-2 py-3 text-center text-xs text-gray-400 italic">
                Tidak ditemukan hasil &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

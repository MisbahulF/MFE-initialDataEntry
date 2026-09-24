import React from 'react';
import { FormField, FormFieldProps } from './FormField';

export interface DateFieldProps extends Omit<FormFieldProps, 'children'> {
  dayValue?: string;
  monthValue?: string;
  yearValue?: string;
  onDayChange?: (val: string) => void;
  onMonthChange?: (val: string) => void;
  onYearChange?: (val: string) => void;
  disabled?: boolean;
}

const MONTH_OPTIONS = [
  { label: 'Januari', value: 'Januari' },
  { label: 'Februari', value: 'Februari' },
  { label: 'Maret', value: 'Maret' },
  { label: 'April', value: 'April' },
  { label: 'Mei', value: 'Mei' },
  { label: 'Juni', value: 'Juni' },
  { label: 'Juli', value: 'Juli' },
  { label: 'Agustus', value: 'Agustus' },
  { label: 'September', value: 'September' },
  { label: 'Oktober', value: 'Oktober' },
  { label: 'November', value: 'November' },
  { label: 'Desember', value: 'Desember' },
];

export const DateField: React.FC<DateFieldProps> = ({
  label,
  required,
  error,
  helperText,
  dayValue = '',
  monthValue = '',
  yearValue = '',
  onDayChange,
  onMonthChange,
  onYearChange,
  disabled = false,
  className = '',
}) => {
  return (
    <FormField label={label} required={required} error={error} helperText={helperText} className={className}>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          maxLength={2}
          placeholder="DD"
          disabled={disabled}
          value={dayValue}
          onChange={(e) => onDayChange?.(e.target.value)}
          className="w-12 text-center px-2 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#F15A24] focus:border-[#F15A24] disabled:bg-gray-100 disabled:text-gray-400"
        />
        <div className="relative flex-1">
          <select
            disabled={disabled}
            value={monthValue}
            onChange={(e) => onMonthChange?.(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-800 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#F15A24] focus:border-[#F15A24] disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">- Bulan -</option>
            {MONTH_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        <input
          type="text"
          maxLength={4}
          placeholder="YYYY"
          disabled={disabled}
          value={yearValue}
          onChange={(e) => onYearChange?.(e.target.value)}
          className="w-16 text-center px-2 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#F15A24] focus:border-[#F15A24] disabled:bg-gray-100 disabled:text-gray-400"
        />
      </div>
    </FormField>
  );
};

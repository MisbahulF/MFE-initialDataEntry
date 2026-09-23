import React from 'react';
import { FormField, FormFieldProps } from './FormField';
import { formatRupiah, parseRupiah } from '../../lib/formatters';

export interface CurrencyFieldProps extends Omit<FormFieldProps, 'children'> {
  value: number | string | undefined | null;
  onChangeValue: (numericValue: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  label,
  required,
  error,
  helperText,
  value,
  onChangeValue,
  placeholder = 'Rp 0',
  disabled,
  className = '',
}) => {
  const displayValue = value !== undefined && value !== null && value !== '' 
    ? formatRupiah(value) 
    : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseRupiah(e.target.value);
    onChangeValue(numericValue);
  };

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-1.5 border rounded text-xs font-semibold transition-colors focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-400 bg-red-50/20 focus:ring-red-500 focus:border-red-500 text-red-900'
            : 'border-gray-300 bg-white text-gray-800 focus:ring-[#007B7A] focus:border-[#007B7A]'
        } ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''} ${className}`}
      />
    </FormField>
  );
};

CurrencyField.displayName = 'CurrencyField';

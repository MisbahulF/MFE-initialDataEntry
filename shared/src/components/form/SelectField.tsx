import React, { forwardRef } from 'react';
import { FormField, FormFieldProps } from './FormField';

import type { SelectOption } from '../../types/common';
export type { SelectOption };

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    Omit<FormFieldProps, 'children'> {
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      required,
      error,
      helperText,
      options,
      placeholder = '-- Pilih --',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <FormField
        label={label}
        required={required}
        error={error}
        helperText={helperText}
      >
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={`w-full px-3 py-1.5 border rounded text-xs transition-colors bg-white appearance-none cursor-pointer focus:outline-none focus:ring-1 ${
              error
                ? 'border-red-400 bg-red-50/20 focus:ring-red-500 focus:border-red-500 text-red-900'
                : 'border-gray-300 text-gray-800 focus:ring-[#007B7A] focus:border-[#007B7A]'
            } ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden={required}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </FormField>
    );
  }
);

SelectField.displayName = 'SelectField';

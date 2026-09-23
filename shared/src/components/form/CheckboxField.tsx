import React, { forwardRef } from 'react';

export interface CheckboxFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      label,
      required,
      error,
      helperText,
      className = '',
      disabled,
      checked,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

    return (
      <div className={`flex flex-col gap-0.5 text-xs ${className}`}>
        <label
          htmlFor={inputId}
          className={`inline-flex items-center gap-2 cursor-pointer select-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900'
          }`}
        >
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className={`h-4 w-4 rounded border transition-colors cursor-pointer text-[#007B7A] focus:ring-[#007B7A] ${
              error
                ? 'border-red-500 bg-red-50 text-red-600 focus:ring-red-400'
                : 'border-gray-300'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
            {...props}
          />
          <span className="text-gray-700 font-medium">
            {label}
            {required && <span className="text-red-500 font-bold ml-1">*</span>}
          </span>
        </label>
        {error ? (
          <span className="text-[11px] text-red-600 font-medium ml-6">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-[11px] text-gray-400 ml-6">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

import React from 'react';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  helperText,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 text-xs ${className}`}>
      {label && (
        <label className="font-semibold text-gray-700 flex items-center gap-1 select-none">
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-[11px] text-red-600 font-medium tracking-tight">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-[11px] text-gray-400">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

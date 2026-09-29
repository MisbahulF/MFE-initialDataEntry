import React, { forwardRef } from 'react';
import { FormField, FormFieldProps } from './FormField';

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Omit<FormFieldProps, 'children'> {}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      required,
      error,
      helperText,
      className = '',
      type = 'text',
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
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={`w-full px-3 py-1.5 border rounded text-xs transition-colors focus:outline-none focus:ring-1 ${
            error
              ? 'border-red-400 bg-red-50/20 focus:ring-red-500 focus:border-red-500 text-red-900'
              : required
            ? 'bg-[#f4fbac] border-[#b7c46b] text-gray-900 focus:bg-[#fffde5] focus:ring-[#C2410C] focus:border-[#C2410C]'
            : 'border-gray-300 bg-white text-gray-800 focus:ring-[#C2410C] focus:border-[#C2410C]'
          } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
      </FormField>
    );
  }
);

TextField.displayName = 'TextField';

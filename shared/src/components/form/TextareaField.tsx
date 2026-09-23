import React, { forwardRef } from 'react';
import { FormField, FormFieldProps } from './FormField';

export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<FormFieldProps, 'children'> {}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      required,
      error,
      helperText,
      className = '',
      disabled,
      rows = 3,
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
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded text-xs transition-colors resize-y focus:outline-none focus:ring-1 ${
            error
              ? 'border-red-400 bg-red-50/20 focus:ring-red-500 focus:border-red-500 text-red-900'
              : 'border-gray-300 bg-white text-gray-800 focus:ring-[#007B7A] focus:border-[#007B7A]'
          } ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
      </FormField>
    );
  }
);

TextareaField.displayName = 'TextareaField';

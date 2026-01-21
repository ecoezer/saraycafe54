import React, { InputHTMLAttributes, forwardRef } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border border-gray-300 focus:border-light-blue-400 focus:ring-1 focus:ring-light-blue-400 p-2.5 text-sm bg-white ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

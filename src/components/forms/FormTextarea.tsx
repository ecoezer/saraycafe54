import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full rounded-lg border border-gray-300 focus:border-light-blue-400 focus:ring-1 focus:ring-light-blue-400 p-2.5 text-sm bg-white resize-none ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

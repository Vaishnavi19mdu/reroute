import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  helperText,
  required = false,
  optional = false,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 text-xs ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="font-semibold text-[#17483C] text-xs select-none"
        >
          {label}
          {required && <span className="text-[#33006F] ml-1">*</span>}
          {optional && (
            <span className="text-neutral-400 font-normal ml-1">(Optional)</span>
          )}
        </label>
      </div>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[11px] font-medium text-[#C5221F] flex items-center gap-1"
        >
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-[11px] text-[#64748B]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;

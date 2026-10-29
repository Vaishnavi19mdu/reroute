import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  hasError?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  hasError = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        id={id}
        type={showPassword ? 'text' : 'password'}
        aria-invalid={hasError}
        className={`w-full px-3 py-2 pl-9 pr-10 rounded-[6px] border text-sm text-[#1D1160] transition-colors focus:outline-none focus:ring-2 focus:ring-[#17483C]/20 ${
          hasError
            ? 'border-[#C5221F] bg-[#FFF8F8] focus:border-[#C5221F]'
            : 'border-[#D5DFD9] bg-white focus:border-[#17483C]'
        } ${className}`}
      />
      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-2.5 top-2 p-1 text-neutral-400 hover:text-[#17483C] transition-colors rounded-[4px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#17483C]"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;

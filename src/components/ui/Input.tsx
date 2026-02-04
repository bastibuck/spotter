import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  suffix,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="text-ocean-200 mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          className={`ocean-input placeholder-ocean-200/40 w-full rounded-lg px-4 py-3 text-white ${className}`}
          {...props}
        />
        {suffix && (
          <span className="text-ocean-200/60 absolute right-4 text-sm">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

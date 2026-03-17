import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = "",
  wrapperClassName = "",
  ...props
}) => {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label className="text-ocean-200 mb-2 block text-sm font-medium">
          {label}
        </label>
      )}

      <textarea
        className={`ocean-input placeholder-ocean-200/40 min-h-32 w-full rounded-lg px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

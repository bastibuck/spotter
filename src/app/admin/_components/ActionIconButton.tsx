import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export default function ActionIconButton({
  label,
  className,
  children,
  ...props
}: ActionIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/4 transition ${className ?? ""} ${props.disabled ? "cursor-not-allowed opacity-50" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

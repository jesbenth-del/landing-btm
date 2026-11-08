import { ArrowRight, Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from "react";

export const labelClass =
  "block text-xs font-medium uppercase tracking-widest text-muted-foreground";

export const inputClass = (error?: string) =>
  `h-12 w-full rounded-xl border bg-black/40 px-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-white/30 focus:border-primary/70 focus:ring-4 focus:ring-primary/10 sm:text-sm ${
    error ? "border-destructive/70" : "border-white/10 hover:border-white/20"
  }`;

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({ label, error, id, ref, ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      <input
        {...props}
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClass(error)}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "whatsapp" | "outline";
  children: ReactNode;
}

const VARIANTS: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_0_0_0_var(--color-primary)] hover:shadow-[0_0_40px_-6px_var(--color-primary)]",
  whatsapp:
    "bg-[#25D366] text-black hover:brightness-105 hover:shadow-[0_0_40px_-6px_#25D366]",
  outline: "border border-primary/40 bg-transparent text-primary hover:bg-primary/10",
};

export function CtaButton({
  loading = false,
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: CtaButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-[opacity,filter,transform,box-shadow] duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
      {!loading && variant === "primary" ? (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      ) : null}
    </button>
  );
}

/** Enlace con forma de botón que lleva al formulario del héroe. */
export function CtaLink({
  href = "#registro",
  className = "",
  children,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_50px_-6px_var(--color-primary)] active:scale-[0.98] ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export function WhatsappIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.22-8.24 8.22Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

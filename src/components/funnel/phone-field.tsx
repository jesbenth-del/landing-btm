import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes, Ref } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { COUNTRIES, findCountry, type Country } from "@/lib/countries";

import { labelClass } from "./fields";

interface PhoneFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  countryCode: string;
  onCountryChange: (code: string) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

/** Quita acentos para que "mexico" encuentre "México". */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

function filterCountries(countries: Country[], query: string): Country[] {
  const trimmed = query.trim();
  if (!trimmed) return countries;

  const normalizedQuery = normalize(trimmed);
  const digitsQuery = trimmed.replace(/\D/g, "");

  return countries.filter((country) => {
    if (normalize(country.name).includes(normalizedQuery)) return true;
    return digitsQuery.length > 0 && country.dialCode.replace(/\D/g, "").includes(digitsQuery);
  });
}

/** Celular con selector de país buscable (por nombre o por prefijo). */
export function PhoneField({
  label,
  countryCode,
  onCountryChange,
  error,
  ref,
  ...props
}: PhoneFieldProps) {
  const country = findCountry(countryCode);
  const errorId = "phoneNumber-error";

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterCountries(COUNTRIES, query), [query]);

  /** Cierra por selección o Escape y devuelve el foco al disparador. */
  const close = () => {
    setIsOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;

    // Cierra sin robarle el foco a lo que se haya clicado afuera.
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="phoneNumber" className={labelClass}>
        {label}
      </label>

      <div
        className={`flex h-12 w-full items-stretch rounded-xl border bg-black/40 transition-[border-color,box-shadow] focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/10 ${
          error ? "border-destructive/70" : "border-white/10 hover:border-white/20"
        }`}
      >
        <div
          ref={containerRef}
          className="relative flex items-center gap-2 border-r border-white/10 pr-2.5 pl-3"
        >
          <button
            ref={triggerRef}
            type="button"
            aria-label="Código de país"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="flex items-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {country.flag}
            </span>
            <span className="text-sm whitespace-nowrap text-foreground">{country.dialCode}</span>
            <ChevronDown
              aria-hidden="true"
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div
              role="listbox"
              aria-label="Lista de países"
              className="absolute top-full left-0 z-30 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-2xl shadow-black/40 sm:w-72"
            >
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.stopPropagation();
                    close();
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    if (filtered[0]) {
                      onCountryChange(filtered[0].code);
                      close();
                    }
                  }
                }}
                placeholder="Buscar país o código..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary/60"
              />

              <ul className="mt-2 max-h-64 overflow-y-auto">
                {filtered.length === 0 && (
                  <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                    Sin resultados
                  </li>
                )}
                {filtered.map((option) => {
                  const isSelected = option.code === countryCode;
                  return (
                    <li key={option.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onCountryChange(option.code);
                          close();
                        }}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                          isSelected ? "bg-primary/10 text-primary" : "text-foreground"
                        }`}
                      >
                        <span aria-hidden="true" className="text-base leading-none">
                          {option.flag}
                        </span>
                        <span className="w-12 shrink-0 font-semibold tabular-nums">
                          {option.dialCode}
                        </span>
                        <span className="truncate">{option.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <input
          {...props}
          id="phoneNumber"
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={country.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-full min-w-0 flex-1 rounded-r-md bg-transparent px-3.5 text-base text-foreground outline-none placeholder:text-muted-foreground/60 sm:text-sm"
        />
      </div>

      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

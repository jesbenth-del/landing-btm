import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ChevronDown } from "lucide-react";

import { EXPERIENCIA_OPCIONES, HERO, type Experiencia } from "@/content/evento";
import { trackEvent } from "@/lib/analytics";
import { DEFAULT_COUNTRY_CODE, findCountry } from "@/lib/countries";
import { createLead } from "@/lib/funnel-api";
import { readTrackingParams, saveFunnelSession, toFunnelSession } from "@/lib/funnel-session";
import { leadSchema, type LeadFormValues } from "@/lib/lead-schema";
import { readMetaCookies } from "@/lib/pixel";

import { Countdown } from "./countdown";
import { CtaButton, inputClass, labelClass, TextField } from "./fields";
import { PhoneField } from "./phone-field";

export function LeadForm({ startsAt = "" }: { startsAt?: string }) {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  /*
    Cuándo se mostró el formulario. Reemplaza al campo trampa (honeypot), que
    los gestores de contraseñas autocompletaban y hacía perder leads reales:
    ahora nada se descarta, solo se guarda cuánto tardó en llenarse.
  */
  const [mountedAt] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      email: "",
      experience: "",
      countryCode: DEFAULT_COUNTRY_CODE,
      phoneNumber: "",
      privacyAccepted: false,
    },
  });

  const countryCode = useWatch({ control, name: "countryCode" });
  const experience = useWatch({ control, name: "experience" });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const country = findCountry(values.countryCode);

    try {
      const response = await createLead({
        data: {
          firstName: values.firstName.trim(),
          email: values.email.trim().toLowerCase(),
          experience: values.experience as Experiencia,
          countryCode: country.code,
          dialCode: country.dialCode,
          phoneNumber: values.phoneNumber.replace(/\D/g, ""),
          privacyAccepted: true,
          /*
            Las cookies del pixel se guardan con el lead: los eventos de la
            Conversions API se disparan más tarde desde el servidor, que ya no
            tiene forma de leerlas.
          */
          tracking: { ...readTrackingParams(), ...readMetaCookies() },
          formFillMs: Date.now() - mountedAt,
        },
      });

      trackEvent("generate_lead", { country: country.code });
      saveFunnelSession(toFunnelSession(response));
      await navigate({ to: "/procesando" });
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Ocurrió un error inesperado. Inténtalo de nuevo.",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <TextField
        label="Nombre"
        placeholder="Tu nombre"
        autoComplete="name"
        error={errors.firstName?.message}
        {...register("firstName")}
      />

      <TextField
        label="Correo electrónico"
        type="email"
        placeholder="Escribe tu mejor correo"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <PhoneField
            label="WhatsApp (con código de país)"
            countryCode={countryCode}
            onCountryChange={(code) => setValue("countryCode", code, { shouldValidate: false })}
            error={errors.phoneNumber?.message}
            value={field.value}
            onChange={(event) => field.onChange(event.target.value.replace(/[^\d\s-]/g, ""))}
            onBlur={field.onBlur}
            ref={field.ref}
            name={field.name}
          />
        )}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="experience" className={labelClass}>
          ¿Cuánto tiempo llevas analizando gráficos?
        </label>
        <div className="relative">
          <select
            id="experience"
            aria-invalid={Boolean(errors.experience)}
            aria-describedby={errors.experience ? "experience-error" : undefined}
            className={`${inputClass(errors.experience?.message)} appearance-none pr-10 ${
              experience ? "" : "text-white/30"
            }`}
            {...register("experience")}
          >
            <option value="" disabled>
              Elige una opción
            </option>
            {EXPERIENCIA_OPCIONES.map((option) => (
              <option key={option.value} value={option.value} className="bg-card text-foreground">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-white/40"
          />
        </div>
        {errors.experience && (
          <p id="experience-error" className="text-sm text-destructive">
            {errors.experience.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="privacyAccepted" className="flex cursor-pointer items-start gap-3">
          <input
            id="privacyAccepted"
            type="checkbox"
            aria-invalid={Boolean(errors.privacyAccepted)}
            {...register("privacyAccepted")}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border accent-primary"
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            Acepto la{" "}
            <Link
              to="/politica-de-privacidad"
              target="_blank"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Política de Privacidad
            </Link>{" "}
            y autorizo a BTM Academy a contactarme por WhatsApp y correo.
          </span>
        </label>
        {errors.privacyAccepted && (
          <p className="mt-2 text-sm text-destructive">{errors.privacyAccepted.message}</p>
        )}
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {submitError}
        </div>
      )}

      <Countdown startsAt={startsAt} />

      <CtaButton type="submit" loading={isSubmitting}>
        {isSubmitting ? "Enviando..." : HERO.botonFormulario}
      </CtaButton>

      <p className="px-1 text-center text-[11px] leading-snug text-muted-foreground sm:text-xs">
        {HERO.avisoFormulario}
      </p>
    </form>
  );
}

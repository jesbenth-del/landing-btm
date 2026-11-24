import { z } from "zod";

import { EXPERIENCIA_OPCIONES } from "@/content/evento";

import { findCountry } from "./countries";

const EXPERIENCIA_VALUES = EXPERIENCIA_OPCIONES.map((o) => o.value) as [string, ...string[]];

export const leadSchema = z
  .object({
    // Un solo campo de nombre: cada quien escribe nombre y apellido si quiere.
    firstName: z
      .string()
      .trim()
      .min(2, "Escribe tu nombre")
      .max(80, "El nombre es demasiado largo")
      .regex(/^[\p{L}\p{M}\s'-]+$/u, "El nombre solo admite letras"),
    email: z.string().trim().toLowerCase().email("Ingresa un correo electrónico válido"),
    countryCode: z.string().length(2),
    phoneNumber: z.string().trim().min(1, "Ingresa tu número de WhatsApp"),
    experience: z
      .string()
      .refine((v) => EXPERIENCIA_VALUES.includes(v), {
        message: "Elige cuánto tiempo llevas analizando gráficos",
      }),
    privacyAccepted: z.boolean().refine((v) => v, {
      message: "Debes aceptar la Política de Privacidad para continuar",
    }),
  })
  .superRefine((data, ctx) => {
    const country = findCountry(data.countryCode);
    const digits = data.phoneNumber.replace(/\D/g, "");

    if (digits.length < country.minLength || digits.length > country.maxLength) {
      const expected =
        country.minLength === country.maxLength
          ? `${country.minLength} dígitos`
          : `entre ${country.minLength} y ${country.maxLength} dígitos`;

      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: `El número de ${country.name} debe tener ${expected}`,
      });
    }
  });

export type LeadFormValues = z.input<typeof leadSchema>;

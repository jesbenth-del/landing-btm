import { z } from "zod";

import { findCountry } from "./countries";

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `Escribe tu ${label}`)
    .max(50, `El ${label} es demasiado largo`)
    .regex(/^[\p{L}\p{M}\s'-]+$/u, `El ${label} solo admite letras`);

export const leadSchema = z
  .object({
    firstName: nameField("nombre"),
    lastName: nameField("apellido"),
    email: z.string().trim().toLowerCase().email("Ingresa un correo electrónico válido"),
    countryCode: z.string().length(2),
    phoneNumber: z.string().trim().min(1, "Ingresa tu número de WhatsApp"),
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

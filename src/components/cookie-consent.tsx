import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";

function updateTrackingConsent() {
  const analyticsGranted = CookieConsent.acceptedCategory("analytics");

  window.gtag?.("consent", "update", {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: analyticsGranted ? "granted" : "denied",
  });
}

export function CookieConsentProvider() {
  useEffect(() => {
    void CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "bar inline",
          position: "bottom",
          equalWeightButtons: true,
        },
        preferencesModal: {
          layout: "box",
          equalWeightButtons: true,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: "_gid" }, { name: "_clck" }, { name: "_clsk" }],
          },
        },
      },
      onConsent: () => {
        updateTrackingConsent();
      },
      onChange: () => {
        updateTrackingConsent();
      },
      language: {
        default: "es",
        translations: {
          es: {
            consentModal: {
              title: "Cookies y privacidad",
              description:
                "Usamos cookies esenciales y, con tu consentimiento, cookies analíticas para entender cómo se utiliza el sitio. Puedes aceptar, rechazar las no esenciales o gestionar tus preferencias.",
              acceptAllBtn: "Aceptar cookies",
              acceptNecessaryBtn: "Rechazar no esenciales",
              showPreferencesBtn: "Gestionar preferencias",
              footer: `<a href="/politica-de-cookies" class="cc-link">Política de Cookies</a>`,
            },
            preferencesModal: {
              title: "Preferencias de cookies",
              acceptAllBtn: "Aceptar todas",
              acceptNecessaryBtn: "Rechazar no esenciales",
              savePreferencesBtn: "Guardar preferencias",
              closeIconLabel: "Cerrar",
              sections: [
                {
                  title: "Uso de cookies",
                  description:
                    "Puedes elegir qué categorías de cookies permitir. Las cookies esenciales son necesarias para el funcionamiento básico del sitio.",
                },
                {
                  title: "Cookies estrictamente necesarias",
                  description:
                    "Imprescindibles para el funcionamiento del sitio. No se pueden desactivar.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Cookies analíticas",
                  description:
                    "Nos ayudan a entender cómo se utiliza el sitio (Google Analytics y Microsoft Clarity).",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
}

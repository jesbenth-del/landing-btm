import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/politica-de-cookies")({
  head: () => ({
    meta: [{ title: "Política de Cookies — BTM Academy" }, { name: "robots", content: "noindex" }],
  }),
  component: PoliticaDeCookiesPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="mb-4 text-base font-semibold tracking-tight text-foreground sm:text-lg">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

type CookieRow = {
  name: string;
  provider: string;
  category: string;
  purpose: string;
  duration: string;
};

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Cookie", "Proveedor", "Categoría", "Finalidad", "Duración"].map((h) => (
              <th
                key={h}
                className="py-2 pr-4 text-left font-medium text-foreground last:pr-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border/40 last:border-0">
              <td className="py-2 pr-4 font-mono font-medium text-foreground/80">{row.name}</td>
              <td className="py-2 pr-4">{row.provider}</td>
              <td className="py-2 pr-4">{row.category}</td>
              <td className="py-2 pr-4">{row.purpose}</td>
              <td className="py-2">{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cookieRows: CookieRow[] = [
  {
    name: "cc_cookie",
    provider: "BTM Academy",
    category: "Necesaria",
    purpose: "Guarda las preferencias de consentimiento del usuario sobre cookies",
    duration: "6 meses",
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    category: "Analítica",
    purpose: "Distingue usuarios únicos y calcula estadísticas de visita",
    duration: "2 años",
  },
  {
    name: "_ga_*",
    provider: "Google Analytics",
    category: "Analítica",
    purpose: "Mantiene el estado de sesión en Google Analytics 4",
    duration: "2 años",
  },
  {
    name: "_gid",
    provider: "Google Analytics",
    category: "Analítica",
    purpose: "Distingue usuarios únicos durante una sesión de 24 horas",
    duration: "24 horas",
  },
  {
    name: "_clck",
    provider: "Microsoft Clarity",
    category: "Analítica / Comportamiento",
    purpose: "Identifica al usuario en Clarity y asocia las sesiones a su perfil",
    duration: "1 año",
  },
  {
    name: "_clsk",
    provider: "Microsoft Clarity",
    category: "Analítica / Comportamiento",
    purpose: "Agrupa los eventos de navegación del usuario en una misma sesión",
    duration: "1 día",
  },
];

function PoliticaDeCookiesPage() {
  return (
    <LegalPage title="Política de Cookies" effectiveDate="2 de julio de 2026">
      <div className="space-y-6">
        {/* Introducción */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Esta Política de Cookies explica qué son las cookies, qué tipos de cookies pueden
              utilizarse en la landing page de BTM Academy, para qué se usan y cómo el usuario
              puede gestionarlas o bloquearlas.
            </p>
            <p>
              Esta Política aplica al sitio web{" "}
              <span className="font-medium text-foreground">https://www.btmacademy.co</span>,
              operado por BTM Academy, marca educativa de Jesús Benthan, con domicilio en
              Barranquilla, Colombia. Correo de contacto:{" "}
              <a
                href="mailto:btmtradingacademy@gmail.com"
                className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70"
              >
                btmtradingacademy@gmail.com
              </a>
              .
            </p>
            <p>
              Esta Política complementa la{" "}
              <Link
                to="/politica-de-privacidad"
                className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70"
              >
                Política de Privacidad
              </Link>{" "}
              de BTM Academy.
            </p>
          </div>
        </div>

        {/* 1. ¿Qué son las cookies? */}
        <Section title="1. ¿Qué son las cookies?">
          <p>
            Las cookies son pequeños archivos o tecnologías similares que se almacenan en el
            navegador o dispositivo del usuario cuando visita un sitio web. Permiten, entre otras
            cosas, que el sitio funcione correctamente, recordar ciertas preferencias, analizar el
            uso de la página y medir el rendimiento del sitio.
          </p>
          <p>
            Cuando las cookies o tecnologías similares permiten identificar o asociar información a
            una persona determinada, su uso puede implicar tratamiento de datos personales.
          </p>
        </Section>

        {/* 2. ¿Por qué usamos cookies? */}
        <Section title="2. ¿Por qué usamos cookies?">
          <p>BTM Academy puede utilizar cookies y tecnologías similares para:</p>
          <Ul
            items={[
              "Permitir el funcionamiento técnico de la landing page",
              "Garantizar la seguridad y estabilidad del sitio",
              "Guardar las preferencias de consentimiento del usuario",
              "Medir visitas, tráfico y rendimiento del sitio",
              "Entender cómo los usuarios interactúan con la landing",
              "Mejorar la experiencia de navegación",
              "Analizar la efectividad de los contenidos y formularios",
            ]}
          />
          <p>
            BTM Academy no utiliza cookies para vender productos financieros, ofrecer señales de
            trading, prometer rentabilidad ni prestar asesoría financiera personalizada.
          </p>
        </Section>

        {/* 3. Tipos de cookies */}
        <Section title="3. Tipos de cookies que utiliza el sitio">
          <h3 className="font-medium text-foreground">3.1. Cookies necesarias o técnicas</h3>
          <p>
            Son cookies indispensables para que el sitio funcione correctamente: cargar la página,
            procesar formularios, mantener la seguridad y guardar las preferencias de consentimiento
            del usuario. No requieren consentimiento adicional porque son estrictamente necesarias
            para prestar el servicio.
          </p>

          <h3 className="mt-4 font-medium text-foreground">3.2. Cookies analíticas</h3>
          <p>
            Ayudan a BTM Academy a entender cómo los usuarios interactúan con la landing page:
            número de visitas, páginas más consultadas, tiempo de permanencia, dispositivo, eventos
            de interacción y rendimiento general. BTM Academy utiliza{" "}
            <span className="font-medium text-foreground">Google Analytics</span> y{" "}
            <span className="font-medium text-foreground">Microsoft Clarity</span> para estas
            finalidades. Estas cookies no son estrictamente necesarias y se activan únicamente
            cuando el usuario otorga su consentimiento.
          </p>

          <h3 className="mt-4 font-medium text-foreground">
            3.3. Cookies de marketing o remarketing
          </h3>
          <p>
            Actualmente BTM Academy no utiliza herramientas de publicidad ni remarketing (Meta
            Pixel, Google Ads, TikTok Pixel u otras similares). Si en el futuro se implementan,
            BTM Academy informará al usuario y solicitará su consentimiento cuando corresponda.
          </p>
        </Section>

        {/* 4. Herramientas utilizadas */}
        <Section title="4. Herramientas utilizadas">
          <h3 className="font-medium text-foreground">Google Analytics</h3>
          <p>
            Permite medir y analizar el tráfico del sitio web. Puede utilizar cookies e
            identificadores para distinguir visitantes, analizar sesiones, conocer fuentes de
            tráfico y generar estadísticas sobre el uso del sitio. La información se utiliza para
            mejorar la landing page y entender el comportamiento general de los visitantes.
          </p>

          <h3 className="mt-4 font-medium text-foreground">Microsoft Clarity</h3>
          <p>
            Permite analizar la interacción de los usuarios mediante mapas de calor, grabaciones de
            sesión, clics, desplazamientos y métricas de navegación. BTM Academy utiliza esta
            información para mejorar la experiencia del usuario y detectar oportunidades de mejora
            en la landing page.
          </p>

          <h3 className="mt-4 font-medium text-foreground">Vercel y Supabase</h3>
          <p>
            Vercel opera como proveedor de hosting y despliegue del sitio. Supabase gestiona el
            almacenamiento de la información enviada a través del formulario. Estas herramientas
            procesan información técnica necesaria para operar el sitio y recibir solicitudes.
          </p>
        </Section>

        {/* 5. Tabla de cookies */}
        <Section title="5. Cookies utilizadas actualmente">
          <p>Las siguientes cookies pueden estar presentes en tu navegador al visitar el sitio:</p>
          <CookieTable rows={cookieRows} />
        </Section>

        {/* 6. Información que puede recopilarse */}
        <Section title="6. Información que puede recopilarse mediante cookies">
          <p>
            A través de cookies y tecnologías similares, BTM Academy o sus proveedores pueden
            recopilar:
          </p>
          <Ul
            items={[
              "Dirección IP e identificadores de cookies o del navegador",
              "Tipo de dispositivo, sistema operativo y navegador utilizado",
              "Páginas visitadas, fecha, hora y tiempo de permanencia",
              "Clics, desplazamientos e interacciones dentro del sitio",
              "Fuente de tráfico o campaña de origen",
              "Información técnica sobre errores o rendimiento",
            ]}
          />
          <p>
            BTM Academy no usa cookies para recopilar intencionalmente datos sensibles, datos
            financieros, claves, contraseñas ni credenciales de cuentas de trading.
          </p>
        </Section>

        {/* 7. Consentimiento */}
        <Section title="7. Consentimiento para cookies">
          <p>
            Al ingresar a la landing page, el usuario es informado sobre el uso de cookies mediante
            un banner ubicado en la parte inferior del sitio. Este banner permite:
          </p>
          <Ul
            items={[
              "Aceptar todas las cookies (necesarias y analíticas)",
              "Rechazar las cookies no esenciales (solo se activan las necesarias)",
              "Gestionar las preferencias por categoría",
            ]}
          />
          <p>
            Las cookies necesarias se activan automáticamente porque son indispensables para el
            funcionamiento del sitio. Las cookies analíticas y de comportamiento se activan
            únicamente cuando el usuario otorga su consentimiento. El usuario puede cambiar sus
            preferencias en cualquier momento reabriendo el panel de preferencias de cookies.
          </p>
        </Section>

        {/* 8. Configurar o bloquear */}
        <Section title="8. Cómo configurar o bloquear cookies">
          <p>
            El usuario puede configurar, bloquear o eliminar cookies directamente desde las
            opciones de privacidad de su navegador. Normalmente, el usuario puede:
          </p>
          <Ul
            items={[
              "Bloquear todas las cookies o permitir solo ciertas cookies",
              "Eliminar cookies existentes",
              "Recibir alertas antes de que una cookie sea almacenada",
              "Bloquear cookies de terceros",
            ]}
          />
          <p>
            La configuración varía según el navegador (Google Chrome, Safari, Mozilla Firefox,
            Microsoft Edge, Brave, Opera). Si el usuario bloquea algunas cookies, ciertas
            funciones del sitio podrían no operar correctamente.
          </p>
        </Section>

        {/* 9. Cookies de terceros */}
        <Section title="9. Cookies de terceros">
          <p>
            Algunas cookies son instaladas o gestionadas por terceros proveedores de servicios,
            como Google o Microsoft. Estos terceros pueden tratar información conforme a sus propias
            políticas de privacidad y términos de servicio. BTM Academy no controla completamente
            las cookies instaladas por terceros, por lo que recomienda al usuario revisar las
            políticas correspondientes de cada proveedor.
          </p>
        </Section>

        {/* 10. Transferencias internacionales */}
        <Section title="10. Transferencias internacionales">
          <p>
            Debido a que algunos proveedores tecnológicos pueden operar desde otros países, ciertos
            datos técnicos o de navegación podrían ser tratados internacionalmente. Esto puede
            ocurrir, por ejemplo, con servicios de analítica, hosting o almacenamiento. BTM Academy
            procurará utilizar proveedores que adopten medidas razonables de seguridad y protección
            de la información.
          </p>
        </Section>

        {/* 11. Actualizaciones */}
        <Section title="11. Actualizaciones de esta Política">
          <p>
            BTM Academy podrá actualizar esta Política de Cookies en cualquier momento para
            reflejar cambios técnicos, legales, operativos o comerciales. Cuando se realicen
            cambios importantes, se publicará la versión actualizada en la landing page. La fecha
            de entrada en vigencia indicada al inicio permite identificar la versión más reciente.
          </p>
        </Section>

        {/* 12. Contacto */}
        <Section title="12. Contacto">
          <p>
            Para preguntas, solicitudes o inquietudes relacionadas con esta Política de Cookies, el
            usuario puede contactar a BTM Academy a través del siguiente correo electrónico:
          </p>
          <p>
            <a
              href="mailto:btmtradingacademy@gmail.com"
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70"
            >
              btmtradingacademy@gmail.com
            </a>
          </p>
        </Section>
      </div>
    </LegalPage>
  );
}

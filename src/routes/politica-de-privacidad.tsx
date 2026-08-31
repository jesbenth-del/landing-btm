import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/politica-de-privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad — BTM Academy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PoliticaDePrivacidadPage,
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

function PoliticaDePrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad" effectiveDate="2 de julio de 2026">
      <div className="space-y-6">
        {/* Introducción */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              En BTM Academy respetamos la privacidad de las personas que visitan nuestro sitio web
              y diligencian nuestros formularios de contacto. Esta Política de Privacidad explica
              qué datos personales recopilamos, para qué los usamos, cómo los protegemos y cuáles
              son los derechos de los usuarios.
            </p>
            <p>
              Esta Política aplica a la landing page ubicada en{" "}
              <span className="font-medium text-foreground">https://www.btmacademy.co</span>.
            </p>
            <p>
              El tratamiento de datos personales se rige por la{" "}
              <span className="font-medium text-foreground">Ley 1581 de 2012</span> y el{" "}
              <span className="font-medium text-foreground">Decreto 1377 de 2013</span> de Colombia,
              normas que regulan la protección de datos personales en el país.
            </p>
          </div>
        </div>

        {/* 1. Identificación del responsable */}
        <Section title="1. Identificación del responsable del tratamiento">
          <p>
            El responsable del tratamiento de los datos personales es{" "}
            <span className="font-medium text-foreground">
              BTM Academy, marca educativa operada por Jesús Benthan
            </span>
            , con domicilio en Barranquilla, Colombia.
          </p>
          <p>
            Correo electrónico de contacto:{" "}
            <a
              href="mailto:btmtradingacademy@gmail.com"
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70"
            >
              btmtradingacademy@gmail.com
            </a>
          </p>
          <p>
            BTM Academy se encuentra en proceso de consolidación y registro como marca. Mientras
            ello ocurre, el tratamiento de datos personales se realiza bajo la responsabilidad de la
            persona natural anteriormente indicada.
          </p>
        </Section>

        {/* 2. Naturaleza de BTM Academy */}
        <Section title="2. Naturaleza de BTM Academy">
          <p>
            BTM Academy es una marca educativa dedicada a ofrecer formación, workshops y mentorías
            relacionadas con trading, Forex, Oro, Índices y lectura estructurada del mercado.
          </p>
          <p>
            BTM Academy <span className="font-medium text-foreground">no</span> es una entidad
            financiera, no actúa como broker, no administra recursos de terceros, no vende señales
            de trading, no presta asesoría financiera personalizada y no promete rentabilidad ni
            resultados financieros específicos.
          </p>
          <p>
            La información compartida por BTM Academy tiene fines educativos. Cualquier decisión de
            inversión o actividad de trading que realice el usuario será tomada de manera personal,
            autónoma y bajo su propia responsabilidad. BTM Academy no se hace responsable por
            pérdidas derivadas de decisiones de inversión tomadas por los usuarios.
          </p>
        </Section>

        {/* 3. Alcance */}
        <Section title="3. Alcance de esta Política">
          <p>
            Esta Política aplica a los datos personales recopilados a través de la landing page de
            BTM Academy, especialmente cuando el usuario solicita información, aplica a un Workshop,
            aplica a una Mentoría personalizada 1:1 o manifiesta interés en ambos programas.
          </p>
          <p>
            La landing page no funciona como tienda online. En este sitio no se procesan compras,
            pagos, carritos de compra, pasarelas de pago ni facturación electrónica.
          </p>
        </Section>

        {/* 4. Datos que recopilamos */}
        <Section title="4. Datos personales que recopilamos">
          <p>
            BTM Academy puede recopilar los siguientes datos cuando el usuario diligencia el
            formulario de contacto:
          </p>
          <Ul
            items={[
              "Nombre",
              "Correo electrónico",
              "WhatsApp o número de teléfono",
              "Tiempo que lleva estudiando trading",
              "Principal dificultad actual",
              "Interés del usuario: Workshop, Mentoría personalizada 1:1 o ambos",
              "Cualquier información adicional que el usuario escriba voluntariamente",
            ]}
          />
          <p>Además, el sitio puede recopilar información técnica mediante cookies:</p>
          <Ul
            items={[
              "Dirección IP o identificadores técnicos",
              "Tipo de dispositivo y navegador",
              "Sistema operativo",
              "Páginas visitadas e interacciones dentro del sitio",
              "Datos de comportamiento de navegación de forma agregada o seudonimizada",
            ]}
          />
          <p>
            BTM Academy no solicita intencionalmente datos sensibles, datos financieros,
            información bancaria, claves ni información relacionada con cuentas de trading.
          </p>
        </Section>

        {/* 5. Finalidades */}
        <Section title="5. Finalidades del tratamiento">
          <p>Los datos personales serán tratados para las siguientes finalidades:</p>
          <Ul
            items={[
              "Contactar al interesado y responder solicitudes de información",
              "Enviar información relacionada con los programas de BTM Academy",
              "Evaluar qué opción puede encajar mejor con el momento actual del usuario",
              "Gestionar comunicaciones previas a una posible mentoría o workshop",
              "Realizar seguimiento comercial relacionado únicamente con los servicios educativos de BTM Academy",
              "Llevar un registro interno de solicitudes recibidas",
              "Mejorar la experiencia del usuario en la landing page",
              "Analizar el rendimiento del sitio web",
              "Cumplir obligaciones legales cuando resulte aplicable",
            ]}
          />
          <p>
            BTM Academy no usará los datos para vender productos financieros, ofrecer señales de
            trading, prometer rentabilidad ni prestar asesoría financiera personalizada.
          </p>
        </Section>

        {/* 6. Autorización */}
        <Section title="6. Autorización del usuario">
          <p>
            Al diligenciar y enviar el formulario de contacto, el usuario autoriza de manera previa,
            expresa e informada a BTM Academy para recopilar, almacenar, usar y tratar sus datos
            personales conforme a esta Política de Privacidad.
          </p>
          <p>
            El usuario declara que la información suministrada es veraz, completa y actualizada, y
            que entrega sus datos de forma voluntaria.
          </p>
        </Section>

        {/* 7. Mayores de edad */}
        <Section title="7. Servicios dirigidos a mayores de edad">
          <p>
            Los servicios educativos de BTM Academy están dirigidos únicamente a personas mayores
            de edad. BTM Academy no busca recopilar datos personales de menores de edad. Si se
            identifica que un menor ha enviado información sin autorización válida, BTM Academy
            podrá eliminar dicha información.
          </p>
        </Section>

        {/* 8. Conservación */}
        <Section title="8. Conservación de los datos">
          <p>
            BTM Academy conservará los datos personales mientras sean necesarios para atender la
            solicitud del usuario, gestionar la relación comercial o educativa y mantener registros
            internos. Como referencia, los datos de solicitudes no convertidas se revisarán con
            criterio de supresión al cabo de{" "}
            <span className="font-medium text-foreground">dos (2) años</span> desde la última
            interacción, salvo que exista una obligación legal, contractual o razón legítima que
            exija conservarlos por un período adicional.
          </p>
          <p>
            El usuario puede solicitar la eliminación de sus datos en cualquier momento escribiendo
            a{" "}
            <a
              href="mailto:btmtradingacademy@gmail.com"
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70"
            >
              btmtradingacademy@gmail.com
            </a>
            .
          </p>
        </Section>

        {/* 9. Terceros */}
        <Section title="9. Terceros y encargados del tratamiento">
          <p>
            BTM Academy no vende, alquila ni comparte comercialmente los datos personales de los
            usuarios con terceros. Sin embargo, para operar el sitio y gestionar comunicaciones,
            los datos pueden ser tratados por proveedores tecnológicos necesarios, tales como:
          </p>
          <Ul
            items={[
              "Vercel — proveedor de hosting y despliegue del sitio web",
              "Supabase — almacenamiento de información recibida a través del formulario",
              "Google Analytics — analítica de tráfico y comportamiento agregado",
              "Microsoft Clarity — mapas de calor y grabaciones de sesión",
              "Servicios de correo electrónico utilizados para recibir o responder solicitudes",
              "Otros proveedores tecnológicos que BTM Academy pueda implementar en el futuro",
            ]}
          />
          <p>
            Estos proveedores tratan datos únicamente en la medida necesaria para prestar sus
            servicios, conforme a sus propias políticas y estándares de seguridad.
          </p>
          <p>
            Algunos de estos proveedores pueden estar ubicados fuera de Colombia, por lo que los
            datos podrían ser objeto de transferencia internacional con la única finalidad de
            operar el sitio y gestionar las solicitudes.
          </p>
        </Section>

        {/* 10. Google Analytics y Microsoft Clarity */}
        <Section title="10. Uso de Google Analytics y Microsoft Clarity">
          <p>
            BTM Academy utiliza <span className="font-medium text-foreground">Google Analytics</span>{" "}
            para analizar visitas, tráfico y rendimiento de la landing page, y{" "}
            <span className="font-medium text-foreground">Microsoft Clarity</span> para entender
            cómo los usuarios interactúan con el sitio (mapas de calor, grabaciones de sesión,
            clics y desplazamientos).
          </p>
          <p>
            Estas herramientas pueden recopilar información técnica, cookies, identificadores y
            datos de navegación conforme a sus propias políticas de privacidad. Su activación
            depende del consentimiento que el usuario otorgue mediante el banner de cookies del
            sitio.
          </p>
        </Section>

        {/* 11. Cookies */}
        <Section title="11. Cookies">
          <p>
            La landing page de BTM Academy puede utilizar cookies y tecnologías similares. Para
            conocer en detalle qué cookies se utilizan, cómo gestionarlas y cómo otorgar o revocar
            el consentimiento, consulta la{" "}
            <Link
              to="/politica-de-cookies"
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70"
            >
              Política de Cookies
            </Link>
            .
          </p>
        </Section>

        {/* 12. Derechos */}
        <Section title="12. Derechos del titular de los datos">
          <p>
            De conformidad con la Ley 1581 de 2012, el usuario como titular de sus datos personales
            puede ejercer los siguientes derechos:
          </p>
          <Ul
            items={[
              "Solicitar acceso a sus datos personales",
              "Solicitar la actualización, corrección o rectificación de información incorrecta o incompleta",
              "Solicitar la eliminación o supresión de sus datos personales",
              "Revocar la autorización otorgada para el tratamiento de sus datos",
              "Solicitar información sobre el uso que se ha dado a sus datos personales",
              "Presentar queja ante la Superintendencia de Industria y Comercio (SIC) cuando considere que no se ha atendido debidamente una solicitud sobre sus datos",
            ]}
          />
          <p>
            Para ejercer estos derechos, el usuario puede escribir a{" "}
            <a
              href="mailto:btmtradingacademy@gmail.com"
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70"
            >
              btmtradingacademy@gmail.com
            </a>
            , indicando su nombre, una descripción clara de la solicitud y un medio de contacto
            para responder. BTM Academy responderá dentro de los plazos previstos por la normativa
            aplicable.
          </p>
        </Section>

        {/* 13. Seguridad */}
        <Section title="13. Seguridad de la información">
          <p>
            BTM Academy implementa medidas razonables de seguridad técnicas, administrativas y
            organizativas para proteger los datos personales contra acceso no autorizado, pérdida,
            uso indebido, alteración o divulgación no autorizada.
          </p>
          <p>
            Ningún sistema de transmisión o almacenamiento en internet es completamente seguro. Por
            ello, aunque BTM Academy adopta medidas razonables de protección, no puede garantizar
            seguridad absoluta frente a ataques informáticos o fallas técnicas fuera de su control.
          </p>
        </Section>

        {/* 14. Comunicaciones comerciales */}
        <Section title="14. Comunicaciones comerciales">
          <p>
            BTM Academy podrá contactar al usuario por correo electrónico, WhatsApp u otros medios
            suministrados voluntariamente, con el fin de responder su solicitud, enviar información
            sobre los programas educativos y gestionar comunicaciones previas a una posible mentoría
            o workshop. Estas comunicaciones estarán relacionadas únicamente con los servicios
            educativos de BTM Academy.
          </p>
          <p>
            El usuario podrá solicitar en cualquier momento que se suspendan las comunicaciones
            comerciales escribiendo a{" "}
            <a
              href="mailto:btmtradingacademy@gmail.com"
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70"
            >
              btmtradingacademy@gmail.com
            </a>
            .
          </p>
        </Section>

        {/* 15. Transferencia internacional */}
        <Section title="15. Transferencia o transmisión internacional de datos">
          <p>
            Debido a la naturaleza de los servicios tecnológicos utilizados, algunos datos
            personales pueden ser almacenados o tratados en servidores ubicados fuera de Colombia.
            Esto puede ocurrir, por ejemplo, con los proveedores de hosting, almacenamiento,
            analítica o correo electrónico. BTM Academy procurará que dichos proveedores adopten
            medidas razonables de seguridad y tratamiento adecuado de la información.
          </p>
        </Section>

        {/* 16. Visitantes desde la UE/UK */}
        <Section title="16. Visitantes desde la Unión Europea o el Reino Unido">
          <p>
            Si accedes a este sitio desde la Unión Europea, el Reino Unido o Suiza, el tratamiento
            de tus datos se basa en el{" "}
            <span className="font-medium text-foreground">
              interés legítimo de BTM Academy en responder tu consulta
            </span>{" "}
            (Art. 6.1.f RGPD) y, para cookies no esenciales, en tu{" "}
            <span className="font-medium text-foreground">consentimiento explícito</span> (Art.
            6.1.a RGPD), que puedes otorgar o revocar en cualquier momento desde el banner de
            cookies. Además del derecho a reclamar ante la SIC, puedes dirigirte a la autoridad de
            protección de datos de tu país de residencia (p.ej., la AEPD en España, la ICO en el
            Reino Unido).
          </p>
        </Section>

        {/* 17. Enlace a terceros */}
        <Section title="17. Enlaces a sitios de terceros">
          <p>
            La landing page puede contener enlaces a sitios web o servicios de terceros. BTM Academy
            no controla las políticas de privacidad ni las prácticas de dichos terceros. El usuario
            debe revisar las políticas correspondientes antes de entregar información en sitios
            externos.
          </p>
        </Section>

        {/* 18. Cambios en la política */}
        <Section title="18. Cambios en esta Política de Privacidad">
          <p>
            BTM Academy podrá actualizar esta Política en cualquier momento para reflejar cambios
            legales, técnicos, operativos o comerciales. Cuando se realicen modificaciones
            importantes, se procurará informar a los usuarios mediante la publicación de la versión
            actualizada en la landing page. La fecha de entrada en vigencia indicada al inicio
            permite identificar la versión más reciente.
          </p>
        </Section>

        {/* 19. Contacto */}
        <Section title="19. Contacto">
          <p>
            Para preguntas, solicitudes, reclamos o inquietudes relacionadas con esta Política o
            con el tratamiento de datos personales, el usuario puede contactar a BTM Academy a
            través del siguiente correo electrónico:
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

import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Cómo se tratan los datos que enviás al pedir un turno con ${site.brand}.`,
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  const { legal, social } = site;
  return (
    <LegalPage title="Política de privacidad" updated="24 de noviembre de 2026">
      <p>
        Esta política explica qué datos se usan cuando pedís un turno desde este sitio y cuáles son tus derechos, de acuerdo
        con la Ley 25.326 de Protección de los Datos Personales y su reglamentación.
      </p>

      <h2>Responsable</h2>
      <p>
        {legal.fullName}, {legal.profession}
        {legal.matricula && <> ({legal.matricula})</>}. Contacto: WhatsApp{" "}
        <a className="link" href={social.whatsapp}>{social.whatsappDisplay}</a> e Instagram{" "}
        <a className="link" href={social.instagram}>{social.instagramHandle}</a>
        {legal.contactEmail && (
          <>
            {" "}o <a className="link" href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>
          </>
        )}
        .
      </p>

      <h2>Qué datos se piden y para qué</h2>
      <p>
        Para pedir un turno se piden nombre, apellido, mail, celular, el día y horario elegidos y cinco respuestas breves
        sobre tu salud y tus hábitos. Se usan únicamente para coordinar la consulta y prepararla. Las respuestas sobre
        salud son datos sensibles: solo se envían si aceptás expresamente hacerlo.
      </p>
      <p>
        Completar el formulario es voluntario. Sin estos datos no se puede armar el pedido por la página, pero siempre
        podés escribir directamente por WhatsApp.
      </p>

      <h2>Cómo viajan los datos</h2>
      <p>
        Este sitio <strong>no guarda</strong> los datos del formulario ni los manda a ningún servidor propio. Al tocar
        “¡Agendar!” se abre WhatsApp con el mensaje armado, y los datos solo llegan a Aldana si vos enviás ese mensaje.
        Desde ese momento, el mensaje queda en WhatsApp (un servicio de Meta, con su propia política de privacidad) y Aldana
        lo trata con secreto profesional.
      </p>

      <h2>Medición de visitas</h2>
      <p>
        El sitio usa Vercel Analytics para contar visitas de forma anónima y agregada (por ejemplo, cuántas personas
        entraron y desde qué tipo de dispositivo). No usa cookies ni identifica a nadie. El sitio está alojado en Vercel,
        que puede registrar datos técnicos de conexión, como la dirección IP, para su funcionamiento y seguridad.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Podés pedir en cualquier momento acceder a tus datos, rectificarlos, actualizarlos o suprimirlos, escribiendo por
        los medios de contacto indicados arriba. El derecho de acceso se puede ejercer en forma gratuita a intervalos no
        inferiores a seis meses, salvo que se acredite un interés legítimo (art. 14, inc. 3, Ley 25.326).
      </p>
      <p>
        La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley 25.326, tiene la
        atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por
        incumplimiento de las normas vigentes en materia de protección de datos personales.
      </p>
    </LegalPage>
  );
}

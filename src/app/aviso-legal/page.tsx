import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: `Datos de la titular, alcance de la información y condiciones de uso del sitio de ${site.brand}.`,
  alternates: { canonical: "/aviso-legal" },
};

export default function LegalNoticePage() {
  const { legal } = site;
  return (
    <LegalPage title="Aviso legal" updated="24 de noviembre de 2026">
      <h2>Titular</h2>
      <p>
        Este sitio pertenece a {legal.fullName}, {legal.profession}, egresada de la Universidad Adventista del Plata
        {legal.matricula && <>, {legal.matricula}</>}. Las consultas son online.
      </p>

      <h2>Alcance de la información</h2>
      <p>
        Los contenidos de este sitio son informativos y generales. No constituyen un diagnóstico ni un tratamiento, y no
        reemplazan una consulta profesional personalizada. Este sitio no es un servicio de urgencias: ante una emergencia,
        comunicate con el servicio de emergencias de tu zona.
      </p>

      <h2>Turnos</h2>
      <p>
        El pedido de turno desde la página arma un mensaje de WhatsApp. El turno queda reservado recién cuando Aldana lo
        confirma por ese medio. Los valores y la forma de pago se informan por WhatsApp.
      </p>

      <h2>Fotos y textos</h2>
      <p>
        Las fotos y los textos del sitio son de {legal.fullName}. No se pueden reproducir sin su autorización.
      </p>

      <h2>Enlaces a otros sitios</h2>
      <p>
        El sitio enlaza a WhatsApp e Instagram, servicios de terceros con sus propias condiciones y políticas de
        privacidad.
      </p>

      <h2>Datos personales</h2>
      <p>
        El tratamiento de los datos que se envían al pedir un turno se explica en la{" "}
        <a className="link" href="/privacidad">política de privacidad</a>.
      </p>
    </LegalPage>
  );
}

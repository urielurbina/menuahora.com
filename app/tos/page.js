import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Última actualización: 11 de octubre de 2024

Bienvenido a MenúAhora ("nosotros" o "nuestro"). Al acceder o usar nuestro sitio web, https://menuahora.com ("Sitio Web"), aceptas cumplir con estos Términos y Servicios ("Términos"). Por favor, léelos cuidadosamente.

1. Descripción del Servicio
MenúAhora ofrece herramientas para crear y personalizar menús digitales, así como la descarga de código para crear aplicaciones. Al comprar un paquete, los usuarios adquieren la propiedad del código, pero no pueden revenderlo ni transferir estos derechos a terceros.

2. Propiedad y Licencia
Los usuarios que compren un paquete tienen derecho a usar y modificar el código descargado para sus propios fines.
El código proporcionado es para uso personal o comercial, y está prohibida la reventa, redistribución o sublicencia del código.
MenúAhora retiene todos los demás derechos no expresamente otorgados en estos Términos.
3. Política de Reembolso
Ofrecemos un reembolso completo dentro de los 7 días posteriores a la fecha de compra si no estás satisfecho. Para solicitar un reembolso, por favor contáctanos en soyurielurbina@gmail.com.

4. Recopilación de Datos de los Usuarios
Recopilamos la siguiente información personal:

Nombre
Correo electrónico
Información de pago
Para más detalles sobre cómo manejamos tus datos, consulta nuestra Política de Privacidad.

5. Recopilación de Datos No Personales
También recopilamos datos no personales a través de cookies web para mejorar nuestros servicios y la experiencia del usuario. Al usar el Sitio Web, aceptas el uso de cookies de acuerdo con nuestra Política de Privacidad.

6. Cambios en los Términos
Podemos actualizar estos Términos de vez en cuando. Si realizamos cambios, notificaremos a los usuarios por correo electrónico. El uso continuo de nuestro Sitio Web después de cualquier cambio constituye tu aceptación de los Términos actualizados.

7. Ley Aplicable
Estos Términos se rigen y se interpretan de acuerdo con las leyes de México. Cualquier disputa que surja o esté relacionada con estos Términos se resolverá conforme a la legislación mexicana.

8. Información de Contacto
Para cualquier pregunta o inquietud sobre estos Términos, por favor contáctanos en:
Correo electrónico: soyurielurbina@gmail.com`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;

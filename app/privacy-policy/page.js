import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Última actualización: 11 de octubre de 2024

En MenúAhora ("nosotros" o "nuestro"), accesible desde https://menuahora.com, estamos comprometidos con la protección de tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información. Al utilizar nuestro sitio web, aceptas los términos descritos a continuación.

1. Información que Recopilamos
Recopilamos dos tipos de datos:

Información Personal: Incluye tu nombre, correo electrónico e información de pago para procesar pedidos.
Información No Personal: Recopilamos cookies web para mejorar tu experiencia de navegación.
2. Propósito de la Recopilación de Datos
Recopilamos tus datos para procesar y gestionar pedidos de manera eficiente y mejorar nuestros servicios.

3. Compartición de Datos
No compartimos tu información personal ni no personal con terceros. Toda la información se mantiene estrictamente confidencial.

4. Privacidad de los Niños
Nuestros servicios no están dirigidos a niños y no recopilamos intencionadamente datos de menores.

5. Cookies
Utilizamos cookies para mejorar la funcionalidad del sitio web y la experiencia del usuario. Al usar el sitio, consientes el uso de cookies según lo descrito en esta Política de Privacidad.

6. Actualizaciones a la Política de Privacidad
Podemos actualizar esta Política de Privacidad periódicamente. Si se realizan cambios significativos, notificaremos a los usuarios por correo electrónico. Revisa esta Política de Privacidad regularmente para estar informado sobre cómo protegemos tus datos.

7. Información de Contacto
Si tienes alguna pregunta o inquietud sobre nuestra Política de Privacidad, por favor contáctanos en:
Correo electrónico: soyurielurbina@gmail.com`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;

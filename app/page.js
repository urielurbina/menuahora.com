import {
  Hero,
  Features,
  UseCases,
  Comparison,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
  Footer,
} from '@/components/landing'
import { getSEOTags } from '@/libs/seo'
import config from '@/config'

export const metadata = getSEOTags({
  title: "Repisa - Crea tu Catálogo Digital y Recibe Pedidos por WhatsApp",
  description: "Crea tu catálogo digital en minutos. Agrega productos con variantes y extras, recibe pedidos directo en WhatsApp. Sin comisiones, productos ilimitados. Prueba gratis 7 días.",
  keywords: [
    "catálogo digital",
    "pedidos whatsapp",
    "menú digital",
    "tienda online whatsapp",
    "catálogo online",
    "pedidos online",
    "repisa",
    "catálogo productos",
    "ventas whatsapp",
  ],
  canonicalUrlRelative: "/",
  openGraph: {
    title: "Repisa - Catálogo Digital con Pedidos por WhatsApp",
    description: "Crea tu catálogo digital en minutos. Agrega productos con variantes y extras, recibe pedidos directo en WhatsApp. Prueba gratis 7 días.",
  },
})

// Structured data for the homepage
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `https://${config.domainName}/#organization`,
      "name": "Repisa",
      "url": `https://${config.domainName}`,
      "logo": {
        "@type": "ImageObject",
        "url": `https://${config.domainName}/images/logotipo_repisa_co_negro.png`,
      },
      "description": "Plataforma para crear catálogos digitales y recibir pedidos por WhatsApp.",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "url": "https://api.whatsapp.com/send?phone=526143348253",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `https://${config.domainName}/#software`,
      "name": "Repisa",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Crea tu catálogo digital y recibe pedidos por WhatsApp. Productos ilimitados, variantes, extras y precios por mayoreo.",
      "offers": {
        "@type": "Offer",
        "price": "199",
        "priceCurrency": "MXN",
        "priceValidUntil": "2026-12-31",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "50",
        "bestRating": "5",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `https://${config.domainName}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cómo funciona la prueba gratis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tienes 7 días para probar Repisa sin pagar. Creas tu catálogo, subes productos, y ves cómo funcionan los pedidos. Sin tarjeta de crédito.",
          },
        },
        {
          "@type": "Question",
          "name": "¿Cómo recibo los pedidos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cuando un cliente hace un pedido, te llega un mensaje a WhatsApp con todos los detalles: productos, cantidades, extras, total y datos del cliente.",
          },
        },
        {
          "@type": "Question",
          "name": "¿Puedo agregar variantes y extras?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí. Cada producto puede tener múltiples variantes (tamaños, sabores, colores) y extras opcionales. Los precios se calculan automáticamente.",
          },
        },
        {
          "@type": "Question",
          "name": "¿Cuántos productos puedo agregar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ilimitados. No hay límite de productos, categorías, ni variantes.",
          },
        },
        {
          "@type": "Question",
          "name": "¿Mi catálogo aparece en Google?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí. Cada catálogo está optimizado para SEO, lo que significa que Google puede indexarlo.",
          },
        },
        {
          "@type": "Question",
          "name": "¿Cobran comisión por venta?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Pagas una suscripción fija, sin importar cuántos pedidos recibas.",
          },
        },
      ],
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <main>
        <Hero />
        <Features />
        <UseCases />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

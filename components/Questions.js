'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { FaWhatsapp } from 'react-icons/fa'

const faqs = [
  {
    question: "¿Cómo funciona el sistema de pedidos por WhatsApp?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Los clientes navegan tu catálogo digital, seleccionan los productos que desean, personalizan su pedido y 
        con un clic envían la orden directamente a tu WhatsApp. Recibirás el pedido 
        completo y organizado para procesarlo fácilmente.
      </div>
    ),
  },
  {
    question: "¿Cómo crear mi catálogo digital para mi negocio?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Es muy simple: elige un plan, personaliza el diseño de tu catálogo con tus colores y logo, 
        sube tus productos y categorías. En minutos tendrás tu catálogo digital listo para compartir 
        y empezar a recibir pedidos por WhatsApp.
      </div>
    ),
  },
  {
    question: "¿Cómo actualizo mi catálogo y productos?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Desde tu panel de control puedes agregar, editar o eliminar productos y categorías en 
        tiempo real. Los cambios se reflejan instantáneamente en tu catálogo digital sin necesidad 
        de conocimientos técnicos o ayuda externa.
      </div>
    ),
  },
  {
    question: "¿Cómo comparto mi catálogo digital con clientes?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Tu catálogo incluye un link personalizado y código QR que puedes compartir en:
        • Redes sociales (Instagram, Facebook, etc.)
        • Estados de WhatsApp
        • Bio de Instagram
        • Material impreso de tu negocio
        Los clientes acceden desde cualquier dispositivo sin descargar apps.
      </div>
    ),
  },
  {
    question: "¿Cuántos productos puedo agregar?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Todos nuestros planes incluyen productos y categorías ilimitadas. Puedes organizar 
        tu catálogo digital como mejor se adapte a tu negocio, con múltiples categorías, 
        subcategorías y variaciones de productos.
      </div>
    ),
  },
  {
    question: "¿Puedo probar el sistema antes de pagar?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Sí, puedes explorar nuestro catálogo digital de demostración para ver todas las funcionalidades 
        desde la perspectiva del cliente: navegación del catálogo, selección de productos y proceso de 
        pedidos por WhatsApp. Para crear tu propio catálogo digital personalizado necesitarás adquirir 
        uno de nuestros planes. El proceso de creación es rápido y podrás empezar a recibir pedidos 
        el mismo día.
      </div>
    ),
  },
  {
    question: "¿Necesito conocimientos técnicos?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        No, nuestro sistema está diseñado para ser intuitivo y fácil de usar. Podrás crear 
        tu catálogo digital y gestionar pedidos por WhatsApp sin necesidad de conocimientos 
        técnicos o ayuda de programadores.
      </div>
    ),
  },
  {
    question: "¿Qué soporte técnico incluye?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Ofrecemos soporte técnico para la configuración inicial de tu catálogo, dudas sobre el sistema 
        de pedidos, problemas técnicos y optimización de tu catálogo. Nuestro equipo está disponible 
        para ayudarte a aprovechar al máximo tu catálogo digital.
      </div>
    ),
  }
]

export default function Questions() {
  const whatsappLink = "https://api.whatsapp.com/send?phone=526143348253&text=Hola,%20tengo%20una%20pregunta%20sobre%20MenúAhora"

  return (
    <section 
      className="bg-gradient-to-br from-white via-gray-50 to-white py-24 sm:py-32"
      aria-labelledby="faq-title"
      itemScope
      itemType="https://schema.org/FAQPage"
      lang="es"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center relative">
            {/* Elementos decorativos */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#0D654A]/5 rounded-full blur-3xl" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0D654A]/10 rounded-full blur-xl" />
            
            <h2 
              id="faq-title"
              className="inline-block px-4 py-1 text-sm font-semibold uppercase tracking-wider text-[#0D654A] bg-[#0D654A]/10 rounded-full"
            >
              Preguntas Frecuentes
            </h2>
            <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas saber sobre{' '}
              <span className="text-[#0D654A]">MenúAhora</span>
            </p>
          </div>

          <dl className="mt-12 space-y-6 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <Disclosure key={faq.question}>
                {({ open }) => (
                  <div 
                    className="pt-6"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <dt>
                      <DisclosureButton className="flex w-full items-start justify-between text-left">
                        <span 
                          className="text-base font-semibold leading-7 text-gray-900 hover:text-[#0D654A] transition-colors duration-200"
                          itemProp="name"
                        >
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          <ChevronDownIcon 
                            className={`h-6 w-6 text-[#0D654A] transition-transform duration-200 ${
                              open ? 'rotate-180 transform' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      </DisclosureButton>
                    </dt>
                    <DisclosurePanel 
                      className="mt-2 pr-12"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                      <p 
                        className="text-base leading-7 text-gray-600"
                        itemProp="text"
                      >
                        {faq.answer}
                      </p>
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            ))}
          </dl>

          <div className="mt-16 text-center">
            <p className="text-base text-gray-600">
              ¿Tienes más preguntas? Contáctanos directamente
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-[#0D654A] rounded-full shadow-lg shadow-[#0D654A]/20 hover:shadow-xl hover:shadow-[#0D654A]/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaWhatsapp className="h-5 w-5" />
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

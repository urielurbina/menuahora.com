import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
    {
        question: "¿Cuánto tiempo tarda en estar listo mi menú?",
        answer: (
          <p>
            El menú personalizado se entrega en un plazo de 24 a 72 horas, 
            dependiendo de la cantidad de productos y detalles proporcionados.
          </p>
        ),
      },
      {
        question: "¿Puedo actualizar mi menú después de recibirlo?",
        answer: (
          <div className="space-y-2 leading-relaxed">Sí, puedes editar y actualizar los productos en tu menú 
          en cualquier momento de forma rápida y sencilla, sin necesidad de contactar a un diseñador. 
          El diseño visual del menú no se puede modificar, pero siempre estará alineado con la identidad de tu marca.
          </div>
        ),
      },
      {
        question: "¿Qué necesito para comenzar?",
        answer: (
          <div className="space-y-2 leading-relaxed">Solo necesitas completar un formulario con la información 
          de tu negocio y subir los productos en un archivo Excel. Nosotros nos encargamos del resto. 
          Pronto, contaremos con un portal para facilitar aún más la gestión de tus productos.</div>
        ),
      },
      {
        question: "¿Puedo personalizar el diseño del menú?",
        answer: (
          <div className="space-y-2 leading-relaxed">Sí, un diseñador profesional adaptará el menú a la 
          identidad de tu marca, incluyendo colores, tipografía y estilo visual.</div>
        ),
      },
      {
        question: "¿Qué pasa si necesito ayuda?",
        answer: (
          <div className="space-y-2 leading-relaxed">Nuestro equipo de soporte está disponible para 
          asistirte con cualquier duda o problema que puedas tener.</div>
        ),
      },
  // More questions...
]

export default function Example() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-200">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Preguntas frecuentes</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="pt-6">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <ChevronDownIcon aria-hidden="true" className="h-6 w-6 text-gray-400 group-data-[open]:hidden" />
                      <ChevronUpIcon aria-hidden="true" className="h-6 w-6 text-gray-400 [.group:not([data-open])_&]:hidden" />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

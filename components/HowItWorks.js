'use client'

import Image from 'next/image'
import { LinkIcon, InformationCircleIcon, ClipboardDocumentListIcon, CheckCircleIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

const steps = [
  {
    name: 'Elige tu username',
    description: 'Selecciona un link personalizado para tu menú, que sea fácil de compartir y recordar.',
    icon: LinkIcon,
  },
  {
    name: 'Completa la información básica',
    description: 'Agrega los detalles de tu negocio, como el nombre, logotipo y descripción, para personalizar la apariencia de tu menú.',
    icon: InformationCircleIcon,
  },
  {
    name: 'Sube tus productos',
    description: 'Carga tus platillos, precios y categorías. Nuestro sistema intuitivo te facilita organizar todo rápidamente.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Revisión y confirmación',
    description: 'Nos aseguramos de que todo esté en orden antes de comenzar con el diseño.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Recibe tu menú personalizado',
    description: 'En 24-72 horas, tendrás un menú digital profesional listo para compartir y actualizar cuando lo necesites.',
    icon: DevicePhoneMobileIcon,
  },
]

const images = [
  { src: "/images/menu-digital-1.jpg", alt: "Ejemplo de menú digital", className: "col-span-2 row-span-2" },
  { src: "/images/restaurante-2.jpg", alt: "Interior de restaurante", className: "col-span-1 row-span-1" },
  { src: "/images/chef-3.jpg", alt: "Chef preparando platillo", className: "col-span-1 row-span-2" },
  { src: "/images/cliente-4.jpg", alt: "Cliente usando menú digital", className: "col-span-2 row-span-1" },
  // { src: "/images/plato-5.jpg", alt: "Plato gourmet", className: "col-span-3 row-span-1" }, // Quitamos hidden lg:block
]

export default function HowItWorks() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#0D654A]">How it works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cómo Funciona
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Obtén tu menú digital en solo cinco sencillos pasos. Nuestra plataforma facilita a los restaurantes la modernización de su proceso de pedidos.
          </p>
        </div>
        <div className="mt-12 sm:mt-16">
          <div className="lg:flex lg:items-stretch lg:space-x-16">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="grid grid-cols-3 grid-rows-3 gap-4 aspect-[4/3] lg:aspect-auto lg:h-full">
                {images.map((image, index) => (
                  <div key={index} className={`relative ${image.className}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="rounded-lg shadow-md object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <ul role="list" className="lg:w-1/2 space-y-8 flex flex-col justify-between">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0D654A]">
                        <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[#0D654A]">
                        Paso {stepIdx + 1}
                      </div>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{step.name}</p>
                      <p className="mt-2 text-base text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import 'swiper/css'
import 'swiper/css/pagination'
import Image from 'next/image'
import { PencilSquareIcon, ClipboardDocumentListIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

const steps = [
  {
    name: 'Personaliza tu sitio',
    description: 'Agrega los detalles clave de tu negocio, como nombre, logotipo y descripción, para que tu menú refleje la identidad de tu marca.',
    icon: PencilSquareIcon,
    imageSrc: '/images/paso1.png', // Corregido: eliminado 'public' del inicio
  },
  {
    name: 'Sube tus productos',
    description: 'Carga fácilmente tus platillos, precios y categorías. Nuestro sistema intuitivo te permite organizar y gestionar todo en minutos.',
    icon: ClipboardDocumentListIcon,
    imageSrc: '/images/paso2.png', // Reemplaza con la ruta de tu imagen real
  },
  {
    name: 'Disfruta de tu menú',
    description: 'Mantén tu menú actualizado en todo momento. Cambia productos y ajusta el diseño con total libertad.',
    icon: DevicePhoneMobileIcon,
    imageSrc: '/images/paso3.png', // Reemplaza con la ruta de tu imagen real
  },
]

export default function HowItWorks() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[#0D654A]">CÓMO FUNCIONA</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Obtén el menú que siempre has querido
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Crea tu sitio en 3 sencillos pasos y personalízalo a tu medida.
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-3 md:gap-x-12">
            {steps.map((step, index) => (
              <div key={step.name} className="flex flex-col items-center text-center">
                <div className="w-full h-64 relative mb-6">
                  <Image
                    src={step.imageSrc}
                    alt={`Paso ${index + 1}: ${step.name}`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={90}
                    className="object-cover object-center rounded-lg"
                    fill
                  />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0D654A]">
                  <step.icon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{index + 1}. {step.name}</h3>
                <p className="mt-2 text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

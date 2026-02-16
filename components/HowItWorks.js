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
    imageSrc: '/images/paso1.png',
    altText: 'Tutorial menú digital: Paso 1 - Personalización y configuración inicial del menú para restaurantes'
  },
  {
    name: 'Sube tus productos',
    description: 'Crea tu catálogo en minutos. Organiza fácilmente tus platillos, precios y categorías con nuestro sistema intuitivo.',
    icon: ClipboardDocumentListIcon,
    imageSrc: '/images/paso2.png',
    altText: 'Crear menú digital: Paso 2 - Carga de productos y platillos al catálogo digital del restaurante'
  },
  {
    name: 'Disfruta de tu menú',
    description: 'Recibe pedidos por WhatsApp automáticamente. Actualiza tu menú digital en tiempo real y gestiona todo desde un solo lugar.',
    icon: DevicePhoneMobileIcon,
    imageSrc: '/images/paso3.png',
    altText: 'Menú QR WhatsApp: Paso 3 - Sistema de pedidos automáticos por WhatsApp para restaurantes'
  },
]

export default function HowItWorks() {
  return (
    <section 
      className="bg-gradient-to-b from-white to-gray-50 py-20 sm:py-32"
      aria-labelledby="como-funciona"
      itemScope
      itemType="https://schema.org/HowTo"
      lang="es"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 
            id="como-funciona"
            className="inline-block px-4 py-1 text-sm font-semibold uppercase tracking-wider text-[#0D654A] bg-[#0D654A]/10 rounded-full"
            itemProp="name"
          >
            CÓMO FUNCIONA
          </h2>
          <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tu Catálogo Digital listo en <span className="text-[#0D654A]">3 Simples Pasos</span>
          </p>
          <meta itemProp="totalTime" content="PT10M" />
          <meta itemProp="tool" content="Menú Digital QR" />
          <meta itemProp="supply" content="Información del restaurante" />
          <link itemProp="target" href="https://repisa.co/crear-menu-digital" />
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto" itemProp="description">
            Descubre cómo transformar tu catálogo en una herramienta digital para recibir pedidos de manera eficiente.
          </p>
        </div>
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-3 md:gap-x-12 relative">
            <div className="hidden md:block absolute top-32 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#0D654A]/20 via-[#0D654A] to-[#0D654A]/20" />
            
            {steps.map((step, index) => (
              <div 
                key={step.name} 
                className="flex flex-col items-center text-center group"
                itemProp="step"
                itemScope
                itemType="https://schema.org/HowToStep"
              >
                <meta itemProp="position" content={index + 1} />
                <div className="w-full h-64 relative mb-8 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={step.imageSrc}
                    alt={step.altText}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={90}
                    className="object-cover object-center"
                    fill
                    itemProp="image"
                  />
                </div>
                <div 
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0D654A] shadow-lg shadow-[#0D654A]/20 transition-transform duration-300 group-hover:-translate-y-1"
                  role="presentation"
                >
                  <step.icon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                <h3 
                  className="mt-6 text-xl font-bold text-gray-900"
                  itemProp="name"
                >
                  <span className="text-[#0D654A]">{index + 1}.</span> {step.name}
                </h3>
                <p 
                  className="mt-3 text-base text-gray-600 max-w-sm"
                  itemProp="text"
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* eslint-disable @next/next/no-img-element */

'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import ButtonSignIn from '@/components/ButtonSignin'
import TestimonialsAvatars from './TestimonialsAvatars'
import { FaWhatsapp } from 'react-icons/fa'

const navigation = [
  { name: 'Beneficios', href: '#beneficios' },
  { name: 'Cómo funciona', href: '#como-funciona' },
  { name: 'Precios', href: '#precios' },
  { name: 'FAQ', href: '#faq' },
]

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8 backdrop-blur-sm bg-white/70">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">MenúAhora - Tu catálogo digital para restaurantes</span>
              <img
                alt="MenúAhora - Tu catálogo digital para restaurantes"
                src="https://res.cloudinary.com/dkuss2bup/image/upload/v1729739519/ohglabavyxhuflbn7jun.svg"
                className="h-6 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a> */}
            <ButtonSignIn />
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">MenúAhora - Tu catálogo digital para restaurantes</span>
                <img
                  alt="MenúAhora - Tu catálogo digital para restaurantes"
                  src="https://res.cloudinary.com/dkuss2bup/image/upload/v1729739519/ohglabavyxhuflbn7jun.svg"
                  className="h-6 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Cerrar menú</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  {/* <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a> */}
                  <ButtonSignIn />
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate pt-14 sm:pt-16 lg:pt-20">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0D654A] to-[#9BD9C7] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="lg:flex lg:items-center lg:gap-x-10">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto lg:w-1/2">
              <h1 className="max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-center lg:text-left mx-auto lg:mx-0">
                Crea tu Catálogo Digital y{' '}
                <span className="text-[#0D654A]">
                  Recibe Pedidos por WhatsApp{' '}
                  <FaWhatsapp className="inline-block mb-2 h-8 w-8 sm:h-12 sm:w-12" />
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 text-center lg:text-left">
                Diseña un catálogo profesional y recibe pedidos automáticamente por WhatsApp. 
                Sin comisiones, sin apps, actualización en tiempo real.
              </p>
              <div className="mt-8 sm:mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <a
                  href="/#pricing"
                  className="rounded-md bg-[#0D654A] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0D654A]/20 hover:shadow-xl hover:shadow-[#0D654A]/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Crear Mi Catálogo Digital
                </a>
                <a
                  href="https://www.menuahora.com/tacosuriel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/80 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-[#0D654A] shadow-md ring-1 ring-[#0D654A]/20 hover:bg-white hover:shadow-lg transition-all duration-200"
                >
                  Ver Demo
                </a>
              </div>
              <div className="mt-8 sm:mt-10 flex justify-center lg:justify-start">
                <TestimonialsAvatars priority={true} />
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:flex-shrink-0 lg:flex-grow lg:w-1/2">
              <div className="flex justify-center space-x-4 sm:space-x-8 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#0D654A]/5 to-transparent blur-2xl rounded-3xl" />
                
                <AppScreenshot imageUrl="/images/screenshot-menuahora-1.webp" />
                <AppScreenshot imageUrl="/images/screenshot-menuahora-2.webp" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#0D654A] to-[#9BD9C7] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </div>
  )
}

function AppScreenshot({ imageUrl }) {
  return (
    <svg role="img" viewBox="0 0 366 729" className="w-[18rem] max-w-full drop-shadow-xl" aria-hidden="true">
      <title>Vista previa de la aplicación MenúAhora</title>
      <defs>
        <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
          <rect rx={36} width={316} height={684} />
        </clipPath>
      </defs>
      <path
        d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z"
        fill="#000000"
      />
      <path
        d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z"
        fill="#111111"
      />
      <foreignObject
        width={316}
        height={684}
        clipPath="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)"
        transform="translate(24 24)"
      >
        <img 
          alt="Captura de pantalla de la aplicación MenúAhora mostrando el catálogo digital" 
          src={imageUrl}
          loading="eager"
          decoding="async"
        />
      </foreignObject>
    </svg>
  )
}

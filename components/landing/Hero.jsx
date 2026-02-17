'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Producto', href: '#producto' },
  { name: 'Precios', href: '#precios' },
  { name: 'FAQ', href: '#faq' },
]

const sections = [
  { id: 'producto', label: 'Producto', title: 'Todo lo que necesitas para mostrar tus productos y recibir pedidos por WhatsApp.' },
  { id: 'usecases', label: 'Casos de uso', title: 'Para cualquier tipo de negocio' },
  { id: 'comparison', label: 'Comparativa', title: 'El punto medio que necesitas' },
  { id: 'precios', label: 'Precios', title: 'Simple y transparente' },
  { id: 'faq', label: 'FAQ', title: 'Preguntas frecuentes' },
]

const heroProducts = [
  {
    name: 'Pastel de Chocolate',
    price: '$380',
    originalPrice: '$450',
    category: 'Pasteles',
    hasPromo: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
  },
  {
    name: 'Cupcake Chocolate',
    price: '$45',
    category: 'Cupcakes',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=200&h=200&fit=crop',
  },
  {
    name: 'Galletas Mantequilla',
    price: '$120',
    category: 'Galletas',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop',
  },
  {
    name: 'Cheesecake Frutos',
    price: '$380',
    category: 'Pasteles',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&h=200&fit=crop',
  },
]

// Phone mockup with product catalog
function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="pointer-events-none select-none"
    >
      {/* Phone frame */}
      <div className="relative mx-auto w-[280px] h-[560px] bg-neutral-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-neutral-900 rounded-b-2xl z-20" />

        {/* Screen */}
        <div className="relative w-full h-full bg-gray-100 rounded-[2.25rem] overflow-hidden">
          {/* Status bar */}
          <div className="h-11 bg-[#0D654A] flex items-end justify-center pb-1">
            <div className="flex items-center gap-1">
              <div className="w-6 h-1 bg-white/60 rounded-full" />
            </div>
          </div>

          {/* Header with logo */}
          <div className="bg-[#0D654A] px-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">🎂</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Pasteleria Luna</div>
                <div className="text-white/70 text-xs">repisa.co/luna</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white px-3 py-3 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-900 mb-2">Categorías</div>
            <div className="flex gap-1.5 overflow-hidden">
              <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-medium">Todo</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-medium">Pasteles</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-medium">Cupcakes</span>
            </div>
          </div>

          {/* Products grid */}
          <div className="p-3 grid grid-cols-2 gap-2">
            {heroProducts.map((product, i) => (
              <motion.div
                key={product.name}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                className="bg-white rounded-xl p-2 shadow-sm"
              >
                <div className="aspect-square rounded-lg mb-2 relative overflow-hidden">
                  {product.hasPromo && (
                    <div className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-1.5 py-0.5 rounded-full text-[6px] font-semibold z-10">
                      Oferta
                    </div>
                  )}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
                <span className="text-[7px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-full">{product.category}</span>
                <div className="text-[9px] font-semibold mt-1 text-gray-900">{product.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-bold text-gray-900">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-[8px] text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart button */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 right-3 bg-gray-900 text-white px-3 py-2 rounded-full flex items-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium">$425</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto max-w-[1400px] flex items-center justify-between px-6 lg:px-12 h-16 lg:h-20">
          <Link href="/" className="flex items-center">
            <Image
              alt="Repisa"
              src="/images/logotipo_repisa_co_negro.png"
              width={90}
              height={22}
              className="h-5 lg:h-6 w-auto"
            />
          </Link>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-neutral-900"
              aria-label="Abrir menu"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="flex items-center gap-6 ml-6 pl-6 border-l border-neutral-200">
              <Link href="/auth/signin" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                Entrar
              </Link>
              <Link
                href="/#precios"
                className="text-sm text-white bg-neutral-900 px-5 py-2.5 hover:bg-neutral-800 transition-colors"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-white" />
          <DialogPanel className="fixed inset-0 z-50 bg-white">
            <div className="flex items-center justify-between px-6 h-16">
              <Link href="/">
                <Image
                  alt="Repisa"
                  src="/images/logotipo_repisa_co_negro.png"
                  width={90}
                  height={22}
                  className="h-5 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-900"
                aria-label="Cerrar menu"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="px-6 py-8 space-y-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-2xl text-neutral-900"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-6 border-t border-neutral-200 space-y-4">
                <Link href="/auth/signin" className="block text-lg text-neutral-500">
                  Entrar
                </Link>
                <Link href="/#precios" className="block text-lg text-[#0D654A] font-medium">
                  Comenzar gratis →
                </Link>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Hero Content */}
      <main className="pt-16 lg:pt-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 lg:py-16">
            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left content */}
              <div className="lg:col-span-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Eyebrow */}
                  <p className="text-sm text-[#0D654A] tracking-wide uppercase mb-6 lg:mb-8">
                    7 dias gratis · Sin tarjeta
                  </p>

                  {/* Headline */}
                  <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] leading-[0.95] tracking-tight text-neutral-900 font-medium">
                    Tu catalogo digital.
                    <br />
                    <span className="text-[#0D654A]">Pedidos por WhatsApp.</span>
                  </h1>

                  {/* Subhead */}
                  <p className="mt-8 lg:mt-10 text-lg lg:text-xl text-neutral-500 leading-relaxed max-w-lg">
                    Mas que un PDF, menos que un ecommerce. Crea tu catalogo, agrega variantes y extras, recibe pedidos directo en WhatsApp.
                  </p>

                  {/* CTA */}
                  <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/#precios"
                      className="inline-flex items-center justify-center px-8 py-4 text-base text-white bg-[#0D654A] hover:bg-[#0a5640] transition-colors"
                    >
                      Crear mi catalogo
                    </Link>
                    <a
                      href="https://repisa.co/tacosuriel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-8 py-4 text-base text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      Ver demo →
                    </a>
                  </div>

                  {/* Section index - visible on desktop below CTA */}
                  <div className="hidden lg:block mt-16 pt-8 border-t border-neutral-200">
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">
                      En esta pagina
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {sections.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                          {section.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right: Phone Mockup */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const features = [
  'Productos ilimitados',
  'Categorias ilimitadas',
  'Variantes y extras',
  'Carrito de compras',
  'Pedidos a WhatsApp',
  'Link personalizado',
  'Codigo QR',
  'SEO optimizado',
  'Soporte por WhatsApp',
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="precios" className="bg-neutral-900">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left: Header & Toggle */}
          <div className="lg:col-span-5">
            <p className="text-sm text-[#0D654A] tracking-wide uppercase mb-4">
              Precios
            </p>
            <h2 className="text-3xl lg:text-5xl text-white font-medium tracking-tight leading-[1.1] mb-8">
              Simple y transparente
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed mb-12">
              Un solo plan con todo incluido. Sin sorpresas, sin comisiones.
            </p>

            {/* Toggle */}
            <div className="flex items-center gap-4 mb-12">
              <button
                onClick={() => setAnnual(false)}
                className={`text-sm ${!annual ? 'text-white' : 'text-neutral-500'}`}
              >
                Mensual
              </button>
              <button
                onClick={() => setAnnual(!annual)}
                className="relative w-12 h-6 bg-neutral-700 rounded-full transition-colors"
                role="switch"
                aria-checked={annual}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${annual ? 'left-7' : 'left-1'}`} />
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`text-sm ${annual ? 'text-white' : 'text-neutral-500'}`}
              >
                Anual
                <span className="ml-2 text-[#0D654A]">-37%</span>
              </button>
            </div>

            {/* Price */}
            <motion.div
              key={annual ? 'annual' : 'monthly'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl lg:text-7xl text-white font-light tracking-tight tabular-nums">
                  ${annual ? '1,499' : '199'}
                </span>
                <span className="text-neutral-500">
                  MXN / {annual ? 'año' : 'mes'}
                </span>
              </div>
              {annual && (
                <p className="text-sm text-neutral-500">
                  Equivale a $125/mes
                </p>
              )}
            </motion.div>

            {/* CTA */}
            <div className="mt-12">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center w-full lg:w-auto px-8 py-4 text-base text-neutral-900 bg-white hover:bg-neutral-100 transition-colors"
              >
                Comenzar 7 dias gratis
              </Link>
              <p className="mt-4 text-sm text-neutral-500">
                Sin tarjeta de credito
              </p>
            </div>
          </div>

          {/* Right: Features */}
          <div className="lg:col-span-6 lg:col-start-7 lg:border-l lg:border-neutral-800 lg:pl-12">
            <p className="text-sm text-neutral-500 uppercase tracking-wide mb-8">
              Todo incluido
            </p>
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-4 text-neutral-300">
                  <span className="w-1.5 h-1.5 bg-[#0D654A] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

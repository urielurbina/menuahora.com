'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

// Mini mockup for "Catalogo en minutos" - shows product grid building
function CatalogMockup() {
  const products = [
    { image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop' },
    { image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=100&h=100&fit=crop' },
    { image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop' },
    { image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=100&h=100&fit=crop' },
    { image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=100&h=100&fit=crop' },
    { image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100&h=100&fit=crop' },
  ]

  return (
    <div className="pointer-events-none select-none mt-8 bg-gray-50 rounded-lg p-3 overflow-hidden">
      <div className="flex gap-2">
        {/* Sidebar */}
        <div className="w-12 bg-[#0D654A] rounded-lg p-2 flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6 bg-white rounded-full mb-2"
          />
          <div className="w-full space-y-1">
            <div className="h-1 bg-white/40 rounded" />
            <div className="h-1 bg-white/20 rounded w-3/4" />
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 grid grid-cols-3 gap-1.5">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="bg-white rounded-md p-1 shadow-sm"
            >
              <div className="aspect-square rounded relative overflow-hidden mb-1">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="50px"
                />
              </div>
              <div className="h-1 bg-neutral-200 rounded w-full mb-0.5" />
              <div className="h-1 bg-[#0D654A] rounded w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mini mockup for "Variantes y extras" - shows variant selection UI
function VariantsMockup() {
  return (
    <div className="pointer-events-none select-none mt-8 bg-gray-50 rounded-lg p-3 overflow-hidden">
      <div className="bg-white rounded-lg p-3 shadow-sm">
        {/* Product header */}
        <div className="flex gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop"
              alt=""
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-neutral-200 rounded w-3/4 mb-1" />
            <div className="h-2 bg-[#0D654A] rounded w-1/3" />
          </div>
        </div>

        {/* Variant section */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-1.5 bg-neutral-300 rounded w-12" />
            <span className="text-[6px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded-full">Requerido</span>
          </div>
          <div className="space-y-1">
            <motion.div
              animate={{ borderColor: ['#e5e5e5', '#171717', '#e5e5e5'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-between p-1.5 border rounded-md bg-gray-50"
            >
              <div className="h-1.5 bg-neutral-400 rounded w-16" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 border-2 border-neutral-900 bg-neutral-900 rounded-full flex items-center justify-center"
              >
                <div className="w-1 h-1 bg-white rounded-full" />
              </motion.div>
            </motion.div>
            <div className="flex items-center justify-between p-1.5 border border-gray-200 rounded-md">
              <div className="flex items-center gap-1">
                <div className="h-1.5 bg-neutral-300 rounded w-14" />
                <span className="text-[6px] text-emerald-600">+$30</span>
              </div>
              <div className="w-2.5 h-2.5 border-2 border-gray-300 rounded-full" />
            </div>
          </div>
        </div>

        {/* Extras section */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-1.5 bg-neutral-300 rounded w-8" />
            <span className="text-[6px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded-full">Opcional</span>
          </div>
          <motion.div
            animate={{ borderColor: ['#e5e5e5', '#171717', '#e5e5e5'] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            className="flex items-center justify-between p-1.5 border rounded-md"
          >
            <div className="flex items-center gap-1">
              <div className="h-1.5 bg-neutral-300 rounded w-20" />
              <span className="text-[6px] text-emerald-600">+$15</span>
            </div>
            <motion.div
              animate={{ backgroundColor: ['#e5e5e5', '#171717', '#e5e5e5'] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              className="w-2.5 h-2.5 border-2 border-neutral-900 rounded flex items-center justify-center"
            >
              <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Mini mockup for "Pedidos a WhatsApp" - shows cart and WhatsApp message
function WhatsAppMockup() {
  return (
    <div className="pointer-events-none select-none mt-8 bg-gray-50 rounded-lg p-3 overflow-hidden">
      <div className="flex gap-2">
        {/* Cart summary */}
        <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="h-1.5 bg-neutral-300 rounded w-8" />
          </div>
          {/* Cart items */}
          <div className="space-y-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=50&h=50&fit=crop"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
              <div className="flex-1">
                <div className="h-1 bg-neutral-200 rounded w-full mb-0.5" />
                <div className="h-1 bg-neutral-400 rounded w-8" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=50&h=50&fit=crop"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
              <div className="flex-1">
                <div className="h-1 bg-neutral-200 rounded w-full mb-0.5" />
                <div className="h-1 bg-neutral-400 rounded w-6" />
              </div>
            </div>
          </div>
          {/* Total */}
          <div className="pt-1.5 border-t border-gray-100 flex justify-between items-center">
            <div className="h-1.5 bg-neutral-300 rounded w-6" />
            <div className="h-2 bg-neutral-900 rounded w-10" />
          </div>
        </div>

        {/* WhatsApp message */}
        <motion.div
          animate={{ x: [10, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          className="w-28 bg-[#25D366] rounded-lg p-2 shadow-sm"
        >
          <div className="flex items-center gap-1 mb-1.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-[7px] text-white font-medium">Nuevo pedido</span>
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-white/60 rounded w-full" />
            <div className="h-1 bg-white/40 rounded w-3/4" />
            <div className="h-1 bg-white/40 rounded w-5/6" />
            <div className="h-1 bg-white/60 rounded w-1/2" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    number: '01',
    title: 'Catalogo en minutos',
    description: 'Sube productos, organiza categorias, personaliza el diseno. Tu catalogo queda listo para compartir al instante.',
    mockup: CatalogMockup,
  },
  {
    number: '02',
    title: 'Variantes y extras',
    description: 'Tamanos, sabores, ingredientes adicionales. Tus clientes personalizan su pedido exactamente como lo quieren.',
    mockup: VariantsMockup,
  },
  {
    number: '03',
    title: 'Pedidos a WhatsApp',
    description: 'Sin comisiones. Tus clientes arman su carrito y envian el pedido completo a tu WhatsApp con un tap.',
    mockup: WhatsAppMockup,
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="producto" className="bg-neutral-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 lg:py-40">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 lg:mb-32">
          <div className="lg:col-span-5">
            <p className="text-sm text-[#0D654A] tracking-wide uppercase mb-4">
              Producto
            </p>
            <h2 className="text-3xl lg:text-5xl text-neutral-900 font-medium tracking-tight leading-[1.1]">
              Todo lo que necesitas para mostrar tus productos y recibir pedidos por WhatsApp.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-8">
            <p className="text-lg text-neutral-500 leading-relaxed">
              Un catalogo digital completo con sistema de pedidos. Simple de usar, rapido de configurar.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-neutral-200"
        >
          {features.map((feature, i) => {
            const MockupComponent = feature.mockup
            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 lg:p-10"
              >
                <span className="text-sm text-neutral-300 font-mono block mb-6">
                  {feature.number}
                </span>
                <h3 className="text-xl lg:text-2xl text-neutral-900 font-medium tracking-tight mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
                <MockupComponent />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

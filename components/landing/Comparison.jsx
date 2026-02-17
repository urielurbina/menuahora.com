'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const rows = [
  { feature: 'Tiempo de setup', pdf: 'Dias', repisa: 'Minutos', ecommerce: 'Semanas' },
  { feature: 'Costo mensual', pdf: '$0', repisa: '$199', ecommerce: '$500+' },
  { feature: 'Actualizaciones', pdf: 'Reimprimir', repisa: 'Instantaneo', ecommerce: 'Instantaneo' },
  { feature: 'Variantes y extras', pdf: '—', repisa: '✓', ecommerce: '✓' },
  { feature: 'Carrito de compras', pdf: '—', repisa: '✓', ecommerce: '✓' },
  { feature: 'Pedidos a WhatsApp', pdf: '—', repisa: '✓', ecommerce: '—' },
  { feature: 'Comisiones', pdf: '—', repisa: '—', ecommerce: '2-5%' },
]

export default function Comparison() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="comparison" className="bg-neutral-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 lg:py-40">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-24">
          <div className="lg:col-span-5">
            <p className="text-sm text-[#0D654A] tracking-wide uppercase mb-4">
              Comparativa
            </p>
            <h2 className="text-3xl lg:text-5xl text-neutral-900 font-medium tracking-tight leading-[1.1]">
              El punto medio que necesitas
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-8">
            <p className="text-lg text-neutral-500 leading-relaxed">
              Mas funcionalidad que un PDF, sin la complejidad ni el costo de un ecommerce.
            </p>
          </div>
        </div>

        {/* Comparison content */}
        <div ref={ref}>
          {/* Mobile: Card-based comparison */}
          <div className="md:hidden space-y-3">
            {rows.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-4 rounded-lg"
              >
                <div className="text-sm font-medium text-neutral-900 mb-3">
                  {row.feature}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1">PDF</div>
                    <div className="text-sm text-neutral-500">{row.pdf}</div>
                  </div>
                  <div className="text-center bg-[#0D654A]/10 rounded-lg py-2 -my-1">
                    <div className="text-[10px] text-[#0D654A] uppercase tracking-wide mb-1 font-medium">Repisa</div>
                    <div className="text-sm text-[#0D654A] font-medium">{row.repisa}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1">Ecommerce</div>
                    <div className="text-sm text-neutral-500">{row.ecommerce}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="hidden md:block bg-white overflow-x-auto"
          >
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-6 text-sm font-normal text-neutral-400"></th>
                <th className="p-6 text-sm font-normal text-neutral-400 text-center">PDF</th>
                <th className="p-6 text-sm font-normal text-white text-center bg-[#0D654A]">Repisa</th>
                <th className="p-6 text-sm font-normal text-neutral-400 text-center">Ecommerce</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.05 }}
                  className="border-t border-neutral-100"
                >
                  <td className="p-6 text-sm text-neutral-900">{row.feature}</td>
                  <td className="p-6 text-sm text-neutral-400 text-center">{row.pdf}</td>
                  <td className="p-6 text-sm text-[#0D654A] text-center font-medium bg-[#0D654A]/5">{row.repisa}</td>
                  <td className="p-6 text-sm text-neutral-400 text-center">{row.ecommerce}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        </div>
      </div>
    </section>
  )
}

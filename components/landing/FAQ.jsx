'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const faqs = [
  {
    q: 'Como funciona la prueba gratis?',
    a: 'Tienes 7 dias para probar Repisa sin pagar. Creas tu catalogo, subes productos, y ves como funcionan los pedidos. Sin tarjeta de credito.',
  },
  {
    q: 'Como recibo los pedidos?',
    a: 'Cuando un cliente hace un pedido, te llega un mensaje a WhatsApp con todos los detalles: productos, cantidades, extras, total y datos del cliente.',
  },
  {
    q: 'Puedo agregar variantes y extras?',
    a: 'Si. Cada producto puede tener multiples variantes (tamanos, sabores, colores) y extras opcionales. Los precios se calculan automaticamente.',
  },
  {
    q: 'Cuantos productos puedo agregar?',
    a: 'Ilimitados. No hay limite de productos, categorias, ni variantes.',
  },
  {
    q: 'Mi catalogo aparece en Google?',
    a: 'Si. Cada catalogo esta optimizado para SEO, lo que significa que Google puede indexarlo.',
  },
  {
    q: 'Cobran comision por venta?',
    a: 'No. Pagas una suscripcion fija, sin importar cuantos pedidos recibas.',
  },
]

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left: Header */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm text-[#0D654A] tracking-wide uppercase mb-4">
                FAQ
              </p>
              <h2 className="text-3xl lg:text-4xl text-neutral-900 font-medium tracking-tight leading-[1.1] mb-8">
                Preguntas frecuentes
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-8">
                Tienes otra pregunta?
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=526143348253&text=Hola,%20tengo%20una%20pregunta%20sobre%20Repisa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0D654A] hover:underline"
              >
                Escribenos por WhatsApp →
              </a>
            </div>
          </div>

          {/* Right: Questions */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 lg:col-start-6"
          >
            <div className="divide-y divide-neutral-200">
              {faqs.map((faq, i) => (
                <Disclosure key={faq.q}>
                  {({ open }) => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: i * 0.05 }}
                      className="py-6"
                    >
                      <DisclosureButton className="flex w-full items-start justify-between text-left">
                        <span className="text-lg text-neutral-900 pr-8">
                          {faq.q}
                        </span>
                        <span className="flex-shrink-0 text-neutral-400">
                          {open ? '−' : '+'}
                        </span>
                      </DisclosureButton>
                      <DisclosurePanel className="mt-4 text-neutral-500 leading-relaxed pr-12">
                        {faq.a}
                      </DisclosurePanel>
                    </motion.div>
                  )}
                </Disclosure>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

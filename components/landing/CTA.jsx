'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="bg-[#0D654A]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 lg:py-40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl lg:text-5xl xl:text-6xl text-white font-medium tracking-tight leading-[1.1]">
              Tu catalogo digital, listo en minutos
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-lg">
              Empieza tu prueba gratis de 7 dias. Sin tarjeta de credito.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center w-full px-8 py-4 text-base text-[#0D654A] bg-white hover:bg-neutral-100 transition-colors"
            >
              Crear mi catalogo
            </Link>
            <a
              href="https://repisa.co/tacosuriel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-8 py-4 mt-4 text-base text-white/70 hover:text-white transition-colors"
            >
              Ver demo →
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

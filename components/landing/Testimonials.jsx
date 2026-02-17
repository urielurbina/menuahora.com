'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    quote: "Antes mandaba un PDF y me la pasaba explicando precios. Ahora mis clientas arman su pedido solas.",
    author: "Lucia Mendez",
    business: "Boutique Bella Luna",
  },
  {
    quote: "Lo mejor es poder actualizar el catalogo al instante. Cuando llegan piezas nuevas, las subo en 5 minutos.",
    author: "Carmen Flores",
    business: "Floreria El Jardin",
  },
  {
    quote: "Mis clientes pueden ver fotos, elegir tamano y agregar extras. Los pedidos llegan super claros.",
    author: "Patricia Ruiz",
    business: "Pasteleria Dulce Tentacion",
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 lg:py-40">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <p className="text-sm text-[#0D654A] tracking-wide uppercase mb-4">
            Testimonios
          </p>
          <h2 className="text-3xl lg:text-5xl text-neutral-900 font-medium tracking-tight leading-[1.1]">
            Negocios reales
          </h2>
        </div>

        {/* Testimonials */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-neutral-200"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 lg:p-12"
            >
              <p className="text-lg lg:text-xl text-neutral-900 leading-relaxed mb-8">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm text-neutral-900 font-medium">{testimonial.author}</p>
                <p className="text-sm text-neutral-400">{testimonial.business}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

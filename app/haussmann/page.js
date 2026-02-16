'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaWhatsapp, FaShareAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Component() {
  const services = [
    { name: "HAUSSMANN'SS SSUPREME", duration: 80, price: 1500, description: "MASAJE VIGORIZANTE CUERPO COMPLETO. INCLUYE PIEDRAS CALIENTES, VENTOSAS Y ACEITES ESENCIALES." },
    { name: "BANNDIDO SSERENNO", duration: 50, price: 1000, description: "MASAJE VIGORIZANTE CUERPO COMPLETO. INCLUYE PIEDRAS CALIENTES, VENTOSAS Y ACEITES ESENCIALES." },
    { name: "FORTALEZA HAUSSMANN", duration: 60, price: 1099, description: "MASAJE RECOVERY DEEP TISSUE." },
    { name: "REVIVE PIERNAS", duration: 45, price: 1000, description: "ALIVIO INSTANTÁNEO PARA PIERNAS CANSADAS CON UN MASAJE REVITALIZANTE." },
    { name: "NNECK & BACK", duration: 45, price: 1000, description: "MASAJE INTENSO PARA TUS MÚSCULOS DE ESPALDA, BRAZOS Y CUELLO. INCLUYE PIEDRAS CALIENTES, VENTOSAS Y ACEITES ESENCIALES." },
    { name: "MASSAJE EXPRESS", duration: 30, price: 699, description: "MASAJE EXPRESS RELAJANTE." },
    { name: "CRÁNNEO FACIAL", duration: 30, price: 699, description: "MASAJE SÚPER RELAJANTE DE CRÁNEO, ROSTRO Y CUELLO." },
    { name: "THE ROCK MASSAGE", duration: 50, price: 1000, description: "MASAJE SÚPER RELAJANTE DE CRNEO, ROSTRO Y CUELLO." },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12 flex flex-col">
      <div className="flex-grow max-w-4xl mx-auto p-5 text-center font-sans">
        <motion.header
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-44 h-44 relative mb-6">
            <div className="absolute inset-0 bg-white rounded-full"></div>
            <div className="absolute inset-1 bg-black rounded-full"></div>
            <div className="absolute inset-2 overflow-hidden rounded-full">
              <Image
                src="/images/fotoperfil.jpg"
                alt="Haussmann Logo"
                width={160}
                height={160}
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex gap-6">
            <Link href="https://instagram.com" aria-label="Instagram">
              <FaInstagram size={28} className="text-white hover:text-gray-300 transition-colors" />
            </Link>
            <Link href="https://whatsapp.com" aria-label="WhatsApp">
              <FaWhatsapp size={28} className="text-white hover:text-gray-300 transition-colors" />
            </Link>
            <Link href="#" aria-label="Share">
              <FaShareAlt size={28} className="text-white hover:text-gray-300 transition-colors" />
            </Link>
          </div>
        </motion.header>

        <main className="bg-black rounded-lg shadow-xl p-8 space-y-16">
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold mb-4">Haussmann</h1>
            <p className="text-2xl mb-6 text-gray-300">SPA PARA HOMBRES EN MONTERREY.</p>
            
            <div className="text-gray-400 mb-8">
              <p>LUNES - VIERNES | 11AM - 8PM</p>
              <p>SÁBADO - DOMINGO | CERRADO</p>
            </div>

            <div className="flex justify-center items-center">
              <Link 
                href="https://goo.gl/maps/your-google-maps-link-here" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-black px-6 py-3 rounded-full flex items-center gap-3 hover:bg-gray-200 transition-colors"
              >
                <FaMapMarkerAlt size={24} />
                <span className="text-lg font-semibold">MONTERREY SUR, COL. CONTRY</span>
              </Link>
            </div>
          </motion.section>

          <motion.nav
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {["MENÚ DE TERAPIAS", "TERAPEUTA PERLA URBINA", "CUENTANOS TU EXPERIENCIA"].map((item, index) => (
              <motion.button
                key={item}
                className="py-3 px-6 border-2 border-white text-lg hover:bg-white hover:text-black transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            ))}
            <motion.button
              className="py-3 px-6 bg-white text-black text-lg flex justify-center items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWhatsapp size={24} />
              AGENDA TU CITA
            </motion.button>
          </motion.nav>

          <motion.section
            className="bg-white text-black p-8 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-7xl font-bold mb-4">-20%</h2>
            <p className="text-2xl mb-3">TODOS LOS DÍAS DE 11AM A 2PM</p>
            <p className="text-lg">
              RESERVA DE 11AM A 2PM MENCIONANDO ESTA PROMOCIÓN Y
              OBTÉN UN DESCUENTO EN LA TERAPIA DE TU ELECCIÓN
            </p>
          </motion.section>

          <motion.section
            className="text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8">Menú de Servicios</h2>
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="mb-8 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl font-bold bg-white text-black px-4 py-2 inline-block">{service.name}</h3>
                  <span className="text-2xl text-gray-300">${service.price}</span>
                </div>
                <p className="text-lg mb-2 text-gray-400">DURACIÓN: {service.duration} MINUTOS</p>
                <p className="text-lg text-gray-300">{service.description}</p>
                {index < services.length - 1 && (
                  <div className="border-b border-gray-800 my-8"></div>
                )}
              </motion.div>
            ))}
          </motion.section>

          <motion.section
            className="bg-white text-black p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
          >
            <h2 className="text-3xl font-bold mb-6">¿NO SABES CUÁL MASAJE NECESITAS?</h2>
            <button className="bg-black text-white py-3 px-6 text-lg flex items-center justify-center gap-3 w-full">
              <FaWhatsapp size={24} />
              ENVÍANOS UN WHATSAPP
            </button>
          </motion.section>

          <motion.section
            className="text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
          >
            <h2 className="text-3xl font-bold mb-6">Nuestra Fundadora</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-56 h-56 relative rounded-full overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Perla Urbina"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Perla Urbina</h3>
                <p className="text-lg mb-3 text-gray-300">Fundadora y Terapeuta Principal</p>
                <p className="text-lg mb-4 text-gray-400">
                  Con más de 15 años de experiencia en terapias de masaje y bienestar, 
                  Perla Urbina fundó Haussmann con la visión de crear un espacio único 
                  dedicado al cuidado y relajación masculina en Monterrey.
                </p>
                <p className="text-lg text-gray-400">
                  Certificada en diversas técnicas de masaje, incluyendo masaje deportivo, 
                  terapia de piedras calientes y masaje tailandés, Perla combina su amplio 
                  conocimiento con una atención personalizada para cada cliente.
                </p>
              </div>
            </div>
          </motion.section>
        </main>

        <footer className="mt-16 text-center text-gray-400 pb-4">
          <p className="text-sm">
            ¿Quieres un menú digital como este para tu negocio? Visita{' '}
            <a href="https://repisa.co" className="underline hover:text-white transition-colors">
              repisa.co
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

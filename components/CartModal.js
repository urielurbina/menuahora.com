'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

export default function CartModal({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem,
  appearance = {}
}) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    metodoPago: 'efectivo',
    metodoEntrega: 'recoleccion',
    direccion: ''
  })

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.precio * item.quantity)
    }, 0)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    // Aquí iría la lógica para enviar el pedido por WhatsApp
    console.log('Enviando pedido...', formData)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white w-full h-[90vh] sm:h-[85vh] sm:max-w-lg sm:rounded-xl relative flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {step === 1 ? 'Tu pedido' : 'Completa tu pedido'}
              </h2>
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 overflow-y-auto">
              {step === 1 ? (
                // Paso 1: Lista de productos
                <div className="p-4 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.nombre}</h3>
                        <p className="text-sm text-gray-500">${item.precio}</p>
                        
                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Botón eliminar */}
                      <button
                        onClick={() => onRemoveItem(item._id)}
                        className="text-red-500 p-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // Paso 2: Formulario de pedido
                <div className="p-4 space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Tu número de WhatsApp"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de pago
                      </label>
                      <select
                        name="metodoPago"
                        value={formData.metodoPago}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia bancaria</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de entrega
                      </label>
                      <select
                        name="metodoEntrega"
                        value={formData.metodoEntrega}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="recoleccion">Recolección</option>
                        <option value="domicilio">Entrega a domicilio</option>
                      </select>
                    </div>

                    {formData.metodoEntrega === 'domicilio' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección de entrega
                        </label>
                        <textarea
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="Tu dirección completa"
                          rows="3"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer fijo */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total estimado:</span>
                  <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  className="w-full h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Iniciar compra
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Completar pedido en WhatsApp
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
'use client'

import { motion } from 'framer-motion'

export default function CartPreview({ onClick, cart }) {
  // Calcular el total de items en el carrito
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // No mostrar el preview si no hay items
  if (!totalItems) return null;

  return (
    <div 
      onClick={onClick}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-lg cursor-pointer z-50 flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span className="font-medium">${cart.total.toFixed(2)}</span>
      <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-sm">
        {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
      </span>
    </div>
  )
} 
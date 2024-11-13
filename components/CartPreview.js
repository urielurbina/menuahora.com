'use client'

import { motion } from 'framer-motion'

export default function CartPreview({ onClick, itemCount = 0, total = 0 }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-50 px-4">
      <motion.button
        onClick={onClick}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-3 w-auto min-w-[200px]"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span className="font-medium whitespace-nowrap">Ver carrito</span>
        {total > 0 && (
          <span className="font-bold whitespace-nowrap">${total.toFixed(2)}</span>
        )}
      </motion.button>
    </div>
  )
} 
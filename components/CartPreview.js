'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function CartPreview({ onClick, cart }) {
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (!totalItems) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={onClick}
        className="
          fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2
          bg-gray-900 text-white
          px-5 py-3.5 sm:px-6 sm:py-3
          rounded-2xl sm:rounded-full
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          cursor-pointer z-50
          flex items-center justify-between sm:justify-center gap-3
          active:scale-[0.98] transition-transform duration-150
          backdrop-blur-sm
        "
        style={{
          paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom, 0.875rem))'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <motion.span
              key={totalItems}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 bg-white text-gray-900 rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[11px] font-bold px-1"
            >
              {totalItems}
            </motion.span>
          </div>
          <span className="text-sm sm:text-base font-medium sm:hidden">Ver carrito</span>
        </div>
        <motion.span
          key={cart.total}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-base sm:text-lg font-semibold tabular-nums"
        >
          ${cart.total.toFixed(2)}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  )
} 
'use client'

import { motion } from 'framer-motion'

const products = [
  {
    name: 'Ramo Primaveral',
    price: '$450',
    category: 'Ramos',
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop',
    hasVariants: true,
  },
  {
    name: 'Arreglo Elegante',
    price: '$680',
    category: 'Arreglos',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&h=200&fit=crop',
    hasExtras: true,
  },
  {
    name: 'Rosas Rojas x12',
    price: '$320',
    category: 'Rosas',
    image: 'https://images.unsplash.com/photo-1518882605630-8eb5e568c5df?w=200&h=200&fit=crop',
  },
]

export default function ProductMockup() {
  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative mx-auto w-[280px] sm:w-[320px]">
        {/* Phone outer frame */}
        <div className="relative bg-gray-900 rounded-[3rem] p-2 border-[3px] border-gray-800">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10" />

          {/* Screen */}
          <div className="relative bg-white rounded-[2.5rem] overflow-hidden">
            {/* Status bar */}
            <div className="h-12 bg-white flex items-end justify-center pb-2">
              <div className="w-20 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* App content */}
            <div className="px-4 pb-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Catalogo</p>
                  <h3 className="text-lg font-semibold text-gray-900">Floreria Bella</h3>
                </div>
                <div className="w-10 h-10 bg-[#0D654A]/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0D654A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>

              {/* Categories */}
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                {['Todo', 'Ramos', 'Arreglos', 'Rosas'].map((cat, i) => (
                  <span
                    key={cat}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      i === 0
                        ? 'bg-[#0D654A] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Products */}
              <div className="space-y-3">
                {products.map((product, i) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-400">{product.category}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#0D654A]">
                          {product.price}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {product.hasVariants && (
                          <span className="px-1.5 py-0.5 text-[9px] font-medium bg-blue-50 text-blue-600 rounded">
                            Variantes
                          </span>
                        )}
                        {product.hasExtras && (
                          <span className="px-1.5 py-0.5 text-[9px] font-medium bg-orange-50 text-orange-600 rounded">
                            Extras
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-800">Pedir por WhatsApp</p>
                    <p className="text-[10px] text-gray-500">2 articulos en tu carrito</p>
                  </div>
                  <span className="text-sm font-semibold text-[#0D654A]">$1,130</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -right-4 top-20 bg-white rounded-xl p-3 border border-gray-100 max-w-[140px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#0D654A]/10 flex items-center justify-center">
              <svg className="w-3 h-3 text-[#0D654A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-gray-700">Personalizable</span>
          </div>
          <p className="text-[9px] text-gray-500 leading-relaxed">
            Variantes, extras y opciones para cada producto
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute -left-4 bottom-32 bg-white rounded-xl p-3 border border-gray-100 max-w-[130px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#0D654A]/10 flex items-center justify-center">
              <svg className="w-3 h-3 text-[#0D654A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-gray-700">SEO</span>
          </div>
          <p className="text-[9px] text-gray-500 leading-relaxed">
            Indexado en Google para que te encuentren
          </p>
        </motion.div>
      </div>
    </div>
  )
}

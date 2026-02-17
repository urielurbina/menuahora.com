'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const useCases = [
  {
    id: 'pastelerias',
    name: 'Pastelerias',
    emoji: '🎂',
    color: '#FF6B9D',
    products: [
      { name: 'Pastel de Chocolate', price: '450.00', promoPrice: '380.00', category: 'Pasteles', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop' },
      { name: 'Cupcake Chocolate', price: '45.00', category: 'Cupcakes', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=200&h=200&fit=crop' },
      { name: 'Galletas Mantequilla', price: '120.00', category: 'Galletas', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop' },
      { name: 'Cheesecake Frutos', price: '380.00', category: 'Pasteles', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&h=200&fit=crop' },
    ],
    categories: ['Todo', 'Pasteles', 'Cupcakes', 'Galletas'],
  },
  {
    id: 'florerias',
    name: 'Florerias',
    emoji: '💐',
    color: '#E91E63',
    products: [
      { name: 'Ramo de Rosas', price: '650.00', promoPrice: '550.00', category: 'Ramos', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&h=200&fit=crop' },
      { name: 'Arreglo Tropical', price: '480.00', category: 'Arreglos', image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop' },
      { name: 'Girasoles (12 pzas)', price: '320.00', category: 'Flores', image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&h=200&fit=crop' },
      { name: 'Caja de Tulipanes', price: '890.00', category: 'Premium', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=200&h=200&fit=crop' },
    ],
    categories: ['Todo', 'Ramos', 'Arreglos', 'Flores'],
  },
  {
    id: 'boutiques',
    name: 'Boutiques',
    emoji: '👗',
    color: '#9C27B0',
    products: [
      { name: 'Vestido Verano', price: '890.00', promoPrice: '690.00', category: 'Vestidos', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop' },
      { name: 'Blusa Bordada', price: '450.00', category: 'Blusas', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200&h=200&fit=crop' },
      { name: 'Pantalon Lino', price: '680.00', category: 'Pantalones', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop' },
      { name: 'Bolso Artesanal', price: '520.00', category: 'Accesorios', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&h=200&fit=crop' },
    ],
    categories: ['Todo', 'Vestidos', 'Blusas', 'Accesorios'],
  },
  {
    id: 'cosmeticos',
    name: 'Cosmeticos',
    emoji: '💄',
    color: '#F44336',
    products: [
      { name: 'Set Skincare Noche', price: '780.00', promoPrice: '650.00', category: 'Skincare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop' },
      { name: 'Paleta de Sombras', price: '420.00', category: 'Maquillaje', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop' },
      { name: 'Serum Vitamina C', price: '350.00', category: 'Skincare', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop' },
      { name: 'Labial Matte Set', price: '280.00', category: 'Maquillaje', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop' },
    ],
    categories: ['Todo', 'Skincare', 'Maquillaje', 'Sets'],
  },
  {
    id: 'artesanias',
    name: 'Artesanias',
    emoji: '🎨',
    color: '#FF9800',
    products: [
      { name: 'Vela Aromatica', price: '180.00', category: 'Velas', image: 'https://images.unsplash.com/photo-1603905179474-10ea97ec0d38?w=200&h=200&fit=crop' },
      { name: 'Maceta Pintada', price: '250.00', promoPrice: '220.00', category: 'Decoracion', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop' },
      { name: 'Taza de Ceramica', price: '150.00', category: 'Ceramica', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&h=200&fit=crop' },
      { name: 'Cuadro Bordado', price: '380.00', category: 'Arte', image: 'https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?w=200&h=200&fit=crop' },
    ],
    categories: ['Todo', 'Velas', 'Ceramica', 'Decoracion'],
  },
]

// Product card mockup matching the real ProductList component
function ProductCardMockup({ name, price, promoPrice, category, image }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
      <div className="p-2">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          {promoPrice && (
            <div className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-1.5 py-0.5 rounded-full text-[6px] font-semibold z-10">
              Oferta
            </div>
          )}
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>
        <div className="mt-1.5">
          <span className="text-[6px] text-gray-500 bg-gray-50 px-1 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="font-semibold text-[8px] mt-0.5 leading-tight line-clamp-2 text-neutral-900">
          {name}
        </h3>
        <div className="flex items-baseline gap-1 mt-0.5">
          {promoPrice ? (
            <>
              <p className="text-[9px] font-bold text-gray-900">${promoPrice}</p>
              <p className="text-gray-400 line-through text-[6px]">${price}</p>
            </>
          ) : (
            <p className="text-[9px] font-bold text-gray-900">${price}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Category pill mockup
function CategoryPillMockup({ name, active }) {
  return (
    <div className={`
      flex-shrink-0 px-2 py-0.5 rounded-full text-[6px] font-medium
      ${active
        ? 'bg-gray-900 text-white'
        : 'bg-gray-100 text-gray-700'
      }
    `}>
      {name}
    </div>
  )
}

// Mobile phone mockup component
function PhoneMockup({ activeCase }) {
  return (
    <div className="relative mx-auto w-[240px] h-[480px] bg-neutral-900 rounded-[2.5rem] p-2.5 shadow-2xl">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-neutral-900 rounded-b-xl z-20" />

      {/* Screen */}
      <div className="relative w-full h-full bg-gray-100 rounded-[2rem] overflow-hidden">
        {/* Status bar */}
        <div className="h-9 flex items-end justify-center pb-1" style={{ backgroundColor: activeCase?.color || '#0D654A' }}>
          <div className="flex items-center gap-1">
            <div className="w-5 h-0.5 bg-white/60 rounded-full" />
          </div>
        </div>

        {/* Header with logo */}
        <div className="px-3 pb-3" style={{ backgroundColor: activeCase?.color || '#0D654A' }}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">{activeCase?.emoji}</span>
            </div>
            <div>
              <div className="text-white font-semibold text-xs">{activeCase?.name} Online</div>
              <div className="text-white/70 text-[10px]">repisa.co/{activeCase?.id}</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white px-2 py-2 border-b border-gray-100">
          <div className="flex gap-1 overflow-hidden">
            {activeCase?.categories.slice(0, 3).map((cat, i) => (
              <CategoryPillMockup key={cat} name={cat} active={i === 0} />
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="p-2 grid grid-cols-2 gap-1.5">
          {activeCase?.products.map((product, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              <ProductCardMockup
                name={product.name}
                price={product.price}
                promoPrice={product.promoPrice}
                category={product.category}
                image={product.image}
              />
            </motion.div>
          ))}
        </div>

        {/* Cart button */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 right-2 bg-gray-900 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-[10px] font-medium">$930</span>
        </motion.div>
      </div>
    </div>
  )
}

export default function UseCases() {
  const [active, setActive] = useState('pastelerias')
  const activeCase = useCases.find(u => u.id === active)

  return (
    <section id="usecases" className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 lg:py-40">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-24">
          <div className="lg:col-span-6">
            <p className="text-sm text-[#0D654A] tracking-wide uppercase mb-4">
              Casos de uso
            </p>
            <h2 className="text-3xl lg:text-5xl text-neutral-900 font-medium tracking-tight leading-[1.1]">
              Para cualquier tipo de negocio
            </h2>
          </div>
        </div>

        {/* Mobile: Horizontal scrollable category pills */}
        <div className="lg:hidden mb-6 -mx-6 px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {useCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => setActive(useCase.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  active === useCase.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                <span>{useCase.emoji}</span>
                <span>{useCase.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: Phone mockup */}
        <div className="lg:hidden">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none select-none"
          >
            <PhoneMockup activeCase={activeCase} />
          </motion.div>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: List */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-1">
              {useCases.map((useCase) => (
                <button
                  key={useCase.id}
                  onClick={() => setActive(useCase.id)}
                  className={`w-full text-left px-4 py-4 transition-colors flex items-center justify-between group ${
                    active === useCase.id
                      ? 'bg-neutral-100'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <span className={`text-lg ${active === useCase.id ? 'text-neutral-900' : 'text-neutral-500'}`}>
                    {useCase.name}
                  </span>
                  <span className={`text-2xl transition-opacity ${active === useCase.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    {useCase.emoji}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Preview - Accurate product mockup */}
          <div className="lg:col-span-8 lg:border-l lg:border-neutral-200 lg:pl-12">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 rounded-lg overflow-hidden relative pointer-events-none select-none"
            >
              {/* Desktop catalog layout */}
              <div className="flex min-h-[400px]">
                {/* Left sidebar - Business branding */}
                <div
                  className="w-1/4 p-4 flex flex-col"
                  style={{ backgroundColor: activeCase?.color || '#0D654A' }}
                >
                  {/* Cover + Logo */}
                  <div className="relative mb-4">
                    <div className="h-16 bg-black/20 rounded-lg" />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-2xl">
                      {activeCase?.emoji}
                    </div>
                  </div>

                  {/* Business info */}
                  <div className="mt-6 text-center text-white">
                    <div className="text-sm font-semibold mb-1">{activeCase?.name} Online</div>
                    <div className="text-xs opacity-70">repisa.co/{active}</div>
                  </div>

                  {/* Business details */}
                  <div className="mt-6 space-y-2 text-white/80 text-xs">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>9:00 - 20:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Ciudad de Mexico</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-auto space-y-2">
                    <button className="w-full bg-white/20 text-white py-2 rounded-full text-xs font-medium">
                      Ver ubicacion
                    </button>
                    <button className="w-full bg-[#25D366] text-white py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>

                {/* Right content - Products */}
                <div className="flex-1 bg-gray-50 p-4 flex flex-col">
                  {/* Categories header */}
                  <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-900 mb-2">Categorías</div>
                    <div className="flex gap-1.5 overflow-x-auto">
                      {activeCase?.categories.map((cat, i) => (
                        <CategoryPillMockup key={cat} name={cat} active={i === 0} />
                      ))}
                    </div>
                  </div>

                  {/* Product grid */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {activeCase?.products.map((product, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                      >
                        <ProductCardMockup
                          name={product.name}
                          price={product.price}
                          promoPrice={product.promoPrice}
                          category={product.category}
                          image={product.image}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                    <span className="text-[10px] text-gray-400">
                      Creado con <span className="font-medium text-gray-500">Repisa</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Cart preview floating button */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xs font-medium">2 productos · $930.00</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

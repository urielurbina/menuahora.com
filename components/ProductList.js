'use client'

import Image from 'next/image'

export default function ProductList({ products, cardInfoSettings, appearance, activeCategory, onProductClick, detailedView }) {
  const filteredProducts = activeCategory === 'Todo'
    ? products
    : products.filter(product => product.categorias.includes(activeCategory))

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4">
      {filteredProducts.map((product, index) => (
        <div
          key={product._id}
          className={`
            bg-white rounded-xl overflow-hidden
            shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]
            hover:shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)]
            transition-all duration-300 ease-out
            ${detailedView ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}
          `}
          onClick={() => detailedView && onProductClick(product)}
          style={{
            animationDelay: `${index * 30}ms`
          }}
        >
          <div className="p-2.5 sm:p-3">
            {cardInfoSettings.imagen && (
              <div className="aspect-square relative overflow-hidden rounded-lg">
                {product.precioPromocion > 0 && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-10 shadow-sm">
                    Oferta
                  </div>
                )}
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            )}
            {cardInfoSettings.categoria && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.categorias.slice(0, 1).map((categoria, index) => (
                  <span
                    key={index}
                    className="text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
                    style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}
                  >
                    {categoria}
                  </span>
                ))}
              </div>
            )}
            {cardInfoSettings.nombre && (
              <h3
                className="font-semibold text-sm sm:text-base mt-1.5 leading-snug line-clamp-2"
                style={{ fontFamily: appearance.headingFont || 'sans-serif' }}
              >
                {product.nombre}
              </h3>
            )}
            <div className="flex items-baseline gap-2 mt-1">
              {product.precioPromocion > 0 ? (
                <>
                  <p className="text-base sm:text-lg font-bold text-gray-900">${product.precioPromocion.toFixed(2)}</p>
                  <p className="text-gray-400 line-through text-xs sm:text-sm">${product.precio.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-base sm:text-lg font-bold text-gray-900">${product.precio.toFixed(2)}</p>
              )}
            </div>
            {cardInfoSettings.descripcion && (
              <p
                className="text-gray-500 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed"
                style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}
              >
                {product.descripcion}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

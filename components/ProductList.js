'use client'

import Image from 'next/image'

export default function ProductList({ products, cardInfoSettings, appearance, activeCategory, onProductClick, detailedView }) {
  const filteredProducts = activeCategory === 'Todo'
    ? products
    : products.filter(product => product.categorias.includes(activeCategory))

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {filteredProducts.map((product) => (
        <div 
          key={product._id} 
          className={`bg-white rounded-lg overflow-hidden ${detailedView ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => detailedView && onProductClick(product)}
        >
          <div className="p-3">
            {cardInfoSettings.imagen && (
              <div className="aspect-square md:aspect-[3/4] relative overflow-hidden rounded-sm">
                {product.precioPromocion > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
                    ¡En promoción!
                  </div>
                )}
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            {cardInfoSettings.categoria && (
              <div className="mt-2 space-x-1">
                {product.categorias.slice(0, 2).map((categoria, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full inline-block" 
                    style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}
                  >
                    {categoria}
                  </span>
                ))}
              </div>
            )}
            {cardInfoSettings.nombre && (
              <h3 className="font-semibold text-md lg:text-lg mt-2" style={{ fontFamily: appearance.headingFont || 'sans-serif' }}>
                {product.nombre}
              </h3>
            )}
            <div className="flex items-center gap-2">
              {product.precioPromocion > 0 ? (
                <>
                  <p className="text-lg font-bold">${product.precioPromocion.toFixed(2)}</p>
                  <p className="text-gray-500 line-through text-sm">${product.precio.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-lg font-bold">${product.precio.toFixed(2)}</p>
              )}
            </div>
            {cardInfoSettings.descripcion && (
              <p className="text-gray-600 text-sm mt-1" style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}>
                {product.descripcion}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

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
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            {cardInfoSettings.categoria && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block" style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}>
                {product.categorias[0]}
              </span>
            )}
            {cardInfoSettings.nombre && (
              <h3 className="font-semibold text-md mt-2" style={{ fontFamily: appearance.headingFont || 'sans-serif' }}>
                {product.nombre}
              </h3>
            )}
            {cardInfoSettings.precio && (
              <span className="font-bold text-md mt-1 block" style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}>
                ${product.precio.toFixed(2)}
              </span>
            )}
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

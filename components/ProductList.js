'use client'

import Image from 'next/image'

export default function ProductList({ products, cardInfoSettings, appearance, activeCategory, onProductClick, detailedView, productQuantities, onIncrease, onDecrease }) {
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
            {cardInfoSettings.precio && (
              <span className="font-regular text-md mt-1 block" style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}>
                ${product.precio.toFixed(2)}
              </span>
            )}
            {cardInfoSettings.descripcion && (
              <p className="text-gray-600 text-sm mt-1" style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}>
                {product.descripcion}
              </p>
            )}
            
            <div className="flex items-center mt-3 mb-2">
              <div className="flex items-center h-8 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecrease(product._id);
                  }}
                  className="w-8 h-full flex items-center justify-center bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
                >
                  -
                </button>
                <div className="w-12 h-full flex items-center justify-center bg-white text-sm">
                  {productQuantities[product._id] || 0}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncrease(product._id);
                  }}
                  className="w-8 h-full flex items-center justify-center bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

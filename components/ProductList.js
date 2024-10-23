'use client'

import Image from 'next/image'

export default function ProductList({ products, cardInfoSettings, appearance, activeCategory, onProductClick }) {
  const filteredProducts = activeCategory === 'Todo'
    ? products
    : products.filter(product => product.categorias.includes(activeCategory))

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product._id} 
            className="bg-white rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              console.log('Product clicked:', product);
              onProductClick(product);
            }}
          >
            {cardInfoSettings.imagen && (
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="p-4">
              {cardInfoSettings.nombre && (
                <h3 className="font-semibold text-md">{product.nombre}</h3>
              )}
              {cardInfoSettings.descripcion && (
                <p className="text-sm text-gray-600 mt-1">{product.descripcion}</p>
              )}
              {cardInfoSettings.precio && (
                <span className="font-bold text-md mt-2 block">
                  ${product.precio.toFixed(2)}
                </span>
              )}
              {cardInfoSettings.categoria && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                  {product.categorias[0]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

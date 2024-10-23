'use client'

import Image from 'next/image'

export default function ProductList({ products = [], cardInfoSettings = {}, appearance, activeCategory, onProductClick }) {
  // Establecer valores predeterminados para cardInfoSettings
  const defaultCardInfoSettings = {
    imagen: true,
    nombre: true,
    descripcion: true,
    precio: true,
    categoria: true
  }

  // Combinar los valores predeterminados con los proporcionados
  const mergedCardInfoSettings = { ...defaultCardInfoSettings, ...cardInfoSettings }

  const filteredProducts = products && activeCategory === 'Todo'
    ? products
    : products?.filter(product => product.categorias.includes(activeCategory)) || []

  return (
    <div className="px-6 py-4">
      {filteredProducts.length === 0 ? (
        <p>No hay productos disponibles en esta categoría.</p>
      ) : (
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
              <div className="p-3">
                {mergedCardInfoSettings.imagen && product.imagen && (
                  <div className="aspect-square md:aspect-[1/1] relative overflow-hidden rounded-sm">
                    <Image
                      src={product.imagen}
                      alt={product.nombre || 'Producto'}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
                {mergedCardInfoSettings.categoria && product.categorias && product.categorias.length > 0 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                    {product.categorias[0]}
                  </span>
                )}
                {mergedCardInfoSettings.nombre && (
                  <h3 className="font-semibold text-md mt-2">{product.nombre || 'Sin nombre'}</h3>
                )}
                {mergedCardInfoSettings.precio && product.precio !== undefined && (
                  <span className="font-bold text-md mt-1 block">
                    ${product.precio.toFixed(2)}
                  </span>
                )}
                {mergedCardInfoSettings.descripcion && product.descripcion && (
                  <p className="text-sm text-gray-600 mt-1">{product.descripcion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

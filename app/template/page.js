'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Head from 'next/head'

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const categories = ['Todo', 'Tacos', 'Tortas', 'Quesadillas', 'Ensaladas', 'Bebidas', 'Postres']
  const products = [
    { 
      id: 1,
      name: 'Orden de 4 tacos al Pastor', 
      price: 249.99, 
      category: 'Tacos',
      description: 'Deliciosos tacos al pastor con piña, cebolla y cilantro.',
      extras: ['Salsa verde', 'Salsa roja', 'Limones'],
      image: '/images/tacos-pastor.jpg'
    },
    { 
      id: 2,
      name: 'Orden de 4 tacos de Bistec', 
      price: 249.99, 
      category: 'Tacos',
      description: 'Sabrosos tacos de bistec con cebolla y cilantro.',
      extras: ['Salsa verde', 'Salsa roja', 'Limones'],
      image: '/images/tacos-bistec.jpg'
    },
    { id: 3, name: 'Taco de Chicharrón Verde', price: 89.99, category: 'Tacos', image: '/images/taco-chicharron.jpg' },
    { id: 4, name: 'Machete', price: 129.99, category: 'Ensaladas', image: '/images/machete.jpg' },
    { id: 5, name: 'Agua de Jamaica', price: 25.00, category: 'Bebidas', image: '/images/jamaica.jpg' },
    { id: 6, name: 'Flan Napolitano', price: 45.00, category: 'Postres', image: '/images/postrecito.jpg' },
    { id: 7, name: 'Agua de Horchata', price: 30.00, category: 'Bebidas', image: '/images/jamaica.jpg' },
  ]

  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
      setShowScrollTop(window.scrollY > 300) // Mostrar el botón después de 300px de scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const toggleProductDetails = useCallback((product) => {
    setSelectedProduct(prevProduct => {
      if (prevProduct?.id === product.id) {
        document.body.style.overflow = 'auto'; // Habilitar scroll
        return null;
      } else {
        document.body.style.overflow = 'hidden'; // Deshabilitar scroll
        return product;
      }
    })
  }, [])

  useEffect(() => {
    return () => {
      // Limpieza: asegurarse de que el scroll se habilite cuando el componente se desmonte
      document.body.style.overflow = 'auto';
    }
  }, [])

  const businessInfoRef = useRef(null)

  const scrollToBusinessInfo = () => {
    if (businessInfoRef.current) {
      const yOffset = -20; // Ajusta este valor si necesitas un poco de espacio en la parte superior
      const y = businessInfoRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  // Modificar la función para filtrar productos
  const filteredProducts = useCallback(() => {
    if (activeCategory === 'Todo') {
      return products;
    }
    return products.filter(product => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Head>
        <title>Demo Page</title>
        <meta name="theme-color" content="#FF1C20" />
      </Head>
      <div className="w-full mx-auto">
        <div className="lg:flex">
          {/* Column 1: Logo and Info */}
          <div className="bg-[#FF1C20] lg:w-1/4 lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:overflow-y-auto">
            {/* Header with background image and logo */}
            <div className="relative">
              <Image
                src="/images/trompo-de-pastor.webp"
                alt="Fondo de tacos"
                width={500}
                height={300}
                layout="responsive"
                objectFit="cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/logo-tacos-uriel.png"
                    alt="Logotipo"
                    width={128}
                    height={128}
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>

            {/* Business information and Social links */}
            <div className="px-6 py-4 flex">
              {/* Business information */}
              <div className="w-2/3 pr-4 text-white">
                <h1 className="text-2xl font-bold tracking-tight">Tacos el Uriel</h1>
                <p className="text-sm mt-1">El mejor sabor en cada taco</p>
              </div>

              {/* Social links */}
              <div className="w-1/3 flex justify-end items-center">
                <div className="flex space-x-2">
                  <Link href="#" className="text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Link>
                  <Link href="#" className="text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </Link>
                  <Link href="#" className="text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.48 22.926l-1.193.658c-6.979 3.621-19.082-17.494-12.279-21.484l1.145-.637 3.714 6.467-1.139.632c-2.067 1.245 2.76 9.707 4.879 8.545l1.162-.642 3.711 6.461zm-9.808-22.926l-1.68.975 3.714 6.466 1.681-.975-3.715-6.466zm8.613 14.997l-1.68.975 3.714 6.467 1.681-.975-3.715-6.467z"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Business details */}
            <div className="px-6 py-2 flex justify-between text-xs text-white">
              <div>
                <p className="font-bold">Dirección:</p>
                <p>Calle Principal 123,</p>
                <p>Ciudad Bonita</p>
                <p>México</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Horario:</p>
                <p>Lun-Vie 11:00-22:00</p>
                <p>Sáb 12:00-23:00</p>
                <p>Dom Cerrado</p>
              </div>
            </div>

            {/* Business description */}
            <div className="px-6 py-3 flex justify-between text-xs text-white">
              <div className="text-left">
                
                <p>Lorem ipsum dolor sit amet consectetur. Risus augue egestas augue orci congue ipsum. Interdum proin luctus purus tincidunt dolor nulla nisi. Ullamcorper fermentum elit lorem montes massa commodo vitae amet. Vel ultrices imperdiet consectetur ac dignissim tempor in augue.</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-6 py-4 space-y-2">
              <button className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Reservaciones
              </button>
              <button className="w-full bg-white text-black hover:bg-gray-100 h-12 text-lg rounded-md border border-black">
                Pedir en Uber Eats
              </button>
              <button className="w-full bg-white text-black hover:bg-gray-100 h-12 text-lg rounded-md border border-black">
                Pedir en Rappi
              </button>
            
            </div>
          </div>

          {/* Columns 2-4: Categories and Products */}
          <div ref={businessInfoRef}  className="lg:w-3/4 lg:ml-[25%]">
            <div className="bg-gray-100">
              {/* Categories */}
              <div 
                className={`px-6 py-4 bg-white border-b border-gray-200 ${isScrolled ? 'lg:fixed lg:top-0 lg:right-0 lg:left-[25%] lg:z-20' : ''}`}
                style={{pointerEvents: 'auto'}}
              >
                <h2 className="text-2xl font-bold mb-4">Categorías</h2>
                <div className="flex space-x-2 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        activeCategory === category
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* <hr className="border-b border-gray-200 my-4" /> */}

              {/* Products */}
              <div className={`px-6 py-4 ${isScrolled ? 'lg:mt-[100px]' : ''}`}>
                {filteredProducts().length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts().map((product) => (
                      <div 
                        key={product.id}
                        className="bg-white rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => toggleProductDetails(product)}
                      >
                        <div className="p-3">
                          <div className="aspect-square md:aspect-[3/4] relative overflow-hidden rounded-sm">
                            <Image
                              src={product.image}
                              alt={product.name}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                            {product.category}
                          </span>
                          <h3 className="font-semibold text-md mt-2">{product.name}</h3>
                          <span className="font-bold text-md mt-1 block">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xl text-gray-600">No hay productos disponibles en esta categoría.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botón Volver Arriba */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToBusinessInfo}
              className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Modal para detalles del producto */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setSelectedProduct(null);
                document.body.style.overflow = 'auto'; // Habilitar scroll al cerrar
              }}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Eliminamos el botón de cerrar (X) de la parte superior */}

                {/* Imagen del producto */}
                <div className="aspect-[3/2] w-full mb-4 relative overflow-hidden rounded-lg">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-600 mb-2">{selectedProduct.category}</p>
                <p className="font-bold text-lg mb-4">${selectedProduct.price.toFixed(2)}</p>
                {selectedProduct.description && (
                  <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
                )}
                {selectedProduct.extras && selectedProduct.extras.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Extras:</h4>
                    <ul className="list-disc list-inside text-sm">
                      {selectedProduct.extras.map((extra, index) => (
                        <li key={index}>{extra}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nuevo botón de cerrar en la esquina inferior derecha */}
                <button
                  className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  onClick={() => {
                    setSelectedProduct(null);
                    document.body.style.overflow = 'auto'; // Habilitar scroll al cerrar
                  }}
                >
                  Cerrar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

'use client'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import BusinessInfo from '@/components/BusinessInfo'
import ActionButtons from '@/components/ActionButtons'
import CategoryList from '@/components/CategoryList'
import ProductList from '@/components/ProductList'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function UserPage({ params }) {
  const [businessData, setBusinessData] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/business/${params.username}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to fetch business data: ${response.status} ${response.statusText}. ${errorData.error || ''}`)
        }
        const data = await response.json()
        setBusinessData(data)
      } catch (err) {
        console.error('Error details:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.username])

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const [toggleProductDetails, setToggleProductDetails] = useState(() => () => {});

  useEffect(() => {
    if (businessData) {
      const { cardInfoSettings = {} } = businessData;
      setToggleProductDetails(() => (product) => {
        if (cardInfoSettings.detailedView) {
          console.log('Toggling product details:', product);
          setSelectedProduct(prevProduct => prevProduct?._id === product._id ? null : product);
        }
      });
    }
  }, [businessData]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div role="status">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-red-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
    </div>
  )
  if (error) return <div>Error: {error}</div>
  if (!businessData) return notFound()

  const {
    'basic-info': basicInfo = {},
    cardInfoSettings = {},
    categories = [],
    products = [],
    buttons = [],
    appearance = {}
  } = businessData || {}

  const primaryColor = appearance.primaryColor || '#FF1C20'

  // Valores predeterminados para basicInfo
  const defaultBasicInfo = {
    coverPhotoUrl: '/default-cover.jpg',
    logoUrl: '/default-logo.png',
    businessName: params.username,
    description: 'Descripción no disponible',
  }

  // Combinar los valores reales con los predeterminados
  const mergedBasicInfo = { ...defaultBasicInfo, ...basicInfo }

  const headingFont = appearance.headingFont || inter.className
  const bodyFont = appearance.bodyFont || inter.className

  return (
    <div className={`w-full mx-auto bg-gray-100 relative ${bodyFont}`}>
      <div className="lg:flex">
        {/* Column 1: Logo and Info */}
        <div style={{backgroundColor: primaryColor}} className="lg:w-1/4 lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:overflow-y-auto">
          {/* Header with background image and logo */}
          <div className="relative">
            <Image
              src={mergedBasicInfo.coverPhotoUrl}
              alt="Fondo de negocio"
              width={500}
              height={300}
              layout="responsive"
              objectFit="cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
                <Image
                  src={mergedBasicInfo.logoUrl}
                  alt="Logotipo"
                  width={128}
                  height={128}
                  objectFit="cover"
                />
              </div>
            </div>
          </div>

          <BusinessInfo basicInfo={basicInfo} appearance={appearance} />
          <ActionButtons buttons={buttons} appearance={appearance} />
        </div>

        {/* Columns 2-4: Categories and Products */}
        <div className="lg:w-3/4 lg:ml-[25%]">
          <div className="bg-gray-100">
            {/* Categories */}
            <div className="bg-white border-b border-gray-200">
              <h2 className={`text-2xl font-bold px-6 pt-4 ${headingFont}`}>
                Categorías
              </h2>
              <CategoryList 
                categories={categories} 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                appearance={appearance}
              />
            </div>

            {/* Products */}
            <ProductList 
              products={products} 
              cardInfoSettings={cardInfoSettings}
              appearance={appearance}
              activeCategory={activeCategory}
              onProductClick={toggleProductDetails}
              detailedView={cardInfoSettings.detailedView}
            />
          </div>
          {/* Modificar el footer para centrar los elementos */}
      <footer className="w-full bg-gray-100 py-4 px-4 text-center text-sm text-gray-600 mt-8">
        <Link href="https://menuahora.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
          <span className="mr-2">Sitio creado en:</span>
          <Image
            src="https://res.cloudinary.com/dkuss2bup/image/upload/v1729739519/ohglabavyxhuflbn7jun.svg"
            alt="Logo MenúAhora"
            width={100}
              height={20}
            />
            </Link>
          </footer>
        </div>
      </div>

      

      {/* Modal para detalles del producto */}
      <AnimatePresence>
        {selectedProduct && cardInfoSettings.detailedView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => toggleProductDetails(selectedProduct)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagen del producto */}
              <div className="aspect-[3/2] w-full mb-4 relative overflow-hidden rounded-lg">
                <Image
                  src={selectedProduct.imagen}
                  alt={selectedProduct.nombre}
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              <h2 className="text-2xl font-bold mb-2">{selectedProduct.nombre}</h2>
              <p className="text-gray-600 mb-2">{selectedProduct.categorias[0]}</p>
              <p className="font-bold text-lg mb-4">${selectedProduct.precio.toFixed(2)}</p>
              {selectedProduct.descripcion && (
                <p className="text-gray-700 mb-4">{selectedProduct.descripcion}</p>
              )}
              {selectedProduct.extras && selectedProduct.extras.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Extras:</h4>
                  <ul className="list-disc list-inside text-sm">
                    {selectedProduct.extras.map((extra, index) => (
                      <li key={index}>{extra.name} - ${extra.price.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Botón de cerrar en la esquina inferior derecha */}
              <button
                className={`absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 ${bodyFont}`}
                onClick={() => toggleProductDetails(selectedProduct)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

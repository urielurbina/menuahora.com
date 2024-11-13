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
import CartPreview from '@/components/CartPreview'
import CartModal from '@/components/CartModal'
import { usePersistedCart } from '@/hooks/usePersistedCart'

const inter = Inter({ subsets: ['latin'] })

function UserPageContent({ params }) {
  const { 
    cart, 
    addToCart: addToPersistedCart, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = usePersistedCart(params.username);

  const [businessData, setBusinessData] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [cardInfoSettings, setCardInfoSettings] = useState({
    nombre: true,
    descripcion: true,
    precio: true,
    categoria: true,
    imagen: true,
    detailedView: true
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  const [productQuantities, setProductQuantities] = useState({});

  const [selectedType, setSelectedType] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);

  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleIncreaseQuantity = (productId) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleDecreaseQuantity = (productId) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0)
    }));
  };

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
        
        // Actualizar cardInfoSettings, manteniendo detailedView en true si no se especifica
        if (data.cardInfoSettings) {
          setCardInfoSettings(prevSettings => ({
            ...prevSettings,
            ...data.cardInfoSettings,
            detailedView: data.cardInfoSettings.detailedView !== false
          }));
        }
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
    setToggleProductDetails(() => (product) => {
      if (cardInfoSettings.detailedView) {
        if (selectedProduct?._id === product._id) {
          setSelectedProduct(null);
          setSelectedType('');
          setSelectedExtras([]);
          document.body.style.overflow = 'auto';
          document.body.style.position = 'static';
          document.body.style.width = 'auto';
        } else {
          setSelectedProduct(product);
          setSelectedType('');
          setSelectedExtras([]);
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
        }
      }
    });

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [cardInfoSettings.detailedView, selectedProduct]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div role="status">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-[#0D654A]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  // Agregar estas funciones para calcular el total y la cantidad de items
  const calculateCartTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateCartItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const addToCart = (product, quantity, selectedType, selectedExtras) => {
    let totalPrice = product.precioPromocion > 0 ? product.precioPromocion : product.precio;
    
    if (selectedType && product.tipos) {
      const selectedTypeOption = product.tipos.opciones.find(opt => opt.nombre === selectedType);
      if (selectedTypeOption && selectedTypeOption.precio) {
        totalPrice += selectedTypeOption.precio;
      }
    }

    if (selectedExtras.length > 0 && product.extras) {
      selectedExtras.forEach(extraName => {
        const extra = product.extras.find(e => e.name === extraName);
        if (extra && extra.price) {
          totalPrice += extra.price;
        }
      });
    }

    const cartItem = {
      id: `${product._id}-${selectedType}-${selectedExtras.join('-')}`,
      _id: product._id,
      nombre: product.nombre,
      price: totalPrice,
      quantity: quantity,
      tipo: selectedType,
      extras: selectedExtras,
      imagen: product.imagen,
      businessId: params.username
    };

    addToPersistedCart(cartItem);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const createWhatsAppOrder = (message) => {
    const businessPhone = businessData['basic-info']?.whatsapp || '';
    if (!businessPhone) return;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

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
          <div className="bg-gray-100 ">
            {/* Categories */}
            <div className="py-6 lg:py-2 bg-white border-b border-gray-200 text-center lg:text-left">
              <h2 className={`text-3xl font-regular px-6 pt-4 ${headingFont}`}>
                Categorías
              </h2>
              <div className="flex justify-center lg:justify-start">
                <CategoryList 
                  categories={categories} 
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  appearance={appearance}
                />
              </div>
            </div>

            {/* Products */}
            <ProductList 
              products={products} 
              cardInfoSettings={cardInfoSettings}
              appearance={appearance}
              activeCategory={activeCategory}
              onProductClick={toggleProductDetails}
              detailedView={cardInfoSettings.detailedView}
              productQuantities={productQuantities}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
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

  <CartPreview 
    onClick={() => setIsCartOpen(true)}
    cart={cart}
  />

  {/* Botón Volver Arriba */}
  <AnimatePresence>
    {showScrollTop && (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={scrollToTop}
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
    {selectedProduct && cardInfoSettings.detailedView && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50"
        onClick={(e) => {
          e.stopPropagation();
          toggleProductDetails(selectedProduct);
        }}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="bg-white w-full h-[100vh] sm:h-[85vh] sm:max-w-lg sm:rounded-xl relative flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de cerrar (X) */}
          <button
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleProductDetails(selectedProduct);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Contenedor con scroll */}
          <div className="flex-1 overflow-y-auto pb-[100px]">
            {/* Imagen del producto con padding */}
            <div className="p-4 sm:p-6">
              <div className="w-full aspect-[4/3] sm:aspect-[3/2] relative rounded-xl overflow-hidden">
                <Image
                  src={selectedProduct.imagen}
                  alt={selectedProduct.nombre}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            </div>

            {/* Contenido del producto */}
            <div className="px-4 sm:px-6">
              {/* Categoría con estilo redondeado */}
              <div className="mb-2">
                <span 
                  className="text-sm bg-gray-100 px-3 py-1 rounded-full inline-block"
                  style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}
                >
                  {selectedProduct.categorias[0]}
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-2">{selectedProduct.nombre}</h2>
              <div className="flex items-center gap-2 mb-4">
                {selectedProduct.precioPromocion > 0 ? (
                  <>
                    <p className="font-bold text-lg text-black">${selectedProduct.precioPromocion.toFixed(2)}</p>
                    <p className="text-gray-500 line-through text-sm">${selectedProduct.precio.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="font-bold text-lg">${selectedProduct.precio.toFixed(2)}</p>
                )}
              </div>
              
              {selectedProduct.descripcion && (
                <p className="text-gray-700 mb-4">{selectedProduct.descripcion}</p>
              )}

              {/* Tipos */}
              {selectedProduct.tipos && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center">
                    {selectedProduct.tipos.titulo}
                    <span className="text-red-500 ml-1">*</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedProduct.tipos.opciones.map((opcion, index) => (
                      <div key={index} className="relative">
                        <input
                          type="radio"
                          id={`tipo-${index}`}
                          name="tipo"
                          value={opcion.nombre}
                          checked={selectedType === opcion.nombre}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="peer hidden"
                          required
                        />
                        <label
                          htmlFor={`tipo-${index}`}
                          className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-gray-600 peer-checked:bg-gray-50 hover:bg-gray-50 transition-all"
                        >
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center mr-3 peer-checked:border-gray-600">
                              <div className={`w-2.5 h-2.5 bg-gray-600 rounded-full ${selectedType === opcion.nombre ? 'block' : 'hidden'}`}></div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700">
                                {opcion.nombre}
                              </div>
                              {opcion.precio && (
                                <div className="text-xs text-gray-500">
                                  +${opcion.precio.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {selectedProduct.extras && selectedProduct.extras.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-800">Extras</h4>
                  <div className="space-y-2">
                    {selectedProduct.extras.map((extra, index) => (
                      <div key={index} className="relative">
                        <input
                          type="checkbox"
                          id={`extra-${index}`}
                          checked={selectedExtras.includes(extra.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExtras(prev => [...prev, extra.name]);
                            } else {
                              setSelectedExtras(prev => prev.filter(name => name !== extra.name));
                            }
                          }}
                          className="peer hidden"
                        />
                        <label
                          htmlFor={`extra-${index}`}
                          className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-gray-600 peer-checked:bg-gray-50 hover:bg-gray-50 transition-all"
                        >
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mr-3 peer-checked:border-gray-600">
                              <svg 
                                className={`w-3 h-3 text-gray-600 ${selectedExtras.includes(extra.name) ? 'block' : 'hidden'}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="2" 
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm font-medium text-gray-700">
                                {extra.name}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                +${typeof extra.price === 'number' ? extra.price.toFixed(2) : extra.price}
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer fijo con selector de cantidad y botón de agregar */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
              <div className="flex items-center h-12 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecreaseQuantity(selectedProduct._id);
                  }}
                  className="w-12 h-full flex items-center justify-center bg-gray-100 text-gray-700 text-lg font-medium hover:bg-gray-200"
                >
                  -
                </button>
                <div className="w-16 h-full flex items-center justify-center bg-white text-lg">
                  {productQuantities[selectedProduct._id] || 0}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncreaseQuantity(selectedProduct._id);
                  }}
                  className="w-12 h-full flex items-center justify-center bg-gray-100 text-gray-700 text-lg font-medium hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              {/* Botón de Agregar al Carrito */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedProduct.tipos && !selectedType) {
                    alert('Por favor selecciona un tipo');
                    return;
                  }
                  addToCart(
                    selectedProduct, 
                    productQuantities[selectedProduct._id] || 1,
                    selectedType,
                    selectedExtras
                  );
                }}
                className="flex-1 h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z" />
                  <path d="M20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span>Agregar al carrito</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  <CartModal
    isOpen={isCartOpen}
    onClose={() => setIsCartOpen(false)}
    cartItems={cart.items}
    onUpdateQuantity={updateQuantity}
    onRemoveItem={removeItem}
    appearance={businessData}
    total={cart.total}
  />
</div>

  )
}

export default function UserPage({ params }) {
  return <UserPageContent params={params} />;
}

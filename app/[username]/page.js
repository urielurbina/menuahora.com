'use client'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import BusinessInfo from '@/components/BusinessInfo'
import ActionButtons from '@/components/ActionButtons'
import CategoryList from '@/components/CategoryList'
import ProductList from '@/components/ProductList'
import { useState, useEffect } from 'react'
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
    removeItem
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

  const [selectedVariants, setSelectedVariants] = useState({}); // { variantId: { optionId: quantity } }
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [editingCartItem, setEditingCartItem] = useState(null);

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

  // Funciones para manejar variantes
  const handleVariantOptionChange = (variantId, optionId, quantity = 1) => {
    setSelectedVariants(prev => {
      const newVariants = { ...prev };
      
      // Buscar la variante para determinar si es de selección única (radio) o múltiple
      const product = selectedProduct;
      const variant = product?.variants?.find(v => v.id === variantId);
      
      if (variant && !variant.enableStock) {
        // Para variantes sin cantidad seleccionable (radio buttons)
        const currentSelection = prev[variantId]?.[optionId];
        
        if (variant.isRequired === false && currentSelection > 0) {
          // Si la variante es opcional y ya está seleccionada, deseleccionar
          newVariants[variantId] = { [optionId]: 0 };
        } else {
          // Seleccionar la opción y limpiar otras opciones
          newVariants[variantId] = { [optionId]: quantity };
        }
      } else {
        // Para variantes con cantidad seleccionable, mantener las otras opciones
        newVariants[variantId] = {
          ...prev[variantId],
          [optionId]: quantity
        };
      }
      
      return newVariants;
    });
  };

  const handleVariantQuantityChange = (variantId, optionId, quantity) => {
    if (quantity <= 0) {
      setSelectedVariants(prev => {
        const newVariants = { ...prev };
        if (newVariants[variantId]) {
          delete newVariants[variantId][optionId];
          if (Object.keys(newVariants[variantId]).length === 0) {
            delete newVariants[variantId];
          }
        }
        return newVariants;
      });
    } else {
      setSelectedVariants(prev => ({
        ...prev,
        [variantId]: {
          ...prev[variantId],
          [optionId]: quantity
        }
      }));
    }
  };

  const getVariantQuantity = (variantId, optionId) => {
    return selectedVariants[variantId]?.[optionId] || 0;
  };

  // Función para verificar si el producto tiene variantes con cantidad seleccionable
  const hasVariantsWithQuantity = (product) => {
    return product.variants?.some(variant => variant.enableStock) || false;
  };

  // Función para calcular el precio total dinámico
  const calculateDynamicPrice = (product) => {
    let basePrice = product.precioPromocion > 0 ? product.precioPromocion : product.precio;
    let totalPrice = 0;
    
    // Calcular cantidad total de piezas considerando multiplicadores
    let totalPieces = 1;
    let totalQuantity = 1;
    
    if (hasVariantsWithQuantity(product)) {
      // Para productos con variantes con cantidad seleccionable
      totalQuantity = calculateTotalVariantQuantity(product);
      totalPieces = 0;
      
      Object.entries(selectedVariants).forEach(([variantId, options]) => {
        const variant = product.variants?.find(v => v.id === variantId);
        if (variant && variant.enableStock) {
          Object.entries(options).forEach(([optionId, optionQuantity]) => {
            if (optionQuantity > 0) {
              const option = variant.options.find(o => o.id === optionId);
              if (option) {
                const multiplier = option.quantityMultiplier || 1;
                totalPieces += optionQuantity * multiplier;
              }
            }
          });
        }
      });
    } else {
      // Para productos simples
      totalQuantity = productQuantities[product._id] || 1;
      
      // Calcular multiplicador de variantes estáticas
      let staticMultiplier = 1;
      Object.entries(selectedVariants).forEach(([variantId, options]) => {
        const variant = product.variants?.find(v => v.id === variantId);
        if (variant && !variant.enableStock) {
          Object.entries(options).forEach(([optionId, optionQuantity]) => {
            if (optionQuantity > 0) {
              const option = variant.options.find(o => o.id === optionId);
              if (option && option.quantityMultiplier) {
                staticMultiplier *= option.quantityMultiplier;
              }
            }
          });
        }
      });
      
      totalPieces = totalQuantity * staticMultiplier;
    }
    
    // Calcular precio base por unidad
    let unitPrice = basePrice;
    
    // Agregar precios de variantes estáticas al precio base por unidad
    Object.entries(selectedVariants).forEach(([variantId, options]) => {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant && !variant.enableStock) {
        Object.entries(options).forEach(([optionId, optionQuantity]) => {
          if (optionQuantity > 0) {
            const option = variant.options.find(o => o.id === optionId);
            if (option && option.price > 0) {
              unitPrice += option.price;
            }
          }
        });
      }
    });

    // Calcular precio total
    if (product.priceType === "per_piece") {
      totalPrice = unitPrice * totalPieces;
    } else {
      totalPrice = unitPrice * totalQuantity;
    }

    // Agregar precios de extras al total (no por unidad)
    if (selectedExtras.length > 0 && product.extras) {
      selectedExtras.forEach(extraName => {
        const extra = product.extras.find(e => e.name === extraName);
        if (extra && extra.price && !isNaN(parseFloat(extra.price))) {
          const extraPrice = parseFloat(extra.price);
          if (extra.priceType === "per_piece") {
            // Si el extra es por pieza, multiplicar por las piezas totales
            totalPrice += extraPrice * totalPieces;
          } else {
            // Si el extra es por paquete, multiplicar por la cantidad de paquetes
            totalPrice += extraPrice * totalQuantity;
          }
        }
      });
    }

    // Agregar precios de variantes con cantidad seleccionable
    Object.entries(selectedVariants).forEach(([variantId, options]) => {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant && variant.enableStock) {
        Object.entries(options).forEach(([optionId, optionQuantity]) => {
          if (optionQuantity > 0) {
            const option = variant.options.find(o => o.id === optionId);
            if (option && option.price > 0) {
              // Para variantes con cantidad, siempre multiplicar por la cantidad
              totalPrice += option.price * optionQuantity;
            }
          }
        });
      }
    });

    // Aplicar descuento por mayoreo si aplica
    if (product.wholesalePricing && product.wholesalePricing.length > 0) {
      const wholesaleDiscount = calculateWholesaleDiscount(product, totalQuantity, totalPrice / totalQuantity);
      if (wholesaleDiscount.discount > 0) {
        totalPrice -= wholesaleDiscount.discount * totalQuantity;
      }
    }

    return totalPrice;
  };

  // Función para obtener información de todos los descuentos disponibles
  const getAvailableDiscounts = (product) => {
    if (!product?.wholesalePricing || product.wholesalePricing.length === 0) {
      return null;
    }

    const totalQuantity = calculateRealPiecesQuantity(product);

    // Calcular el precio base + variantes + extras (sin descuento)
    let priceBeforeDiscount = product.precioPromocion > 0 ? product.precioPromocion : product.precio;
    
    // Agregar precios de variantes seleccionadas
    Object.entries(selectedVariants).forEach(([variantId, options]) => {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant) {
        Object.entries(options).forEach(([optionId, optionQuantity]) => {
          const option = variant.options.find(o => o.id === optionId);
          if (option && optionQuantity > 0) {
            if (variant.enableStock) {
              priceBeforeDiscount += option.price * optionQuantity;
            } else {
              priceBeforeDiscount += option.price;
            }
          }
        });
      }
    });

    // Agregar precios de extras seleccionados
    if (selectedExtras.length > 0 && product.extras) {
      selectedExtras.forEach(extraName => {
        const extra = product.extras.find(e => e.name === extraName);
        if (extra && extra.price && !isNaN(parseFloat(extra.price))) {
          priceBeforeDiscount += parseFloat(extra.price);
        }
      });
    }
    
    const currentDiscount = calculateWholesaleDiscount(product, totalQuantity, priceBeforeDiscount);
    
    // Obtener todos los descuentos disponibles ordenados por cantidad mínima
    const allDiscounts = product.wholesalePricing
      .sort((a, b) => a.minQuantity - b.minQuantity)
      .map(pricing => ({
        ...pricing,
        needed: Math.max(0, pricing.minQuantity - totalQuantity),
        isActive: totalQuantity >= pricing.minQuantity
      }));

    return {
      current: currentDiscount,
      allDiscounts,
      totalQuantity
    };
  };

  // Función para obtener el próximo descuento disponible
  const getNextDiscount = (product) => {
    if (!product?.wholesalePricing || product.wholesalePricing.length === 0) {
      return null;
    }

    const totalQuantity = calculateRealPiecesQuantity(product);
    
    // Encontrar el próximo descuento disponible (el más cercano que aún no se alcanza)
    const nextDiscount = product.wholesalePricing
      .sort((a, b) => a.minQuantity - b.minQuantity)
      .find(pricing => totalQuantity < pricing.minQuantity);

    return nextDiscount ? {
      ...nextDiscount,
      needed: nextDiscount.minQuantity - totalQuantity
    } : null;
  };

  // Función para calcular la cantidad total de variantes seleccionadas
  const calculateTotalVariantQuantity = (product) => {
    let totalQuantity = 0;
    Object.entries(selectedVariants).forEach(([variantId, options]) => {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant && variant.enableStock) {
        Object.values(options).forEach(quantity => {
          totalQuantity += quantity || 0;
        });
      }
    });
    return totalQuantity;
  };

  // Función para calcular la cantidad real de piezas (considerando multiplicadores)
  const calculateRealPiecesQuantity = (product) => {
    let totalPieces = 0;
    let baseQuantity = 1;
    
    // Calcular multiplicador base de variantes estáticas (como paquetes de stickers)
    let staticMultiplier = 1;
    Object.entries(selectedVariants).forEach(([variantId, options]) => {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant && !variant.enableStock) {
        Object.entries(options).forEach(([optionId, optionQuantity]) => {
          if (optionQuantity > 0) {
            const option = variant.options.find(o => o.id === optionId);
            if (option && option.quantityMultiplier) {
              staticMultiplier *= option.quantityMultiplier;
            }
          }
        });
      }
    });
    
    if (hasVariantsWithQuantity(product)) {
      // Para productos con variantes con cantidad seleccionable
      Object.entries(selectedVariants).forEach(([variantId, options]) => {
        const variant = product.variants?.find(v => v.id === variantId);
        if (variant && variant.enableStock) {
          Object.entries(options).forEach(([optionId, quantity]) => {
            if (quantity > 0) {
              const option = variant.options.find(o => o.id === optionId);
              if (option) {
                const multiplier = option.quantityMultiplier || 1;
                totalPieces += (quantity * multiplier * staticMultiplier);
              }
            }
          });
        }
      });
    } else {
      // Para productos simples, usar la cantidad del selector principal
      baseQuantity = productQuantities[product._id] || 1;
      totalPieces = baseQuantity * staticMultiplier;
    }
    
    console.log('Real pieces calculation:', {
      baseQuantity,
      staticMultiplier,
      totalPieces,
      selectedVariants
    });
    
    return totalPieces;
  };

  // Función para editar un item del carrito
  const handleEditCartItem = (cartItem) => {
    setEditingCartItem(cartItem);
    setIsCartOpen(false);
    
    // Buscar el producto original
    const product = products.find(p => p._id === cartItem._id);
    if (product) {
      setSelectedProduct(product);
      
      // Restaurar las variantes seleccionadas del item del carrito
      if (cartItem.variants) {
        setSelectedVariants(cartItem.variants);
      }
      
      // Restaurar los extras seleccionados
      if (cartItem.extras) {
        setSelectedExtras(cartItem.extras);
      }
      
      // Establecer la cantidad del producto
      setProductQuantities(prev => ({
        ...prev,
        [product._id]: cartItem.quantity
      }));
    }
  };

  // Función para actualizar un item editado
  const handleUpdateEditedItem = () => {
    if (editingCartItem) {
      // Remover el item original del carrito
      removeItem(editingCartItem.id);
      
      // Agregar el item actualizado
      const finalQuantity = hasVariantsWithQuantity(selectedProduct) 
        ? calculateTotalVariantQuantity(selectedProduct)
        : (productQuantities[selectedProduct._id] || 1);
      
      if (finalQuantity > 0) {
        addToCart(
          selectedProduct, 
          finalQuantity,
          selectedVariants,
          selectedExtras
        );
      }
      
      // Limpiar el estado de edición
      setEditingCartItem(null);
      setSelectedProduct(null);
      setSelectedVariants({});
      setSelectedExtras([]);
    }
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
          setSelectedVariants({});
          setSelectedExtras([]);
          document.body.style.overflow = 'auto';
          document.body.style.position = 'static';
          document.body.style.width = 'auto';
        } else {
          setSelectedProduct(product);
          setSelectedVariants({});
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


  // Función para calcular el descuento por mayoreo
  const calculateWholesaleDiscount = (product, totalQuantity, itemPrice = null) => {
    if (!product.wholesalePricing || product.wholesalePricing.length === 0) {
      return { discount: 0, discountPercentage: 0 };
    }

    // Encontrar el descuento más alto aplicable según la cantidad
    let applicableDiscount = null;
    for (const pricing of product.wholesalePricing.sort((a, b) => b.minQuantity - a.minQuantity)) {
      if (totalQuantity >= pricing.minQuantity) {
        applicableDiscount = pricing;
        break;
      }
    }

    if (applicableDiscount) {
      // Si se proporciona itemPrice, usar ese; sino usar el precio base
      const priceToDiscount = itemPrice || (product.precioPromocion > 0 ? product.precioPromocion : product.precio);
      const discountAmount = priceToDiscount * (applicableDiscount.discount / 100);
      return {
        discount: discountAmount,
        discountPercentage: applicableDiscount.discount,
        minQuantity: applicableDiscount.minQuantity
      };
    }

    return { discount: 0, discountPercentage: 0 };
  };

  const addToCart = (product, quantity, selectedVariants, selectedExtras) => {
    // Función para calcular el precio total de un item específico
    const calculateItemPrice = (product, selectedVariants, selectedExtras, quantity) => {
      let basePrice = product.precioPromocion > 0 ? product.precioPromocion : product.precio;
      let totalPrice = 0;
      
      // Calcular cantidad total de piezas considerando multiplicadores
      let totalPieces = 1;
      let totalQuantity = quantity;
      
      if (hasVariantsWithQuantity(product)) {
        // Para productos con variantes con cantidad seleccionable
        totalQuantity = calculateTotalVariantQuantity(product);
        totalPieces = 0;
        
        Object.entries(selectedVariants).forEach(([variantId, options]) => {
          const variant = product.variants?.find(v => v.id === variantId);
          if (variant && variant.enableStock) {
            Object.entries(options).forEach(([optionId, optionQuantity]) => {
              if (optionQuantity > 0) {
                const option = variant.options.find(o => o.id === optionId);
                if (option) {
                  const multiplier = option.quantityMultiplier || 1;
                  totalPieces += optionQuantity * multiplier;
                }
              }
            });
          }
        });
      } else {
        // Para productos simples
        // Calcular multiplicador de variantes estáticas
        let staticMultiplier = 1;
        Object.entries(selectedVariants).forEach(([variantId, options]) => {
          const variant = product.variants?.find(v => v.id === variantId);
          if (variant && !variant.enableStock) {
            Object.entries(options).forEach(([optionId, optionQuantity]) => {
              if (optionQuantity > 0) {
                const option = variant.options.find(o => o.id === optionId);
                if (option && option.quantityMultiplier) {
                  staticMultiplier *= option.quantityMultiplier;
                }
              }
            });
          }
        });
        
        totalPieces = totalQuantity * staticMultiplier;
      }
      
      // Calcular precio base por unidad
      let unitPrice = basePrice;
      
      // Agregar precios de variantes estáticas al precio base por unidad
      Object.entries(selectedVariants).forEach(([variantId, options]) => {
        const variant = product.variants?.find(v => v.id === variantId);
        if (variant && !variant.enableStock) {
          Object.entries(options).forEach(([optionId, optionQuantity]) => {
            if (optionQuantity > 0) {
              const option = variant.options.find(o => o.id === optionId);
              if (option && option.price > 0) {
                unitPrice += option.price;
              }
            }
          });
        }
      });

      // Calcular precio total
      if (product.priceType === "per_piece") {
        totalPrice = unitPrice * totalPieces;
      } else {
        totalPrice = unitPrice * totalQuantity;
      }

      // Agregar precios de extras al total (no por unidad)
      if (selectedExtras.length > 0 && product.extras) {
        selectedExtras.forEach(extraName => {
          const extra = product.extras.find(e => e.name === extraName);
          if (extra && extra.price && !isNaN(parseFloat(extra.price))) {
            const extraPrice = parseFloat(extra.price);
            if (extra.priceType === "per_piece") {
              // Si el extra es por pieza, multiplicar por las piezas totales
              totalPrice += extraPrice * totalPieces;
            } else {
              // Si el extra es por paquete, multiplicar por la cantidad de paquetes
              totalPrice += extraPrice * totalQuantity;
            }
          }
        });
      }

      // Agregar precios de variantes con cantidad seleccionable
      Object.entries(selectedVariants).forEach(([variantId, options]) => {
        const variant = product.variants?.find(v => v.id === variantId);
        if (variant && variant.enableStock) {
          Object.entries(options).forEach(([optionId, optionQuantity]) => {
            if (optionQuantity > 0) {
              const option = variant.options.find(o => o.id === optionId);
              if (option && option.price > 0) {
                // Para variantes con cantidad, siempre multiplicar por la cantidad
                totalPrice += option.price * optionQuantity;
              }
            }
          });
        }
      });

      // Aplicar descuento por mayoreo si aplica
      if (product.wholesalePricing && product.wholesalePricing.length > 0) {
        const wholesaleDiscount = calculateWholesaleDiscount(product, totalQuantity, totalPrice / totalQuantity);
        if (wholesaleDiscount.discount > 0) {
          totalPrice -= wholesaleDiscount.discount * totalQuantity;
        }
      }

      return totalPrice;
    };
    
    
    // Crear resumen de variantes estáticas
    const staticVariants = [];
    Object.entries(selectedVariants).forEach(([variantId, options]) => {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant && !variant.enableStock) {
        Object.entries(options).forEach(([optionId, optionQuantity]) => {
          if (optionQuantity > 0) {
            const option = variant.options.find(o => o.id === optionId);
            if (option) {
              staticVariants.push(option.name);
            }
          }
        });
      }
    });
    
    const itemsToAdd = [];
    let hasQuantityVariants = false;
    
    // Procesar variantes con cantidad seleccionable
    Object.entries(selectedVariants).forEach(([variantId, options]) => {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant && variant.enableStock) {
        hasQuantityVariants = true;
        Object.entries(options).forEach(([optionId, optionQuantity]) => {
          if (optionQuantity > 0) {
            const option = variant.options.find(o => o.id === optionId);
            if (option) {
              // Crear variantes específicas para este item
              const itemVariants = { 
                ...Object.fromEntries(
                  Object.entries(selectedVariants).filter(([vId]) => {
                    const v = product.variants?.find(variant => variant.id === vId);
                    return v && !v.enableStock;
                  })
                ),
                [variantId]: { [optionId]: optionQuantity }
              };
              
              // Calcular precio total para esta combinación específica
              const totalPrice = calculateItemPrice(product, itemVariants, selectedExtras, optionQuantity);
              const finalUnitPrice = totalPrice / optionQuantity;
              
              // Crear resumen de variantes para este item
              const itemVariantsSummary = [...staticVariants, `${option.name} (${optionQuantity})`];
              
              itemsToAdd.push({
                id: `${product._id}_${variantId}_${optionId}_${Date.now()}_${Math.random()}`,
                _id: product._id,
                nombre: product.nombre,
                imagen: product.imagen,
                price: finalUnitPrice,
                quantity: optionQuantity,
                variants: itemVariants,
                variantsSummary: itemVariantsSummary,
                extras: selectedExtras,
                businessId: params.username,
                basePrice: product.precioPromocion > 0 ? product.precioPromocion : product.precio,
                variantPrice: option.price || 0,
                extrasPrice: selectedExtras.reduce((sum, extraName) => {
                  const extra = product.extras?.find(e => e.name === extraName);
                  return sum + (parseFloat(extra?.price) || 0);
                }, 0),
                wholesaleDiscount: product.wholesalePricing && product.wholesalePricing.length > 0 ? 
                  calculateWholesaleDiscount(product, optionQuantity, totalPrice / optionQuantity) : null
              });
            }
          }
        });
      }
    });
    
    // Si no hay variantes con cantidad, crear un solo item
    if (!hasQuantityVariants) {
      const totalPrice = calculateItemPrice(product, selectedVariants, selectedExtras, quantity);
      const finalUnitPrice = totalPrice / quantity;
      
      const itemVariantsSummary = [...staticVariants];
      
      itemsToAdd.push({
        id: `${product._id}_${Date.now()}`,
        _id: product._id,
        nombre: product.nombre,
        imagen: product.imagen,
        price: finalUnitPrice,
        quantity: quantity,
        variants: selectedVariants,
        variantsSummary: itemVariantsSummary,
        extras: selectedExtras,
        businessId: params.username,
        basePrice: product.precioPromocion > 0 ? product.precioPromocion : product.precio,
        variantPrice: Object.entries(selectedVariants).reduce((sum, [variantId, options]) => {
          const variant = product.variants?.find(v => v.id === variantId);
          if (variant && !variant.enableStock) {
            return sum + Object.entries(options).reduce((optionSum, [optionId, optionQuantity]) => {
              const option = variant.options.find(o => o.id === optionId);
              return optionSum + ((option?.price || 0) * (optionQuantity > 0 ? 1 : 0));
            }, 0);
          }
          return sum;
        }, 0),
        extrasPrice: selectedExtras.reduce((sum, extraName) => {
          const extra = product.extras?.find(e => e.name === extraName);
          return sum + (parseFloat(extra?.price) || 0);
        }, 0),
        wholesaleDiscount: product.wholesalePricing && product.wholesalePricing.length > 0 ? 
          calculateWholesaleDiscount(product, quantity, totalPrice / quantity) : null
      });
    }
    
    // Agregar todos los items al carrito
    itemsToAdd.forEach(item => {
      addToPersistedCart(item);
    });
    
    setSelectedProduct(null);
    setIsCartOpen(true);
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
      <span className="mr-2">Crea tu cátalogo digital en:</span>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white w-full h-[100vh] sm:h-[85vh] sm:max-w-lg sm:rounded-xl relative flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Contenedor con scroll */}
          <div className="flex-1 overflow-y-auto pb-[150px] pt-16">
            {/* Imagen del producto */}
            <div className="px-4 sm:px-6 pb-4">
              <div className="w-full aspect-square relative rounded-2xl overflow-hidden">
                 <Image
                   src={selectedProduct.imagen}
                   alt={selectedProduct.nombre}
                   fill
                   style={{ objectFit: 'cover' }}
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
                    <p className="font-bold text-lg text-black">${calculateDynamicPrice(selectedProduct).toFixed(2)}</p>
                    <p className="text-gray-500 line-through text-sm">${selectedProduct.precio.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="font-bold text-lg">${calculateDynamicPrice(selectedProduct).toFixed(2)}</p>
                )}
                {(calculateDynamicPrice(selectedProduct) > (selectedProduct.precioPromocion || selectedProduct.precio)) && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +${(calculateDynamicPrice(selectedProduct) - (selectedProduct.precioPromocion || selectedProduct.precio)).toFixed(2)} extras
                  </span>
                )}
                
                {/* Mostrar información de descuentos por mayoreo */}
                {(() => {
                  const discountInfo = getAvailableDiscounts(selectedProduct);
                  if (!discountInfo || !discountInfo.allDiscounts) return null;
                  
                  // Mostrar solo el descuento activo si existe
                  const activeDiscount = discountInfo.allDiscounts.find(d => d.isActive);
                  if (activeDiscount) {
                    return (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full ml-2">
                        -{activeDiscount.discount}% mayoreo activo
                      </span>
                    );
                  }
                  
                  return null;
                })()}
              </div>
              
              {selectedProduct.descripcion && (
                <p className="text-gray-700 mb-8">{selectedProduct.descripcion}</p>
              )}

              {/* Variantes */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="mb-6">
                  {selectedProduct.variants.map((variant, variantIndex) => (
                    <div key={variant.id} className="mb-6">
                      {/* Divisor entre variantes */}
                      {variantIndex > 0 && (
                        <div className="border-t-2 border-gray-200 mb-4"></div>
                      )}
                      
                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center justify-between">
                        <span>{variant.name}</span>
                        {variant.isRequired !== false ? (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                            Requerido
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
                            Opcional
                          </span>
                        )}
                      </h4>
                      <div className="space-y-2">
                        {variant.options.map((option) => (
                          <div key={option.id} className="relative">
                            {variant.enableStock ? (
                              // Con contador de cantidad
                              <div className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-700">
                                    {option.name}
                                    {option.price > 0 && (
                                      <span className="text-xs text-green-600 ml-2">+${option.price.toFixed(2)}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center border rounded-lg">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const currentQuantity = getVariantQuantity(variant.id, option.id);
                                      handleVariantQuantityChange(variant.id, option.id, Math.max(0, currentQuantity - 1));
                                    }}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
                                  >
                                    -
                                  </button>
                                  <div className="w-12 h-8 flex items-center justify-center bg-white text-sm">
                                    {getVariantQuantity(variant.id, option.id)}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const currentQuantity = getVariantQuantity(variant.id, option.id);
                                      handleVariantQuantityChange(variant.id, option.id, currentQuantity + 1);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Sin contador (selección única)
                              <div className="relative">
                                <input
                                  type="radio"
                                  id={`variant-${variant.id}-${option.id}`}
                                  name={`variant-${variant.id}`}
                                  value={option.id}
                                  checked={getVariantQuantity(variant.id, option.id) > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleVariantOptionChange(variant.id, option.id, 1);
                                    } else {
                                      handleVariantQuantityChange(variant.id, option.id, 0);
                                    }
                                  }}
                                  className="peer hidden"
                                  required
                                />
                                <label
                                  htmlFor={`variant-${variant.id}-${option.id}`}
                                  className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-gray-600 peer-checked:bg-gray-50 hover:bg-gray-50 transition-all"
                                >
                                  <div className="flex-1 text-sm font-medium text-gray-700">
                                    {option.name}
                                    {option.price > 0 && (
                                      <span className="text-xs text-green-600 ml-2">+${option.price.toFixed(2)}</span>
                                    )}
                                  </div>
                                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center ml-3 peer-checked:border-gray-600 flex-shrink-0">
                                    <div className={`w-2.5 h-2.5 bg-gray-600 rounded-full ${getVariantQuantity(variant.id, option.id) > 0 ? 'block' : 'hidden'}`}></div>
                                  </div>
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Compatibilidad con estructura antigua (tipos) */}
              {selectedProduct.tipos && !selectedProduct.variants && (
                <div className="mb-6">
                  {/* Divisor antes de tipos */}
                  <div className="border-t-2 border-gray-200 mb-4"></div>
                  
                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center justify-between">
                    <span>{selectedProduct.tipos.titulo}</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                      Requerido
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {selectedProduct.tipos.opciones.map((opcion, index) => (
                      <div key={index} className="relative">
                        <input
                          type="radio"
                          id={`tipo-${index}`}
                          name="tipo"
                          value={opcion.nombre}
                          checked={Object.keys(selectedVariants).includes(opcion.nombre)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleVariantOptionChange('legacy-tipo', opcion.nombre, 1);
                            } else {
                              handleVariantQuantityChange('legacy-tipo', opcion.nombre, 0);
                            }
                          }}
                          className="peer hidden"
                          required
                        />
                        <label
                          htmlFor={`tipo-${index}`}
                          className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-gray-600 peer-checked:bg-gray-50 hover:bg-gray-50 transition-all"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">
                              {opcion.nombre}
                              {opcion.precio && (
                                <span className="text-xs text-green-600 ml-2">+${opcion.precio.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center ml-3 peer-checked:border-gray-600 flex-shrink-0">
                            <div className={`w-2.5 h-2.5 bg-gray-600 rounded-full ${Object.keys(selectedVariants).includes(opcion.nombre) ? 'block' : 'hidden'}`}></div>
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
                  {/* Divisor antes de extras */}
                  <div className="border-t-2 border-gray-200 mb-4"></div>
                  
                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center justify-between">
                    <span>Extras</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
                      Opcional
                    </span>
                  </h4>
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
                          <div className="flex-1 text-sm font-medium text-gray-700">
                            {extra.name}
                            <span className="text-xs text-green-600 ml-2">
                              +${typeof extra.price === 'number' ? extra.price.toFixed(2) : extra.price}
                            </span>
                          </div>
                          <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center ml-3 peer-checked:border-gray-600 flex-shrink-0">
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
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de cantidad - Movido aquí desde el footer */}
              {!hasVariantsWithQuantity(selectedProduct) && (
                <div className="mb-6">
                  {/* Divisor antes de cantidad */}
                  <div className="border-t-2 border-gray-200 mb-4"></div>
                  
                  <h4 className="font-semibold mb-3 text-gray-800">
                    Cantidad
                  </h4>
                  <div className="flex items-center justify-center w-full">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecreaseQuantity(selectedProduct._id);
                        }}
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 text-lg font-medium hover:bg-gray-200"
                      >
                        -
                      </button>
                      <div className="w-16 h-12 flex items-center justify-center bg-white text-lg font-medium">
                        {productQuantities[selectedProduct._id] || 1}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncreaseQuantity(selectedProduct._id);
                        }}
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 text-lg font-medium hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de cerrar flotante - siempre visible */}
          <button
            className="absolute top-12 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (editingCartItem) {
                // Si estamos editando, limpiar el estado de edición
                setEditingCartItem(null);
                setSelectedProduct(null);
                setSelectedVariants({});
                setSelectedExtras([]);
              } else {
                toggleProductDetails(selectedProduct);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>


          {/* Fondo blanco adicional en la parte inferior para mobile */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white -z-10"></div>

          {/* Footer fijo con botón de agregar */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white shadow-lg">
            <div className="max-w-lg mx-auto">
              {/* Banner de descuentos */}
              {(() => {
                const discountInfo = getAvailableDiscounts(selectedProduct);
                const nextDiscount = getNextDiscount(selectedProduct);
                
                if (!discountInfo || !discountInfo.allDiscounts) return null;
                
                // Mostrar el descuento activo más alto (el mayor descuento alcanzado)
                const activeDiscounts = discountInfo.allDiscounts.filter(d => d.isActive);
                const activeDiscount = activeDiscounts.length > 0 
                  ? activeDiscounts.reduce((max, current) => current.discount > max.discount ? current : max)
                  : null;
                
                if (activeDiscount) {
                  // Mostrar descuento actual activo Y próximo nivel si existe
                  return (
                    <div className="mb-3">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          <span className="text-xs text-gray-700 font-medium">
                            🎉 Descuento activo: <span className="font-bold">{activeDiscount.discount}%</span> de mayoreo
                          </span>
                          {nextDiscount && nextDiscount.needed > 0 && (
                            <span className="text-xs text-gray-600 font-medium">
                              Agrega <span className="font-bold">{nextDiscount.needed}</span> piezas más para <span className="font-bold">{nextDiscount.discount}%</span> descuento
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                } else if (nextDiscount && nextDiscount.needed > 0) {
                  // Mostrar próximo descuento disponible
                  return (
                    <div className="mb-3">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-center text-center">
                          <span className="text-xs text-gray-700 font-medium">
                            Agrega <span className="font-bold">{nextDiscount.needed}</span> piezas más para <span className="font-bold">{nextDiscount.discount}%</span> descuento
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return null;
              })()}
              
              {/* Botón de Agregar al Carrito */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  
                  // Validar que se hayan seleccionado las variantes requeridas
                  if (selectedProduct.variants && selectedProduct.variants.length > 0) {
                    const unselectedRequiredVariants = selectedProduct.variants.filter(variant => {
                      // Solo verificar variantes que son obligatorias
                      if (variant.isRequired === false) return false;
                      
                      const hasSelection = Object.keys(selectedVariants).includes(variant.id) && 
                        Object.values(selectedVariants[variant.id] || {}).some(qty => qty > 0);
                      return !hasSelection; // Si no hay selección en variante obligatoria
                    });
                    
                    if (unselectedRequiredVariants.length > 0) {
                      const variantNames = unselectedRequiredVariants.map(v => v.name).join(', ');
                      alert(`Por favor selecciona las siguientes variantes obligatorias: ${variantNames}`);
                      return;
                    }
                  }
                  
                  // Compatibilidad con estructura antigua
                  if (selectedProduct.tipos && !selectedProduct.variants) {
                    const hasLegacySelection = Object.keys(selectedVariants).length > 0;
                    if (!hasLegacySelection) {
                    alert('Por favor selecciona un tipo');
                      return;
                    }
                  }
                  
                  // Si tiene variantes con cantidad, usar la cantidad total calculada
                  const finalQuantity = hasVariantsWithQuantity(selectedProduct) 
                    ? calculateTotalVariantQuantity(selectedProduct)
                    : (productQuantities[selectedProduct._id] || 1);
                  
                  // Validar que hay al menos una unidad seleccionada
                  if (finalQuantity === 0) {
                    alert('Debes seleccionar al menos una unidad');
                    return;
                  }
                  
                  if (editingCartItem) {
                    // Si estamos editando, actualizar el item
                    handleUpdateEditedItem();
                  } else {
                    // Si no estamos editando, agregar nuevo item
                  addToCart(
                    selectedProduct, 
                      finalQuantity,
                      selectedVariants,
                    selectedExtras
                  );
                  }
                }}
                className="w-full h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-white">
                  {editingCartItem ? "Actualizar item" : `Agregar ${hasVariantsWithQuantity(selectedProduct) ? calculateTotalVariantQuantity(selectedProduct) : (productQuantities[selectedProduct._id] || 1)} al carrito • $${calculateDynamicPrice(selectedProduct).toFixed(2)}`}
                </span>
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
    onEditItem={handleEditCartItem}
    appearance={businessData}
    total={cart.total}
  />
</div>

  )
}

export default function UserPage({ params }) {
  return <UserPageContent params={params} />;
}

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
    
    // Calcular cantidad total de piezas y cantidad de unidades
    let totalPieces = 1;
    let totalQuantity = 1;
    
    if (hasVariantsWithQuantity(product)) {
      // Para productos con variantes con cantidad seleccionable
      totalQuantity = calculateTotalVariantQuantity(product);
      
      // Calcular totalPieces considerando multiplicadores
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

    // Calcular precio base + variantes (sin extras)
    let basePriceWithVariants = 0;
    if (product.priceType === "per_piece") {
      basePriceWithVariants = unitPrice * totalPieces;
    } else {
      basePriceWithVariants = unitPrice * totalQuantity;
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
              basePriceWithVariants += option.price * optionQuantity;
            }
          }
        });
      }
    });

    // Aplicar descuento por mayoreo solo al precio base + variantes (sin extras)
    if (product.wholesalePricing && product.wholesalePricing.length > 0) {
      const wholesaleDiscount = calculateWholesaleDiscount(product, totalQuantity, totalPieces, basePriceWithVariants / (product.priceType === "per_piece" ? totalPieces : totalQuantity));
      if (wholesaleDiscount.discount > 0) {
        if (product.priceType === "per_piece") {
          basePriceWithVariants -= wholesaleDiscount.discount * totalPieces;
        } else {
          basePriceWithVariants -= wholesaleDiscount.discount * totalQuantity;
        }
      }
    }

    // Calcular precio total agregando extras (que no tienen descuento)
    let totalPrice = basePriceWithVariants;
    
    // Agregar precios de extras al total (sin descuento por mayoreo)
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
    <div className="flex flex-col justify-center items-center h-[100dvh] bg-gray-50">
      <div className="relative">
        <div className="w-10 h-10 border-[3px] border-gray-200 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-[3px] border-transparent border-t-gray-900 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-sm text-gray-400 font-medium">Cargando...</p>
    </div>
  )
  if (error) return <div>Error: {error}</div>
  if (!businessData) return notFound()

  const {
    'basic-info': basicInfo = {},
    categories = [],
    products = [],
    buttons = [],
    appearance = {},
    deliverySettings = null
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
  const calculateWholesaleDiscount = (product, totalQuantity, totalPieces, itemPrice = null) => {
    if (!product.wholesalePricing || product.wholesalePricing.length === 0) {
      return { discount: 0, discountPercentage: 0 };
    }

    // Para productos por pieza, usar totalPieces; para productos por paquete, usar totalPieces si hay variantes con cantidad, sino totalQuantity
    const quantityForDiscount = product.priceType === "per_piece" ? totalPieces : 
      (totalPieces > totalQuantity ? totalPieces : totalQuantity);

    // Debug: mostrar información del descuento
    console.log('Calculando descuento:', {
      product: product.nombre,
      priceType: product.priceType,
      totalQuantity,
      totalPieces,
      quantityForDiscount,
      itemPrice,
      wholesalePricing: product.wholesalePricing
    });

    // Encontrar el descuento más alto aplicable según la cantidad
    let applicableDiscount = null;
    for (const pricing of product.wholesalePricing.sort((a, b) => b.minQuantity - a.minQuantity)) {
      console.log('Verificando descuento:', {
        minQuantity: pricing.minQuantity,
        discount: pricing.discount,
        quantityForDiscount,
        applies: quantityForDiscount >= pricing.minQuantity
      });
      
      if (quantityForDiscount >= pricing.minQuantity) {
        applicableDiscount = pricing;
        break;
      }
    }

    if (applicableDiscount) {
      // Si se proporciona itemPrice, usar ese; sino usar el precio base
      const priceToDiscount = itemPrice || (product.precioPromocion > 0 ? product.precioPromocion : product.precio);
      const discountAmount = priceToDiscount * (applicableDiscount.discount / 100);
      
      console.log('Descuento aplicado:', {
        applicableDiscount,
        priceToDiscount,
        discountAmount,
        discountPercentage: applicableDiscount.discount
      });
      
      return {
        discount: discountAmount,
        discountPercentage: applicableDiscount.discount,
        minQuantity: applicableDiscount.minQuantity
      };
    }

    console.log('No se aplicó descuento');
    return { discount: 0, discountPercentage: 0 };
  };

  const addToCart = (product, quantity, selectedVariants, selectedExtras) => {
    // Función para calcular el precio total de un item específico
    const calculateItemPrice = (product, selectedVariants, selectedExtras, quantity) => {
      let basePrice = product.precioPromocion > 0 ? product.precioPromocion : product.precio;
      
      // Calcular cantidad total de piezas y cantidad de unidades
      let totalPieces = 1;
      let totalQuantity = quantity;
      
      if (hasVariantsWithQuantity(product)) {
        // Para productos con variantes con cantidad seleccionable
        totalQuantity = calculateTotalVariantQuantity(product);
        
        // Calcular totalPieces considerando multiplicadores
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

      // Calcular precio base + variantes (sin extras)
      let basePriceWithVariants = 0;
      if (product.priceType === "per_piece") {
        basePriceWithVariants = unitPrice * totalPieces;
      } else {
        basePriceWithVariants = unitPrice * totalQuantity;
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
                basePriceWithVariants += option.price * optionQuantity;
              }
            }
          });
        }
      });

      // Aplicar descuento por mayoreo solo al precio base + variantes (sin extras)
      if (product.wholesalePricing && product.wholesalePricing.length > 0) {
        const wholesaleDiscount = calculateWholesaleDiscount(product, totalQuantity, totalPieces, basePriceWithVariants / (product.priceType === "per_piece" ? totalPieces : totalQuantity));
        if (wholesaleDiscount.discount > 0) {
          if (product.priceType === "per_piece") {
            basePriceWithVariants -= wholesaleDiscount.discount * totalPieces;
          } else {
            basePriceWithVariants -= wholesaleDiscount.discount * totalQuantity;
          }
        }
      }

      // Calcular precio total agregando extras (que no tienen descuento)
      let totalPrice = basePriceWithVariants;
      
      // Agregar precios de extras al total (sin descuento por mayoreo)
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
    
    // Verificar si hay variantes con cantidad seleccionable
    Object.entries(selectedVariants).forEach(([variantId]) => {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant && variant.enableStock) {
        hasQuantityVariants = true;
      }
    });
    
    // Si hay variantes con cantidad, crear un solo item con todas las variantes
    if (hasQuantityVariants) {
      // Calcular precio total para todas las variantes seleccionadas
      const totalPrice = calculateItemPrice(product, selectedVariants, selectedExtras, 1);
      
      // Calcular cantidades para el descuento por mayoreo
      let totalPieces = 0;
      let totalQuantity = 1;
      
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
      
      // Calcular precio unitario (base + variantes estáticas)
      let unitPrice = product.precioPromocion > 0 ? product.precioPromocion : product.precio;
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
      
      // Calcular el descuento por mayoreo
      const wholesaleDiscount = product.wholesalePricing && product.wholesalePricing.length > 0 ? 
        calculateWholesaleDiscount(product, totalQuantity, totalPieces, totalPrice / (product.priceType === "per_piece" ? totalPieces : totalQuantity)) : null;
      
      // Debug: mostrar información del descuento
      if (wholesaleDiscount && wholesaleDiscount.discountPercentage > 0) {
        console.log('Descuento calculado:', {
          product: product.nombre,
          totalPieces,
          totalQuantity,
          unitPrice,
          discountPercentage: wholesaleDiscount.discountPercentage,
          discount: wholesaleDiscount.discount
        });
      }
      
      // Crear resumen de todas las variantes
      const itemVariantsSummary = [...staticVariants];
      Object.entries(selectedVariants).forEach(([variantId, options]) => {
        const variant = product.variants?.find(v => v.id === variantId);
        if (variant && variant.enableStock) {
          Object.entries(options).forEach(([optionId, optionQuantity]) => {
            if (optionQuantity > 0) {
              const option = variant.options.find(o => o.id === optionId);
              if (option) {
                itemVariantsSummary.push(`${option.name} (${optionQuantity})`);
              }
            }
          });
        }
      });
      
      itemsToAdd.push({
        id: `${product._id}_${Date.now()}`,
        _id: product._id,
        nombre: product.nombre,
        imagen: product.imagen,
        price: totalPrice,
        quantity: 1,
        variants: selectedVariants,
        variantsSummary: itemVariantsSummary,
        extras: selectedExtras,
        businessId: params.username,
        basePrice: product.precioPromocion > 0 ? product.precioPromocion : product.precio,
        variantPrice: Object.entries(selectedVariants).reduce((sum, [variantId, options]) => {
          const variant = product.variants?.find(v => v.id === variantId);
          if (variant && variant.enableStock) {
            Object.entries(options).forEach(([optionId, optionQuantity]) => {
              if (optionQuantity > 0) {
                const option = variant.options.find(o => o.id === optionId);
                if (option && option.price) {
                  sum += option.price * optionQuantity;
                }
              }
            });
          }
          return sum;
        }, 0),
        extrasPrice: selectedExtras.reduce((sum, extraName) => {
          const extra = product.extras?.find(e => e.name === extraName);
          return sum + (parseFloat(extra?.price) || 0);
        }, 0),
        wholesaleDiscount: wholesaleDiscount
      });
    }
    
    // Si no hay variantes con cantidad, crear un solo item
    if (!hasQuantityVariants) {
      const totalPrice = calculateItemPrice(product, selectedVariants, selectedExtras, quantity);
      const finalUnitPrice = totalPrice / quantity;
      
      // Calcular precio unitario (base + variantes estáticas)
      let unitPrice = product.precioPromocion > 0 ? product.precioPromocion : product.precio;
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
      
      // Calcular cantidades para el descuento
      let totalPieces = quantity;
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
      totalPieces = quantity * staticMultiplier;
      
      // Calcular el descuento por mayoreo
      const wholesaleDiscount = product.wholesalePricing && product.wholesalePricing.length > 0 ? 
        calculateWholesaleDiscount(product, quantity, totalPieces, finalUnitPrice) : null;
      
      // Debug: mostrar información del descuento
      if (wholesaleDiscount && wholesaleDiscount.discountPercentage > 0) {
        console.log('Descuento calculado (sin variantes):', {
          product: product.nombre,
          totalPieces,
          quantity,
          unitPrice,
          discountPercentage: wholesaleDiscount.discountPercentage,
          discount: wholesaleDiscount.discount
        });
      }
      
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
        wholesaleDiscount: wholesaleDiscount
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
          <header className="relative">
            <Image
              src={mergedBasicInfo.coverPhotoUrl}
              alt={`Portada de ${mergedBasicInfo.businessName}`}
              width={500}
              height={300}
              layout="responsive"
              objectFit="cover"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
                <Image
                  src={mergedBasicInfo.logoUrl}
                  alt={`Logo de ${mergedBasicInfo.businessName}`}
                  width={128}
                  height={128}
                  objectFit="cover"
                />
              </div>
            </div>
          </header>

          <BusinessInfo basicInfo={basicInfo} appearance={appearance} />
          <ActionButtons buttons={buttons} appearance={appearance} />
        </div>

        {/* Columns 2-4: Categories and Products */}
        <div className="lg:w-3/4 lg:ml-[25%]">
          <div className="bg-gray-50">
            {/* Categories */}
            <div className="py-4 sm:py-6 lg:py-2 bg-white border-b border-gray-100 text-center lg:text-left sticky top-0 z-30">
              <h2 className={`text-2xl sm:text-3xl font-medium px-4 sm:px-6 pt-2 sm:pt-4 text-gray-900 ${headingFont}`}>
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
          {/* Footer */}
          <footer className="w-full bg-gray-50 py-6 px-4 text-center mt-8 mb-20 sm:mb-4">
            <Link
              href="https://repisa.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span>Crea tu catálogo digital en</span>
              <Image
                src="/images/logotipo_repisa_co_negro.png"
                alt="Logo Repisa"
                width={90}
                height={18}
                className="opacity-70 hover:opacity-100 transition-opacity"
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
    {showScrollTop && !cart?.items?.length && (
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-4 bg-white text-gray-700 w-11 h-11 rounded-full shadow-lg z-40 flex items-center justify-center active:scale-95 transition-transform border border-gray-100"
        aria-label="Volver arriba"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
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
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50"
        onClick={(e) => {
          e.stopPropagation();
          toggleProductDetails(selectedProduct);
        }}
      >

        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white w-full h-[100dvh] sm:h-[85vh] sm:max-w-lg sm:rounded-2xl relative flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Drag handle indicator for mobile */}
          <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full z-30" />

          {/* Contenedor con scroll */}
          <div className="flex-1 overflow-y-auto overscroll-y-contain pb-[160px] pt-12 sm:pt-6">
            {/* Imagen del producto */}
            <div className="px-4 sm:px-6 pb-4">
              <figure className="w-full aspect-square relative rounded-2xl overflow-hidden shadow-sm">
                 <Image
                   src={selectedProduct.imagen}
                   alt={`${selectedProduct.nombre}${selectedProduct.descripcion ? ` - ${selectedProduct.descripcion.slice(0, 50)}` : ''}`}
                   fill
                   sizes="(max-width: 640px) 100vw, 512px"
                   className="object-cover"
                   priority
                 />
              </figure>
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
                    <div key={variant.id} className="mb-5">
                      {variantIndex > 0 && (
                        <div className="border-t border-gray-100 mb-4" />
                      )}

                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center justify-between">
                        <span>{variant.name}</span>
                        {variant.isRequired !== false ? (
                          <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium">
                            Requerido
                          </span>
                        ) : (
                          <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                            Opcional
                          </span>
                        )}
                      </h4>
                      <div className="space-y-2">
                        {variant.options.map((option) => (
                          <div key={option.id} className="relative">
                            {variant.enableStock ? (
                              // Con contador de cantidad
                              <div className="flex items-center justify-between w-full p-3.5 bg-white border border-gray-200 rounded-xl transition-colors">
                                <div className="flex-1 min-w-0 pr-3">
                                  <div className="text-sm font-medium text-gray-800 truncate">
                                    {option.name}
                                  </div>
                                  {option.price > 0 && (
                                    <span className="text-xs text-emerald-600 font-medium">+${option.price.toFixed(2)}</span>
                                  )}
                                </div>
                                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const currentQuantity = getVariantQuantity(variant.id, option.id);
                                      handleVariantQuantityChange(variant.id, option.id, Math.max(0, currentQuantity - 1));
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg font-medium active:bg-gray-200 transition-colors"
                                  >
                                    −
                                  </button>
                                  <div className="w-10 h-10 flex items-center justify-center bg-white text-sm font-semibold tabular-nums">
                                    {getVariantQuantity(variant.id, option.id)}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const currentQuantity = getVariantQuantity(variant.id, option.id);
                                      handleVariantQuantityChange(variant.id, option.id, currentQuantity + 1);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg font-medium active:bg-gray-200 transition-colors"
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
                                  className="flex items-center justify-between w-full p-3.5 bg-white border border-gray-200 rounded-xl cursor-pointer peer-checked:border-gray-900 peer-checked:bg-gray-50 active:bg-gray-50 transition-all"
                                >
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-800">{option.name}</span>
                                    {option.price > 0 && (
                                      <span className="text-xs text-emerald-600 font-medium ml-2">+${option.price.toFixed(2)}</span>
                                    )}
                                  </div>
                                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ml-3 flex-shrink-0 transition-colors ${getVariantQuantity(variant.id, option.id) > 0 ? 'border-gray-900 bg-gray-900' : 'border-gray-300'}`}>
                                    {getVariantQuantity(variant.id, option.id) > 0 && (
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
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
                  <div className="border-t border-gray-100 mb-4" />

                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center justify-between">
                    <span>Extras</span>
                    <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
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
                          className="flex items-center justify-between w-full p-3.5 bg-white border border-gray-200 rounded-xl cursor-pointer peer-checked:border-gray-900 peer-checked:bg-gray-50 active:bg-gray-50 transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-800">{extra.name}</span>
                            <span className="text-xs text-emerald-600 font-medium ml-2">
                              +${typeof extra.price === 'number' ? extra.price.toFixed(2) : extra.price}
                            </span>
                          </div>
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ml-3 flex-shrink-0 transition-colors ${selectedExtras.includes(extra.name) ? 'border-gray-900 bg-gray-900' : 'border-gray-300'}`}>
                            {selectedExtras.includes(extra.name) && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de cantidad */}
              {!hasVariantsWithQuantity(selectedProduct) && (
                <div className="mb-6">
                  <div className="border-t border-gray-100 mb-4" />

                  <h4 className="font-semibold mb-3 text-gray-800">
                    Cantidad
                  </h4>
                  <div className="flex items-center justify-center w-full">
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecreaseQuantity(selectedProduct._id);
                        }}
                        className="w-14 h-14 flex items-center justify-center text-gray-600 text-xl font-medium active:bg-gray-200 transition-colors"
                      >
                        −
                      </button>
                      <div className="w-16 h-14 flex items-center justify-center bg-white text-lg font-semibold tabular-nums">
                        {productQuantities[selectedProduct._id] || 1}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncreaseQuantity(selectedProduct._id);
                        }}
                        className="w-14 h-14 flex items-center justify-center text-gray-600 text-xl font-medium active:bg-gray-200 transition-colors"
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
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white active:scale-95 transition-all duration-150"
            onClick={(e) => {
              e.stopPropagation();
              if (editingCartItem) {
                setEditingCartItem(null);
                setSelectedProduct(null);
                setSelectedVariants({});
                setSelectedExtras([]);
              } else {
                toggleProductDetails(selectedProduct);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>


          {/* Footer fijo con botón de agregar */}
          <div
            className="absolute bottom-0 left-0 right-0 border-t border-gray-100 px-4 pt-3 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
            style={{
              paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))'
            }}
          >
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

                  if (selectedProduct.variants && selectedProduct.variants.length > 0) {
                    const unselectedRequiredVariants = selectedProduct.variants.filter(variant => {
                      if (variant.isRequired === false) return false;

                      const hasSelection = Object.keys(selectedVariants).includes(variant.id) &&
                        Object.values(selectedVariants[variant.id] || {}).some(qty => qty > 0);
                      return !hasSelection;
                    });

                    if (unselectedRequiredVariants.length > 0) {
                      const variantNames = unselectedRequiredVariants.map(v => v.name).join(', ');
                      alert(`Por favor selecciona las siguientes variantes obligatorias: ${variantNames}`);
                      return;
                    }
                  }

                  if (selectedProduct.tipos && !selectedProduct.variants) {
                    const hasLegacySelection = Object.keys(selectedVariants).length > 0;
                    if (!hasLegacySelection) {
                      alert('Por favor selecciona un tipo');
                      return;
                    }
                  }

                  const finalQuantity = hasVariantsWithQuantity(selectedProduct)
                    ? calculateTotalVariantQuantity(selectedProduct)
                    : (productQuantities[selectedProduct._id] || 1);

                  if (finalQuantity === 0) {
                    alert('Debes seleccionar al menos una unidad');
                    return;
                  }

                  if (editingCartItem) {
                    handleUpdateEditedItem();
                  } else {
                    addToCart(
                      selectedProduct,
                      finalQuantity,
                      selectedVariants,
                      selectedExtras
                    );
                  }
                }}
                className="
                  w-full h-14 sm:h-12
                  bg-gray-900 text-white
                  rounded-xl sm:rounded-lg
                  font-semibold text-[15px]
                  hover:bg-gray-800 active:scale-[0.98]
                  transition-all duration-150
                  flex items-center justify-center gap-2
                  shadow-sm
                "
              >
                {editingCartItem ? (
                  <span>Actualizar</span>
                ) : (
                  <>
                    <span>Agregar</span>
                    <span className="mx-1 text-white/40">•</span>
                    <span className="tabular-nums">${calculateDynamicPrice(selectedProduct).toFixed(2)}</span>
                  </>
                )}
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
    deliverySettings={deliverySettings}
  />
</div>

  )
}

export default function UserPage({ params }) {
  return <UserPageContent params={params} />;
}

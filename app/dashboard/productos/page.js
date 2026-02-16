"use client"

import { useState, useEffect } from "react"
import { Plus, X, Edit2, Copy, GripVertical, ChevronDown, ChevronRight, Check } from "lucide-react"
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Componente sortable para variantes
function SortableVariant({ variant, onDelete, onToggleStock, onToggleRequired, onToggleCollapse, onStartInlineEdit, onSaveInlineEdit, onCancelInlineEdit, isCollapsed, isEditingInline, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variant.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header de la variante */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
              title="Arrastrar para reordenar"
            >
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>
            
            {/* Botón de colapso */}
            <button
              onClick={() => onToggleCollapse(variant.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={isCollapsed ? "Expandir" : "Colapsar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {/* Nombre de la variante o campo de edición */}
            <div className="flex-grow">
              {isEditingInline ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => onStartInlineEdit({ ...variant, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0D654A]"
                    autoFocus
                  />
                  <button
                    onClick={onSaveInlineEdit}
                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Guardar"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onCancelInlineEdit}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Cancelar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{variant.name}</h4>
                  <button
                    onClick={() => onStartInlineEdit(variant)}
                    className="p-1 text-gray-400 hover:text-[#0D654A] hover:bg-gray-50 rounded transition-colors"
                    title="Editar nombre"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controles de la variante */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={variant.enableStock}
                  onChange={() => onToggleStock(variant.id)}
                  className="h-4 w-4 text-[#0D654A] focus:ring-[#0D654A] border-gray-300 rounded"
                />
                <span className="text-xs">Cantidad</span>
              </label>
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={variant.isRequired !== false}
                  onChange={() => onToggleRequired(variant.id)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className={`text-xs ${variant.isRequired !== false ? "text-orange-600 font-medium" : ""}`}>
                  Obligatorio
                </span>
              </label>
            </div>
            
            <button
              onClick={() => onDelete(variant)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              title="Eliminar variante"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido colapsable */}
      {!isCollapsed && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  )
}

// Componente sortable para tarjetas de productos
function SortableProductCard({ product, onEdit, onDuplicate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
    >
      <div className="flex items-center gap-3 p-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0 opacity-40 group-hover:opacity-100"
          title="Arrastrar para reordenar"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        {/* Imagen */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {product.imagen ? (
            <Image
              src={product.imagen}
              alt={product.nombre}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{product.nombre}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                {product.precioPromocion > 0 ? (
                  <>
                    <span className="font-bold text-gray-900">${product.precioPromocion}</span>
                    <span className="text-gray-400 line-through text-sm">${product.precio}</span>
                  </>
                ) : (
                  <span className="font-bold text-gray-900">${product.precio}</span>
                )}
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                  product.availability
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {product.availability ? 'Disponible' : 'Agotado'}
                </span>
              </div>
            </div>
          </div>

          {/* Categorías - solo mostrar si hay */}
          {product.categorias && product.categorias.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {product.categorias.slice(0, 3).map((categoria, index) => (
                <span key={index} className="inline-block bg-gray-100 rounded px-1.5 py-0.5 text-xs text-gray-600">
                  {categoria}
                </span>
              ))}
              {product.categorias.length > 3 && (
                <span className="text-xs text-gray-400">+{product.categorias.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Botones de acción - compactos */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-500 hover:text-[#0D654A] hover:bg-green-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDuplicate(product)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Duplicar"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente sortable para opciones de variantes
function SortableVariantOption({ option, variantId, onDelete, onStartInlineEdit, onSaveInlineEdit, onCancelInlineEdit, isEditingInline, newVariantOption, setNewVariantOption }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
          title="Arrastrar para reordenar"
        >
          <GripVertical className="h-3 w-3 text-gray-400" />
        </div>
        
        {isEditingInline ? (
          <div className="flex items-center gap-2 flex-grow">
            <div className="flex flex-col flex-grow">
              <label className="text-xs text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={newVariantOption.name}
                onChange={(e) => setNewVariantOption({ ...newVariantOption, name: e.target.value })}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0D654A]"
                placeholder="Nombre de la opción"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Precio extra</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">+$</span>
                  </div>
                  <input
                    type="number"
                    value={newVariantOption.price || ''}
                    onChange={(e) => setNewVariantOption({ ...newVariantOption, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-20 pl-6 pr-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0D654A]"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Unidades</label>
                <input
                  type="number"
                  value={newVariantOption.quantityMultiplier || ''}
                  onChange={(e) => setNewVariantOption({ ...newVariantOption, quantityMultiplier: parseInt(e.target.value) || 1 })}
                  placeholder="1"
                  min="1"
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0D654A]"
                  title="Cantidad real por unidad"
                />
              </div>
            </div>
            <button
              onClick={onSaveInlineEdit}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Guardar"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={onCancelInlineEdit}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Cancelar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{option.name}</span>
              {option.price > 0 && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">+${option.price.toFixed(2)}</span>
              )}
              {option.quantityMultiplier && option.quantityMultiplier > 1 && (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">{option.quantityMultiplier} piezas</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {!isEditingInline && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onStartInlineEdit(option, variantId)}
            className="p-1 text-gray-400 hover:text-[#0D654A] hover:bg-gray-100 rounded transition-colors"
            title="Editar opción"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(option, variantId)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Eliminar opción"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function ProductDashboard() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    precio: 0,
    precioPromocion: 0,
    categorias: [],
    availability: true,
    extras: [],
    variants: [],
    wholesalePricing: [],
    priceType: "per_package" // "per_piece" o "per_package"
  })
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [newExtra, setNewExtra] = useState({ name: "", price: 0, priceType: "per_package" })
  const [newVariantCategory, setNewVariantCategory] = useState("")
  const [newVariantOption, setNewVariantOption] = useState({ name: "", price: 0, quantityMultiplier: 1 })
  const [editingVariantCategory, setEditingVariantCategory] = useState(null)
  const [editingVariantOption, setEditingVariantOption] = useState(null)
  const [selectedVariantCategoryId, setSelectedVariantCategoryId] = useState(null)
  const [cardInfoSettings, setCardInfoSettings] = useState({
    nombre: true,
    descripcion: true,
    precio: true,
    categoria: true,
    imagen: true,
    detailedView: true,
  })
  const [error, setError] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [editingExtra, setEditingExtra] = useState(null)
  const [newWholesalePrice, setNewWholesalePrice] = useState({ minQuantity: 0, discount: 0 })
  const [editingWholesalePrice, setEditingWholesalePrice] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  // Estados para secciones avanzadas colapsables
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false)
  const [showVariants, setShowVariants] = useState(false)
  const [showExtras, setShowExtras] = useState(false)
  
  // Estados para UI mejorada de variantes
  const [collapsedVariants, setCollapsedVariants] = useState({})
  const [editingVariantInline, setEditingVariantInline] = useState(null)
  const [editingOptionInline, setEditingOptionInline] = useState(null)
  
  // Estados para confirmaciones de eliminación
  const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false)
  const [variantToDelete, setVariantToDelete] = useState(null)
  const [showDeleteOptionModal, setShowDeleteOptionModal] = useState(false)
  const [optionToDelete, setOptionToDelete] = useState(null)

  // Configuración de sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchCardInfoSettings()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar los productos');
      }
      const data = await response.json()
      setProducts(data)
      setDataLoaded(true)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(`No se pudieron cargar los productos: ${error.message}`);
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar las categorías');
      }
      const data = await response.json()
      setCategories(data)
      setDataLoaded(true)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError(`No se pudieron cargar las categorías: ${error.message}`);
    }
  }

  const fetchCardInfoSettings = async () => {
    try {
      const response = await fetch('/api/card-info-settings')
      if (!response.ok) {
        throw new Error('Error al cargar la configuración de la tarjeta')
      }
      const data = await response.json()
      setCardInfoSettings(data.cardInfoSettings)
    } catch (error) {
      console.error('Error fetching card info settings:', error)
      setError(`No se pudo cargar la configuración de la tarjeta: ${error.message}`)
    }
  }

  const handleCardInfoSettingChange = async (key, value) => {
    const newSettings = { ...cardInfoSettings, [key]: value }
    setCardInfoSettings(newSettings)
    try {
      const response = await fetch('/api/card-info-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })
      if (!response.ok) {
        throw new Error('Error al guardar la configuración de la tarjeta')
      }
    } catch (error) {
      console.error('Error saving card info settings:', error)
      setError(`No se pudo guardar la configuración de la tarjeta: ${error.message}`)
    }
  }

  const handleAddProduct = async () => {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = '/api/products';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }
      await fetchProducts();
      resetNewProduct();
      setIsAddingProduct(false);
      setEditingProduct(null);
    } catch (error) {
      setError(error.message);
      console.error('Error al guardar el producto:', error);
    }
  };

  const resetNewProduct = () => {
    setNewProduct({
      nombre: "",
      descripcion: "",
      imagen: "",
      precio: 0,
      precioPromocion: 0,
      categorias: [],
      availability: true,
      extras: [],
      variants: [],
      wholesalePricing: [],
      priceType: "per_package"
    })
    setNewExtra({ name: "", price: 0, priceType: "per_package" })
    setNewVariantCategory("")
    setNewVariantOption({ name: "", price: 0, quantityMultiplier: 1 })
    setEditingExtra(null)
    setEditingVariantCategory(null)
    setEditingVariantOption(null)
    setSelectedVariantCategoryId(null)
    setNewWholesalePrice({ minQuantity: 0, discount: 0 })
    setEditingWholesalePrice(null)
    // Reset collapsible sections
    setShowAdvancedPricing(false)
    setShowVariants(false)
    setShowExtras(false)
  }

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory.trim() }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al añadir la categoría');
        }
        const data = await response.json();
        console.log('Categoría añadida:', data);
        await fetchCategories();
        setNewCategory("");
      } catch (error) {
        console.error('Error adding category:', error);
        setError(error.message);
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
  };

  const handleUpdateCategory = async () => {
    if (newCategory.trim() && editingCategory) {
      try {
        const response = await fetch(`/api/categories/${editingCategory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory.trim() }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar la categoría');
        }
        await fetchCategories();
        setNewCategory("");
        setEditingCategory(null);
      } catch (error) {
        console.error('Error updating category:', error);
        setError(error.message);
      }
    }
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setNewCategory("");
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la categoría');
      }
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(error.message);
    }
  };

  const handleAddExtra = () => {
    if (newExtra.name && newExtra.price) {
      setNewProduct({
        ...newProduct,
        extras: [...newProduct.extras, { 
          ...newExtra, 
          id: Date.now(), 
          price: parseFloat(newExtra.price),
          priceType: newExtra.priceType || "per_package"
        }],
      })
      setNewExtra({ name: "", price: 0, priceType: "per_package" })
    }
  }

  const handleDeleteExtra = (id) => {
    setNewProduct({
      ...newProduct,
      extras: newProduct.extras.filter(extra => extra.id !== id),
    })
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    
    // Migrar de tipos a variants si es necesario
    let productWithVariants = { ...product }
    
    if (product.tipos && !product.variants) {
      // Migrar de la estructura antigua
      if (product.tipos.titulo && product.tipos.opciones && product.tipos.opciones.length > 0) {
        productWithVariants.variants = [{
          id: Date.now().toString() + Math.random().toString(36),
          name: product.tipos.titulo,
          enableStock: false,
          isRequired: true, // Por defecto obligatoria al migrar
          options: product.tipos.opciones.map(opcion => ({
            id: opcion.id || Date.now().toString() + Math.random().toString(36),
            name: opcion.nombre,
            stock: 0
          }))
        }]
      } else {
        productWithVariants.variants = []
      }
    } else if (!product.variants) {
      productWithVariants.variants = []
    }
    
    // Asegurar que wholesalePricing sea un array
    if (!productWithVariants.wholesalePricing) {
      productWithVariants.wholesalePricing = []
    }
    
    // Asegurar que priceType esté definido
    if (!productWithVariants.priceType) {
      productWithVariants.priceType = "per_package"
    }
    
    // Asegurar que todas las variantes tengan isRequired definido
    if (productWithVariants.variants && productWithVariants.variants.length > 0) {
      productWithVariants.variants = productWithVariants.variants.map(variant => ({
        ...variant,
        isRequired: variant.isRequired !== undefined ? variant.isRequired : true
      }));
    }
    
    setNewProduct(productWithVariants)
    setIsAddingProduct(true)

    // Auto-expand sections that have data
    setShowAdvancedPricing(productWithVariants.wholesalePricing?.length > 0 || productWithVariants.precioPromocion > 0)
    setShowVariants(productWithVariants.variants?.length > 0)
    setShowExtras(productWithVariants.extras?.length > 0)
  }

  const handleDuplicateProduct = async (product) => {
    try {
      // Crear una copia del producto con un nuevo nombre
      const duplicatedProduct = {
        ...product,
        nombre: `${product.nombre} (Copia)`,
        _id: undefined // Remover el ID para que se cree como nuevo producto
      };
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedProduct),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al duplicar el producto');
      }
      
      await fetchProducts();
      
      // Mostrar toast de confirmación
      toast.success(`¡Producto "${product.nombre}" duplicado exitosamente!`, {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: '500',
        },
      });
    } catch (error) {
      setError(error.message);
      toast.error(`Error al duplicar el producto: ${error.message}`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontWeight: '500',
        },
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el producto');
      }
      await fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const cancelDeleteProduct = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'product')
    formData.append('transformation', 'c_fit,h_800/ar_4:5,c_crop,g_auto,h_800/q_auto:best/f_webp')

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Error al subir la imagen')
      const data = await response.json()
      setNewProduct({ ...newProduct, imagen: data.url })
    } catch (error) {
      setError(error.message)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  // Funciones para manejar categorías de variantes
  const handleAddVariantCategory = () => {
    if (newVariantCategory.trim()) {
      const newCategory = {
        id: Date.now().toString() + Math.random().toString(36),
        name: newVariantCategory.trim(),
        enableStock: false,
        isRequired: true, // Por defecto las variantes son obligatorias
        options: []
      }
      setNewProduct({
        ...newProduct,
        variants: [...newProduct.variants, newCategory]
      })
      setNewVariantCategory("")
    }
  }


  const handleUpdateVariantCategory = () => {
    if (newVariantCategory.trim()) {
    setNewProduct({
      ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === editingVariantCategory.id
            ? { ...variant, name: newVariantCategory.trim() }
            : variant
        )
      })
      setNewVariantCategory("")
      setEditingVariantCategory(null)
    }
  }

  const handleToggleVariantStock = (categoryId) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.map(variant =>
        variant.id === categoryId
          ? { ...variant, enableStock: !variant.enableStock }
          : variant
      )
    })
  }

  const handleToggleVariantRequired = (categoryId) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.map(variant =>
        variant.id === categoryId
          ? { ...variant, isRequired: !variant.isRequired }
          : variant
      )
    })
  }

  // Funciones para manejar opciones de variantes
  const handleAddVariantOption = () => {
    if (newVariantOption.name.trim() && selectedVariantCategoryId) {
      const newOption = {
        id: Date.now().toString() + Math.random().toString(36),
        name: newVariantOption.name.trim(),
        price: parseFloat(newVariantOption.price) || 0,
        quantityMultiplier: parseInt(newVariantOption.quantityMultiplier) || 1
      }
      
    setNewProduct({
      ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === selectedVariantCategoryId
            ? { ...variant, options: [...variant.options, newOption] }
            : variant
        )
      })
      setNewVariantOption({ name: "", price: 0, quantityMultiplier: 1 })
    }
  }


  const handleUpdateVariantOption = () => {
    if (newVariantOption.name.trim()) {
    setNewProduct({
      ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === editingVariantOption.categoryId
            ? {
                ...variant,
                options: variant.options.map(option =>
                  option.id === editingVariantOption.id
                    ? { 
                        ...option, 
                        name: newVariantOption.name.trim(), 
                        price: parseFloat(newVariantOption.price) || 0,
                        quantityMultiplier: parseInt(newVariantOption.quantityMultiplier) || 1
                      }
                    : option
                )
              }
            : variant
        )
      })
      setNewVariantOption({ name: "", price: 0, quantityMultiplier: 1 })
      setEditingVariantOption(null)
    }
  }

  const handleEditExtra = (extra) => {
    setEditingExtra(extra)
    setNewExtra({ 
      name: extra.name, 
      price: extra.price,
      priceType: extra.priceType || "per_package"
    })
  }

  const handleUpdateExtra = () => {
    if (newExtra.name && newExtra.price) {
      setNewProduct({
        ...newProduct,
        extras: newProduct.extras.map(extra => 
          extra.id === editingExtra.id 
            ? { 
                ...newExtra, 
                id: extra.id, 
                price: parseFloat(newExtra.price),
                priceType: newExtra.priceType || "per_package"
              }
            : extra
        ),
      })
      setNewExtra({ name: "", price: 0, priceType: "per_package" })
      setEditingExtra(null)
    }
  }

  // Funciones para manejar precios mayoreo
  const handleAddWholesalePrice = () => {
    if (newWholesalePrice.minQuantity > 0 && newWholesalePrice.discount > 0) {
      const newWholesale = {
        id: Date.now().toString() + Math.random().toString(36),
        minQuantity: parseInt(newWholesalePrice.minQuantity),
        discount: parseFloat(newWholesalePrice.discount)
      }
      
      setNewProduct({
        ...newProduct,
        wholesalePricing: [...(newProduct.wholesalePricing || []), newWholesale].sort((a, b) => a.minQuantity - b.minQuantity)
      })
      setNewWholesalePrice({ minQuantity: 0, discount: 0 })
    }
  }

  const handleDeleteWholesalePrice = (id) => {
    setNewProduct({
      ...newProduct,
      wholesalePricing: (newProduct.wholesalePricing || []).filter(wholesale => wholesale.id !== id)
    })
  }

  const handleEditWholesalePrice = (wholesale) => {
    setEditingWholesalePrice(wholesale)
    setNewWholesalePrice({ minQuantity: wholesale.minQuantity, discount: wholesale.discount })
  }

  const handleUpdateWholesalePrice = () => {
    if (newWholesalePrice.minQuantity > 0 && newWholesalePrice.discount > 0) {
      setNewProduct({
        ...newProduct,
        wholesalePricing: (newProduct.wholesalePricing || []).map(wholesale =>
          wholesale.id === editingWholesalePrice.id
            ? { ...wholesale, minQuantity: parseInt(newWholesalePrice.minQuantity), discount: parseFloat(newWholesalePrice.discount) }
            : wholesale
        ).sort((a, b) => a.minQuantity - b.minQuantity)
      })
      setNewWholesalePrice({ minQuantity: 0, discount: 0 })
      setEditingWholesalePrice(null)
    }
  }

  // Funciones para drag and drop de variantes
  const handleDragEndVariants = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setNewProduct((prevProduct) => {
        // Validar que todas las variantes tengan ID
        const variantsWithIds = prevProduct.variants.filter(v => v.id)
        if (variantsWithIds.length !== prevProduct.variants.length) {
          console.error('Algunas variantes no tienen ID:', prevProduct.variants)
          return prevProduct
        }

        const oldIndex = prevProduct.variants.findIndex((variant) => variant.id === active.id)
        const newIndex = prevProduct.variants.findIndex((variant) => variant.id === over.id)
        
        if (oldIndex === -1 || newIndex === -1) {
          console.error('No se encontró la variante para reordenar')
          return prevProduct
        }

        const newVariants = arrayMove(prevProduct.variants, oldIndex, newIndex)

        return {
          ...prevProduct,
          variants: newVariants,
        }
      })
    }
  }

  // Funciones para drag and drop de opciones dentro de una variante
  const handleDragEndOptions = (event, variantId) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setNewProduct((prevProduct) => {
        const variantIndex = prevProduct.variants.findIndex((variant) => variant.id === variantId)
        if (variantIndex === -1) return prevProduct

        const variant = prevProduct.variants[variantIndex]
        const oldIndex = variant.options.findIndex((option) => option.id === active.id)
        const newIndex = variant.options.findIndex((option) => option.id === over.id)

        const newOptions = arrayMove(variant.options, oldIndex, newIndex)

        const newVariants = [...prevProduct.variants]
        newVariants[variantIndex] = {
          ...variant,
          options: newOptions,
        }

        return {
          ...prevProduct,
          variants: newVariants,
        }
      })
    }
  }

  // Función para drag and drop de productos
  const handleDragEndProducts = async (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const newProducts = arrayMove(products, 
        products.findIndex((product) => product._id === active.id),
        products.findIndex((product) => product._id === over.id)
      )
      
      // Actualizar el estado local inmediatamente para feedback visual
      setProducts(newProducts)
      
      // Si hay un producto siendo editado, actualizarlo también
      if (editingProduct) {
        const updatedProduct = newProducts.find(p => p._id === editingProduct._id)
        if (updatedProduct) {
          setEditingProduct(updatedProduct)
          setNewProduct(updatedProduct)
        }
      }
      
      // Guardar el nuevo orden en la base de datos
      try {
        const response = await fetch('/api/products/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: newProducts }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Error al guardar el orden de productos')
        }
        
        toast.success('Orden de productos guardado')
      } catch (error) {
        console.error('Error al guardar orden:', error)
        toast.error('Error al guardar el orden de productos')
        // Revertir el cambio si falla
        setProducts(products)
        // También revertir editingProduct si estaba siendo editado
        if (editingProduct) {
          const originalProduct = products.find(p => p._id === editingProduct._id)
          if (originalProduct) {
            setEditingProduct(originalProduct)
            setNewProduct(originalProduct)
          }
        }
      }
    }
  }

  // Funciones para UI mejorada de variantes
  const toggleVariantCollapse = (variantId) => {
    setCollapsedVariants(prev => ({
      ...prev,
      [variantId]: prev[variantId] !== undefined ? !prev[variantId] : false
    }))
  }

  // Función para obtener el estado de colapso (por defecto cerrado)
  const isVariantCollapsed = (variantId) => {
    return collapsedVariants[variantId] !== undefined ? collapsedVariants[variantId] : true
  }

  const startInlineVariantEdit = (variant) => {
    setEditingVariantInline(variant)
    setNewVariantCategory(variant.name)
  }

  const saveInlineVariantEdit = () => {
    if (newVariantCategory.trim() && editingVariantInline) {
      setNewProduct({
        ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === editingVariantInline.id
            ? { ...variant, name: newVariantCategory.trim() }
            : variant
        )
      })
      setEditingVariantInline(null)
      setNewVariantCategory("")
    }
  }

  const cancelInlineVariantEdit = () => {
    setEditingVariantInline(null)
    setNewVariantCategory("")
  }

  const startInlineOptionEdit = (option, variantId) => {
    setEditingOptionInline({ ...option, variantId })
    setNewVariantOption({
      name: option.name,
      price: option.price || 0,
      quantityMultiplier: option.quantityMultiplier || 1
    })
  }

  const saveInlineOptionEdit = () => {
    if (newVariantOption.name.trim() && editingOptionInline) {
      setNewProduct({
        ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === editingOptionInline.variantId
            ? {
                ...variant,
                options: variant.options.map(option =>
                  option.id === editingOptionInline.id
                    ? {
                        ...option,
                        name: newVariantOption.name.trim(),
                        price: parseFloat(newVariantOption.price) || 0,
                        quantityMultiplier: parseInt(newVariantOption.quantityMultiplier) || 1
                      }
                    : option
                )
              }
            : variant
        )
      })
      setEditingOptionInline(null)
      setNewVariantOption({ name: "", price: 0, quantityMultiplier: 1 })
    }
  }

  const cancelInlineOptionEdit = () => {
    setEditingOptionInline(null)
    setNewVariantOption({ name: "", price: 0, quantityMultiplier: 1 })
  }

  // Funciones para confirmaciones de eliminación
  const confirmDeleteVariant = (variant) => {
    setVariantToDelete(variant)
    setShowDeleteVariantModal(true)
  }

  const confirmDeleteOption = (option, variantId) => {
    setOptionToDelete({ ...option, variantId })
    setShowDeleteOptionModal(true)
  }

  const handleDeleteVariantConfirmed = () => {
    if (variantToDelete) {
      setNewProduct({
        ...newProduct,
        variants: newProduct.variants.filter(variant => variant.id !== variantToDelete.id)
      })
      if (selectedVariantCategoryId === variantToDelete.id) {
        setSelectedVariantCategoryId(null)
      }
      setShowDeleteVariantModal(false)
      setVariantToDelete(null)
    }
  }

  const handleDeleteOptionConfirmed = () => {
    if (optionToDelete) {
      setNewProduct({
        ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === optionToDelete.variantId
            ? { ...variant, options: variant.options.filter(option => option.id !== optionToDelete.id) }
            : variant
        )
      })
      setShowDeleteOptionModal(false)
      setOptionToDelete(null)
    }
  }

  const cancelDeleteVariant = () => {
    setShowDeleteVariantModal(false)
    setVariantToDelete(null)
  }

  const cancelDeleteOption = () => {
    setShowDeleteOptionModal(false)
    setOptionToDelete(null)
  }


  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1 className="page-title">Administrador de Productos</h1>
        <p className="page-description">Gestiona tu catálogo de productos, categorías y configuración de tarjetas.</p>
      </motion.div>

      {/* Categorías e Información en Tarjeta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Categorías</h2>
            <p className="card-description">Gestiona las categorías de tus productos</p>
          </div>
          <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder={editingCategory ? "Editar categoría" : "Nueva categoría"}
              className="form-input"
            />
            {editingCategory ? (
              <>
                <button onClick={handleUpdateCategory} className="btn-primary">
                  Actualizar
                </button>
                <button onClick={handleCancelEditCategory} className="btn-secondary">
                  Cancelar
                </button>
              </>
            ) : (
              <button onClick={handleAddCategory} className="btn-primary">
                Agregar
              </button>
            )}
          </div>
          <div>
            {categories.length === 0 && dataLoaded ? (
              <p className="text-sm text-gray-500">No hay categorías. Añade una nueva categoría para empezar.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div key={category._id} className={`inline-flex items-center rounded-full px-3 py-1 ${
                    editingCategory?._id === category._id 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'bg-gray-200'
                  }`}>
                    <span className="text-sm font-medium text-gray-700 mr-2">{category.name}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-gray-500 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                        title="Editar categoría"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-200"
                        title="Eliminar categoría"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </motion.div>

        {/* Información en Tarjeta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Información en Tarjeta</h2>
            <p className="card-description">Configura la información que se mostrará en las tarjetas de productos</p>
          </div>
          <div className="card-body">
          <div className="space-y-4">
            {Object.entries(cardInfoSettings)
              .filter(([key]) => key !== 'detailedView')
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                  <button
                    type="button"
                    onClick={() => handleCardInfoSettingChange(key, !value)}
                    className={`toggle ${value ? 'active' : ''}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
              ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Vista detallada</span>
                <button
                  type="button"
                  onClick={() => handleCardInfoSettingChange('detailedView', !cardInfoSettings.detailedView)}
                  className={`toggle ${cardInfoSettings.detailedView ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>

      {/* Agregar Producto y Lista de Productos */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="card-title">Productos</h2>
              <p className="card-description">Gestiona tu catálogo de productos</p>
            </div>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="btn-primary w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Agregar Producto
            </button>
          </div>
        </div>
        <div className="card-body">
        <div className="alert alert-info mb-4">
          <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="alert-content">
            <strong>Tip:</strong> Puedes arrastrar las tarjetas de productos para reordenarlas usando el ícono de arrastre.
          </div>
        </div>
        
        {/* Lista de productos con drag and drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndProducts}
        >
          <SortableContext
            items={products.map(product => product._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {products.length === 0 && dataLoaded ? (
                <p className="text-center text-gray-500 py-8">No hay productos. Añade un nuevo producto para empezar.</p>
              ) : (
                products.map((product) => (
                  <SortableProductCard
                    key={product._id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDuplicate={handleDuplicateProduct}
                    onDelete={confirmDeleteProduct}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
        </div>
      </motion.div>

      {/* Modal para agregar/editar producto */}
      {isAddingProduct && (
        <div className="modal-backdrop" />
      )}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header simple */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={() => {
                  setIsAddingProduct(false)
                  resetNewProduct()
                  setEditingProduct(null)
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Sección principal: Imagen + Info básica lado a lado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Imagen - columna izquierda */}
                  <div {...getRootProps()} className="md:col-span-1">
                    <div className={`aspect-square rounded-xl border-2 border-dashed transition-colors cursor-pointer flex items-center justify-center overflow-hidden ${isDragActive ? 'border-[#0D654A] bg-green-50' : 'border-gray-300 hover:border-[#0D654A]'}`}>
                      {newProduct.imagen ? (
                        <div className="relative w-full h-full group">
                          <Image
                            src={newProduct.imagen}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Cambiar
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Plus className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">Agregar imagen</p>
                        </div>
                      )}
                      <input {...getInputProps()} className="sr-only" />
                    </div>
                  </div>

                  {/* Info básica - columna derecha */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="form-label">Nombre del producto</label>
                      <input
                        type="text"
                        value={newProduct.nombre}
                        onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                        placeholder="Ej: Tacos al Pastor"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Descripción <span className="text-gray-400 font-normal">(opcional)</span></label>
                      <textarea
                        value={newProduct.descripcion}
                        onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                        rows={3}
                        placeholder="Breve descripción del producto..."
                        className="form-input resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Precio y Categorías */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Precio */}
                  <div>
                    <label className="form-label">Precio</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={newProduct.precio || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })}
                        className="form-input pl-7"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Categorías */}
                  <div>
                    <label className="form-label">Categoría</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <label
                          key={category._id}
                          className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                            newProduct.categorias?.includes(category.name)
                              ? 'bg-[#0D654A] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } ${newProduct.categorias?.length >= 2 && !newProduct.categorias?.includes(category.name) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="checkbox"
                            value={category.name}
                            checked={newProduct.categorias?.includes(category.name) || false}
                            onChange={(e) => {
                              const categoryName = e.target.value;
                              setNewProduct(prev => {
                                const currentCategories = prev.categorias || [];
                                if (e.target.checked) {
                                  if (currentCategories.length < 2) {
                                    return { ...prev, categorias: [...currentCategories, categoryName] };
                                  }
                                } else {
                                  return { ...prev, categorias: currentCategories.filter(cat => cat !== categoryName) };
                                }
                                return prev;
                              });
                            }}
                            className="sr-only"
                          />
                          {category.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Disponibilidad */}
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${newProduct.availability ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {newProduct.availability ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {newProduct.availability ? "Disponible" : "No disponible"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {newProduct.availability ? "Visible en el menú" : "Oculto del menú"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, availability: !newProduct.availability })}
                    className={`toggle ${newProduct.availability ? 'active' : ''}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                {/* Opciones avanzadas - Acordeón */}
                <div className="border-t pt-6">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Opciones avanzadas</p>

                  {/* Precio de promoción */}
                  <button
                    type="button"
                    onClick={() => setShowAdvancedPricing(!showAdvancedPricing)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showAdvancedPricing ? 'rotate-90' : ''}`} />
                      <span className="text-sm font-medium text-gray-700">Precio promoción y mayoreo</span>
                      {(newProduct.precioPromocion > 0 || newProduct.wholesalePricing?.length > 0) && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Configurado</span>
                      )}
                    </div>
                  </button>
                  {showAdvancedPricing && (
                    <div className="pl-6 pb-4 space-y-4">
                      <div>
                        <label className="form-label">Precio de promoción <span className="text-gray-400 font-normal">(opcional)</span></label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={newProduct.precioPromocion || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, precioPromocion: parseFloat(e.target.value) || 0 })}
                            className="form-input pl-7"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        {newProduct.precioPromocion > 0 && newProduct.precio > 0 && (
                          <p className="form-hint text-green-600 mt-1">
                            {Math.round((1 - newProduct.precioPromocion / newProduct.precio) * 100)}% de descuento
                          </p>
                        )}
                      </div>

                      {/* Precios mayoreo */}
                      <div className="mt-4">
                        <label className="form-label">Descuentos por mayoreo</label>
                        {newProduct.wholesalePricing?.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {newProduct.wholesalePricing.map((wholesale) => (
                              <div key={wholesale.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                                <span>{wholesale.minQuantity}+ unidades = <strong>{wholesale.discount}% desc.</strong></span>
                                <button onClick={() => handleDeleteWholesalePrice(wholesale.id)} className="text-gray-400 hover:text-red-500">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={newWholesalePrice.minQuantity || ''}
                            onChange={(e) => setNewWholesalePrice({ ...newWholesalePrice, minQuantity: parseInt(e.target.value) || 0 })}
                            placeholder="Cantidad mín."
                            min="2"
                            className="form-input flex-1"
                          />
                          <input
                            type="number"
                            value={newWholesalePrice.discount || ''}
                            onChange={(e) => setNewWholesalePrice({ ...newWholesalePrice, discount: parseFloat(e.target.value) || 0 })}
                            placeholder="% descuento"
                            min="1"
                            max="50"
                            className="form-input flex-1"
                          />
                          <button onClick={handleAddWholesalePrice} className="btn-secondary px-3">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Variantes */}
                  <button
                    type="button"
                    onClick={() => setShowVariants(!showVariants)}
                    className="w-full flex items-center justify-between py-3 text-left border-t border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showVariants ? 'rotate-90' : ''}`} />
                      <span className="text-sm font-medium text-gray-700">Variantes (tallas, sabores, etc.)</span>
                      {newProduct.variants?.length > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{newProduct.variants.length}</span>
                      )}
                    </div>
                  </button>
                  {showVariants && (
                    <div className="pl-6 pb-4 space-y-4">
                      {/* Lista de variantes existentes */}
                      {newProduct.variants.length > 0 && (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndVariants}>
                          <SortableContext items={newProduct.variants.map(v => v.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
                              {newProduct.variants.map((variant) => (
                                <SortableVariant
                                  key={variant.id}
                                  variant={variant}
                                  onDelete={confirmDeleteVariant}
                                  onToggleStock={handleToggleVariantStock}
                                  onToggleRequired={handleToggleVariantRequired}
                                  onToggleCollapse={toggleVariantCollapse}
                                  onStartInlineEdit={startInlineVariantEdit}
                                  onSaveInlineEdit={saveInlineVariantEdit}
                                  onCancelInlineEdit={cancelInlineVariantEdit}
                                  isCollapsed={isVariantCollapsed(variant.id)}
                                  isEditingInline={editingVariantInline?.id === variant.id}
                                >
                                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => handleDragEndOptions(event, variant.id)}>
                                    <SortableContext items={variant.options.map(o => o.id)} strategy={verticalListSortingStrategy}>
                                      <div className="space-y-2 mb-3">
                                        {variant.options.map((option) => (
                                          <SortableVariantOption
                                            key={option.id}
                                            option={option}
                                            variantId={variant.id}
                                            onDelete={confirmDeleteOption}
                                            onStartInlineEdit={startInlineOptionEdit}
                                            onSaveInlineEdit={saveInlineOptionEdit}
                                            onCancelInlineEdit={cancelInlineOptionEdit}
                                            isEditingInline={editingOptionInline?.id === option.id}
                                            newVariantOption={newVariantOption}
                                            setNewVariantOption={setNewVariantOption}
                                          />
                                        ))}
                                      </div>
                                    </SortableContext>
                                  </DndContext>
                                  {/* Agregar opción */}
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={selectedVariantCategoryId === variant.id ? newVariantOption.name : ""}
                                      onChange={(e) => setNewVariantOption({ ...newVariantOption, name: e.target.value })}
                                      placeholder="Nueva opción..."
                                      className="form-input flex-1 text-sm"
                                      onClick={() => setSelectedVariantCategoryId(variant.id)}
                                    />
                                    <input
                                      type="number"
                                      value={selectedVariantCategoryId === variant.id && newVariantOption.price > 0 ? newVariantOption.price : ""}
                                      onChange={(e) => setNewVariantOption({ ...newVariantOption, price: parseFloat(e.target.value) || 0 })}
                                      placeholder="+$0"
                                      className="form-input w-20 text-sm"
                                      onClick={() => setSelectedVariantCategoryId(variant.id)}
                                    />
                                    <button
                                      onClick={() => { setSelectedVariantCategoryId(variant.id); handleAddVariantOption(); }}
                                      className="btn-secondary px-3"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                </SortableVariant>
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}
                      {/* Agregar nueva categoría */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newVariantCategory}
                          onChange={(e) => setNewVariantCategory(e.target.value)}
                          placeholder="Nueva categoría (ej: Tallas, Sabores...)"
                          className="form-input flex-1"
                        />
                        <button onClick={handleAddVariantCategory} className="btn-secondary px-3">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Extras */}
                  <button
                    type="button"
                    onClick={() => setShowExtras(!showExtras)}
                    className="w-full flex items-center justify-between py-3 text-left border-t border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showExtras ? 'rotate-90' : ''}`} />
                      <span className="text-sm font-medium text-gray-700">Extras (complementos con costo)</span>
                      {newProduct.extras?.length > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">{newProduct.extras.length}</span>
                      )}
                    </div>
                  </button>
                  {showExtras && (
                    <div className="pl-6 pb-4 space-y-3">
                      {/* Lista de extras */}
                      {newProduct.extras.length > 0 && (
                        <div className="space-y-2">
                          {newProduct.extras.map((extra) => (
                            <div key={extra.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                              <span>{extra.name} <strong className="text-green-600">+${extra.price.toFixed(2)}</strong></span>
                              <button onClick={() => handleDeleteExtra(extra.id)} className="text-gray-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Agregar extra */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newExtra.name}
                          onChange={(e) => setNewExtra({ ...newExtra, name: e.target.value })}
                          placeholder="Nombre del extra..."
                          className="form-input flex-1"
                        />
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            value={newExtra.price || ''}
                            onChange={(e) => setNewExtra({ ...newExtra, price: parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                            className="form-input w-20 pl-5"
                          />
                        </div>
                        <button onClick={handleAddExtra} className="btn-secondary px-3">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer simple */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsAddingProduct(false)
                  resetNewProduct()
                  setEditingProduct(null)
                }}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button onClick={handleAddProduct} className="btn-primary">
                {editingProduct ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && productToDelete && (
        <div className="modal-backdrop" onClick={cancelDeleteProduct}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-panel max-w-sm">
              {/* Content */}
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Eliminar producto</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Esta acción no se puede deshacer</p>
                  </div>
                </div>

                {/* Product preview */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {productToDelete.imagen ? (
                      <Image
                        src={productToDelete.imagen}
                        alt={productToDelete.nombre}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{productToDelete.nombre}</p>
                    <p className="text-sm text-gray-500">
                      ${productToDelete.precioPromocion > 0 ? productToDelete.precioPromocion : productToDelete.precio}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelDeleteProduct}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(productToDelete._id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación de variante */}
      {showDeleteVariantModal && variantToDelete && (
        <div className="modal-backdrop" onClick={cancelDeleteVariant}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-panel max-w-sm">
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Eliminar variante</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Esta acción no se puede deshacer</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="font-medium text-gray-900">{variantToDelete.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {variantToDelete.options?.length || 0} opciones serán eliminadas
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={cancelDeleteVariant} className="btn-secondary flex-1">
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteVariantConfirmed}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación de opción */}
      {showDeleteOptionModal && optionToDelete && (
        <div className="modal-backdrop" onClick={cancelDeleteOption}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-panel max-w-sm">
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Eliminar opción</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Esta acción no se puede deshacer</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="font-medium text-gray-900">{optionToDelete.name}</p>
                  <div className="flex gap-3 mt-1">
                    {optionToDelete.price > 0 && (
                      <span className="text-sm text-gray-500">+${optionToDelete.price.toFixed(2)}</span>
                    )}
                    {optionToDelete.quantityMultiplier > 1 && (
                      <span className="text-sm text-gray-500">{optionToDelete.quantityMultiplier} unidades</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={cancelDeleteOption} className="btn-secondary flex-1">
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteOptionConfirmed}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


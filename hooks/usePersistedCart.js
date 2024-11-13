import { useState, useEffect } from 'react';

export function usePersistedCart(businessId) {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`cart-${businessId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved cart:', e);
        }
      }
    }
    return { items: [], total: 0 };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cart-${businessId}`, JSON.stringify(cart));
    }
  }, [cart, businessId]);

  const addToCart = (item) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(i => i.id === item.id);
      
      if (existingItemIndex > -1) {
        const newItems = [...currentCart.items];
        newItems[existingItemIndex].quantity += item.quantity;
        return {
          ...currentCart,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      }

      const newItems = [...currentCart.items, item];
      return {
        ...currentCart,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    });
  };

  const updateQuantity = (itemId, quantity) => {
    setCart(currentCart => {
      const newItems = currentCart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0);

      return {
        ...currentCart,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    });
  };

  const removeItem = (itemId) => {
    setCart(currentCart => {
      const newItems = currentCart.items.filter(item => item.id !== itemId);
      return {
        ...currentCart,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };
} 
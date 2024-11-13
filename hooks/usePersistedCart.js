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
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(i => 
        i.id === item.id && 
        i._id === item._id && 
        i.tipo === item.tipo && 
        JSON.stringify(i.extras) === JSON.stringify(item.extras)
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = prevCart.items.map((i, index) => 
          index === existingItemIndex 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...prevCart.items, item];
      }

      const newTotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

      return {
        ...prevCart,
        items: newItems,
        total: newTotal
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
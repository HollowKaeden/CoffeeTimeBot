import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

    const addToCart = (coffee, addons, totalPrice) => {
    setCart(prev => [...prev, { 
        coffee: {
        ...coffee,
        price: Number(coffee.price) // дублирующее преобразование для надежности
        },
        addons: addons.map(a => ({
        ...a,
        price: Number(a.price)
        })),
        totalPrice: Number(totalPrice),
        id: Date.now()
    }]);
    };

  const updateCartItem = (id, newAddons, newTotal) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, addons: newAddons, totalPrice: newTotal } : item
    ));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };


  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

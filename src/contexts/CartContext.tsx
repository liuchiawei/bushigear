"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart, Product } from "@/lib/type";
import { cartUtils } from "@/lib/cart";

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = cartUtils.getCart();
    setCart(savedCart);
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    const updatedCart = cartUtils.addToCart(product, quantity);
    setCart(updatedCart);
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartUtils.removeFromCart(productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const updatedCart = cartUtils.updateQuantity(productId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    const emptyCart = cartUtils.clearCart();
    setCart(emptyCart);
  };

  const itemCount = cartUtils.getItemCount(cart);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
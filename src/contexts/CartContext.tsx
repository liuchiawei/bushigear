"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        try {
          const res = await fetch("/api/cart", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            setCart(data.cart ?? { items: [], total: 0 });
          } else {
            setCart({ items: [], total: 0 });
          }
        } catch {
          setCart({ items: [], total: 0 });
        }
      })();
    } else if (status === "unauthenticated") {
      const savedCart = cartUtils.getCart();
      setCart(savedCart);
    }
  }, [status]);

  const addToCart = async (product: Product, quantity: number = 1): Promise<void> => {
    if (session?.user?.id) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity }),
        });
        if (res.ok) {
          const data = await res.json();
          // 楽観的更新: API が updatedItem を返す場合、それを既存のカートにマージ
          if (data.updatedItem) {
            setCart((prevCart) => {
              const existingIndex = prevCart.items.findIndex(
                (item) => item.product.id === product.id
              );
              if (existingIndex >= 0) {
                const updatedItems = [...prevCart.items];
                updatedItems[existingIndex] = data.updatedItem;
                return {
                  items: updatedItems,
                  total: updatedItems.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                  ),
                };
              } else {
                return {
                  items: [...prevCart.items, data.updatedItem],
                  total: prevCart.total + data.updatedItem.product.price * data.updatedItem.quantity,
                };
              }
            });
          } else {
            // フォールバック: 完全なカートデータを取得
            const cartRes = await fetch("/api/cart", { cache: "no-store" });
            if (cartRes.ok) {
              const cartData = await cartRes.json();
              setCart(cartData.cart ?? { items: [], total: 0 });
            }
          }
        }
      } catch (e) {
        console.error("Error adding to cart:", e);
        throw e;
      }
    } else {
      const updatedCart = cartUtils.addToCart(product, quantity);
      setCart(updatedCart);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (session?.user?.id) {
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          const data = await res.json();
          setCart(data.cart ?? { items: [], total: 0 });
        }
      } catch (e) {
        console.error("Error removing from cart:", e);
      }
    } else {
      const updatedCart = cartUtils.removeFromCart(productId);
      setCart(updatedCart);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (session?.user?.id) {
      try {
        const res = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
        if (res.ok) {
          const data = await res.json();
          setCart(data.cart ?? { items: [], total: 0 });
        }
      } catch (e) {
        console.error("Error updating quantity:", e);
      }
    } else {
      const updatedCart = cartUtils.updateQuantity(productId, quantity);
      setCart(updatedCart);
    }
  };

  const clearCart = async () => {
    if (session?.user?.id) {
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setCart(data.cart ?? { items: [], total: 0 });
        }
      } catch (e) {
        console.error("Error clearing cart:", e);
      }
    } else {
      const emptyCart = cartUtils.clearCart();
      setCart(emptyCart);
    }
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

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

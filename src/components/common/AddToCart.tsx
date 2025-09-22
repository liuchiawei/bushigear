"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/type";

interface AddToCartProps {
  product: Product;
  quantity?: number;
  className?: string;
}

export default function AddToCart({
  product,
  quantity = 1,
  className = ""
}: AddToCartProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    try {
      addToCart(product, quantity);
      // Provide user feedback
      setTimeout(() => setIsAdding(false), 800);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`
        group
        relative
        p-3
        rounded-full
        cursor-pointer
        bg-white/50 backdrop-blur-sm
        hover:bg-primary/80
        hover:*:text-white
        shadow-sm hover:shadow-md
        transition-all duration-200
        disabled:opacity-50
        ${className}
      `}
      title="カートに追加"
    >
      <ShoppingCart
        className={`
          size-4
          text-gray-700
          group-hover:text-black
          transition-colors duration-200
          ${isAdding ? 'animate-pulse' : ''}
        `}
      />

      {isAdding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
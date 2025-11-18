"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/type";
import { Spinner } from "@/components/ui/spinner";

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
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    setIsSuccess(false);
    
    try {
      await addToCart(product, quantity);
      setIsSuccess(true);
      // Reset success state after showing feedback
      setTimeout(() => {
        setIsAdding(false);
        setIsSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsAdding(false);
      setIsSuccess(false);
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
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isSuccess ? 'bg-green-500/80' : ''}
        ${className}
      `}
      title="カートに追加"
    >
      {isAdding && !isSuccess ? (
        <Spinner size="sm" className="text-gray-700 group-hover:text-white" />
      ) : isSuccess ? (
        <Check className="size-4 text-white" />
      ) : (
        <ShoppingCart
          className={`
            size-4
            text-gray-700
            group-hover:text-white
            transition-colors duration-200
          `}
        />
      )}
    </button>
  );
}
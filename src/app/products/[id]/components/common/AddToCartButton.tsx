"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import OptionButtons from "./OptionButtons";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/type";
import content from "@/data/content.json";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setIsSuccess(false);
    
    try {
      await addToCart(product, quantity);
      setIsSuccess(true);
      // Reset after showing success feedback
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
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="text-sm font-medium">
          {content.products_detail.quantity.jp}:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          disabled={isAdding}
          className="border rounded-md px-3 py-1 text-sm disabled:opacity-50"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <OptionButtons handleAddToCart={handleAddToCart} productId={product.id} />

      <Button 
        onClick={handleAddToCart} 
        disabled={isAdding}
        className={`w-full col-span-2 ${isSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
      >
        {isAdding ? (
          <>
            <Spinner size="sm" variant="white" />
            {isSuccess ? "追加しました！" : "カートに追加中..."}
          </>
        ) : (
          content.products_detail.directly_buy.jp
        )}
      </Button>
    </div>
  );
}

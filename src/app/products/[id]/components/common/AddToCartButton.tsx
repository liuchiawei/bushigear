"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import OptionButtons from "./OptionButtons";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/type";
import content from "@/data/content.json";
import Link from "next/link";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(product, quantity);
      // Provide user feedback
      setTimeout(() => setIsAdding(false), 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsAdding(false);
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
          className="border rounded-md px-3 py-1 text-sm"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <OptionButtons handleAddToCart={handleAddToCart} />

      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        asChild
      >
        <Link href="/cart" className="w-full col-span-2">
          {isAdding ? "カートに追加中..." : content.products_detail.directly_buy.jp}
        </Link>
      </Button>
    </div>
  );
}

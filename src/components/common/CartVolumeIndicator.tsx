"use client";

import { useCart } from "@/contexts/CartContext";

interface CartVolumeIndicatorProps {
  className?: string;
}

export default function CartVolumeIndicator({ className = "" }: CartVolumeIndicatorProps) {
  const { itemCount } = useCart();

  if (itemCount === 0) {
    return null;
  }

  return (
    <span
      className={`
        absolute -top-2 -right-2
        bg-accent text-white
        text-xs font-bold
        rounded-full
        min-w-[14px] aspect-square
        flex items-center justify-center
        px-1
        ${className}
      `}
    >
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
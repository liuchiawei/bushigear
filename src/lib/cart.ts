import { Product, CartItem, Cart } from "./type";

// Demo cart functionality using localStorage
// TODO: Replace with database operations when implementing persistent cart
// - Create cart table in Prisma schema
// - Add user authentication integration
// - Replace localStorage operations with database calls

const CART_STORAGE_KEY = "bushigear_cart";

export const cartUtils = {
  // Get cart from localStorage
  getCart(): Cart {
    if (typeof window === "undefined") {
      return { items: [], total: 0 };
    }

    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      if (!cartData) {
        return { items: [], total: 0 };
      }

      const cart: Cart = JSON.parse(cartData);
      return cart;
    } catch (error) {
      console.error("Error loading cart:", error);
      return { items: [], total: 0 };
    }
  },

  // Save cart to localStorage
  // TODO: Replace with database operation
  saveCart(cart: Cart): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  },

  // Add product to cart
  addToCart(product: Product, quantity: number = 1): Cart {
    const cart = this.getCart();

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ product, quantity });
    }

    // Recalculate total
    cart.total = this.calculateTotal(cart.items);

    this.saveCart(cart);
    return cart;
  },

  // Remove product from cart
  removeFromCart(productId: number): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.product.id !== productId);
    cart.total = this.calculateTotal(cart.items);

    this.saveCart(cart);
    return cart;
  },

  // Update item quantity
  updateQuantity(productId: number, quantity: number): Cart {
    const cart = this.getCart();

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
      cart.total = this.calculateTotal(cart.items);
      this.saveCart(cart);
    }

    return cart;
  },

  // Calculate total price
  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  },

  // Clear cart
  clearCart(): Cart {
    const emptyCart: Cart = { items: [], total: 0 };
    this.saveCart(emptyCart);
    return emptyCart;
  },

  // Get cart item count
  getItemCount(cart?: Cart): number {
    const currentCart = cart || this.getCart();
    return currentCart.items.reduce((count, item) => count + item.quantity, 0);
  }
};
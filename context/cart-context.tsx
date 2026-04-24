import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { toast } from "sonner";

// Types for cart items and products
export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "cart";

/**
 * CartProvider - Manages shopping cart state
 * Persists cart data in localStorage for session persistence
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_KEY);
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
    setIsInitialized(true);
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  /**
   * Add a product to cart
   * If already in cart, increment quantity by 1
   */
  const addToCart = useCallback((product: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        toast.success(`Added another ${product.title} to cart`);
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      toast.success(`${product.title} added to cart`);
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  /**
   * Remove a product from cart completely
   */
  const removeFromCart = useCallback((productId: number) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === productId);
      if (item) {
        toast.info(`${item.title} removed from cart`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  /**
   * Update quantity of a specific item
   * Removes item if quantity is 0 or less
   */
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  /**
   * Increment quantity by 1
   */
  const incrementQuantity = useCallback((productId: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  /**
   * Decrement quantity by 1
   * Removes item if quantity reaches 0
   */
  const decrementQuantity = useCallback((productId: number) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === productId);
      if (item && item.quantity === 1) {
        toast.info(`${item.title} removed from cart`);
        return prevItems.filter((i) => i.id !== productId);
      }
      return prevItems.map((i) =>
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
    toast.info("Cart cleared");
  }, []);

  /**
   * Get quantity of a specific item in cart
   */
  const getItemQuantity = useCallback(
    (productId: number) => {
      return items.find((item) => item.id === productId)?.quantity || 0;
    },
    [items]
  );

  /**
   * Check if a product is in the cart
   */
  const isInCart = useCallback(
    (productId: number) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  // Calculate total number of items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Custom hook to access cart context
 * Throws error if used outside CartProvider
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

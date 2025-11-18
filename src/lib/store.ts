/**
 * Zustand Global State Store
 * Manages cart, products, sales, and UI state
 */

import { create } from 'zustand';
import type { Product, Category, Sale } from './database';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface POSStore {
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;

  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  selectedCategory: number | null;
  setSelectedCategory: (categoryId: number | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Sales
  sales: Sale[];
  setSales: (sales: Sale[]) => void;

  // UI State
  currentScreen: 'sales' | 'products' | 'history';
  setCurrentScreen: (screen: 'sales' | 'products' | 'history') => void;
}

export const usePOSStore = create<POSStore>((set, get) => ({
  // Products
  products: [],
  setProducts: (products) => set({ products }),

  // Categories
  categories: [],
  setCategories: (categories) => set({ categories }),
  selectedCategory: null,
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

  // Cart
  cart: [],

  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      // Check stock
      if (existingItem.quantity >= product.stock) {
        return; // Don't add if exceeds stock
      }
      set({
        cart: cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      if (product.stock < 1) return; // Don't add if no stock
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },

  updateCartQuantity: (productId, quantity) => {
    const { cart } = get();
    if (quantity < 1) {
      get().removeFromCart(productId);
      return;
    }

    const item = cart.find((item) => item.product.id === productId);
    if (item && quantity > item.product.stock) {
      return; // Don't exceed stock
    }

    set({
      cart: cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    });
  },

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),

  clearCart: () => set({ cart: [] }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Sales
  sales: [],
  setSales: (sales) => set({ sales }),

  // UI State
  currentScreen: 'sales',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
}));

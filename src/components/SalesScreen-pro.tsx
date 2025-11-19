/**
 * Professional Sales Screen - Modern POS Design
 * 65% Products Grid | 35% Shopping Cart
 * Features: Barcode scanning, Auto-focus, Real-time stock validation
 */

import { useEffect, useState, useRef } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, Barcode, Package } from 'lucide-react';
import { usePOSStore } from '../lib/store';
import {
  getAllProducts,
  getAllCategories,
  searchProducts as searchProductsDB,
  getProductsByCategory,
  searchByBarcode
} from '../lib/database';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { t } from '../lib/translations-pro';
import { formatCurrency } from '../lib/utils';
import toast from 'react-hot-toast';

interface SalesScreenProps {
  onPay?: () => void;
}

export default function SalesScreen({ onPay }: SalesScreenProps) {
  const {
    products,
    setProducts,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = usePOSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Filter products
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const loadData = async () => {
    const [allProducts, allCategories] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
    ]);
    setProducts(allProducts);
    setCategories(allCategories);
  };

  const filterProducts = async () => {
    if (searchQuery.trim()) {
      const results = await searchProductsDB(searchQuery);
      setFilteredProducts(results);
    } else if (selectedCategory !== null) {
      const results = await getProductsByCategory(selectedCategory);
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleAddToCart = (product: typeof products[0]) => {
    if (product.stock < 1) {
      toast.error(t.validation.insufficientStock, {
        icon: '⚠️',
        style: { direction: 'rtl' }
      });
      return;
    }
    addToCart(product);
    toast.success(`${product.nameKurdish} ${t.sales.itemAdded}`, {
      icon: '✓',
      style: { direction: 'rtl' }
    });
  };

  // Enhanced search with barcode scanning support
  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearching(true);

      try {
        // Try barcode search first (USB scanner simulation)
        const barcodeProduct = await searchByBarcode(searchQuery.trim());

        if (barcodeProduct) {
          // Barcode found - add to cart immediately
          handleAddToCart(barcodeProduct);
          setSearchQuery('');
          searchInputRef.current?.focus();
        } else if (filteredProducts.length > 0) {
          // No barcode match - use first name search result
          handleAddToCart(filteredProducts[0]);
          setSearchQuery('');
          searchInputRef.current?.focus();
        } else {
          toast.error(t.validation.productNotFound || 'بەرهەم نەدۆزرایەوە', {
            icon: '❌',
            style: { direction: 'rtl' }
          });
        }
      } catch (error) {
        toast.error('هەڵەیەک ڕوویدا', {
          style: { direction: 'rtl' }
        });
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Get stock badge color
  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'bg-destructive text-white';
    if (stock < 10) return 'bg-yellow-500 text-white';
    if (stock < 20) return 'bg-orange-400 text-white';
    return 'bg-success text-white';
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0; // 0% tax
  const total = subtotal + tax;

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* LEFT SIDE - Products (65%) */}
      <div className="flex-[65] flex flex-col bg-white rounded-2xl shadow-xl p-6">
        {/* Search Bar with Barcode Icon */}
        <div className="relative mb-6">
          <Barcode className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" size={24} />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="گەڕان بە ناو یان بارکۆد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            disabled={isSearching}
            className="pr-14 h-16 text-lg font-semibold border-2 border-gray-300 focus:border-primary rounded-xl shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap h-12 px-6 text-base font-bold rounded-xl"
          >
            {t.sales.allCategories}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id!)}
              className="whitespace-nowrap h-12 px-6 text-base font-bold rounded-xl"
            >
              <span className="ml-2 text-xl">{category.icon}</span>
              {category.nameKurdish}
            </Button>
          ))}
        </div>

        {/* Products Grid - 3 Columns */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`
                  relative bg-white border-2 rounded-2xl p-5 shadow-md transition-all duration-200
                  ${product.stock < 1
                    ? 'border-gray-200 opacity-60'
                    : 'border-gray-200 hover:border-primary hover:shadow-xl'
                  }
                `}
              >
                {/* Stock Badge */}
                <div className={`absolute top-3 left-3 ${getStockBadgeColor(product.stock)} text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
                  {product.stock === 0 ? 'نەماوە' : `${product.stock} دانە`}
                </div>

                {/* Product Image - 150x150px */}
                <div className="bg-gray-100 rounded-xl h-[150px] flex items-center justify-center mb-4 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.nameKurdish}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    <Package size={60} className="text-gray-400" />
                  )}
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem] text-right">
                  {product.nameKurdish}
                </h3>

                {/* Barcode */}
                <p className="text-xs text-gray-500 mb-3 text-right font-mono">
                  #{product.barcode}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">د.ع</span>
                  <span className="text-3xl font-black text-primary">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock < 1}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  زیادکردن بۆ سەبەتە
                </Button>
              </div>
            ))}
          </div>

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package size={80} className="mb-4 opacity-50" />
              <p className="text-2xl font-bold">{t.sales.noProducts}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Shopping Cart (35%) */}
      <div className="flex-[35] bg-white rounded-2xl shadow-xl p-6 flex flex-col">
        {/* Cart Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <ShoppingCart className="text-primary" size={28} />
            {t.sales.cart}
          </h2>
          {cart.length > 0 && (
            <div className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
              {cart.length}
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary/40 transition-all bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-base leading-tight">{item.product.nameKurdish}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatCurrency(item.product.price)} د.ع
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.product.id!);
                      toast.success('سڕایەوە', {
                        icon: '🗑️',
                        style: { direction: 'rtl' }
                      });
                    }}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                    <button
                      onClick={() => updateCartQuantity(item.product.id!, item.quantity - 1)}
                      className="bg-gray-100 hover:bg-primary hover:text-white rounded-lg p-2 transition-all w-10 h-10 flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-black text-xl w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (item.quantity >= item.product.stock) {
                          toast.error(t.validation.insufficientStock, {
                            icon: '⚠️',
                            style: { direction: 'rtl' }
                          });
                          return;
                        }
                        updateCartQuantity(item.product.id!, item.quantity + 1);
                      }}
                      className="bg-gray-100 hover:bg-primary hover:text-white rounded-lg p-2 transition-all w-10 h-10 flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-xl font-black text-primary">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={80} className="mb-4 opacity-30" />
              <p className="text-xl font-bold">{t.sales.cartEmpty}</p>
              <p className="text-sm mt-2">گەڕان بکە و بەرهەم زیاد بکە</p>
            </div>
          )}
        </div>

        {/* Totals and Actions */}
        {cart.length > 0 && (
          <>
            {/* Summary */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">{t.sales.subtotal}:</span>
                <span className="font-bold">
                  {formatCurrency(subtotal)} د.ع
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">{t.sales.tax}:</span>
                  <span className="font-bold">
                    {formatCurrency(tax)} د.ع
                  </span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-black bg-primary-light p-4 rounded-xl">
                <span className="text-primary">{t.sales.total}:</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Pay Button - Big Green 60px */}
            <Button
              variant="success"
              className="w-full h-[60px] text-xl font-black rounded-xl shadow-lg hover:shadow-xl transition-all mb-3"
              onClick={onPay}
            >
              پارەدان و چاپکردن
            </Button>

            {/* Clear Cart Button - Secondary */}
            <Button
              variant="outline"
              className="w-full h-12 text-base font-bold rounded-xl border-2 border-gray-300 hover:bg-gray-100"
              onClick={() => {
                clearCart();
                toast.success('سەبەتە سڕایەوە', {
                  icon: '🗑️',
                  style: { direction: 'rtl' }
                });
                searchInputRef.current?.focus();
              }}
            >
              سڕینەوەی سەبەتە
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

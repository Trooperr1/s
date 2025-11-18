/**
 * Professional Sales Screen - Square POS Style
 * 60% Products Grid | 40% Shopping Cart
 */

import { useEffect, useState, useRef } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { usePOSStore } from '../lib/store';
import { getAllProducts, getAllCategories, searchProducts as searchProductsDB, getProductsByCategory } from '../lib/database';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { t } from '../lib/translations-pro';
import { formatCurrency } from '../lib/utils';
import toast from 'react-hot-toast';

export default function SalesScreen() {
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
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      toast.error(t.validation.insufficientStock);
      return;
    }
    addToCart(product);
    toast.success(`${product.nameKurdish} زیادکرا بۆ سەبەتە`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredProducts.length > 0) {
      handleAddToCart(filteredProducts[0]);
      setSearchQuery('');
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0; // 0% tax, can be changed
  const total = subtotal + tax;

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* LEFT SIDE - Products (60%) */}
      <div className="flex-[3] flex flex-col bg-white rounded-2xl shadow-lg p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={t.sales.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pr-12 h-14 text-lg"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            {t.sales.allCategories}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id!)}
              className="whitespace-nowrap"
            >
              <span className="ml-2">{category.icon}</span>
              {category.nameKurdish}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock < 1}
                className={`
                  group relative bg-white border-2 rounded-xl p-4 text-right transition-all
                  ${product.stock < 1
                    ? 'border-gray-200 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-primary hover:shadow-lg active:scale-95'
                  }
                `}
              >
                {/* Product Image/Icon */}
                <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-3 group-hover:bg-primary/5 transition-colors">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-6xl">📦</div>
                  )}
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                  {product.nameKurdish}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">{t.common.currency}</span>
                </div>

                {/* Stock */}
                <div className={`text-sm font-semibold ${
                  product.stock === 0 ? 'text-red-500' :
                  product.stock < 10 ? 'text-orange-500' :
                  'text-success'
                }`}>
                  {t.products.stock}: {product.stock}
                </div>

                {/* Low Stock Badge */}
                {product.stock > 0 && product.stock < 10 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {t.products.lowStock}
                  </div>
                )}

                {/* Out of Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {t.products.outOfStock}
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <ShoppingCart size={64} className="mb-4 opacity-50" />
              <p className="text-xl">{t.sales.noProducts}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Shopping Cart (40%) */}
      <div className="flex-[2] bg-white rounded-2xl shadow-lg p-6 flex flex-col">
        {/* Cart Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <ShoppingCart className="text-primary" />
            {t.sales.cart}
          </h2>
          {cart.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearCart();
                toast.success('سەبەتە سڕایەوە');
              }}
            >
              {t.sales.clearCart}
            </Button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-3">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.product.nameKurdish}</h3>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.product.price)} {t.common.currency}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.product.id!);
                      toast.success('سڕایەوە لە سەبەتە');
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id!, item.quantity - 1)}
                      className="bg-white hover:bg-gray-200 rounded-md p-2 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-black text-xl w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (item.quantity >= item.product.stock) {
                          toast.error(t.validation.insufficientStock);
                          return;
                        }
                        updateCartQuantity(item.product.id!, item.quantity + 1);
                      }}
                      className="bg-white hover:bg-gray-200 rounded-md p-2 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="text-2xl font-black text-primary">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={64} className="mb-4 opacity-50" />
              <p className="text-xl">{t.sales.cartEmpty}</p>
            </div>
          )}
        </div>

        {/* Totals */}
        {cart.length > 0 && (
          <>
            <div className="border-t-2 border-gray-200 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">{t.sales.subtotal}:</span>
                <span className="font-bold">
                  {formatCurrency(subtotal)} {t.common.currency}
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">{t.sales.tax}:</span>
                  <span className="font-bold">
                    {formatCurrency(tax)} {t.common.currency}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-3xl font-black bg-gray-100 p-4 rounded-xl">
                <span>{t.sales.total}:</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              variant="success"
              size="lg"
              className="w-full h-16 text-xl font-black"
              onClick={() => {
                // This will be handled by a separate payment flow
                toast.success('کلیک کرا بۆ پارەدان');
              }}
            >
              {t.sales.pay}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

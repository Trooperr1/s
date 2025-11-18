/**
 * Sales/Cashier Screen Component
 * Main screen for processing sales and managing cart - Modern Design
 */

import { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaTrash, FaSearch, FaShoppingCart as FaCart, FaMoneyBillWave } from 'react-icons/fa';
import { translations } from '../translations';
import { type Product, type SaleItem, searchProducts, getAllProducts, addSale } from '../db';
import Receipt from './Receipt';

interface CartItem extends SaleItem {
  stock: number;
}

function SalesScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<number | null>(null);

  // Load all products
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery).then(setFilteredProducts);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    const allProducts = await getAllProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  };

  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      // Check stock availability
      if (existingItem.quantity >= product.stock) {
        alert(translations.validation.insufficientStock);
        return;
      }
      // Increase quantity
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      // Add new item
      if (product.stock < 1) {
        alert(translations.validation.insufficientStock);
        return;
      }
      setCart([...cart, {
        productId: product.id!,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price,
        stock: product.stock
      }]);
    }
  };

  // Update cart item quantity
  const updateQuantity = (productId: number, change: number) => {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > item.stock) {
      alert(translations.validation.insufficientStock);
      return;
    }

    setCart(cart.map(cartItem =>
      cartItem.productId === productId
        ? { ...cartItem, quantity: newQuantity, total: newQuantity * cartItem.price }
        : cartItem
    ));
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.0; // 0% tax (can be changed)
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Complete sale
  const completeSale = async () => {
    if (cart.length === 0) {
      alert(translations.validation.emptyCart);
      return;
    }

    try {
      const saleId = await addSale({
        date: new Date(),
        items: cart,
        subtotal,
        tax,
        total
      });

      setLastSaleId(saleId);
      setShowReceipt(true);

      // Clear cart after sale
      setCart([]);
      setSearchQuery('');

      // Reload products to update stock
      await loadProducts();
    } catch (error) {
      console.error('Error completing sale:', error);
      alert(translations.common.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Products Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <FaCart className="text-primary" />
            {translations.sales.title}
          </h2>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translations.sales.searchPlaceholder}
              className="w-full p-5 pr-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock < 1}
                  className={`
                    rounded-2xl p-5 transition-all duration-300 transform animate-scale-in
                    ${product.stock < 1
                      ? 'bg-gray-100 border-2 border-gray-300 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-primary hover:shadow-xl hover:scale-105'
                    }
                  `}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="text-center">
                    <div className="bg-white rounded-xl p-3 mb-3 shadow-sm">
                      <div className="text-4xl mb-2">📦</div>
                    </div>
                    <div className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                      {product.name}
                    </div>
                    <div className="text-2xl font-black text-primary mb-2">
                      {product.price.toLocaleString()}
                      <span className="text-sm text-gray-500 mr-1">{translations.common.currency}</span>
                    </div>
                    <div className={`text-sm font-semibold ${
                      product.stock === 0 ? 'text-red-500' :
                      product.stock < 10 ? 'text-orange-500' :
                      'text-green-600'
                    }`}>
                      مخزون: {product.stock}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <FaSearch className="text-5xl mx-auto mb-3 opacity-50" />
                <p className="text-xl">{translations.sales.noProducts}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <FaCart className="text-accent" />
            {translations.sales.cart}
            {cart.length > 0 && (
              <span className="bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                {cart.length}
              </span>
            )}
          </h2>

          {/* Cart Items */}
          <div className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto mb-6">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div
                  key={item.productId}
                  className="border-2 border-gray-100 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white hover:border-primary/30 transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold text-base flex-1 text-gray-800">
                      {item.productName}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-all"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 bg-white rounded-lg p-1 border-2 border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors"
                      >
                        <FaMinus className="text-sm text-gray-600" />
                      </button>
                      <span className="font-black text-xl w-10 text-center text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="bg-accent hover:bg-green-600 text-white rounded-lg p-2 transition-colors"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                    <div className="font-black text-lg text-primary">
                      {item.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <FaCart className="text-6xl text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">{translations.sales.emptyCart}</p>
              </div>
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <>
              <div className="border-t-2 border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-lg text-gray-600">
                  <span>{translations.sales.subtotal}:</span>
                  <span className="font-bold">
                    {subtotal.toLocaleString()} {translations.common.currency}
                  </span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-lg text-gray-600">
                    <span>{translations.sales.tax}:</span>
                    <span className="font-bold">
                      {tax.toLocaleString()} {translations.common.currency}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-3xl font-black text-gray-800 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border-2 border-accent/30">
                  <span>المجموع:</span>
                  <span className="text-accent">{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={completeSale}
                className="w-full bg-gradient-to-r from-accent to-green-600 hover:from-green-600 hover:to-accent text-white font-black text-2xl py-6 rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
              >
                <FaMoneyBillWave className="text-3xl" />
                دفع الآن
              </button>
            </>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastSaleId && (
        <Receipt
          saleId={lastSaleId}
          onClose={() => {
            setShowReceipt(false);
            setLastSaleId(null);
          }}
        />
      )}
    </div>
  );
}

export default SalesScreen;

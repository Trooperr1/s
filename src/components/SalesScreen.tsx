/**
 * Sales/Cashier Screen Component
 * Main screen for processing sales and managing cart
 */

import { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaTrash, FaSearch, FaPrint } from 'react-icons/fa';
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {translations.sales.title}
          </h2>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translations.sales.searchPlaceholder}
              className="w-full p-4 pr-12 text-lg border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock < 1}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${product.stock < 1
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                      : 'border-primary bg-white hover:bg-primary hover:text-white hover:shadow-lg'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="font-bold text-lg mb-2">{product.name}</div>
                    <div className="text-xl font-semibold mb-1">
                      {product.price.toLocaleString()} {translations.common.currency}
                    </div>
                    <div className="text-sm text-gray-600">
                      {translations.products.stock}: {product.stock}
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="text-xs text-orange-500 mt-1">
                        {translations.products.lowStock}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                {translations.sales.noProducts}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {translations.sales.cart}
          </h2>

          {/* Cart Items */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.productId} className="border-2 border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold flex-1">{item.productName}</div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 mr-2"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="bg-primary hover:bg-secondary text-white rounded-full p-2"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                    <div className="font-bold">
                      {item.total.toLocaleString()} {translations.common.currency}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    {item.price.toLocaleString()} {translations.common.currency} × {item.quantity}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                {translations.sales.emptyCart}
              </div>
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <>
              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>{translations.sales.subtotal}:</span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString()} {translations.common.currency}
                  </span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-lg">
                    <span>{translations.sales.tax}:</span>
                    <span className="font-semibold">
                      {tax.toLocaleString()} {translations.common.currency}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold text-primary border-t-2 border-gray-200 pt-2">
                  <span>{translations.sales.total}:</span>
                  <span>{total.toLocaleString()} {translations.common.currency}</span>
                </div>
              </div>

              {/* Complete Sale Button */}
              <button
                onClick={completeSale}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 rounded-lg mt-4 transition-colors flex items-center justify-center gap-2"
              >
                <FaPrint />
                {translations.sales.completeSale}
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

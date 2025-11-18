/**
 * Inventory Screen Component
 * Shows all products with stock levels and low stock warnings - Modern Card Design
 */

import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaBoxOpen, FaChartBar } from 'react-icons/fa';
import { translations } from '../translations';
import { type Product, getAllProducts, getLowStockProducts } from '../db';

function InventoryScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const products = await getAllProducts();
    const lowStock = await getLowStockProducts();
    setAllProducts(products);
    setLowStockProducts(lowStock);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        text: translations.products.outOfStock,
        color: 'bg-red-100 text-red-700 border-red-300',
        barColor: 'bg-red-500'
      };
    } else if (stock < 10) {
      return {
        text: translations.products.lowStock,
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        barColor: 'bg-orange-500'
      };
    } else {
      return {
        text: translations.products.inStock,
        color: 'bg-green-100 text-green-700 border-green-300',
        barColor: 'bg-green-500'
      };
    }
  };

  const stockStats = {
    total: allProducts.length,
    inStock: allProducts.filter(p => p.stock >= 10).length,
    lowStock: lowStockProducts.length,
    outOfStock: allProducts.filter(p => p.stock === 0).length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <FaBoxOpen className="text-4xl opacity-80" />
            <FaChartBar className="text-2xl opacity-60" />
          </div>
          <h3 className="text-lg font-semibold opacity-90 mb-2">مجموع البضائع</h3>
          <p className="text-5xl font-black">{stockStats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <FaBoxOpen className="text-4xl opacity-80" />
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold opacity-90 mb-2">بضائع متوفرة</h3>
          <p className="text-5xl font-black">{stockStats.inStock}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <FaExclamationTriangle className="text-4xl opacity-80" />
            <span className="text-3xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold opacity-90 mb-2">بضائع قليلة</h3>
          <p className="text-5xl font-black">{stockStats.lowStock}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <FaBoxOpen className="text-4xl opacity-80" />
            <span className="text-3xl">✕</span>
          </div>
          <h3 className="text-lg font-semibold opacity-90 mb-2">بضائع منتهية</h3>
          <p className="text-5xl font-black">{stockStats.outOfStock}</p>
        </div>
      </div>

      {/* Low Stock Warning Section */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500 text-white p-3 rounded-xl">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-orange-800">
                {translations.inventory.lowStockWarning}
              </h2>
              <p className="text-orange-600">البضائع التي تحتاج إلى إعادة تعبئة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white border-2 border-orange-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <FaBoxOpen className="text-2xl text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 flex-1 line-clamp-1">
                    {product.name}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">باركود:</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono">
                      {product.barcode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">مخزون:</span>
                    <span className="font-black text-2xl text-orange-600">{product.stock}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">سعر:</span>
                    <span className="font-bold text-primary">
                      {product.price.toLocaleString()} {translations.common.currency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Products Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <FaBoxOpen className="text-primary" />
          {translations.inventory.allProducts}
        </h2>

        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((product, index) => {
              const status = getStockStatus(product.stock);
              const stockPercentage = Math.min((product.stock / 50) * 100, 100);

              return (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-primary/40 transition-all transform hover:-translate-y-1 animate-scale-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Product Icon */}
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 mb-4 flex items-center justify-center">
                    <FaBoxOpen className="text-4xl text-blue-400" />
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>

                  {/* Barcode */}
                  <div className="bg-gray-100 px-3 py-2 rounded-lg mb-3 text-center">
                    <span className="text-xs text-gray-500 block">باركود</span>
                    <span className="font-mono text-sm font-bold text-gray-700">
                      {product.barcode}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-3">
                    <span className="text-2xl font-black text-primary">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm mr-1">
                      {translations.common.currency}
                    </span>
                  </div>

                  {/* Stock Number */}
                  <div className="text-center mb-3">
                    <div className="text-sm text-gray-600 mb-1">المخزون الحالي</div>
                    <div className="text-4xl font-black text-gray-800">{product.stock}</div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span className={`block text-center px-4 py-2 rounded-full border-2 text-sm font-bold ${status.color}`}>
                      {status.text}
                    </span>
                  </div>

                  {/* Stock Level Bar */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">مستوى المخزون</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-full transition-all duration-500 ${status.barColor}`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">{translations.products.noProducts}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryScreen;

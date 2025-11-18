/**
 * Inventory Screen Component
 * Shows all products with stock levels and low stock warnings
 */

import { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
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
        color: 'bg-red-100 text-red-700 border-red-300'
      };
    } else if (stock < 10) {
      return {
        text: translations.products.lowStock,
        color: 'bg-orange-100 text-orange-700 border-orange-300'
      };
    } else {
      return {
        text: translations.products.inStock,
        color: 'bg-green-100 text-green-700 border-green-300'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Warning Section */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="text-orange-500 text-3xl" />
            <h2 className="text-2xl font-bold text-orange-700">
              {translations.inventory.lowStockWarning}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map(product => (
              <div
                key={product.id}
                className="bg-white border-2 border-orange-300 rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{translations.products.barcode}:</span>
                    <span className="font-semibold">{product.barcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{translations.inventory.currentStock}:</span>
                    <span className="font-bold text-orange-600">{product.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{translations.products.price}:</span>
                    <span className="font-semibold">
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {translations.inventory.allProducts}
        </h2>

        {allProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="p-4 text-right font-bold">{translations.products.productName}</th>
                  <th className="p-4 text-center font-bold">{translations.products.barcode}</th>
                  <th className="p-4 text-center font-bold">{translations.products.price}</th>
                  <th className="p-4 text-center font-bold">{translations.inventory.currentStock}</th>
                  <th className="p-4 text-center font-bold">{translations.inventory.status}</th>
                  <th className="p-4 text-center font-bold">{translations.inventory.stockLevel}</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map(product => {
                  const status = getStockStatus(product.stock);
                  const stockPercentage = Math.min((product.stock / 50) * 100, 100); // Assuming max stock of 50 for visualization

                  return (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 text-right font-semibold">{product.name}</td>
                      <td className="p-4 text-center">{product.barcode}</td>
                      <td className="p-4 text-center">
                        {product.price.toLocaleString()} {translations.common.currency}
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-xl">{product.stock}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              product.stock === 0 ? 'bg-red-500' :
                              product.stock < 10 ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${stockPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {translations.products.noProducts}
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">مجموع البضائع</h3>
          <p className="text-4xl font-bold text-blue-600">{allProducts.length}</p>
        </div>

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-2">بضائع متوفرة</h3>
          <p className="text-4xl font-bold text-green-600">
            {allProducts.filter(p => p.stock >= 10).length}
          </p>
        </div>

        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">بضائع قليلة</h3>
          <p className="text-4xl font-bold text-orange-600">{lowStockProducts.length}</p>
        </div>
      </div>
    </div>
  );
}

export default InventoryScreen;

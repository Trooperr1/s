/**
 * Product Management Component
 * CRUD operations for products - Modern Card Grid Design
 */

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSave, FaBoxOpen } from 'react-icons/fa';
import { translations } from '../translations';
import { type Product, getAllProducts, addProduct, updateProduct, deleteProduct, searchProducts } from '../db';

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

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

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        barcode: product.barcode,
        price: product.price.toString(),
        stock: product.stock.toString()
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', barcode: '', price: '', stock: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', barcode: '', price: '', stock: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.barcode || !formData.price || !formData.stock) {
      alert(translations.validation.required);
      return;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (isNaN(price) || price < 0) {
      alert(translations.validation.invalidPrice);
      return;
    }

    if (isNaN(stock) || stock < 0) {
      alert(translations.validation.invalidStock);
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id!, {
          name: formData.name,
          barcode: formData.barcode,
          price,
          stock
        });
      } else {
        // Add new product
        await addProduct({
          name: formData.name,
          barcode: formData.barcode,
          price,
          stock,
          createdAt: new Date()
        });
      }

      await loadProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(translations.common.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(translations.products.confirmDelete)) {
      try {
        await deleteProduct(id);
        await loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(translations.common.error);
      }
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return 'bg-red-100 text-red-700 border-red-300';
    } else if (stock < 10) {
      return 'bg-orange-100 text-orange-700 border-orange-300';
    } else {
      return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return translations.products.outOfStock;
    if (stock < 10) return translations.products.lowStock;
    return translations.products.inStock;
  };

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {translations.products.title}
            </h2>
            <p className="text-gray-600">إدارة المنتجات والمخزون</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-accent hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 shadow-lg transform transition hover:scale-105"
          >
            <FaPlus className="text-xl" />
            <span className="text-lg">{translations.products.addProduct}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translations.products.searchProducts}
            className="w-full p-5 pr-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Product Image Placeholder */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 h-48 flex items-center justify-center">
                <FaBoxOpen className="text-6xl text-blue-300" />
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {product.name}
                </h3>

                {/* Barcode */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500">باركود:</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono">
                    {product.barcode}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500">{translations.common.currency}</span>
                </div>

                {/* Stock Badge */}
                <div className="mb-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold ${getStockBadge(product.stock)}`}>
                    <span>مخزون: {product.stock}</span>
                    <span className="text-xs">({getStockText(product.stock)})</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold"
                  >
                    <FaEdit />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id!)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold"
                  >
                    <FaTrash />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">{translations.products.noProducts}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingProduct ? translations.products.editProduct : translations.products.addProduct}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    {translations.products.productName}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    {translations.products.barcode}
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    {translations.products.price} ({translations.common.currency})
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    {translations.products.stock}
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    min="0"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-accent hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                  >
                    <FaSave />
                    {translations.products.save}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-colors"
                  >
                    {translations.products.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;

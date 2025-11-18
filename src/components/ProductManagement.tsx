/**
 * Product Management Component
 * CRUD operations for products
 */

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSave } from 'react-icons/fa';
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {translations.products.title}
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          {translations.products.addProduct}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={translations.products.searchProducts}
          className="w-full p-4 pr-12 text-lg border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="p-4 text-right font-bold">{translations.products.productName}</th>
              <th className="p-4 text-center font-bold">{translations.products.barcode}</th>
              <th className="p-4 text-center font-bold">{translations.products.price}</th>
              <th className="p-4 text-center font-bold">{translations.products.stock}</th>
              <th className="p-4 text-center font-bold">{translations.inventory.status}</th>
              <th className="p-4 text-center font-bold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-right font-semibold">{product.name}</td>
                  <td className="p-4 text-center">{product.barcode}</td>
                  <td className="p-4 text-center">
                    {product.price.toLocaleString()} {translations.common.currency}
                  </td>
                  <td className="p-4 text-center font-semibold">{product.stock}</td>
                  <td className="p-4 text-center">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-semibold
                      ${product.stock === 0 ? 'bg-red-100 text-red-700' :
                        product.stock < 10 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'}
                    `}>
                      {product.stock === 0 ? translations.products.outOfStock :
                       product.stock < 10 ? translations.products.lowStock :
                       translations.products.inStock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id!)}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-500">
                  {translations.products.noProducts}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingProduct ? translations.products.editProduct : translations.products.addProduct}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    {translations.products.productName}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    {translations.products.barcode}
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    {translations.products.price} ({translations.common.currency})
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    {translations.products.stock}
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    min="0"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    {translations.products.save}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
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

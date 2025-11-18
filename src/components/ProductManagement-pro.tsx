/**
 * Professional Product Management - Data Table
 */

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { usePOSStore } from '../lib/store';
import { getAllProducts, addProduct, updateProduct, deleteProduct, getAllCategories, type Product, type Category } from '../lib/database';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { t } from '../lib/translations-pro';
import { formatCurrency } from '../lib/utils';
import toast from 'react-hot-toast';

export default function ProductManagement() {
  const { products, setProducts } = usePOSStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameKurdish: '',
    barcode: '',
    price: '',
    stock: '',
    categoryId: '',
    image: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [allProducts, allCategories] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
    ]);
    setProducts(allProducts);
    setCategories(allCategories);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        nameKurdish: product.nameKurdish,
        barcode: product.barcode,
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId.toString(),
        image: product.image || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        nameKurdish: '',
        barcode: '',
        price: '',
        stock: '',
        categoryId: categories[0]?.id?.toString() || '',
        image: '',
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);
    const categoryId = parseInt(formData.categoryId);

    if (isNaN(price) || price < 0) {
      toast.error(t.validation.invalidPrice);
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast.error(t.validation.invalidStock);
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id!, {
          name: formData.name,
          nameKurdish: formData.nameKurdish,
          barcode: formData.barcode,
          price,
          stock,
          categoryId,
          image: formData.image,
        });
        toast.success('بەرهەم نوێکرایەوە');
      } else {
        await addProduct({
          name: formData.name,
          nameKurdish: formData.nameKurdish,
          barcode: formData.barcode,
          price,
          stock,
          categoryId,
          image: formData.image,
        });
        toast.success('بەرهەمی نوێ زیادکرا');
      }

      await loadData();
      setShowDialog(false);
    } catch (error) {
      toast.error(t.common.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(t.products.confirmDelete)) {
      try {
        await deleteProduct(id);
        await loadData();
        toast.success('بەرهەم سڕایەوە');
      } catch (error) {
        toast.error(t.common.error);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { text: t.products.outOfStock, color: 'bg-red-100 text-red-700' };
    if (stock < 10) return { text: t.products.lowStock, color: 'bg-orange-100 text-orange-700' };
    return { text: t.products.inStock, color: 'bg-success/10 text-success' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black flex items-center gap-2">
          <Package className="text-primary" />
          {t.products.title}
        </h2>
        <Button onClick={() => handleOpenDialog()} size="lg">
          <Plus className="ml-2" />
          {t.products.addProduct}
        </Button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-right p-4 font-bold">{t.products.image}</th>
              <th className="text-right p-4 font-bold">{t.products.productNameKurdish}</th>
              <th className="text-center p-4 font-bold">{t.products.barcode}</th>
              <th className="text-center p-4 font-bold">{t.products.price}</th>
              <th className="text-center p-4 font-bold">{t.products.stock}</th>
              <th className="text-center p-4 font-bold">{t.products.category}</th>
              <th className="text-center p-4 font-bold">{t.products.actions}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const badge = getStockBadge(product.stock);
              const category = categories.find((c) => c.id === product.categoryId);

              return (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="text-gray-400" size={32} />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{product.nameKurdish}</div>
                    <div className="text-sm text-gray-500">{product.name}</div>
                  </td>
                  <td className="p-4 text-center">
                    <code className="bg-gray-100 px-2 py-1 rounded">{product.barcode}</code>
                  </td>
                  <td className="p-4 text-center font-bold text-primary">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${badge.color}`}>
                      {product.stock} - {badge.text}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-sm">{category?.icon} {category?.nameKurdish}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id!)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Package size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">{t.products.title}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? t.products.editProduct : t.products.addProduct}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t.products.productName}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>{t.products.productNameKurdish}</Label>
                <Input
                  value={formData.nameKurdish}
                  onChange={(e) => setFormData({ ...formData, nameKurdish: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t.products.barcode}</Label>
                <Input
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>{t.products.category}</Label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="flex h-12 w-full rounded-lg border-2 border-input bg-white px-4 py-2 text-base"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.nameKurdish}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t.products.price} ({t.common.currency})</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div>
                <Label>{t.products.stock}</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label>{t.products.uploadImage}</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-lg" />
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" size="lg">
                {t.common.save}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                size="lg"
                onClick={() => setShowDialog(false)}
              >
                {t.common.cancel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

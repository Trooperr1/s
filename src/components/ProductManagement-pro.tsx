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
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error(t.validation.invalidPrice, { style: { direction: 'rtl' } });
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast.error(t.validation.invalidStock, { style: { direction: 'rtl' } });
      return;
    }

    setIsLoading(true);
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
        toast.success('بەرهەم نوێکرایەوە ✓', { style: { direction: 'rtl' } });
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
        toast.success('بەرهەمی نوێ زیادکرا ✓', { style: { direction: 'rtl' } });
      }

      await loadData();
      setShowDialog(false);
    } catch (error) {
      toast.error(t.common.error, { style: { direction: 'rtl' } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(t.products.confirmDelete)) {
      setIsLoading(true);
      try {
        await deleteProduct(id);
        await loadData();
        toast.success('بەرهەم سڕایەوە ✓', {
          icon: '🗑️',
          style: { direction: 'rtl' }
        });
      } catch (error) {
        toast.error(t.common.error, { style: { direction: 'rtl' } });
      } finally {
        setIsLoading(false);
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
    if (stock === 0) return { text: t.products.outOfStock, color: 'bg-destructive text-white' };
    if (stock < 10) return { text: t.products.lowStock, color: 'bg-yellow-500 text-white' };
    if (stock < 20) return { text: t.products.lowStock, color: 'bg-orange-400 text-white' };
    return { text: t.products.inStock, color: 'bg-success text-white' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-200">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Package className="text-primary" size={36} />
          {t.products.title}
        </h2>
        <Button onClick={() => handleOpenDialog()} size="lg" className="h-14 px-8 text-base shadow-lg">
          <Plus className="ml-2" size={20} />
          {t.products.addProduct}
        </Button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary to-primary/90 text-white">
            <tr>
              <th className="text-right p-4 font-bold text-base">{t.products.image}</th>
              <th className="text-right p-4 font-bold text-base">{t.products.productNameKurdish}</th>
              <th className="text-center p-4 font-bold text-base">{t.products.barcode}</th>
              <th className="text-center p-4 font-bold text-base">{t.products.price}</th>
              <th className="text-center p-4 font-bold text-base">{t.products.stock}</th>
              <th className="text-center p-4 font-bold text-base">{t.products.category}</th>
              <th className="text-center p-4 font-bold text-base">{t.products.actions}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const badge = getStockBadge(product.stock);
              const category = categories.find((c) => c.id === product.categoryId);

              return (
                <tr
                  key={product.id}
                  className={`border-b border-gray-200 hover:bg-primary-light transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="p-5">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-sm border-2 border-gray-300">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="text-gray-400" size={36} />
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-base">{product.nameKurdish}</div>
                    <div className="text-sm text-gray-600 mt-1">{product.name}</div>
                  </td>
                  <td className="p-5 text-center">
                    <code className="bg-primary-light text-primary px-3 py-2 rounded-lg font-mono text-sm font-bold">
                      {product.barcode}
                    </code>
                  </td>
                  <td className="p-5 text-center">
                    <div className="font-black text-lg text-primary">{formatCurrency(product.price)}</div>
                    <div className="text-xs text-gray-500">د.ع</div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${badge.color}`}>
                      {product.stock} - {badge.text}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className="text-base font-semibold">{category?.icon} {category?.nameKurdish}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(product)}
                        disabled={isLoading}
                        className="h-10 px-4 hover:bg-primary hover:text-white hover:border-primary transition-all"
                      >
                        <Edit size={18} className="ml-1" />
                        {t.common.edit}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id!)}
                        disabled={isLoading}
                        className="h-10 px-4 shadow-md hover:shadow-lg transition-all"
                      >
                        <Trash2 size={18} className="ml-1" />
                        {t.common.delete}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-20 text-gray-400 bg-gray-50">
            <Package size={80} className="mx-auto mb-6 opacity-30" />
            <p className="text-2xl font-bold mb-2">هیچ بەرهەمێک نییە</p>
            <p className="text-base">کلیک لە "زیادکردنی بەرهەم" بکە بۆ دەستپێکردن</p>
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
              <Button
                type="submit"
                className="flex-1 h-14 text-base shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? t.common.loading : t.common.save}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-14 text-base border-2"
                onClick={() => setShowDialog(false)}
                disabled={isLoading}
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

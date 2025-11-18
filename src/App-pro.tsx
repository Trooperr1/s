/**
 * Professional POS Main App
 * Navigation, Keyboard Shortcuts, Payment Flow
 */

import { useEffect, useState } from 'react';
import { ShoppingCart, Package, History } from 'lucide-react';
import { usePOSStore } from './lib/store';
import { initializeDatabase, addSale, getSettings, type Sale as SaleType } from './lib/database';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import SalesScreen from './components/SalesScreen-pro';
import ProductManagement from './components/ProductManagement-pro';
import SalesHistory from './components/SalesHistory-pro';
import Receipt from './components/Receipt-pro';
import { t } from './lib/translations-pro';
import toast from 'react-hot-toast';

export default function App() {
  const { currentScreen, setCurrentScreen, cart, clearCart, setSales } = usePOSStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<SaleType | null>(null);
  const [settings, setSettings] = useState({
    storeName: 'Hewa Supermarket',
    storeNameKurdish: 'سوپەرمارکێتی هیوا',
    footer: 'www.nexuspos.com',
  });

  // Initialize database
  useEffect(() => {
    initializeDatabase()
      .then(async () => {
        const appSettings = await getSettings();
        if (appSettings) {
          setSettings({
            storeName: appSettings.storeName,
            storeNameKurdish: appSettings.storeNameKurdish,
            footer: appSettings.receiptFooter || 'www.nexuspos.com',
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to initialize database:', err);
        setIsLoading(false);
      });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 - New Sale
      if (e.key === 'F2') {
        e.preventDefault();
        setCurrentScreen('sales');
        toast.success('شاشەی فرۆشتن');
      }
      // F9 - Products
      if (e.key === 'F9') {
        e.preventDefault();
        setCurrentScreen('products');
        toast.success('بەڕێوەبردنی بەرهەمەکان');
      }
      // Escape - Clear Cart
      if (e.key === 'Escape' && currentScreen === 'sales' && cart.length > 0) {
        if (confirm('دڵنیایت لە سڕینەوەی سەبەتە?')) {
          clearCart();
          toast.success('سەبەتە سڕایەوە');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, cart, clearCart, setCurrentScreen]);

  // Handle payment
  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error(t.validation.emptyCart);
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0; // 0% tax
    const total = subtotal + tax;

    try {
      const saleId = await addSale({
        items: cart.map((item) => ({
          productId: item.product.id!,
          productName: item.product.name,
          productNameKurdish: item.product.nameKurdish,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        subtotal,
        tax,
        total,
      });

      // Get the sale for receipt
      const { db } = await import('./lib/database');
      const sale = await db.sales.get(saleId);

      if (sale) {
        setLastSale(sale);
        setShowReceipt(true);
        clearCart();
        toast.success(t.sales.paymentSuccess);

        // Reload sales for history
        const { getAllSales } = await import('./lib/database');
        const allSales = await getAllSales();
        setSales(allSales);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(t.common.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'sales', label: t.nav.sales, icon: ShoppingCart, color: 'from-success to-green-600' },
    { id: 'products', label: t.nav.products, icon: Package, color: 'from-primary to-blue-600' },
    { id: 'history', label: t.nav.history, icon: History, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-2xl no-print">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black">{settings.storeNameKurdish}</h1>
              <p className="text-blue-100 mt-1">{t.appSubtitle}</p>
            </div>
            <div className="text-right text-sm opacity-90">
              <div>{t.shortcuts.newSale}</div>
              <div>{t.shortcuts.products}</div>
              <div>{t.shortcuts.clearCart}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-lg no-print sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex gap-3 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as any)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base
                    transition-all duration-200 transform hover:scale-105
                    ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {currentScreen === 'sales' && (
          <div>
            <SalesScreen />
            {cart.length > 0 && (
              <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto no-print">
                <Button
                  variant="success"
                  size="lg"
                  className="w-full h-16 text-xl font-black shadow-2xl"
                  onClick={handlePayment}
                >
                  {t.sales.pay}
                </Button>
              </div>
            )}
          </div>
        )}
        {currentScreen === 'products' && <ProductManagement />}
        {currentScreen === 'history' && <SalesHistory />}
      </main>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.sales.paymentSuccess}</DialogTitle>
          </DialogHeader>
          {lastSale && (
            <Receipt
              sale={lastSale}
              storeName={settings.storeName}
              storeNameKurdish={settings.storeNameKurdish}
              footer={settings.footer}
              onPrinted={() => setShowReceipt(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

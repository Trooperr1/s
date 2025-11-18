/**
 * Main App Component
 * Handles navigation and layout for the POS system - Modern Design
 */

import { useState, useEffect } from 'react';
import { FaShoppingCart, FaBoxOpen, FaWarehouse, FaHistory } from 'react-icons/fa';
import { translations } from './translations';
import { initializeDatabase } from './db';
import SalesScreen from './components/SalesScreen';
import ProductManagement from './components/ProductManagement';
import InventoryScreen from './components/InventoryScreen';
import SalesHistory from './components/SalesHistory';

type Screen = 'sales' | 'products' | 'inventory' | 'history';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('sales');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database on app load
  useEffect(() => {
    initializeDatabase()
      .then(() => setIsLoading(false))
      .catch(err => {
        console.error('Failed to initialize database:', err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-2xl font-bold text-gray-700">{translations.common.loading}</p>
        </div>
      </div>
    );
  }

  // Navigation items
  const navItems = [
    { id: 'sales', label: translations.nav.sales, icon: FaShoppingCart, color: 'from-green-500 to-green-600' },
    { id: 'products', label: translations.nav.products, icon: FaBoxOpen, color: 'from-blue-500 to-blue-600' },
    { id: 'inventory', label: translations.nav.inventory, icon: FaWarehouse, color: 'from-purple-500 to-purple-600' },
    { id: 'history', label: translations.nav.history, icon: FaHistory, color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-2xl no-print">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-black text-center tracking-tight">
            {translations.appName}
          </h1>
          <p className="text-center text-blue-100 mt-2 text-sm">نظام نقاط البيع الحديث</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-xl no-print sticky top-0 z-10 border-b-4 border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-3 py-3">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl
                    transition-all duration-300 font-bold text-base
                    transform hover:scale-105
                    ${isActive
                      ? `bg-gradient-to-br ${item.color} text-white shadow-xl scale-105`
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-lg'
                    }
                  `}
                >
                  <Icon className={`text-3xl mb-2 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <div className="w-8 h-1 bg-white rounded-full mt-2"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="min-h-[calc(100vh-250px)]">
          {currentScreen === 'sales' && <SalesScreen />}
          {currentScreen === 'products' && <ProductManagement />}
          {currentScreen === 'inventory' && <InventoryScreen />}
          {currentScreen === 'history' && <SalesHistory />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-4 mt-8 no-print">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 text-sm">
            نظام نقاط البيع الحديث - جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

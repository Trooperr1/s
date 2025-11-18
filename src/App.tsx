/**
 * Main App Component
 * Handles navigation and layout for the POS system
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">{translations.common.loading}</p>
        </div>
      </div>
    );
  }

  // Navigation items
  const navItems = [
    { id: 'sales', label: translations.nav.sales, icon: FaShoppingCart },
    { id: 'products', label: translations.nav.products, icon: FaBoxOpen },
    { id: 'inventory', label: translations.nav.inventory, icon: FaWarehouse },
    { id: 'history', label: translations.nav.history, icon: FaHistory }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg no-print">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center">{translations.appName}</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md no-print sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-lg
                    transition-all duration-200 font-semibold text-lg
                    ${isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <Icon className="text-2xl mb-2" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {currentScreen === 'sales' && <SalesScreen />}
        {currentScreen === 'products' && <ProductManagement />}
        {currentScreen === 'inventory' && <InventoryScreen />}
        {currentScreen === 'history' && <SalesHistory />}
      </main>
    </div>
  );
}

export default App;

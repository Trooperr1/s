/**
 * Sales History Component
 * Displays all past sales transactions and daily summary - Modern Card Design
 */

import { useState, useEffect } from 'react';
import { FaEye, FaCalendarDay, FaMoneyBillWave, FaShoppingCart, FaReceipt } from 'react-icons/fa';
import { translations } from '../translations';
import { type Sale, getAllSales, getDailySalesSummary } from '../db';

function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageSale: 0
  });
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    const allSales = await getAllSales();
    const dailySummary = await getDailySalesSummary();
    setSales(allSales);
    setSummary(dailySummary);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ar-IQ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaMoneyBillWave className="text-4xl" />
            </div>
            <div>
              <h3 className="text-base font-semibold opacity-90">{translations.history.totalSales}</h3>
              <p className="text-xs opacity-75">{translations.history.todaySummary}</p>
            </div>
          </div>
          <p className="text-4xl font-black">
            {summary.totalSales.toLocaleString()}
          </p>
          <p className="text-sm opacity-90 mt-1">{translations.common.currency}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaShoppingCart className="text-4xl" />
            </div>
            <div>
              <h3 className="text-base font-semibold opacity-90">{translations.history.totalTransactions}</h3>
              <p className="text-xs opacity-75">{translations.history.todaySummary}</p>
            </div>
          </div>
          <p className="text-4xl font-black">{summary.totalTransactions}</p>
          <p className="text-sm opacity-90 mt-1">معاملات</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaCalendarDay className="text-4xl" />
            </div>
            <div>
              <h3 className="text-base font-semibold opacity-90">{translations.history.averageSale}</h3>
              <p className="text-xs opacity-75">{translations.history.todaySummary}</p>
            </div>
          </div>
          <p className="text-4xl font-black">
            {summary.averageSale.toLocaleString()}
          </p>
          <p className="text-sm opacity-90 mt-1">{translations.common.currency}</p>
        </div>
      </div>

      {/* Sales Cards */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <FaReceipt className="text-primary" />
          {translations.history.title}
        </h2>

        {sales.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sales.map((sale, index) => (
              <div
                key={sale.id}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-primary/40 transition-all transform hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-xl">
                    <FaReceipt className="text-2xl text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{formatDate(sale.date)}</div>
                    <div className="text-sm text-gray-500">{formatTime(sale.date)}</div>
                  </div>
                </div>

                {/* Items Count */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">عدد المنتجات:</span>
                    <span className="bg-primary text-white px-3 py-1 rounded-full font-bold">
                      {sale.items.length}
                    </span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-1">المبلغ الإجمالي</div>
                  <div className="text-3xl font-black text-accent">
                    {sale.total.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">{translations.common.currency}</div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => setSelectedSale(sale)}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                >
                  <FaEye />
                  {translations.history.viewDetails}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FaReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">{translations.history.noSales}</p>
          </div>
        )}
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaReceipt className="text-primary" />
                    {translations.history.saleDetails}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {formatDate(selectedSale.date)} - {formatTime(selectedSale.date)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="text-gray-400 hover:text-gray-600 text-3xl transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-4 text-gray-800">المنتجات المباعة</h4>
                <div className="space-y-3">
                  {selectedSale.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg text-gray-800 flex-1">
                          {item.productName}
                        </span>
                        <span className="font-black text-xl text-accent">
                          {item.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold">
                          {item.quantity} × {item.price.toLocaleString()}
                        </span>
                        <span>=</span>
                        <span className="font-bold">
                          {item.total.toLocaleString()} {translations.common.currency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-lg text-gray-600">
                  <span>{translations.sales.subtotal}:</span>
                  <span className="font-bold">
                    {selectedSale.subtotal.toLocaleString()} {translations.common.currency}
                  </span>
                </div>
                {selectedSale.tax > 0 && (
                  <div className="flex justify-between text-lg text-gray-600">
                    <span>{translations.sales.tax}:</span>
                    <span className="font-bold">
                      {selectedSale.tax.toLocaleString()} {translations.common.currency}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-3xl font-black text-gray-800 bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border-2 border-accent/30 mt-3">
                  <span>المجموع الكلي:</span>
                  <span className="text-accent">
                    {selectedSale.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSale(null)}
                className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-colors"
              >
                {translations.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesHistory;

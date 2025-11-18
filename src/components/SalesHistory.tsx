/**
 * Sales History Component
 * Displays all past sales transactions and daily summary
 */

import { useState, useEffect } from 'react';
import { FaEye, FaCalendarDay, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
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
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <FaMoneyBillWave className="text-3xl" />
            <h3 className="text-lg font-semibold">{translations.history.totalSales}</h3>
          </div>
          <p className="text-3xl font-bold">
            {summary.totalSales.toLocaleString()} {translations.common.currency}
          </p>
          <p className="text-sm opacity-90 mt-2">{translations.history.todaySummary}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <FaShoppingCart className="text-3xl" />
            <h3 className="text-lg font-semibold">{translations.history.totalTransactions}</h3>
          </div>
          <p className="text-3xl font-bold">{summary.totalTransactions}</p>
          <p className="text-sm opacity-90 mt-2">{translations.history.todaySummary}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <FaCalendarDay className="text-3xl" />
            <h3 className="text-lg font-semibold">{translations.history.averageSale}</h3>
          </div>
          <p className="text-3xl font-bold">
            {summary.averageSale.toLocaleString()} {translations.common.currency}
          </p>
          <p className="text-sm opacity-90 mt-2">{translations.history.todaySummary}</p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {translations.history.title}
        </h2>

        {sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="p-4 text-right font-bold">{translations.history.date}</th>
                  <th className="p-4 text-center font-bold">{translations.history.time}</th>
                  <th className="p-4 text-center font-bold">{translations.history.items}</th>
                  <th className="p-4 text-center font-bold">{translations.history.total}</th>
                  <th className="p-4 text-center font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-right font-semibold">
                      {formatDate(sale.date)}
                    </td>
                    <td className="p-4 text-center">
                      {formatTime(sale.date)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                        {sale.items.length} {translations.history.items}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-green-600 text-lg">
                      {sale.total.toLocaleString()} {translations.common.currency}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                      >
                        <FaEye />
                        {translations.history.viewDetails}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {translations.history.noSales}
          </div>
        )}
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{translations.history.saleDetails}</h3>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Sale Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">{translations.history.date}:</span>
                    <span className="font-semibold mr-2">{formatDate(selectedSale.date)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{translations.history.time}:</span>
                    <span className="font-semibold mr-2">{formatTime(selectedSale.date)}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-4">{translations.history.items}</h4>
                <div className="space-y-3">
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-lg">{item.productName}</span>
                        <span className="font-bold text-primary">
                          {item.total.toLocaleString()} {translations.common.currency}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.price.toLocaleString()} {translations.common.currency} × {item.quantity} = {item.total.toLocaleString()} {translations.common.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t-2 border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>{translations.sales.subtotal}:</span>
                  <span className="font-semibold">
                    {selectedSale.subtotal.toLocaleString()} {translations.common.currency}
                  </span>
                </div>
                {selectedSale.tax > 0 && (
                  <div className="flex justify-between text-lg">
                    <span>{translations.sales.tax}:</span>
                    <span className="font-semibold">
                      {selectedSale.tax.toLocaleString()} {translations.common.currency}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold text-primary border-t-2 border-gray-300 pt-2">
                  <span>{translations.sales.total}:</span>
                  <span>{selectedSale.total.toLocaleString()} {translations.common.currency}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSale(null)}
                className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
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

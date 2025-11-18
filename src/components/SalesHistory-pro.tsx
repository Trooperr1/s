/**
 * Professional Sales History - Invoice Display
 */

import { useEffect, useState } from 'react';
import { Receipt, Eye, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { usePOSStore } from '../lib/store';
import { getAllSales, getDailySalesSummary, type Sale } from '../lib/database';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { t } from '../lib/translations-pro';
import { formatCurrency, formatDate, formatTime } from '../lib/utils';

export default function SalesHistory() {
  const { sales, setSales } = usePOSStore();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageSale: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [allSales, dailySummary] = await Promise.all([
      getAllSales(),
      getDailySalesSummary(),
    ]);
    setSales(allSales);
    setSummary(dailySummary);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <DollarSign size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold opacity-90">{t.history.totalSales}</h3>
              <p className="text-xs opacity-75">{t.history.todaySummary}</p>
            </div>
          </div>
          <p className="text-4xl font-black">{formatCurrency(summary.totalSales)}</p>
          <p className="text-sm opacity-90 mt-1">{t.common.currency}</p>
        </div>

        <div className="bg-gradient-to-br from-success to-green-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold opacity-90">{t.history.totalTransactions}</h3>
              <p className="text-xs opacity-75">{t.history.todaySummary}</p>
            </div>
          </div>
          <p className="text-4xl font-black">{summary.totalTransactions}</p>
          <p className="text-sm opacity-90 mt-1">مامەڵەکان</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold opacity-90">{t.history.averageSale}</h3>
              <p className="text-xs opacity-75">{t.history.todaySummary}</p>
            </div>
          </div>
          <p className="text-4xl font-black">{formatCurrency(summary.averageSale)}</p>
          <p className="text-sm opacity-90 mt-1">{t.common.currency}</p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
          <Receipt className="text-primary" />
          {t.history.salesHistory}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-right p-4 font-bold">{t.history.invoice}</th>
                <th className="text-right p-4 font-bold">{t.history.date}</th>
                <th className="text-center p-4 font-bold">{t.history.time}</th>
                <th className="text-center p-4 font-bold">{t.history.items}</th>
                <th className="text-center p-4 font-bold">{t.history.total}</th>
                <th className="text-center p-4 font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <code className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-bold">
                      {sale.invoiceNumber}
                    </code>
                  </td>
                  <td className="p-4 font-semibold">{formatDate(sale.date)}</td>
                  <td className="p-4 text-center text-gray-600">{formatTime(sale.date)}</td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                      {sale.items.length} {t.sales.items}
                    </span>
                  </td>
                  <td className="p-4 text-center font-black text-success text-xl">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="p-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <Eye size={16} className="ml-2" />
                      {t.history.viewDetails}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sales.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Receipt size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">{t.history.noSales}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sale Details Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="text-primary" />
              {t.history.viewDetails} - {selectedSale?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-4">
              {/* Sale Info */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">{t.history.date}:</span>
                  <span className="font-bold mr-2">{formatDate(selectedSale.date)}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t.history.time}:</span>
                  <span className="font-bold mr-2">{formatTime(selectedSale.date)}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold text-lg mb-3">{t.history.items}</h4>
                <div className="space-y-2">
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">{item.productNameKurdish}</span>
                        <span className="font-black text-xl text-primary">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(item.price)} {t.common.currency} × {item.quantity} = {formatCurrency(item.total)} {t.common.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>{t.sales.subtotal}:</span>
                  <span className="font-bold">{formatCurrency(selectedSale.subtotal)} {t.common.currency}</span>
                </div>
                {selectedSale.tax > 0 && (
                  <div className="flex justify-between text-lg">
                    <span>{t.sales.tax}:</span>
                    <span className="font-bold">{formatCurrency(selectedSale.tax)} {t.common.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-3xl font-black bg-success/10 text-success p-4 rounded-xl">
                  <span>{t.sales.total}:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

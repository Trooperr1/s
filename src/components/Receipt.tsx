/**
 * Receipt Component
 * Displays and prints thermal receipt for completed sales
 */

import { useEffect, useState } from 'react';
import { FaTimes, FaPrint } from 'react-icons/fa';
import { translations } from '../translations';
import { type Sale, db } from '../db';

interface ReceiptProps {
  saleId: number;
  onClose: () => void;
}

function Receipt({ saleId, onClose }: ReceiptProps) {
  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    loadSale();
  }, [saleId]);

  const loadSale = async () => {
    const saleData = await db.sales.get(saleId);
    if (saleData) {
      setSale(saleData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!sale) {
    return null;
  }

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
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{translations.sales.saleCompleted}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-green-600 text-xl font-semibold mb-4">
                {translations.receipt.thankYou}
              </p>
              <button
                onClick={handlePrint}
                className="bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 mx-auto"
              >
                <FaPrint />
                {translations.sales.printReceipt}
              </button>
            </div>

            {/* Receipt Preview */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <ReceiptContent sale={sale} formatDate={formatDate} formatTime={formatTime} />
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
            >
              {translations.common.close}
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt */}
      <div className="hidden print:block">
        <ReceiptContent sale={sale} formatDate={formatDate} formatTime={formatTime} />
      </div>
    </>
  );
}

// Receipt Content Component (for both preview and print)
function ReceiptContent({
  sale,
  formatDate,
  formatTime
}: {
  sale: Sale;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}) {
  return (
    <div className="receipt-print" style={{ width: '80mm', margin: '0 auto', fontFamily: 'monospace' }}>
      {/* Store Header */}
      <div className="text-center border-b-2 border-dashed border-gray-400 pb-3 mb-3">
        <h1 className="text-2xl font-bold mb-1">{translations.receipt.storeName}</h1>
        <p className="text-sm">{translations.receipt.title}</p>
      </div>

      {/* Date and Time */}
      <div className="text-sm mb-3 space-y-1">
        <div className="flex justify-between">
          <span>{translations.receipt.date}:</span>
          <span>{formatDate(sale.date)}</span>
        </div>
        <div className="flex justify-between">
          <span>{translations.receipt.time}:</span>
          <span>{formatTime(sale.date)}</span>
        </div>
      </div>

      {/* Items */}
      <div className="border-t-2 border-dashed border-gray-400 pt-3 mb-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-right pb-2">{translations.receipt.item}</th>
              <th className="text-center pb-2">{translations.receipt.qty}</th>
              <th className="text-left pb-2">{translations.receipt.price}</th>
              <th className="text-left pb-2">{translations.receipt.total}</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 text-right">{item.productName}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-left">{item.price.toLocaleString()}</td>
                <td className="py-2 text-left font-semibold">{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t-2 border-dashed border-gray-400 pt-3 mb-3 space-y-2">
        <div className="flex justify-between text-base">
          <span>{translations.receipt.subtotal}:</span>
          <span>{sale.subtotal.toLocaleString()} {translations.common.currency}</span>
        </div>
        {sale.tax > 0 && (
          <div className="flex justify-between text-base">
            <span>{translations.receipt.tax}:</span>
            <span>{sale.tax.toLocaleString()} {translations.common.currency}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold border-t-2 border-gray-400 pt-2">
          <span>{translations.receipt.grandTotal}:</span>
          <span>{sale.total.toLocaleString()} {translations.common.currency}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-dashed border-gray-400 pt-3 text-sm">
        <p className="font-bold">{translations.receipt.thankYou}</p>
        <p className="mt-2">{translations.receipt.footer}</p>
      </div>
    </div>
  );
}

export default Receipt;

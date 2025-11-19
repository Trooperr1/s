/**
 * Thermal Receipt Component - 58mm
 * Uses react-to-print for printing
 */

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { Button } from './ui/button';
import { type Sale } from '../lib/database';
import { formatCurrency, formatDate, formatTime } from '../lib/utils';
import { t } from '../lib/translations-pro';

interface ReceiptProps {
  sale: Sale;
  storeName: string;
  storeNameKurdish: string;
  footer?: string;
  onPrinted?: () => void;
}

export default function Receipt({ sale, storeName, storeNameKurdish, footer, onPrinted }: ReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Receipt-${sale.invoiceNumber}`,
    onAfterPrint: onPrinted,
  });

  return (
    <div>
      {/* Print Button */}
      <div className="no-print mb-6 flex justify-center">
        <Button onClick={handlePrint} size="lg" variant="success">
          <Printer className="ml-2" />
          {t.receipt.print}
        </Button>
      </div>

      {/* Receipt Content - Hidden on screen, shown in print */}
      <div ref={printRef} className="receipt-container">
        <ReceiptContent
          sale={sale}
          storeName={storeName}
          storeNameKurdish={storeNameKurdish}
          footer={footer}
        />
      </div>

      {/* Preview on screen */}
      <div className="no-print border-4 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
        <div className="max-w-[58mm] mx-auto bg-white p-4 shadow-lg">
          <ReceiptContent
            sale={sale}
            storeName={storeName}
            storeNameKurdish={storeNameKurdish}
            footer={footer}
          />
        </div>
      </div>
    </div>
  );
}

function ReceiptContent({
  sale,
  storeName,
  storeNameKurdish,
  footer,
}: {
  sale: Sale;
  storeName: string;
  storeNameKurdish: string;
  footer?: string;
}) {
  return (
    <div style={{ width: '58mm', fontFamily: 'monospace', fontSize: '12px', textAlign: 'center', padding: '8px' }}>
      {/* Store Name */}
      <div style={{ borderBottom: '2px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>{storeNameKurdish}</h1>
        <p style={{ fontSize: '13px', margin: '0', color: '#555' }}>{storeName}</p>
      </div>

      {/* Invoice Number and Date/Time */}
      <div style={{ fontSize: '11px', marginBottom: '10px', textAlign: 'left', lineHeight: '1.6' }}>
        <div style={{ marginBottom: '3px', fontWeight: 'bold' }}>{t.receipt.invoice}: {sale.invoiceNumber}</div>
        <div style={{ marginBottom: '3px', color: '#666' }}>{formatDate(sale.date)} - {formatTime(sale.date)}</div>
      </div>

      {/* Items */}
      <div style={{ borderTop: '2px dashed #000', borderBottom: '2px dashed #000', padding: '8px 0' }}>
        <table style={{ width: '100%', fontSize: '11px', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'right', paddingBottom: '4px' }}>{t.receipt.item}</th>
              <th style={{ textAlign: 'center', paddingBottom: '4px' }}>{t.receipt.qty}</th>
              <th style={{ textAlign: 'left', paddingBottom: '4px' }}>{t.receipt.total}</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ textAlign: 'right', padding: '4px 0' }}>{item.productNameKurdish}</td>
                <td style={{ textAlign: 'center', padding: '4px 0' }}>{item.quantity}</td>
                <td style={{ textAlign: 'left', padding: '4px 0', fontWeight: 'bold' }}>
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ padding: '8px 0', fontSize: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>{t.receipt.subtotal}:</span>
          <span>{formatCurrency(sale.subtotal)} {t.common.currency}</span>
        </div>
        {sale.tax > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>{t.receipt.tax}:</span>
            <span>{formatCurrency(sale.tax)} {t.common.currency}</span>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '16px',
            fontWeight: 'bold',
            borderTop: '2px solid #000',
            paddingTop: '8px',
            marginTop: '4px',
          }}
        >
          <span>{t.receipt.grandTotal}:</span>
          <span>{formatCurrency(sale.total)} {t.common.currency}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '2px dashed #000', paddingTop: '10px', marginTop: '10px', fontSize: '11px' }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 6px 0', fontSize: '13px' }}>{t.receipt.thankYou}</p>
        {footer && <p style={{ margin: '0', color: '#666' }}>{footer}</p>}
        <p style={{ margin: '6px 0 0 0', fontSize: '10px', color: '#999' }}>{t.receipt.footer}</p>
      </div>
    </div>
  );
}

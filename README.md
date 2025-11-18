# سیستەمی فرۆشتن (Kurdish POS System)

A modern, production-ready Point of Sale (POS) system built with React, featuring offline support and Kurdish language interface.

## 🌟 Features

### Core Features
- **Product Management**: Full CRUD operations for products (Add, Edit, Delete)
- **Sales/Cashier Screen**: Fast checkout with barcode/name search
- **Shopping Cart**: Real-time cart with quantity adjustments
- **Receipt Printing**: Thermal printer support (58mm/80mm)
- **Inventory Tracking**: Auto stock updates with low stock warnings
- **Sales History**: Complete transaction history with daily summaries
- **Offline Support**: Works entirely offline using IndexedDB

### UI Features
- **Kurdish Language**: Full Kurdish (Sorani) interface
- **RTL Support**: Right-to-left layout for Kurdish
- **Modern Design**: Clean, professional blue/white theme
- **Touch-Friendly**: Large buttons optimized for tablets
- **Responsive**: Works on desktop, tablet, and touch screens
- **Fast Performance**: Optimized for quick transactions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with RTL support
- **Database**: IndexedDB (via Dexie.js)
- **Icons**: React Icons
- **Font**: Noto Sans Arabic (Kurdish support)

## 📦 Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Build for production**:
```bash
npm run build
```

4. **Preview production build**:
```bash
npm run preview
```

## 🚀 Usage

### First Launch
The system automatically initializes with sample products in Kurdish on first launch.

### Main Screens

#### 1. Sales Screen (فرۆشتن)
- Search products by name or barcode
- Click products to add to cart
- Adjust quantities with +/- buttons
- Complete sale and print receipt

#### 2. Product Management (بەرهەمەکان)
- Add new products with name, barcode, price, and stock
- Edit existing products
- Delete products
- Search products
- View stock status (In Stock, Low Stock, Out of Stock)

#### 3. Inventory (کۆگا)
- View all products with stock levels
- Low stock warnings (products with < 10 items)
- Visual stock level indicators
- Summary statistics

#### 4. Sales History (مێژوو)
- View all completed transactions
- Today's sales summary
- Total sales, transactions, and averages
- Detailed transaction view

### Receipt Printing

The system generates receipts optimized for thermal printers:

**To Print a Receipt**:
1. Complete a sale
2. Click "چاپکردنی وەسڵ" (Print Receipt)
3. Use browser's print dialog (Ctrl+P / Cmd+P)
4. Select your thermal printer
5. Print

**Receipt Format**:
- Store name and date/time
- Itemized list with quantities and prices
- Subtotal, tax, and total
- Kurdish text with proper RTL formatting
- Optimized for 80mm thermal paper

## 📊 Database Schema

### Products Table
```typescript
{
  id: number (auto-increment)
  name: string
  barcode: string
  price: number
  stock: number
  createdAt: Date
}
```

### Sales Table
```typescript
{
  id: number (auto-increment)
  date: Date
  items: SaleItem[]
  subtotal: number
  tax: number
  total: number
}
```

## 🔧 Configuration

### Tax Rate
Edit `src/components/SalesScreen.tsx`:
```typescript
const taxRate = 0.0; // Change to desired tax rate (e.g., 0.10 for 10%)
```

### Store Name
Edit `src/translations.ts`:
```typescript
storeName: 'فرۆشگای کوردستان' // Change to your store name
```

### Low Stock Threshold
Edit `src/db.ts`:
```typescript
// In getLowStockProducts()
product.stock < 10 // Change 10 to desired threshold
```

### Currency
Edit `src/translations.ts`:
```typescript
currency: 'د.ع' // Change to your currency symbol (د.ع = Iraqi Dinar)
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#2563eb',    // Main blue color
  secondary: '#1e40af',  // Secondary blue
}
```

## 📱 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Touch-optimized

## 🖨️ Printer Setup

### Thermal Printer Configuration
1. Connect your thermal printer via USB or Network
2. Install printer drivers
3. In browser print dialog, select thermal printer
4. Set paper size to 80mm (or 58mm)
5. Enable "Background graphics" for best results

### Tested Printers
- ESC/POS compatible thermal printers
- 80mm thermal receipt printers
- 58mm thermal receipt printers

## 🔒 Data Storage

All data is stored locally in IndexedDB:
- No cloud sync
- No internet required
- Data persists across sessions

## 🐛 Troubleshooting

### Database Issues
Clear browser data and reload, or in browser console:
```javascript
indexedDB.deleteDatabase('POSDatabase');
location.reload();
```

### Print Issues
- Ensure printer is connected and set as default
- Check paper size matches printer (80mm)
- Enable "Background graphics" in print settings

## 🌐 Deployment

### Production Build
```bash
npm run build
```

Deploy the `dist/` folder to:
- Static hosting (Netlify, Vercel, GitHub Pages)
- Web server (Apache, Nginx)
- Local network server for POS terminals

## ✨ Key Features

### Auto Stock Management
- Stock automatically decreases on sale
- Real-time stock updates
- Cannot sell out-of-stock items
- Low stock warnings at < 10 items

### Search Functionality
- Search by product name (Kurdish)
- Search by barcode
- Real-time filtering
- Case-insensitive search

### Cart Management
- Add multiple items
- Adjust quantities with +/- buttons
- Remove items
- Real-time total calculation
- Stock validation

---

**Built with ❤️ for Kurdish businesses**

سوپاس بۆ بەکارهێنانی سیستەمی فرۆشتنمان!

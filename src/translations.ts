/**
 * Kurdish (Sorani) Language Translations
 * All UI text in Kurdish for the POS system
 */

export const translations = {
  // App Title
  appName: 'سیستەمی فرۆشتن',

  // Navigation
  nav: {
    sales: 'فرۆشتن',
    products: 'بەرهەمەکان',
    inventory: 'کۆگا',
    history: 'مێژوو'
  },

  // Sales Screen
  sales: {
    title: 'شاشەی فرۆشتن',
    searchPlaceholder: 'گەڕان بەدوای بەرهەم (ناو یان باڕکۆد)...',
    cart: 'سەبەتە',
    emptyCart: 'سەبەتە بەتاڵە',
    addToCart: 'زیادکردن بۆ سەبەتە',
    quantity: 'بڕ',
    price: 'نرخ',
    total: 'کۆی گشتی',
    subtotal: 'کۆی لاوەکی',
    tax: 'باج',
    remove: 'سڕینەوە',
    payment: 'پارەدان',
    printReceipt: 'چاپکردنی وەسڵ',
    completeSale: 'تەواوکردنی فرۆشتن',
    noProducts: 'هیچ بەرهەمێک نەدۆزرایەوە',
    saleCompleted: 'فرۆشتن بەسەرکەوتوویی تەواو بوو!'
  },

  // Product Management
  products: {
    title: 'بەڕێوەبردنی بەرهەمەکان',
    addProduct: 'زیادکردنی بەرهەمی نوێ',
    editProduct: 'دەستکاریکردنی بەرهەم',
    deleteProduct: 'سڕینەوەی بەرهەم',
    productName: 'ناوی بەرهەم',
    barcode: 'باڕکۆد',
    price: 'نرخ',
    stock: 'کۆگا',
    image: 'وێنە',
    save: 'پاشەکەوتکردن',
    cancel: 'پاشگەزبوونەوە',
    delete: 'سڕینەوە',
    edit: 'دەستکاری',
    confirmDelete: 'دڵنیایت لە سڕینەوەی ئەم بەرهەمە؟',
    searchProducts: 'گەڕان بەدوای بەرهەمەکان...',
    noProducts: 'هیچ بەرهەمێک نییە',
    inStock: 'لە کۆگا',
    outOfStock: 'لە کۆگا نییە',
    lowStock: 'کۆگا کەمە'
  },

  // Inventory
  inventory: {
    title: 'بەڕێوەبردنی کۆگا',
    lowStockWarning: 'ئاگاداری: بەرهەمە کەم کۆگاکان',
    productName: 'ناوی بەرهەم',
    currentStock: 'کۆگای ئێستا',
    status: 'دۆخ',
    noLowStock: 'هەموو بەرهەمەکان کۆگای باشیان هەیە',
    allProducts: 'هەموو بەرهەمەکان',
    stockLevel: 'ئاستی کۆگا'
  },

  // Sales History
  history: {
    title: 'مێژووی فرۆشتن',
    date: 'بەروار',
    time: 'کات',
    items: 'بابەت',
    total: 'کۆی گشتی',
    noSales: 'هیچ فرۆشتنێک نییە',
    todaySummary: 'پوختەی ئەمڕۆ',
    totalSales: 'کۆی فرۆشتن',
    totalTransactions: 'کۆی مامەڵەکان',
    averageSale: 'تێکڕای فرۆشتن',
    viewDetails: 'بینینی وردەکاری',
    saleDetails: 'وردەکاری فرۆشتن'
  },

  // Receipt
  receipt: {
    title: 'وەسڵی کڕین',
    storeName: 'فرۆشگای کوردستان',
    thankYou: 'سوپاس بۆ کڕینەکەت!',
    date: 'بەروار',
    time: 'کات',
    item: 'بابەت',
    qty: 'بڕ',
    price: 'نرخ',
    total: 'کۆ',
    subtotal: 'کۆی لاوەکی',
    tax: 'باج',
    grandTotal: 'کۆی گشتی',
    footer: 'بەخێربێیتەوە!'
  },

  // Common
  common: {
    currency: 'د.ع', // Iraqi Dinar
    close: 'داخستن',
    confirm: 'دڵنیاکردنەوە',
    yes: 'بەڵێ',
    no: 'نەخێر',
    loading: 'بارکردن...',
    error: 'هەڵە',
    success: 'سەرکەوتوو',
    search: 'گەڕان'
  },

  // Validation Messages
  validation: {
    required: 'ئەم خانەیە پێویستە',
    invalidPrice: 'نرخ دەبێت ژمارەیەکی دروست بێت',
    invalidStock: 'کۆگا دەبێت ژمارەیەکی دروست بێت',
    duplicateBarcode: 'ئەم باڕکۆدە پێشتر بەکارهاتووە',
    productNotFound: 'بەرهەم نەدۆزرایەوە',
    insufficientStock: 'کۆگا بەسی ناکات',
    emptyCart: 'سەبەتە بەتاڵە'
  }
};

export type Translations = typeof translations;

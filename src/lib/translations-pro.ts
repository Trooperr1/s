/**
 * Kurdish (Sorani) Translations for Professional POS
 */

export const t = {
  // App
  appName: 'سیستەمی فرۆشتن',
  appSubtitle: 'سیستەمی نوێی فرۆشتن',

  // Navigation
  nav: {
    sales: 'فرۆشتن',
    products: 'بەرهەمەکان',
    history: 'مێژوو',
  },

  // Sales Screen
  sales: {
    title: 'شاشەی فرۆشتن',
    searchPlaceholder: 'گەڕان بە ناو، باڕکۆد...',
    cart: 'سەبەتەی کڕین',
    emptyCart: 'سەبەتە بەتاڵە',
    cartEmpty: 'سەبەتەکەت بەتاڵە',
    addToCart: 'زیادکردن بۆ سەبەتە',
    allCategories: 'هەموو جۆرەکان',
    noProducts: 'هیچ بەرهەمێک نەدۆزرایەوە',
    subtotal: 'کۆی لاوەکی',
    tax: 'باج',
    total: 'کۆی گشتی',
    pay: 'پارەدان و چاپکردن',
    clearCart: 'سڕینەوەی سەبەتە',
    paymentSuccess: 'فرۆشتن بەسەرکەوتوویی تەواو بوو!',
    items: 'بابەت',
  },

  // Products
  products: {
    title: 'بەڕێوەبردنی بەرهەمەکان',
    addProduct: 'زیادکردنی بەرهەم',
    editProduct: 'دەستکاریکردنی بەرهەم',
    deleteProduct: 'سڕینەوەی بەرهەم',
    productName: 'ناوی بەرهەم',
    productNameKurdish: 'ناوی بەرهەم بە کوردی',
    price: 'نرخ',
    stock: 'کۆگا',
    barcode: 'باڕکۆد',
    category: 'جۆر',
    image: 'وێنە',
    actions: 'کردارەکان',
    save: 'پاشەکەوتکردن',
    cancel: 'پاشگەزبوونەوە',
    delete: 'سڕینەوە',
    edit: 'دەستکاری',
    confirmDelete: 'دڵنیایت لە سڕینەوەی ئەم بەرهەمە؟',
    lowStock: 'کۆگا کەمە',
    outOfStock: 'کۆگا تەواو بووە',
    inStock: 'لە کۆگا هەیە',
    uploadImage: 'بارکردنی وێنە',
  },

  // History
  history: {
    title: 'مێژووی فرۆشتن',
    invoice: 'ژمارەی وەسڵ',
    date: 'بەروار',
    time: 'کات',
    items: 'بابەتەکان',
    total: 'کۆی گشتی',
    viewDetails: 'بینینی وردەکاری',
    noSales: 'هیچ فرۆشتنێک نییە',
    todaySummary: 'پوختەی ئەمڕۆ',
    totalSales: 'کۆی فرۆشتن',
    totalTransactions: 'کۆی مامەڵەکان',
    averageSale: 'تێکڕای فرۆشتن',
    salesHistory: 'مێژووی فرۆشتنەکان',
  },

  // Receipt
  receipt: {
    title: 'وەسڵی کڕین',
    invoice: 'ژمارەی وەسڵ',
    date: 'بەروار',
    time: 'کات',
    item: 'بابەت',
    qty: 'بڕ',
    price: 'نرخ',
    total: 'کۆ',
    subtotal: 'کۆی لاوەکی',
    tax: 'باج',
    grandTotal: 'کۆی گشتی',
    thankYou: 'سوپاس بۆ کڕینەکەت',
    footer: 'بەخێربێیتەوە!',
    print: 'چاپکردن',
  },

  // Common
  common: {
    loading: 'بارکردن...',
    save: 'پاشەکەوتکردن',
    cancel: 'پاشگەزبوونەوە',
    delete: 'سڕینەوە',
    edit: 'دەستکاری',
    close: 'داخستن',
    search: 'گەڕان',
    filter: 'فلتەر',
    all: 'هەموو',
    success: 'سەرکەوتوو',
    error: 'هەڵە',
    confirm: 'دڵنیاکردنەوە',
    currency: 'د.ع',
  },

  // Validation
  validation: {
    required: 'ئەم خانەیە پێویستە',
    invalidPrice: 'نرخ دەبێت ژمارەیەکی دروست بێت',
    invalidStock: 'کۆگا دەبێت ژمارەیەکی دروست بێت',
    emptyCart: 'سەبەتە بەتاڵە',
    insufficientStock: 'کۆگا بەسی ناکات',
  },

  // Keyboard Shortcuts
  shortcuts: {
    newSale: 'F2 - فرۆشتنی نوێ',
    products: 'F9 - بەرهەمەکان',
    clearCart: 'Esc - سڕینەوەی سەبەتە',
  },
};

export type Translations = typeof t;

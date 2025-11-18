/**
 * Professional POS Database - IndexedDB with Dexie
 * Includes: Products, Categories, Sales, Settings
 */

import Dexie, { type Table } from 'dexie';

// Category interface
export interface Category {
  id?: number;
  name: string;
  nameKurdish: string;
  icon?: string;
  createdAt: Date;
}

// Product interface with image support
export interface Product {
  id?: number;
  name: string;
  nameKurdish: string;
  barcode: string;
  price: number;
  stock: number;
  categoryId: number;
  image?: string; // Base64 or URL
  createdAt: Date;
  updatedAt: Date;
}

// Sale item interface
export interface SaleItem {
  productId: number;
  productName: string;
  productNameKurdish: string;
  quantity: number;
  price: number;
  total: number;
}

// Sale transaction interface
export interface Sale {
  id?: number;
  invoiceNumber: string;
  date: Date;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Settings interface
export interface Settings {
  id?: number;
  storeName: string;
  storeNameKurdish: string;
  taxRate: number;
  currency: string;
  currencyKurdish: string;
  lastInvoiceNumber: number;
  receiptFooter?: string;
}

// Database class
export class POSDatabase extends Dexie {
  categories!: Table<Category>;
  products!: Table<Product>;
  sales!: Table<Sale>;
  settings!: Table<Settings>;

  constructor() {
    super('ModernPOSDatabase');

    this.version(1).stores({
      categories: '++id, name, nameKurdish',
      products: '++id, name, nameKurdish, barcode, categoryId, stock',
      sales: '++id, invoiceNumber, date, total',
      settings: '++id'
    });
  }
}

// Create database instance
export const db = new POSDatabase();

/**
 * Initialize database with default data
 */
export async function initializeDatabase() {
  // Check if already initialized
  const settingsCount = await db.settings.count();

  if (settingsCount === 0) {
    // Add default settings
    await db.settings.add({
      storeName: 'Hewa Supermarket',
      storeNameKurdish: 'سوپەرمارکێتی هیوا',
      taxRate: 0,
      currency: 'IQD',
      currencyKurdish: 'د.ع',
      lastInvoiceNumber: 0,
      receiptFooter: 'www.nexuspos.com'
    });

    // Add default categories
    const defaultCategories: Omit<Category, 'id'>[] = [
      { name: 'Food & Beverages', nameKurdish: 'خواردن و خواردنەوە', icon: '🍽️', createdAt: new Date() },
      { name: 'Dairy Products', nameKurdish: 'بەرهەمە شیراوییەکان', icon: '🥛', createdAt: new Date() },
      { name: 'Snacks', nameKurdish: 'خواردنی سووک', icon: '🍿', createdAt: new Date() },
      { name: 'Beverages', nameKurdish: 'خواردنەوە', icon: '🥤', createdAt: new Date() },
      { name: 'Personal Care', nameKurdish: 'چاودێری کەسی', icon: '🧴', createdAt: new Date() },
      { name: 'Household', nameKurdish: 'کەلوپەلی ماڵەوە', icon: '🏠', createdAt: new Date() },
    ];

    await db.categories.bulkAdd(defaultCategories);

    // Add sample products
    const foodCatId = 1; // Assuming first category
    const dairyCatId = 2;
    const snacksCatId = 3;
    const beverageCatId = 4;

    const defaultProducts: Omit<Product, 'id'>[] = [
      {
        name: 'Tea Gullaw',
        nameKurdish: 'چای گوڵاو',
        barcode: '1001',
        price: 2500,
        stock: 50,
        categoryId: foodCatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nescafe Coffee',
        nameKurdish: 'قاوەی نەسکافێ',
        barcode: '1002',
        price: 5000,
        stock: 30,
        categoryId: beverageCatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sugar',
        nameKurdish: 'شەکر',
        barcode: '1003',
        price: 3000,
        stock: 40,
        categoryId: foodCatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rice',
        nameKurdish: 'برنج',
        barcode: '1004',
        price: 15000,
        stock: 25,
        categoryId: foodCatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cooking Oil',
        nameKurdish: 'زەیتی خۆراک',
        barcode: '1005',
        price: 8000,
        stock: 20,
        categoryId: foodCatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Water Bottle',
        nameKurdish: 'بوتڵ ئاو',
        barcode: '1006',
        price: 500,
        stock: 100,
        categoryId: beverageCatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Milk',
        nameKurdish: 'شیر',
        barcode: '1007',
        price: 2000,
        stock: 35,
        categoryId: dairyCatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chips',
        nameKurdish: 'چیپس',
        barcode: '1008',
        price: 1500,
        stock: 60,
        categoryId: snacksCatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await db.products.bulkAdd(defaultProducts);
  }
}

/**
 * Generate next invoice number
 */
export async function generateInvoiceNumber(): Promise<string> {
  const settings = await db.settings.toCollection().first();
  if (!settings) throw new Error('Settings not initialized');

  const nextNumber = settings.lastInvoiceNumber + 1;
  await db.settings.update(settings.id!, { lastInvoiceNumber: nextNumber });

  return `#${String(nextNumber).padStart(5, '0')}`;
}

/**
 * Get all categories
 */
export async function getAllCategories() {
  return await db.categories.toArray();
}

/**
 * Get all products
 */
export async function getAllProducts() {
  return await db.products.orderBy('name').toArray();
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categoryId: number) {
  return await db.products.where('categoryId').equals(categoryId).toArray();
}

/**
 * Search products
 */
export async function searchProducts(query: string) {
  const lowerQuery = query.toLowerCase();
  return await db.products
    .filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.nameKurdish.includes(query) ||
      product.barcode.includes(query)
    )
    .toArray();
}

/**
 * Add product
 */
export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  return await db.products.add({
    ...product,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

/**
 * Update product
 */
export async function updateProduct(id: number, updates: Partial<Product>) {
  return await db.products.update(id, {
    ...updates,
    updatedAt: new Date()
  });
}

/**
 * Delete product
 */
export async function deleteProduct(id: number) {
  return await db.products.delete(id);
}

/**
 * Add sale
 */
export async function addSale(sale: Omit<Sale, 'id' | 'invoiceNumber' | 'date'>) {
  const invoiceNumber = await generateInvoiceNumber();

  // Update product stock
  for (const item of sale.items) {
    const product = await db.products.get(item.productId);
    if (product) {
      await db.products.update(item.productId, {
        stock: product.stock - item.quantity,
        updatedAt: new Date()
      });
    }
  }

  return await db.sales.add({
    ...sale,
    invoiceNumber,
    date: new Date()
  });
}

/**
 * Get all sales
 */
export async function getAllSales() {
  return await db.sales.orderBy('date').reverse().toArray();
}

/**
 * Get today's sales
 */
export async function getTodaySales() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await db.sales
    .filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= today && saleDate < tomorrow;
    })
    .toArray();
}

/**
 * Get daily sales summary
 */
export async function getDailySalesSummary() {
  const sales = await getTodaySales();
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = sales.length;

  return {
    totalSales,
    totalTransactions,
    averageSale: totalTransactions > 0 ? totalSales / totalTransactions : 0
  };
}

/**
 * Get settings
 */
export async function getSettings() {
  return await db.settings.toCollection().first();
}

/**
 * Update settings
 */
export async function updateSettings(updates: Partial<Settings>) {
  const settings = await getSettings();
  if (settings) {
    return await db.settings.update(settings.id!, updates);
  }
}

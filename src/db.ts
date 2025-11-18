/**
 * IndexedDB Database Configuration using Dexie
 * Manages local storage for products and sales data
 */

import Dexie, { type Table } from 'dexie';

// Product interface
export interface Product {
  id?: number;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  image?: string;
  createdAt: Date;
}

// Sale item interface
export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Sale transaction interface
export interface Sale {
  id?: number;
  date: Date;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Database class extending Dexie
export class POSDatabase extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;

  constructor() {
    super('POSDatabase');

    // Define database schema
    this.version(1).stores({
      products: '++id, name, barcode, price, stock, createdAt',
      sales: '++id, date, total'
    });
  }
}

// Create database instance
export const db = new POSDatabase();

/**
 * Initialize database with sample data if empty
 */
export async function initializeDatabase() {
  const productCount = await db.products.count();

  if (productCount === 0) {
    // Add sample products in Kurdish
    const sampleProducts: Product[] = [
      {
        name: 'چای گوڵاو',
        barcode: '1001',
        price: 2500,
        stock: 50,
        createdAt: new Date()
      },
      {
        name: 'قاوە نەسکافێ',
        barcode: '1002',
        price: 5000,
        stock: 30,
        createdAt: new Date()
      },
      {
        name: 'شەکر',
        barcode: '1003',
        price: 3000,
        stock: 40,
        createdAt: new Date()
      },
      {
        name: 'برنج',
        barcode: '1004',
        price: 15000,
        stock: 25,
        createdAt: new Date()
      },
      {
        name: 'زەیتی خۆراک',
        barcode: '1005',
        price: 8000,
        stock: 20,
        createdAt: new Date()
      },
      {
        name: 'ئاو',
        barcode: '1006',
        price: 500,
        stock: 100,
        createdAt: new Date()
      }
    ];

    await db.products.bulkAdd(sampleProducts);
  }
}

/**
 * Product CRUD Operations
 */

// Add new product
export async function addProduct(product: Omit<Product, 'id'>) {
  return await db.products.add({
    ...product,
    createdAt: new Date()
  });
}

// Update product
export async function updateProduct(id: number, updates: Partial<Product>) {
  return await db.products.update(id, updates);
}

// Delete product
export async function deleteProduct(id: number) {
  return await db.products.delete(id);
}

// Get all products
export async function getAllProducts() {
  return await db.products.orderBy('name').toArray();
}

// Search products by name or barcode
export async function searchProducts(query: string) {
  const lowerQuery = query.toLowerCase();
  return await db.products
    .filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.barcode.includes(query)
    )
    .toArray();
}

// Get product by barcode
export async function getProductByBarcode(barcode: string) {
  return await db.products.where('barcode').equals(barcode).first();
}

// Get low stock products (stock < 10)
export async function getLowStockProducts() {
  return await db.products.filter(product => product.stock < 10).toArray();
}

/**
 * Sales Operations
 */

// Add new sale
export async function addSale(sale: Omit<Sale, 'id'>) {
  // Update product stock
  for (const item of sale.items) {
    const product = await db.products.get(item.productId);
    if (product) {
      await db.products.update(item.productId, {
        stock: product.stock - item.quantity
      });
    }
  }

  return await db.sales.add({
    ...sale,
    date: new Date()
  });
}

// Get all sales
export async function getAllSales() {
  return await db.sales.orderBy('date').reverse().toArray();
}

// Get sales by date range
export async function getSalesByDateRange(startDate: Date, endDate: Date) {
  return await db.sales
    .filter(sale => sale.date >= startDate && sale.date <= endDate)
    .toArray();
}

// Get today's sales
export async function getTodaySales() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await getSalesByDateRange(today, tomorrow);
}

// Get daily sales summary
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

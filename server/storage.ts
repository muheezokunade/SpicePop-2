import { v4 as uuidv4 } from 'uuid';
import { eq, and, like, desc, asc } from 'drizzle-orm';
import {
  User,
  InsertUser,
  Category,
  InsertCategory,
  Product,
  InsertProduct,
  Order,
  InsertOrder,
  Setting,
  InsertSetting,
  OrderStatus,
  users,
  categories,
  products,
  orders,
  settings,
} from "@shared/schema";
import { db } from './db';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined>;
  
  // Settings operations
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  updateSetting(key: string, value: string): Promise<Setting>;
}

export class DatabaseStorage implements IStorage {
  // USERS
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(insertCategory).returning();
    return result[0];
  }
  
  async updateCategory(id: string, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db
      .update(categories)
      .set(categoryUpdate)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }
  
  async deleteCategory(id: string): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return result.length > 0;
  }
  
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }
  
  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.slug, slug));
    return result[0];
  }
  
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.categoryId, categoryId));
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.isFeatured, true));
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }
  
  async updateProduct(id: string, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }
  
  async deleteProduct(id: string): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return result.length > 0;
  }
  
  // ORDERS
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }
  
  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(insertOrder).returning();
    return result[0];
  }
  
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
    const result = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }
  
  // SETTINGS
  async getSettings(): Promise<Setting[]> {
    return db.select().from(settings);
  }
  
  async getSetting(key: string): Promise<Setting | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key));
    return result[0];
  }
  
  async updateSetting(key: string, value: string): Promise<Setting> {
    // Check if setting exists
    const existingSetting = await this.getSetting(key);
    
    if (existingSetting) {
      // Update existing setting
      const result = await db
        .update(settings)
        .set({ value })
        .where(eq(settings.key, key))
        .returning();
      return result[0];
    } else {
      // Create new setting
      const result = await db
        .insert(settings)
        .values({ key, value })
        .returning();
      return result[0];
    }
  }
  
  // Seed Data Methods
  async seedInitialData() {
    await this.seedAdmin();
    await this.seedCategories();
    await this.seedProducts();
    await this.seedSettings();
  }
  
  private async seedAdmin() {
    const existingAdmin = await this.getUserByUsername('admin');
    if (!existingAdmin) {
      await this.createUser({
        username: 'admin',
        password: 'admin123', // In production, should be hashed
        email: 'admin@spicepop.com',
        isAdmin: true
      });
    }
  }
  
  private async seedCategories() {
    const existingCategories = await this.getCategories();
    if (existingCategories.length === 0) {
      const categories: InsertCategory[] = [
        { name: 'Spices', slug: 'spices', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
        { name: 'Grains & Rice', slug: 'grains-rice', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8d6?w=800&q=80' },
        { name: 'Sauces & Pastes', slug: 'sauces-pastes', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80' },
        { name: 'Snacks', slug: 'snacks', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80' },
        { name: 'Recipe Bundles', slug: 'recipe-bundles', imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80' }
      ];
      
      for (const category of categories) {
        await this.createCategory(category);
      }
    }
  }
  
  private async seedProducts() {
    const existingProducts = await this.getProducts();
    if (existingProducts.length === 0) {
      // Get category IDs
      const categories = await this.getCategories();
      const spicesCategoryId = categories.find(c => c.slug === 'spices')?.id || '';
      const saucesCategoryId = categories.find(c => c.slug === 'sauces-pastes')?.id || '';
      const grainsCategoryId = categories.find(c => c.slug === 'grains-rice')?.id || '';
      const snacksCategoryId = categories.find(c => c.slug === 'snacks')?.id || '';
      
      const products: InsertProduct[] = [
        {
          name: 'Nigerian Pepper Mix',
          slug: 'nigerian-pepper-mix',
          description: 'A perfect blend of scotch bonnet peppers and local spices for your soups and stews.',
          price: '1500',
          stock: 50,
          imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
          categoryId: spicesCategoryId,
          isFeatured: true
        },
        {
          name: 'Jollof Rice Spice Mix',
          slug: 'jollof-rice-spice-mix',
          description: 'All the spices you need to make the perfect Nigerian Jollof rice in one convenient packet.',
          price: '2200',
          stock: 35,
          imageUrl: 'https://images.unsplash.com/photo-1599438245301-173ce6a803c5?w=800&q=80',
          categoryId: spicesCategoryId,
          isFeatured: true
        },
        {
          name: 'Premium Ogbono Seeds',
          slug: 'premium-ogbono-seeds',
          description: 'High-quality ogbono seeds for making authentic Nigerian ogbono soup.',
          price: '3800',
          stock: 20,
          imageUrl: 'https://images.unsplash.com/photo-1508747323945-2a6097fce5bd?w=800&q=80',
          categoryId: saucesCategoryId,
          isFeatured: true
        },
        {
          name: 'Dried Crayfish',
          slug: 'dried-crayfish',
          description: 'Essential ingredient for adding rich flavor to Nigerian soups and stews.',
          price: '2500',
          stock: 40,
          imageUrl: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?w=800&q=80',
          categoryId: spicesCategoryId,
          isFeatured: true
        },
        {
          name: 'Ofada Rice',
          slug: 'ofada-rice',
          description: 'Premium local Nigerian rice with unique texture and flavor.',
          price: '3500',
          stock: 25,
          imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8d6?w=800&q=80',
          categoryId: grainsCategoryId,
          isFeatured: false
        },
        {
          name: 'Egusi Seeds',
          slug: 'egusi-seeds',
          description: 'Ground melon seeds for making traditional egusi soup.',
          price: '2800',
          stock: 30,
          imageUrl: 'https://images.unsplash.com/photo-1556910633-5099dc3971e0?w=800&q=80',
          categoryId: saucesCategoryId,
          isFeatured: false
        },
        {
          name: 'Plantain Chips',
          slug: 'plantain-chips',
          description: 'Crunchy, lightly salted plantain chips made from fresh Nigerian plantains.',
          price: '1200',
          stock: 60,
          imageUrl: 'https://images.unsplash.com/photo-1559471712-e29bb872c2fa?w=800&q=80',
          categoryId: snacksCategoryId,
          isFeatured: false
        },
        {
          name: 'Suya Spice Mix',
          slug: 'suya-spice-mix',
          description: 'Authentic spice blend for making traditional Nigerian suya at home.',
          price: '1800',
          stock: 45,
          imageUrl: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=800&q=80',
          categoryId: spicesCategoryId,
          isFeatured: false
        }
      ];
      
      for (const product of products) {
        await this.createProduct(product);
      }
    }
  }
  
  private async seedSettings() {
    const existingSettings = await this.getSettings();
    if (existingSettings.length === 0) {
      const settings: { key: string, value: string }[] = [
        { key: 'site_name', value: 'SpicePop' },
        { key: 'site_description', value: 'Nigerian Modern E-Commerce Platform for Spices and Foodstuffs' },
        { key: 'founder', value: 'Iman Fasasi' },
        { key: 'contact_email', value: 'info@spicepop.net' },
        { key: 'contact_phone', value: '+2348068989798' },
        { key: 'contact_whatsapp', value: '+2348068989798' },
        { key: 'contact_address', value: '13, Signature estate Ikota, Lekki, Lagos, Nigeria' },
        { key: 'store_location_1', value: '13, Signature estate Ikota, Lekki, Lagos, Nigeria' },
        { key: 'store_location_2', value: '10, Yusuf street Oshodi, Lagos' },
        { key: 'store_location_3', value: 'Road 4, Plot B, Carlton Gate estate, Ibadan, Oyo State' },
        { key: 'store_location_4', value: '7B, road 7b, Obafemi Awolowo University, Ile ife, Osun State' },
        { key: 'social_facebook', value: 'https://www.facebook.com/share/18yaDEg6ck/' },
        { key: 'social_instagram', value: 'https://www.instagram.com/thespicepop?igsh=M3k3cm51aTQ3NG4=' },
        { key: 'social_twitter', value: 'https://x.com/thespicepop?t=UjxyaAgKbIrvzCH1gFmbuA&s=09' },
        { key: 'social_tiktok', value: 'https://www.tiktok.com/@spicepop?_t=ZM-8vpWf36RRDB&_r=1' }
      ];
      
      for (const { key, value } of settings) {
        await this.updateSetting(key, value);
      }
    }
  }
}

// Create and export database storage instance
export const storage = new DatabaseStorage();

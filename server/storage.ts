import { v4 as uuidv4 } from 'uuid';
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
  OrderStatus
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private settings: Map<string, Setting>;
  private nextUserId: number;
  private nextSettingId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.settings = new Map();
    this.nextUserId = 1;
    this.nextSettingId = 1;
    
    // Add default admin user
    this.createUser({
      username: 'admin',
      password: 'admin123',
      email: 'admin@spicepop.com',
      isAdmin: true
    });
    
    // Add some default categories
    this.seedCategories();
    
    // Add some default products
    this.seedProducts();
    
    // Add default settings
    this.seedSettings();
  }

  // USERS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin || false 
    };
    this.users.set(id, user);
    return user;
  }
  
  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = uuidv4();
    const category: Category = { 
      ...insertCategory, 
      id,
      imageUrl: insertCategory.imageUrl || null
    };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: string, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    
    const updated: Category = { ...existing, ...categoryUpdate };
    this.categories.set(id, updated);
    return updated;
  }
  
  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = uuidv4();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date(),
      imageUrl: insertProduct.imageUrl || null,
      stock: insertProduct.stock || 0,
      categoryId: insertProduct.categoryId || null,
      isFeatured: insertProduct.isFeatured || false
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: string, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated: Product = { ...existing, ...productUpdate };
    this.products.set(id, updated);
    return updated;
  }
  
  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // ORDERS
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = uuidv4();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date(),
      status: insertOrder.status || 'pending'
    };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    
    const updated: Order = { ...existing, status };
    this.orders.set(id, updated);
    return updated;
  }
  
  // SETTINGS
  async getSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }
  
  async getSetting(key: string): Promise<Setting | undefined> {
    return Array.from(this.settings.values()).find(
      (setting) => setting.key === key
    );
  }
  
  async updateSetting(key: string, value: string): Promise<Setting> {
    const existingSetting = await this.getSetting(key);
    
    if (existingSetting) {
      const updated: Setting = { ...existingSetting, value };
      this.settings.set(existingSetting.id.toString(), updated);
      return updated;
    } else {
      const id = this.nextSettingId++;
      const setting: Setting = { id, key, value };
      this.settings.set(id.toString(), setting);
      return setting;
    }
  }
  
  // SEED DATA
  private seedCategories() {
    const categories: InsertCategory[] = [
      { name: 'Spices', slug: 'spices', imageUrl: '/images/categories/spices.jpg' },
      { name: 'Grains & Rice', slug: 'grains-rice', imageUrl: '/images/categories/grains.jpg' },
      { name: 'Sauces & Pastes', slug: 'sauces-pastes', imageUrl: '/images/categories/sauces.jpg' },
      { name: 'Snacks', slug: 'snacks', imageUrl: '/images/categories/snacks.jpg' },
      { name: 'Recipe Bundles', slug: 'recipe-bundles', imageUrl: '/images/categories/bundles.jpg' }
    ];
    
    categories.forEach(async (category) => {
      await this.createCategory(category);
    });
  }
  
  private seedProducts() {
    // Get category IDs
    const categories = Array.from(this.categories.values());
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
        imageUrl: '/images/products/pepper-mix.jpg',
        categoryId: spicesCategoryId,
        isFeatured: true
      },
      {
        name: 'Jollof Rice Spice Mix',
        slug: 'jollof-rice-spice-mix',
        description: 'All the spices you need to make the perfect Nigerian Jollof rice in one convenient packet.',
        price: '2200',
        stock: 35,
        imageUrl: '/images/products/jollof-spice.jpg',
        categoryId: spicesCategoryId,
        isFeatured: true
      },
      {
        name: 'Premium Ogbono Seeds',
        slug: 'premium-ogbono-seeds',
        description: 'High-quality ogbono seeds for making authentic Nigerian ogbono soup.',
        price: '3800',
        stock: 20,
        imageUrl: '/images/products/ogbono.jpg',
        categoryId: saucesCategoryId,
        isFeatured: true
      },
      {
        name: 'Dried Crayfish',
        slug: 'dried-crayfish',
        description: 'Essential ingredient for adding rich flavor to Nigerian soups and stews.',
        price: '2500',
        stock: 40,
        imageUrl: '/images/products/crayfish.jpg',
        categoryId: spicesCategoryId,
        isFeatured: true
      },
      {
        name: 'Ofada Rice',
        slug: 'ofada-rice',
        description: 'Premium local Nigerian rice with unique texture and flavor.',
        price: '3500',
        stock: 25,
        imageUrl: '/images/products/ofada-rice.jpg',
        categoryId: grainsCategoryId,
        isFeatured: false
      },
      {
        name: 'Egusi Seeds',
        slug: 'egusi-seeds',
        description: 'Ground melon seeds for making traditional egusi soup.',
        price: '2800',
        stock: 30,
        imageUrl: '/images/products/egusi.jpg',
        categoryId: saucesCategoryId,
        isFeatured: false
      },
      {
        name: 'Plantain Chips',
        slug: 'plantain-chips',
        description: 'Crunchy, lightly salted plantain chips made from fresh Nigerian plantains.',
        price: '1200',
        stock: 60,
        imageUrl: '/images/products/plantain-chips.jpg',
        categoryId: snacksCategoryId,
        isFeatured: false
      },
      {
        name: 'Suya Spice Mix',
        slug: 'suya-spice-mix',
        description: 'Authentic spice blend for making traditional Nigerian suya at home.',
        price: '1800',
        stock: 45,
        imageUrl: '/images/products/suya-spice.jpg',
        categoryId: spicesCategoryId,
        isFeatured: false
      }
    ];
    
    products.forEach(async (product) => {
      await this.createProduct(product);
    });
  }
  
  private seedSettings() {
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
    
    settings.forEach(async ({ key, value }) => {
      await this.updateSetting(key, value);
    });
  }
}

export const storage = new MemStorage();

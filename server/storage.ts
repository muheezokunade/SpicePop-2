import { v4 as uuidv4 } from 'uuid';
import { eq, and, like, desc, asc, isNull } from 'drizzle-orm';
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
  BlogPost,
  InsertBlogPost,
  users,
  categories,
  products,
  orders,
  settings,
  blogPosts,
} from "@shared/schema";
import { db } from './db';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
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
  
  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(categoryId: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // USERS
  async getUser(id: string): Promise<User | undefined> {
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
    // First, update any products that reference this category by setting categoryId to null
    await db
      .update(products)
      .set({ categoryId: null })
      .where(eq(products.categoryId, id));
    
    // Then, update any blog posts that reference this category by setting categoryId to null
    await db
      .update(blogPosts)
      .set({ categoryId: null })
      .where(eq(blogPosts.categoryId, id));
    
    // Now it's safe to delete the category
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
  
  // BLOG POSTS
  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }
  
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
  }
  
  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return result[0];
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return result[0];
  }
  
  async getBlogPostsByCategory(categoryId: string): Promise<BlogPost[]> {
    return db.select().from(blogPosts)
      .where(and(
        eq(blogPosts.categoryId, categoryId),
        eq(blogPosts.published, true)
      ))
      .orderBy(desc(blogPosts.createdAt));
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(insertBlogPost).returning();
    return result[0];
  }
  
  async updateBlogPost(id: string, blogPostUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db
      .update(blogPosts)
      .set({
        ...blogPostUpdate,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }
  
  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Seed Data Methods
  async seedInitialData() {
    try {
      console.log("Starting seeding process...");
      
      console.log("1. Seeding admin...");
      await this.seedAdmin();
      console.log("✓ Admin seeded successfully");

      console.log("2. Seeding categories...");
      await this.seedCategories();
      console.log("✓ Categories seeded successfully");

      console.log("3. Seeding products...");
      await this.seedProducts();
      console.log("✓ Products seeded successfully");

      console.log("4. Seeding settings...");
      await this.seedSettings();
      console.log("✓ Settings seeded successfully");

      console.log("5. Seeding blog posts...");
      await this.seedBlogPosts();
      console.log("✓ Blog posts seeded successfully");

      console.log("All data seeded successfully!");
    } catch (error) {
      console.error("Seeding error:", error);
      throw error;
    }
  }
  
  private async seedAdmin() {
    const existingAdmin = await this.getUserByUsername('admin');
    if (!existingAdmin) {
      await this.createUser({
        username: 'admin',
        password: 'ikeoluwapo',
        email: 'imanbusayo@gmail.com',
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

  private async seedBlogPosts() {
    try {
      const existingPosts = await this.getBlogPosts();
      if (existingPosts.length === 0) {
        const admin = await this.getUserByUsername('admin');
        if (!admin) {
          return;
        }

        // Get category IDs
        const categories = await this.getCategories();
        const spicesCategoryId = categories.find(c => c.slug === 'spices')?.id || '';
        const recipesCategoryId = categories.find(c => c.slug === 'recipe-bundles')?.id || '';
        
        const blogPosts: InsertBlogPost[] = [
          {
            title: "The Ultimate Guide to Nigerian Spices",
            slug: "ultimate-guide-nigerian-spices",
            excerpt: "Discover the rich flavors and health benefits of traditional Nigerian spices used in everyday cooking.",
            content: `
# The Ultimate Guide to Nigerian Spices

Nigerian cuisine is renowned for its bold, aromatic flavors that come from a variety of indigenous spices and herbs. In this guide, we'll explore the most common Nigerian spices, their uses, and health benefits.

## Essential Nigerian Spices

### 1. Uda (Negro Pepper)
Uda adds a pungent, aromatic flavor to soups and stews. It's often used in traditional pepper soup and is known for its medicinal properties that aid digestion.

### 2. Uziza
Both the leaves and seeds of uziza are used in Nigerian cooking. The seeds have a peppery, spicy flavor and are often used in soups like Nsala soup.

### 3. Ehuru (Calabash Nutmeg)
This spice resembles nutmeg but has a unique flavor that's slightly milder. It's commonly used in soups and stews from Eastern Nigeria.

### 4. Iru (Locust Bean)
Fermented locust beans (Iru) are used as a flavoring agent in many Nigerian dishes. It adds a deep, umami flavor to soups and stews.

### 5. Cameroon Pepper
This hot, smoky pepper is essential in Nigerian cooking, particularly in jollof rice and stews.

## Health Benefits

Most Nigerian spices offer numerous health benefits:
- Anti-inflammatory properties
- Antimicrobial effects
- Digestive aid
- Rich in antioxidants

Visit our store to explore our curated selection of premium Nigerian spices!
            `,
            imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
            authorId: admin.id,
            published: true,
            categoryId: spicesCategoryId
          },
          {
            title: "How to Make the Perfect Jollof Rice",
            slug: "perfect-jollof-rice-recipe",
            excerpt: "Learn the secrets to making the most delicious, perfectly cooked Nigerian jollof rice with this step-by-step guide.",
            content: `
# How to Make the Perfect Jollof Rice

Jollof rice is arguably the most famous dish in West Africa, with Nigeria and Ghana constantly debating who makes it better (we know the answer to that!). Here's our foolproof recipe for making authentic Nigerian jollof rice.

## Ingredients

- 3 cups of long-grain parboiled rice
- 8 large plum tomatoes
- 2 red bell peppers
- 3 scotch bonnet peppers (adjust to taste)
- 2 medium onions
- 1/3 cup vegetable oil
- 2 tablespoons tomato paste
- 3 cups chicken or vegetable stock
- 1 teaspoon each of curry powder and dried thyme
- 2 bay leaves
- 1 teaspoon of our SpicePop Jollof Rice Spice Mix
- Salt to taste

## Instructions

### 1. Prepare the Base
Blend tomatoes, red bell peppers, scotch bonnet peppers, and one onion until smooth. Dice the remaining onion.

### 2. Cook the Sauce
- Heat oil in a large pot and sauté the diced onions until translucent.
- Add tomato paste and fry for 2-3 minutes.
- Pour in the blended mixture and cook on medium heat for 15-20 minutes until reduced by half.
- Add curry powder, thyme, bay leaves, and SpicePop Jollof Rice Spice Mix.

### 3. Add Rice
- Wash rice until water runs clear, then add to the pot.
- Add stock, stir well, and cover with foil and a tight-fitting lid.
- Reduce heat to low and simmer for 30 minutes.
- After 30 minutes, stir gently, add more stock if needed, and cook for another 15 minutes.

### 4. The Party Trick
For that authentic smoky flavor, increase the heat for the last 3-5 minutes to allow the bottom layer to create that beloved crust (but don't burn it!).

Serve with plantains, grilled chicken, or fish for a complete Nigerian feast!

Visit our shop to purchase our special Jollof Rice Spice Mix that makes this recipe even more flavorful!
            `,
            imageUrl: "https://images.unsplash.com/photo-1644213410192-74d9b29df7e8?w=800&q=80",
            authorId: admin.id,
            published: true,
            categoryId: recipesCategoryId
          },
          {
            title: "Health Benefits of Nigerian Superfoods",
            slug: "health-benefits-nigerian-superfoods",
            excerpt: "Explore the nutritional powerhouses found in traditional Nigerian cuisine and how they can improve your health.",
            content: `
# Health Benefits of Nigerian Superfoods

Nigerian cuisine isn't just delicious—it's packed with nutritious superfoods that have been used for generations. Here's why you should incorporate these traditional Nigerian foods into your diet.

## Top Nigerian Superfoods

### 1. Egusi Seeds
These melon seeds are rich in protein, healthy fats, and essential minerals. When ground, they create a thick, creamy base for soups that's both nutritious and satisfying.

**Benefits:**
- High protein content
- Rich in zinc and magnesium
- Good source of healthy fats

### 2. Bitter Leaf (Vernonia)
This leafy vegetable has a distinctive bitter taste that mellows with cooking. It's a staple in many Nigerian soups.

**Benefits:**
- Natural detoxifier
- Anti-inflammatory properties
- May help regulate blood sugar

### 3. Uda (Negro Pepper)
Beyond its culinary uses, Uda is valued for its medicinal properties.

**Benefits:**
- Supports digestive health
- Anti-microbial properties
- Used traditionally for respiratory conditions

### 4. Ogbono Seeds
These seeds (from African bush mango) are used to make a popular Nigerian soup and have impressive nutritional benefits.

**Benefits:**
- Weight management support
- Cholesterol-lowering properties
- High in fiber

### 5. Tiger Nuts (Ofio)
These small tubers are used to make a refreshing drink called "Kunun Aya" and are packed with nutrients.

**Benefits:**
- Prebiotic properties for gut health
- Rich in vitamin E and magnesium
- Heart-healthy fats

Visit our store to explore our selection of these traditional Nigerian superfoods and elevate both your cooking and your health!
            `,
            imageUrl: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=800&q=80",
            authorId: admin.id,
            published: true,
            categoryId: spicesCategoryId
          }
        ];

        for (const post of blogPosts) {
          await this.createBlogPost(post);
        }
      }
    } catch (error) {
      console.error("Error seeding blog posts:", error);
    }
  }
}

// Create and export database storage instance
export const storage = new DatabaseStorage();

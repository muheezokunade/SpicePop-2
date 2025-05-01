const { db } = require('./db');
const { eq, and } = require('drizzle-orm');
const { users, categories, products, blogPosts, settings } = require('./schema');

const storage = {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  },

  async getCategories() {
    return await db.select().from(categories);
  },

  async getCategoryBySlug(slug) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  },

  async getProducts() {
    return await db.select().from(products);
  },

  async getProductBySlug(slug) {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  },

  async getProductsByCategory(categoryId) {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  },

  async getPublishedBlogPosts() {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true));
  },

  async getBlogPostBySlug(slug) {
    const [post] = await db.select().from(blogPosts).where(
      and(eq(blogPosts.slug, slug), eq(blogPosts.published, true))
    );
    return post;
  },

  async getSettings() {
    return await db.select().from(settings);
  },

  async seedInitialData() {
    // Add your seed data logic here
    console.log('Seeding initial data...');
  }
};

module.exports = { storage }; 
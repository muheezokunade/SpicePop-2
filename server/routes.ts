import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { z } from "zod";
import { 
  insertCategorySchema, 
  insertProductSchema, 
  insertOrderSchema,
  insertUserSchema,
  insertBlogPostSchema
} from "../shared/schema.js";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Authentication middleware for admin routes
  const requireAuth = async (req: Request, res: Response, next: Function) => {
    // For simplicity, we'll use a basic auth header in this example
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Decode credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    // Check if valid admin user
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password || !user.isAdmin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    next();
  };

  // Authentication
  router.post('/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Set auth in header for future requests
      res.setHeader('Authorization', `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`);
      
      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Check current authentication
  router.get('/auth/check', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Decode credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
      
      if (!username || !password) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Check if valid admin user
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password || !user.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Categories
  router.get('/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/categories/:id', async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.post('/categories', requireAuth, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.put('/categories/:id', requireAuth, async (req, res) => {
    try {
      // Only validate fields that are provided
      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, data);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.delete('/categories/:id', requireAuth, async (req, res) => {
    try {
      const result = await storage.deleteCategory(req.params.id);
      
      if (!result) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Products
  router.get('/products', async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      let products;
      
      if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.post('/products', requireAuth, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.put('/products/:id', requireAuth, async (req, res) => {
    try {
      // Only validate fields that are provided
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, data);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.delete('/products/:id', requireAuth, async (req, res) => {
    try {
      const result = await storage.deleteProduct(req.params.id);
      
      if (!result) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Orders
  router.get('/orders', requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/orders/:id', requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.post('/orders', async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.patch('/orders/:id/status', requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      const validStatus = z.enum(['pending', 'paid', 'shipped', 'delivered']).parse(status);
      const order = await storage.updateOrderStatus(req.params.id, validStatus);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Settings
  router.get('/settings', async (req, res) => {
    try {
      const settings = await storage.getSettings();
      
      // Convert to key-value object
      const settingsObject = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
      
      res.json(settingsObject);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.put('/settings/:key', requireAuth, async (req, res) => {
    try {
      const { value } = req.body;
      
      if (value === undefined) {
        return res.status(400).json({ message: 'Value is required' });
      }
      
      const setting = await storage.updateSetting(req.params.key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Blog Posts
  router.get('/blog', async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/blog/all', requireAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/blog/category/:categoryId', async (req, res) => {
    try {
      const posts = await storage.getBlogPostsByCategory(req.params.categoryId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get blog post by ID (for admin editing)
  router.get('/blog/id/:id', requireAuth, async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/blog/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.post('/blog', requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.put('/blog/:id', requireAuth, async (req, res) => {
    try {
      // Only validate fields that are provided
      const data = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, data);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.delete('/blog/:id', requireAuth, async (req, res) => {
    try {
      const result = await storage.deleteBlogPost(req.params.id);
      
      if (!result) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // SEO files routes (sitemap and robots.txt)
  router.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.sendFile('sitemap.xml', { root: './public' });
  });
  
  router.get('/robots.txt', (req, res) => {
    res.sendFile('robots.txt', { root: './public' });
  });
  
  // Register routes
  app.use('/api', router);

  // Also add root-level routes for SEO files
  app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.sendFile('sitemap.xml', { root: './public' });
  });
  
  app.get('/robots.txt', (req, res) => {
    res.sendFile('robots.txt', { root: './public' });
  });

  const httpServer = createServer(app);
  return httpServer;
}

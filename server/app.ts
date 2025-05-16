import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { storage } from './storage.js';
import { db } from './db.js';
import { settings } from '../shared/schema.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Security middleware - general rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: "Too many requests, please try again later." },
  skipSuccessfulRequests: true // Don't count successful requests against the limit
});

// Special limiter for read-heavy endpoints (GET requests)
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: "Too many read requests, please try again later." },
  skipSuccessfulRequests: true
});

// Stricter limiter for write operations (POST/PUT/DELETE requests)
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: "Too many write requests, please try again later." }
});

// Apply rate limiting based on HTTP method
app.use((req, res, next) => {
  if (req.method === 'GET') {
    return readLimiter(req, res, next);
  } else if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return writeLimiter(req, res, next);
  } else {
    return generalLimiter(req, res, next);
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://spicepopp.netlify.app', 'https://spicepop-backend.onrender.com']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

app.use(session(sessionConfig));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy(async (username: string, password: string, done: any) => {
  try {
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    
    // Compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return done(null, false, { message: "Incorrect password." });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Initialize database and seed data
const initializeDatabase = async () => {
  try {
    console.log("[express] Initializing database tables...");
    
    // First, try a simple database query to validate connection
    try {
      const result = await db.select().from(settings).limit(1);
      console.log("[express] Database connection validated:", result.length ? "Settings found" : "No settings found");
    } catch (error) {
      console.error("[express] Database connection check failed:", error);
      console.log("[express] Will continue with initialization attempt anyway");
    }
    
    console.log("[express] Seeding initial data...");
    
    // Try to seed data but don't let it crash the app if it fails
    try {
      // Start seeding with longer delays between operations
      // This will ensure we're not hitting rate limits
      const progressiveSeed = async () => {
        try {
          // First, seed admin user only and wait
          await storage.seedAdminOnly();
          console.log("[express] Admin user seeded");
          
          // Wait 3 seconds before continuing
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Then seed categories with a longer delay
          await storage.seedCategoriesOnly();
          console.log("[express] Categories seeded");
          
          // Wait 3 seconds before continuing
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Seed products
          await storage.seedProductsOnly();
          console.log("[express] Products seeded");
          
          // Wait 3 seconds before continuing
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Seed settings
          await storage.seedSettingsOnly();
          console.log("[express] Settings seeded");
          
          // Wait 3 seconds before continuing
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Finally seed blog posts
          await storage.seedBlogPostsOnly();
          console.log("[express] Blog posts seeded");
          
          return true;
        } catch (error) {
          console.error("[express] Progressive seeding failed:", error);
          return false;
        }
      };
      
      // Try the progressive seeding approach
      const progressiveSuccess = await progressiveSeed();
      
      if (progressiveSuccess) {
        console.log("[express] Database initialization complete with progressive seeding");
      } else {
        // Fall back to regular seeding if progressive failed
        console.log("[express] Falling back to regular seeding");
        await storage.seedInitialData();
        console.log("[express] Database initialization complete with regular seeding");
      }
    } catch (seedError) {
      console.error("Error seeding initial data:", seedError);
      console.log("[express] Application will continue without initial seed data");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    console.log("[express] Application will continue without database initialization");
  }
};

// Add this middleware for authorization
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Routes
app.post("/api/auth/login", async (req: Request, res: Response) => {
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

app.get("/api/auth/check", async (req: Request, res: Response) => {
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

app.get("/api/logout", (req: Request, res: Response) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

// Protected route example
app.get("/api/profile", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

// Cache objects
let categoriesCache: any[] = [];
let productCache: any[] = [];
let lastCategoriesFetch = 0;
let lastProductsFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache for products by category
const productsByCategoryCache: Record<string, { data: any[], timestamp: number }> = {};

// Helper function to add request timeout
const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]) as Promise<T>;
};

// Categories
app.get("/api/categories", async (req: Request, res: Response) => {
  const now = Date.now();
  try {
    // Return cached data if still valid
    if (categoriesCache.length > 0 && now - lastCategoriesFetch < CACHE_TTL) {
      return res.json(categoriesCache);
    }
    
    // Set timeout to 5 seconds
    const categories = await withTimeout(storage.getCategories(), 5000);
    
    // Update cache
    categoriesCache = categories;
    lastCategoriesFetch = now;
    
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    
    // If we have a cache but it's expired, still use it in case of errors
    if (categoriesCache.length > 0) {
      console.log("Serving stale categories cache due to error");
      return res.json(categoriesCache);
    }
    
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Add the POST endpoint for categories
app.post("/api/categories", requireAuth, async (req: Request, res: Response) => {
  try {
    const category = await storage.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category" });
  }
});

// Add the PUT endpoint for categories
app.put("/api/categories/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const category = await storage.updateCategory(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category" });
  }
});

// Add the DELETE endpoint for categories
app.delete("/api/categories/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await storage.deleteCategory(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
});

app.get("/api/categories/:slug", async (req: Request, res: Response) => {
  try {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category" });
  }
});

// Products
app.get("/api/products", async (req: Request, res: Response) => {
  const now = Date.now();
  try {
    // Return cached data if still valid
    if (productCache.length > 0 && now - lastProductsFetch < CACHE_TTL) {
      return res.json(productCache);
    }
    
    // Set timeout to 5 seconds
    const products = await withTimeout(storage.getProducts(), 5000);
    
    // Update cache
    productCache = products;
    lastProductsFetch = now;
    
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // If we have a cache but it's expired, still use it in case of errors
    if (productCache.length > 0) {
      console.log("Serving stale products cache due to error");
      return res.json(productCache);
    }
    
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    // First check if the parameter is a UUID (ID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(req.params.id)) {
      // It's an ID, get by ID
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    } else {
      // It's a slug, get by slug
      const product = await storage.getProductBySlug(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Add POST endpoint for products
app.post("/api/products", requireAuth, async (req: Request, res: Response) => {
  try {
    const product = await storage.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

// Add PUT endpoint for products
app.put("/api/products/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const product = await storage.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

// Add DELETE endpoint for products
app.delete("/api/products/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await storage.deleteProduct(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

app.get("/api/categories/:categoryId/products", async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const now = Date.now();
  
  try {
    // Check cache first
    const cachedData = productsByCategoryCache[categoryId];
    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      return res.json(cachedData.data);
    }
    
    // Set timeout to 5 seconds
    const products = await withTimeout(storage.getProductsByCategory(categoryId), 5000);
    
    // Update cache
    productsByCategoryCache[categoryId] = {
      data: products,
      timestamp: now
    };
    
    res.json(products);
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    
    // If we have a cache but it's expired, still use it in case of errors
    const cachedData = productsByCategoryCache[categoryId];
    if (cachedData) {
      console.log(`Serving stale products cache for category ${categoryId} due to error`);
      return res.json(cachedData.data);
    }
    
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Blog posts
app.get("/api/blog", async (req: Request, res: Response) => {
  try {
    const posts = await storage.getPublishedBlogPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog posts" });
  }
});

app.get("/api/blog/:slug", async (req: Request, res: Response) => {
  try {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog post" });
  }
});

// Settings
app.get("/api/settings", async (req: Request, res: Response) => {
  try {
    const settings = await storage.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings" });
  }
});

// Health check endpoint
app.get('/api/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Basic status endpoint that doesn't require database access
app.get('/status', (_, res) => {
  res.status(200).json({
    status: 'Service is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});

// Middleware to apply timeout to all API requests
const timeoutMiddleware = (timeout = 15000) => (req: Request, res: Response, next: NextFunction) => {
  // Only apply timeout to API routes
  if (!req.path.startsWith('/api/')) {
    return next();
  }
  
  // Set a timeout to automatically respond if the request takes too long
  const timeoutId = setTimeout(() => {
    console.error(`Request to ${req.method} ${req.path} timed out after ${timeout}ms`);
    
    // Check if response has already been sent
    if (res.headersSent) {
      return;
    }
    
    res.status(504).json({
      error: 'Gateway Timeout',
      message: 'The request took too long to process'
    });
  }, timeout);
  
  // Clear the timeout when the response is sent
  const originalEnd = res.end;
  // @ts-ignore - We're monkey patching the response object
  res.end = function(chunk: any, encoding: BufferEncoding, callback?: () => void) {
    clearTimeout(timeoutId);
    return originalEnd.call(this, chunk, encoding, callback);
  };
  
  next();
};

// Apply the timeout middleware before routes
app.use(timeoutMiddleware(15000)); // 15 second timeout

// Initialize database on startup
initializeDatabase();

export default app; 
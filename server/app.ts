import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { storage } from './storage';
import { db } from './db';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

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
    if (user.password !== password) {
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
    console.log("[express] Seeding initial data...");
    await storage.seedInitialData();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Routes
app.post("/api/login", passport.authenticate("local"), (req: Request, res: Response) => {
  res.json({ message: "Logged in successfully" });
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

// Categories
app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
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
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.get("/api/products/:slug", async (req: Request, res: Response) => {
  try {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

app.get("/api/categories/:categoryId/products", async (req: Request, res: Response) => {
  try {
    const products = await storage.getProductsByCategory(req.params.categoryId);
    res.json(products);
  } catch (error) {
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

// Initialize database on startup
initializeDatabase();

export default app; 
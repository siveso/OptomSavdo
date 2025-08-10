import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProductSchema, insertCategorySchema, insertCartItemSchema, insertReviewSchema, insertTestimonialSchema, insertOrderSchema, insertBlogPostSchema, insertSeoSettingsSchema, insertMarketingMessageSchema, insertAdminUserSchema } from "@shared/schema";
import { adminAssistant } from "./ai/adminAssistant";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", isAuthenticated, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const {
        categoryId,
        search,
        featured,
        isNew,
        limit = 20,
        offset = 0,
      } = req.query;

      const filters = {
        categoryId: categoryId as string,
        search: search as string,
        featured: featured === "true",
        isNew: isNew === "true",
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Cart routes
  app.get("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId,
      });
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const { quantity } = z.object({ quantity: z.number().min(1) }).parse(req.body);
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(400).json({ message: "Invalid quantity" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.removeCartItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Review routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId,
        productId: req.params.id,
      });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Admin middleware function
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const isAdminUser = await storage.isAdmin(userId);
      if (!isAdminUser) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      next();
    } catch (error) {
      console.error("Admin check error:", error);
      res.status(500).json({ message: "Failed to verify admin status" });
    }
  };

  // Admin routes
  
  // Admin Orders
  app.get("/api/admin/orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      const filters = {
        status: status as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };
      
      const orders = await storage.getOrders(filters);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.patch("/api/admin/orders/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Valid status required" });
      }
      
      const order = await storage.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Admin Blog Posts
  app.get("/api/admin/blog", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { published, limit = 20, offset = 0 } = req.query;
      const filters = {
        published: published === "true" ? true : published === "false" ? false : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };
      
      const posts = await storage.getBlogPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  app.patch("/api/admin/blog/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const updateData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, updateData);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ message: "Failed to update blog post" });
    }
  });

  app.patch("/api/admin/blog/:id/publish", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const post = await storage.publishBlogPost(req.params.id);
      res.json(post);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      res.status(500).json({ message: "Failed to publish blog post" });
    }
  });

  // SEO Settings
  app.get("/api/admin/seo", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settings = await storage.getSeoSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
      res.status(500).json({ message: "Failed to fetch SEO settings" });
    }
  });

  app.post("/api/admin/seo", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const seoData = insertSeoSettingsSchema.parse(req.body);
      const settings = await storage.updateSeoSettings(seoData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      res.status(400).json({ message: "Invalid SEO settings data" });
    }
  });

  // Marketing Messages
  app.get("/api/admin/marketing", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { type, status, limit = 20 } = req.query;
      const filters = {
        type: type as string,
        status: status as string,
        limit: parseInt(limit as string),
      };
      
      const messages = await storage.getMarketingMessages(filters);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching marketing messages:", error);
      res.status(500).json({ message: "Failed to fetch marketing messages" });
    }
  });

  app.post("/api/admin/marketing", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const messageData = insertMarketingMessageSchema.parse(req.body);
      const message = await storage.createMarketingMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating marketing message:", error);
      res.status(400).json({ message: "Invalid marketing message data" });
    }
  });

  app.patch("/api/admin/marketing/:id/schedule", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { scheduledAt } = req.body;
      if (!scheduledAt) {
        return res.status(400).json({ message: "Scheduled date required" });
      }
      
      const message = await storage.scheduleMarketingMessage(req.params.id, new Date(scheduledAt));
      res.json(message);
    } catch (error) {
      console.error("Error scheduling marketing message:", error);
      res.status(500).json({ message: "Failed to schedule marketing message" });
    }
  });

  // Admin User Management
  app.post("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const adminData = insertAdminUserSchema.parse(req.body);
      const adminUser = await storage.createAdminUser(adminData);
      res.status(201).json(adminUser);
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(400).json({ message: "Invalid admin user data" });
    }
  });

  // AI Assistant Routes
  app.get("/api/admin/ai/recommendations", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders({ limit: 100 });
      const blogPosts = await storage.getBlogPosts({ limit: 100 });
      const marketingMessages = await storage.getMarketingMessages({ limit: 100 });
      
      const adminData = {
        totalOrders: orders.length,
        pendingOrders: orders.filter((order: any) => order.status === 'pending').length,
        publishedPosts: blogPosts.filter((post: any) => post.isPublished).length,
        draftPosts: blogPosts.filter((post: any) => !post.isPublished).length,
        scheduledMessages: marketingMessages.filter((msg: any) => msg.status === 'scheduled').length,
        recentProducts: [] // Products data will be added when needed
      };

      const recommendations = await adminAssistant.getAdminRecommendations(adminData);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      res.status(500).json({ message: "Failed to get AI recommendations" });
    }
  });

  app.post("/api/admin/ai/blog-suggest", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { topic, keywords = [] } = req.body;
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const suggestion = await adminAssistant.generateBlogPostSuggestion(topic, keywords);
      res.json(suggestion);
    } catch (error) {
      console.error("Error generating blog suggestion:", error);
      res.status(500).json({ message: "Failed to generate blog suggestion" });
    }
  });

  app.post("/api/admin/ai/marketing-suggest", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { type, purpose, targetAudience, products, promotion } = req.body;
      if (!type || !purpose || !targetAudience) {
        return res.status(400).json({ message: "Type, purpose, and target audience are required" });
      }

      const suggestion = await adminAssistant.generateMarketingMessage({
        type,
        purpose,
        targetAudience,
        products,
        promotion
      });
      res.json(suggestion);
    } catch (error) {
      console.error("Error generating marketing suggestion:", error);
      res.status(500).json({ message: "Failed to generate marketing suggestion" });
    }
  });

  app.post("/api/admin/ai/optimize-product", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { name, description, category, price, features } = req.body;
      if (!name || !description || !category || !price) {
        return res.status(400).json({ message: "Name, description, category, and price are required" });
      }

      const optimization = await adminAssistant.optimizeProductDescription({
        name,
        description,
        category,
        price,
        features
      });
      res.json(optimization);
    } catch (error) {
      console.error("Error optimizing product:", error);
      res.status(500).json({ message: "Failed to optimize product description" });
    }
  });

  app.post("/api/admin/ai/analyze-seo", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { title, description, keywords, pages = [] } = req.body;
      
      const analysis = await adminAssistant.analyzeSEO({
        title,
        description,
        keywords,
        pages
      });
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing SEO:", error);
      res.status(500).json({ message: "Failed to analyze SEO" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

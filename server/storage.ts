import {
  users,
  categories,
  products,
  cartItems,
  reviews,
  testimonials,
  orders,
  orderItems,
  blogPosts,
  seoSettings,
  marketingMessages,
  adminUsers,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Review,
  type InsertReview,
  type Testimonial,
  type InsertTestimonial,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type BlogPost,
  type InsertBlogPost,
  type SeoSettings,
  type InsertSeoSettings,
  type MarketingMessage,
  type InsertMarketingMessage,
  type AdminUser,
  type InsertAdminUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, ilike, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(filters?: {
    categoryId?: string;
    search?: string;
    featured?: boolean;
    isNew?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  
  // Cart operations
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeCartItem(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Review operations
  getProductReviews(productId: string): Promise<(Review & { user: User })[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Testimonials operations
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Admin operations
  isAdmin(userId: string): Promise<boolean>;
  createAdminUser(adminData: InsertAdminUser): Promise<AdminUser>;
  
  // Order operations
  getOrders(filters?: { status?: string; limit?: number; offset?: number }): Promise<(Order & { user: User; items: (OrderItem & { product: Product })[] })[]>;
  getOrder(id: string): Promise<(Order & { user: User; items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  
  // Blog operations
  getBlogPosts(filters?: { published?: boolean; limit?: number; offset?: number }): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(postData: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, postData: Partial<InsertBlogPost>): Promise<BlogPost>;
  publishBlogPost(id: string): Promise<BlogPost>;
  
  // SEO operations
  getSeoSettings(): Promise<SeoSettings | undefined>;
  updateSeoSettings(seoData: InsertSeoSettings): Promise<SeoSettings>;
  
  // Marketing operations
  getMarketingMessages(filters?: { type?: string; status?: string; limit?: number }): Promise<MarketingMessage[]>;
  createMarketingMessage(messageData: InsertMarketingMessage): Promise<MarketingMessage>;
  scheduleMarketingMessage(id: string, scheduledAt: Date): Promise<MarketingMessage>;
  markMessageSent(id: string): Promise<MarketingMessage>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }
  
  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }
  
  // Product operations
  async getProducts(filters: {
    categoryId?: string;
    search?: string;
    featured?: boolean;
    isNew?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<Product[]> {
    const conditions = [eq(products.isActive, true)];
    
    if (filters.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters.search) {
      conditions.push(ilike(products.name, `%${filters.search}%`));
    }
    
    if (filters.featured) {
      conditions.push(eq(products.isFeatured, true));
    }
    
    if (filters.isNew) {
      conditions.push(eq(products.isNew, true));
    }
    
    let query = db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt));
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }
  
  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }
  
  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }
  
  // Cart operations
  async getCartItems(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId))
      .then(rows => 
        rows.map(row => ({
          ...row.cart_items,
          product: row.products!,
        }))
      );
  }
  
  async addToCart(cartItemData: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItemData.userId),
          eq(cartItems.productId, cartItemData.productId),
          eq(cartItems.isWholesale, cartItemData.isWholesale || false)
        )
      );
    
    if (existingItem) {
      // Update quantity
      return await this.updateCartItem(existingItem.id, existingItem.quantity + cartItemData.quantity);
    } else {
      // Create new cart item
      const [cartItem] = await db.insert(cartItems).values(cartItemData).returning();
      return cartItem;
    }
  }
  
  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem;
  }
  
  async removeCartItem(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }
  
  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }
  
  // Review operations
  async getProductReviews(productId: string): Promise<(Review & { user: User })[]> {
    return await db
      .select()
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .then(rows =>
        rows.map(row => ({
          ...row.reviews,
          user: row.users!,
        }))
      );
  }
  
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }
  
  // Testimonials operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(desc(testimonials.createdAt));
  }
  
  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(testimonialData).returning();
    return testimonial;
  }

  // Admin operations
  async isAdmin(userId: string): Promise<boolean> {
    const [adminUser] = await db
      .select()
      .from(adminUsers)
      .where(and(eq(adminUsers.userId, userId), eq(adminUsers.isActive, true)));
    return !!adminUser;
  }

  async createAdminUser(adminData: InsertAdminUser): Promise<AdminUser> {
    const [adminUser] = await db.insert(adminUsers).values(adminData).returning();
    return adminUser;
  }

  // Order operations
  async getOrders(filters: { status?: string; limit?: number; offset?: number } = {}): Promise<any[]> {
    let query = db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    if (filters.status) {
      query = query.where(eq(orders.status, filters.status));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const ordersData = await query;
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(
      ordersData.map(async (orderRow) => {
        const items = await db
          .select()
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, orderRow.orders.id));

        return {
          ...orderRow.orders,
          user: orderRow.users!,
          items: items.map(item => ({
            ...item.order_items,
            product: item.products!,
          })),
        };
      })
    );

    return ordersWithItems;
  }

  async getOrder(id: string): Promise<any | undefined> {
    const [orderRow] = await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, id));

    if (!orderRow) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    return {
      ...orderRow.orders,
      user: orderRow.users!,
      items: items.map(item => ({
        ...item.order_items,
        product: item.products!,
      })),
    };
  }

  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    
    // Add order items
    const orderItemsData = items.map(item => ({
      ...item,
      orderId: order.id,
    }));
    
    await db.insert(orderItems).values(orderItemsData);
    
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Blog operations
  async getBlogPosts(filters: { published?: boolean; limit?: number; offset?: number } = {}): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));

    if (filters.published !== undefined) {
      query = query.where(eq(blogPosts.isPublished, filters.published));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(postData).returning();
    return post;
  }

  async updateBlogPost(id: string, postData: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async publishBlogPost(id: string): Promise<BlogPost> {
    const [post] = await db
      .update(blogPosts)
      .set({ isPublished: true, publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  // SEO operations
  async getSeoSettings(): Promise<SeoSettings | undefined> {
    const [settings] = await db.select().from(seoSettings);
    return settings;
  }

  async updateSeoSettings(seoData: InsertSeoSettings): Promise<SeoSettings> {
    const existing = await this.getSeoSettings();
    
    if (existing) {
      const [settings] = await db
        .update(seoSettings)
        .set({ ...seoData, updatedAt: new Date() })
        .where(eq(seoSettings.id, existing.id))
        .returning();
      return settings;
    } else {
      const [settings] = await db.insert(seoSettings).values(seoData).returning();
      return settings;
    }
  }

  // Marketing operations
  async getMarketingMessages(filters: { type?: string; status?: string; limit?: number } = {}): Promise<MarketingMessage[]> {
    const conditions = [];

    if (filters.type) {
      conditions.push(eq(marketingMessages.type, filters.type));
    }

    if (filters.status) {
      conditions.push(eq(marketingMessages.status, filters.status));
    }

    let query = db
      .select()
      .from(marketingMessages)
      .orderBy(desc(marketingMessages.createdAt));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async createMarketingMessage(messageData: InsertMarketingMessage): Promise<MarketingMessage> {
    const [message] = await db.insert(marketingMessages).values(messageData).returning();
    return message;
  }

  async scheduleMarketingMessage(id: string, scheduledAt: Date): Promise<MarketingMessage> {
    const [message] = await db
      .update(marketingMessages)
      .set({ scheduledAt, status: "scheduled" })
      .where(eq(marketingMessages.id, id))
      .returning();
    return message;
  }

  async markMessageSent(id: string): Promise<MarketingMessage> {
    const [message] = await db
      .update(marketingMessages)
      .set({ sentAt: new Date(), status: "sent" })
      .where(eq(marketingMessages.id, id))
      .returning();
    return message;
  }
}

export const storage = new DatabaseStorage();

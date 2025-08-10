import {
  users,
  categories,
  products,
  cartItems,
  reviews,
  testimonials,
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
}

export const storage = new DatabaseStorage();

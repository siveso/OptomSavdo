import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  nameUz: varchar("name_uz", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  parentId: varchar("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  nameUz: varchar("name_uz", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  description: text("description"),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionEn: text("description_en"),
  categoryId: varchar("category_id").notNull(),
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }).notNull(),
  wholesalePrice: decimal("wholesale_price", { precision: 10, scale: 2 }).notNull(),
  wholesaleMinQuantity: integer("wholesale_min_quantity").default(10),
  stockQuantity: integer("stock_quantity").default(0),
  images: text("images").array(),
  videoUrl: varchar("video_url"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  isWholesale: boolean("is_wholesale").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  productId: varchar("product_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  nameUz: varchar("name_uz", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }),
  positionUz: varchar("position_uz", { length: 255 }),
  positionRu: varchar("position_ru", { length: 255 }),
  positionEn: varchar("position_en", { length: 255 }),
  content: text("content").notNull(),
  contentUz: text("content_uz").notNull(),
  contentRu: text("content_ru").notNull(),
  contentEn: text("content_en").notNull(),
  rating: integer("rating").default(5),
  avatar: varchar("avatar"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  reviews: many(reviews),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

// Types (existing tables)
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// TODO: Admin panel types will be added after table definitions

// Admin panel tables
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, confirmed, shipped, delivered, cancelled
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"), // pending, paid, failed
  shippingAddress: text("shipping_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isWholesale: boolean("is_wholesale").default(false),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 500 }).notNull(),
  titleUz: varchar("title_uz", { length: 500 }).notNull(),
  titleRu: varchar("title_ru", { length: 500 }).notNull(),
  titleEn: varchar("title_en", { length: 500 }).notNull(),
  content: text("content").notNull(),
  contentUz: text("content_uz").notNull(),
  contentRu: text("content_ru").notNull(),
  contentEn: text("content_en").notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  featuredImage: varchar("featured_image"),
  metaDescription: text("meta_description"),
  generatedByAI: boolean("generated_by_ai").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const seoSettings = pgTable("seo_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  googleAnalyticsId: varchar("google_analytics_id"),
  metaPixelId: varchar("meta_pixel_id"),
  customHeadCode: text("custom_head_code"),
  siteName: varchar("site_name"),
  siteDescription: text("site_description"),
  siteKeywords: text("site_keywords"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketingMessages = pgTable("marketing_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type", { length: 50 }).notNull(), // telegram, email, sms
  title: varchar("title", { length: 500 }),
  content: text("content").notNull(),
  targetAudience: varchar("target_audience", { length: 100 }),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  status: varchar("status", { length: 50 }).default("draft"), // draft, scheduled, sent, failed
  generatedByAI: boolean("generated_by_ai").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  role: varchar("role", { length: 50 }).default("admin"), // admin, super_admin
  permissions: text("permissions").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin panel types
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({
  id: true,
  updatedAt: true,
});
export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;

export const insertMarketingMessageSchema = createInsertSchema(marketingMessages).omit({
  id: true,
  createdAt: true,
});
export type InsertMarketingMessage = z.infer<typeof insertMarketingMessageSchema>;
export type MarketingMessage = typeof marketingMessages.$inferSelect;

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Admin panel relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const adminUsersRelations = relations(adminUsers, ({ one }) => ({
  user: one(users, {
    fields: [adminUsers.userId],
    references: [users.id],
  }),
}));

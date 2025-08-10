# OptomSavdo E-commerce Platform

## Overview

OptomSavdo is a comprehensive e-commerce platform designed for wholesale and retail trade in Uzbekistan. The application serves as a marketplace connecting businesses with customers, offering multi-language support (Uzbek, Russian, English) and specialized wholesale pricing tiers. The platform features a modern React frontend with a robust Express.js backend, designed to handle product catalogs, user management, shopping carts, and order processing with integrated authentication via Replit Auth.

## User Preferences

Preferred communication style: Simple, everyday language.
Language preference: Uzbek/Russian for UI (multi-language support)
Project focus: AI-powered e-commerce with automated marketing features

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: Custom i18n solution supporting Uzbek, Russian, and English languages

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Design**: RESTful API architecture with structured error handling
- **Development**: Hot module replacement via Vite integration in development mode

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Tables**: 
  - Users (mandatory for Replit Auth)
  - Sessions (mandatory for Replit Auth)
  - Products with multi-language support
  - Categories with hierarchical structure
  - Shopping cart with wholesale/retail pricing
  - Reviews and testimonials
- **Data Validation**: Zod schemas shared between frontend and backend

### Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed session store
- **User Management**: Automatic user creation and profile management
- **Security**: Secure cookie configuration with httpOnly and secure flags

### API Structure
- **Authentication Routes**: `/api/auth/*` for login/logout and user management
- **Product Routes**: `/api/products` with filtering, search, and categorization
- **Category Routes**: `/api/categories` for product organization
- **Cart Routes**: `/api/cart` for shopping cart management
- **Review Routes**: `/api/products/:id/reviews` for customer feedback
- **Error Handling**: Structured error responses with appropriate HTTP status codes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless database driver
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **@tanstack/react-query**: Server state management for React
- **openid-client**: OpenID Connect client for Replit Auth
- **express-session**: Session middleware for Express
- **connect-pg-simple**: PostgreSQL session store

### UI & Styling
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Icon library with React components

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **zod**: Runtime type validation and schema generation
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit development integration

### Third-party Services
- **Replit Auth**: Authentication service with OpenID Connect
- **Neon Database**: Serverless PostgreSQL hosting
- **Unsplash**: Image hosting for product and promotional images
- **Google Fonts**: Web font delivery (Inter font family)

### Build & Deployment
- **esbuild**: Fast JavaScript bundler for production server builds
- **tsx**: TypeScript execution engine for development
- **Node.js**: Runtime environment with ES modules support
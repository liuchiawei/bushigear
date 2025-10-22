# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The project uses pnpm as the package manager. Key commands:

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production (runs db push, generate, then build)
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Commands (Prisma)

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run database migrations

## Architecture Overview

This is a Japanese e-commerce site for martial arts equipment (ブシギア) built with Next.js 15 and React 19.

### Key Technologies

- **Next.js 15.3.5** with App Router and Turbopack
- **React 19.0.0** for UI components
- **Prisma ORM 6.15.0** with PostgreSQL (Neon serverless via @neondatabase/serverless)
- **NextAuth 5.0.0-beta.29** for authentication
- **AI Integration** using Vercel AI SDK with OpenAI (gpt-4o-mini, DALL-E 3)
- **Styling** with Tailwind CSS v4 and shadcn/ui components
- **Internationalization** supporting Japanese, English, and Chinese
- **Motion** library (v12.23.3) for animations
- **Markdown** rendering with react-markdown and marked
- **Icons** from Lucide React

### Directory Structure

#### `/src/app/` - Next.js App Router pages and API routes

**Pages:**
- `/(index)/page.tsx` - Homepage with hero sections and product showcases
- `/ai/page.tsx` - AI assistant chat interface
- `/cart/page.tsx` - Shopping cart page
- `/checkout/page.tsx` - Checkout flow
- `/category/page.tsx` - Category listing page
- `/category/[category]/page.tsx` - Dynamic category pages
- `/products/page.tsx` - All products listing
- `/products/[id]/page.tsx` - Individual product detail pages
- `/login/page.tsx` - User login
- `/register/page.tsx` - User registration
- `/dashboard/page.tsx` - User dashboard
- `/members/page.tsx` - Members area
- `/orders/page.tsx` - Order history

**API Routes:**
- `/api/chat/route.ts` - AI chat endpoint with OpenAI gpt-4o-mini and DALL-E 3 image generation tool
- `/api/products/route.ts` - Product data API (list all products)
- `/api/products/[id]/route.ts` - Single product API
- `/api/auth/[...nextauth]/route.ts` - NextAuth authentication handler
- `/api/register/route.ts` - User registration endpoint
- `/api/profile/route.ts` - User profile management
- `/api/orders/route.ts` - Order management (list/create)
- `/api/orders/[id]/route.ts` - Single order operations
- `/api/users/route.ts` - User management
- `/api/users/[id]/route.ts` - Single user operations

#### `/src/components/` - Reusable React components

**Layout Components (`/layout/`):**
- `nav.tsx` - Main navigation header
- `footer.tsx` - Site footer
- `app-sidebar.tsx` - App sidebar navigation

**Common Components (`/common/`):**
- `aiAssistant.tsx` - Floating AI assistant widget
- `backToTop.tsx` - Back to top button
- `AddToCart.tsx` - Add to cart functionality
- `CartSheet.tsx` - Cart sidebar/sheet
- `CartVolumeIndicator.tsx` - Cart item count indicator
- `Grid.tsx` - Grid layout component
- `memoized-markdown.tsx` - Optimized markdown renderer
- `sns.tsx` - Social media links

**UI Components (`/ui/`):**
- shadcn/ui components: button, carousel, collapsible, dialog, input, navigation-menu, separator, sheet, sidebar, skeleton, tooltip
- Custom: `3d-card.tsx` for 3D card effects

#### `/src/lib/` - Utilities and libraries
- `prisma.ts` - Prisma client singleton
- `cart.ts` - Cart management utilities
- `formatters.ts` - Data formatting helpers
- `type.ts` - TypeScript type definitions
- `utils.ts` - General utility functions

#### `/src/data/` - Static JSON data
- `products.json` - Product catalog data
- `content.json` - Site content/copy
- `heroImageList.json` - Hero section image configurations

#### `/prisma/` - Database schema and migrations
- `schema.prisma` - Database schema definition

#### `/public/images/` - Product and site images
- Product images by category: glove_*, mitt_*, protector_*, fuku_*
- Hero images in `/hero/` subdirectory
- Background images: top_bg_*, glove_area_bg.jpg, sale_area_bg.jpg
- Social media icons: icon-facebook.svg, icon-instagram.svg, icon-x.svg
- Design files and PDFs for reference

### Database Schema

Three main models:

**User**
- id, email, password (hashed with bcryptjs)
- Profile: gender, birthday
- Address: address, postalCode, prefecture, city, street, building, room
- Timestamps: createdAt, updatedAt
- Relations: orders (one-to-many)

**Product**
- id, brand, category, price, stock, image
- Multi-language support:
  - name_en, name_jp, name_cn
  - description_en, description_jp, description_cn
- Categories: gloves, mitts, protectors, fuku (martial arts clothing)
- Relations: orders (one-to-many)

**Order**
- id, userId (nullable), productId, quantity
- Timestamps: createdAt
- Relations: user (many-to-one, onDelete: SetNull), product (many-to-one, onDelete: Restrict)
- Indexes on userId and productId for performance

### AI Features

**Chat Assistant (`/api/chat/route.ts`)**
- Model: OpenAI gpt-4o-mini
- System prompt configured for Japanese responses with Markdown formatting
- Max duration: 30 seconds
- Streaming responses via Vercel AI SDK

**Tools:**
- `generate_image` - DALL-E 3 image generation
  - Supports sizes: 1024x1024, 1792x1024, 1024x1792
  - Quality options: standard, hd
  - Returns imageUrl and generation metadata

### Authentication & User Management

- NextAuth 5.0.0-beta.29 with Prisma adapter
- Password hashing with bcryptjs
- User profile management with detailed address fields
- Session management for cart and orders

### State Management

- **CartContext** - Global cart state provider
- **SidebarProvider** - Sidebar state management (defaultOpen: false)

### Styling & UI

**Fonts:**
- Primary: Noto Sans JP (for Japanese text)
- Secondary: Roboto, Roboto Condensed
- Decorative: Yuji Syuku

**Theme:**
- Language: Japanese (`lang="ja"`)
- Background: Dot grid pattern (bg-dot-32-s-2-neutral-400)
- Tailwind CSS v4 with custom animations (tw-animate-css)
- Motion library for smooth animations
- shadcn/ui component library

### Development Notes

- TypeScript strict mode enabled
- ESLint configuration with Next.js rules
- Build process includes automatic database schema push and Prisma client generation
- Development server uses Turbopack for fast HMR
- Prisma seed script configured (ts-node prisma/seed.ts)
- Environment variables required: DATABASE_URL, OPENAI_API_KEY
- Zod version override for openai-zod-to-json-schema compatibility (3.25.76)

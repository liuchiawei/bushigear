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
- **NextAuth 5.0.0-beta.29** for authentication with Google OAuth and Credentials providers
- **AI Integration** using Vercel AI SDK (ai@5.0.70) with OpenAI (@ai-sdk/openai@2.0.52)
  - Chat model: gpt-4o-mini
  - Image generation: DALL-E 3
- **Styling** with Tailwind CSS v4 and shadcn/ui components
- **Internationalization** supporting Japanese, English, and Chinese (multi-language product data)
- **Motion** library (v12.23.3) for animations
- **Markdown** rendering with react-markdown and marked
- **Icons** from Lucide React (v0.525.0)
- **Password Hashing** with bcryptjs
- **Carousel** with embla-carousel-react

### Directory Structure

#### `/src/app/` - Next.js App Router pages and API routes

**Pages:**
- `/(index)/page.tsx` - Homepage with hero sections and product showcases
  - Uses 8 section components: Hero, Cm, Sales, Features, Ranking, About, News
  - Components in `/(index)/components/layout/`: hero.tsx, cm.tsx, cm1.tsx, sales.tsx, features.tsx, ranking.tsx, about.tsx, news.tsx
  - Shared components in `/(index)/components/common/`: FeatureCarousel.tsx, KatakanaTitle.tsx, SectionHeader.tsx, SectionHeaderNews.tsx
- `/about/page.tsx` - Standalone About page with brand story and mission statement
- `/ai/page.tsx` - AI assistant chat interface with custom layout
- `/cart/page.tsx` - Shopping cart page
- `/checkout/page.tsx` - Checkout flow
- `/category/page.tsx` - Category listing page
- `/category/[category]/page.tsx` - Dynamic category pages with custom Header component
- `/products/page.tsx` - All products listing with custom Header component
- `/products/[id]/page.tsx` - Individual product detail pages
  - Components: ProductImage.tsx, ProductInfo.tsx, AddToCartButton.tsx, OptionButtons.tsx
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

#### `/src/contexts/` - React contexts
- `CartContext.tsx` - Global cart state management with React Context

#### `/src/hooks/` - Custom React hooks
- `use-mobile.ts` - Mobile device detection hook

#### `/src/constants/` - Application constants
- `prefectures.ts` - List of all 47 Japanese prefectures (都道府県)

#### `/src/data/` - Static JSON data
- `products.json` - Product catalog data
- `content.json` - Site content/copy
- `heroImageList.json` - Hero section image configurations

#### `/prisma/` - Database schema and migrations
- `schema.prisma` - Database schema definition

#### `/public/` - Static assets
- `/images/` - Product and site images
  - Product images by category: glove_*, mitt_*, protector_*, fuku_*
  - `/hero/` subdirectory with demo_001.jpg through demo_005.jpg
  - Background images: top_bg_*, glove_area_bg.jpg, sale_area_bg.jpg
  - Social media icons: icon-facebook.svg, icon-instagram.svg, icon-x.svg
  - Design files and PDFs for reference (About redesign.pdf)
  - Commercial images: cm_img_01.png, cm_img_02.png, cm_img_03.png
- `/logo/` - Brand logos and icons
  - logo_white.svg, logo_dark.svg, logo_text.svg, logo_icon.svg
  - icon.svg, favico.png

### Database Schema

Three main models:

**User**
- id (Int, auto-increment), email (unique), password (hashed with bcryptjs)
- Name: lastName, firstName (nullable)
- Profile: gender (nullable), birthday (DateTime, nullable)
- Address: address, postalCode, prefecture, city, street, building, room (all nullable)
- Timestamps: createdAt (default now), updatedAt (auto-updated)
- Relations: orders (one-to-many)

**Product**
- id (Int, auto-increment), brand, category, price (Int), stock (Int, default 0), image
- Multi-language support:
  - name_en, name_jp, name_cn
  - description_en, description_jp, description_cn
- Categories: gloves, mitts, protectors, fuku (martial arts clothing)
- Relations: orders (one-to-many)

**Order**
- id (Int, auto-increment), userId (nullable), productId, quantity (Int)
- Customer info: lastName, firstName, email, address (all nullable for guest orders)
- Timestamps: createdAt (default now)
- Relations:
  - user (many-to-one, onDelete: SetNull) - allows guest orders
  - product (many-to-one, onDelete: Restrict) - prevents product deletion if orders exist
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

**NextAuth Configuration (`/src/auth.ts`):**
- NextAuth 5.0.0-beta.29 with Prisma adapter (@auth/prisma-adapter)
- Authentication providers:
  - Google OAuth (requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars)
  - Credentials (email/password with bcryptjs hashing)
- JWT session strategy
- Session callback includes user ID from token
- Password hashing with bcryptjs for credentials provider
- Email normalization (lowercase, trimmed)
- User profile management with detailed address fields (47 Japanese prefectures supported)
- Guest checkout supported (nullable userId in Order model)

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless)
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `AUTH_SECRET` - NextAuth secret for JWT signing
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional, for Google sign-in)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional, for Google sign-in)

### State Management

- **CartContext** (`/src/contexts/CartContext.tsx`) - Global cart state management with React Context API
- **SidebarProvider** - Sidebar state management from shadcn/ui (defaultOpen: false)
- **SessionProvider** (`/src/app/providers.tsx`) - NextAuth session provider wrapping entire app

### Styling & UI

**Fonts (Next.js Google Fonts):**
- Primary: Noto Sans JP (variable: --font-noto-sans-jp) - for Japanese text
- Secondary: Roboto (variable: --font-roboto)
- Condensed: Roboto Condensed (variable: --font-roboto-condensed)
- Decorative: Yuji Syuku (variable: --font-yuji-syuku, weight: 400)

**Theme:**
- Language: Japanese (`lang="ja"`)
- Background: Dot grid pattern (bg-dot-32-s-2-neutral-400) from @nauverse/tailwind-dot-grid-backgrounds
- Tailwind CSS v4 (@tailwindcss/postcss) with custom animations (tw-animate-css)
- Motion library (v12.23.3) for smooth animations
- shadcn/ui component library with Radix UI primitives
- Global styles in `/src/app/globals.css`

**Layout Structure:**
- Root layout wraps all pages with Nav, Footer, BackToTop, and AiAssistant components
- SidebarProvider and AppSidebar for navigation
- CartProvider for global cart state
- Suppressed hydration warnings for SSR compatibility

### Development Notes

**TypeScript Configuration:**
- Strict mode enabled (`tsconfig.json`)
- Target: ES2017
- Module resolution: bundler
- Path aliases: `@/*` maps to `./src/*`
- Force consistent casing in file names

**Build & Development:**
- ESLint configuration with Next.js rules
- Build process (`pnpm build`): automatically runs `prisma db push` → `prisma generate` → `next build`
- Development server uses Turbopack for fast HMR (`pnpm dev`)
- Production server: `pnpm start`
- Prisma seed script configured (ts-node prisma/seed.ts)

**Package Manager:**
- Uses pnpm (not npm or yarn)
- Zod version override (3.25.76) in package.json for openai-zod-to-json-schema compatibility
- Actual Zod version in project: 4.1.12

**Project Metadata:**
- Site title: "ブシギア | 格闘用品専門店"
- Description: "「ブシギア」は、高品質な日本製の格闘用品を中心に取り扱う専門ECサイトです。"
- Favicon: `/favicon.ico`

**Recent Development Activity:**
- About page redesign (October 2024)
- Dashboard improvements
- RAG (Retrieval-Augmented Generation) AI features integration

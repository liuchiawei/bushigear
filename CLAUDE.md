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
- **Next.js 15** with App Router and Turbopack
- **Prisma ORM** with PostgreSQL (Neon serverless)
- **AI Integration** using Vercel AI SDK with OpenAI
- **Styling** with Tailwind CSS v4 and shadcn/ui components
- **Internationalization** supporting Japanese, English, and Chinese

### Directory Structure

- `/src/app/` - Next.js App Router pages and API routes
  - `/api/chat/` - AI chat endpoint using OpenAI GPT-4.1-nano
  - `/api/products/` - Product data API
  - `/(index)/` - Homepage with product sections
  - `/products/` - Product listing and detail pages
  - `/category/` - Category-based product filtering
  - `/cart/` - Shopping cart and checkout
  - `/ai/` - AI assistant interface
- `/src/components/` - Reusable React components
  - `/ui/` - shadcn/ui components (button, carousel, etc.)
  - `/layout/` - Navigation, footer components
  - `/common/` - Shared components (AI assistant, back-to-top)
- `/src/data/` - Static JSON data files for products and content
- `/src/lib/` - Utilities, types, and Prisma client
- `/prisma/` - Database schema and migrations
- `/public/images/` - Product images organized by category

### Database Schema

Two main models:
- **User** - Basic authentication (id, email, password, timestamps)
- **Product** - Multi-language product data with Japanese, English, and Chinese fields

### Product Data Structure

Products support three languages with separate fields for names and descriptions. Categories include gloves, mitts, protectors, and martial arts uniforms (fuku).

### AI Features

- AI chat assistant integrated via `/api/chat/` route
- Uses OpenAI GPT-4.1-nano model
- Configured to respond in Japanese
- Sample weather tool implementation for extension

## Development Notes

- Uses Japanese as primary language (`lang="ja"`)
- Font: Noto Sans JP for Japanese text support
- Build process includes automatic database schema push and Prisma generation
- Development server uses Turbopack for fast builds
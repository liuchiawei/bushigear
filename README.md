# BushiGear

> Fight with Honor. Train with BushiGear.

A modern e-commerce platform for Japanese martial arts equipment, built with Next.js 15 and React 19.

**Languages:** [English](#) | [中文](README.cn.md) | [日本語](README.ja.md)

## Features

- 🛍️ **E-commerce** - Product catalog, cart, checkout, and order management
- 🤖 **AI Assistant** - OpenAI-powered chat with product recommendations
- 🌐 **Multi-language** - Japanese, English, and Chinese support
- 🔐 **Authentication** - NextAuth with Google OAuth and credentials
- 💳 **Payments** - Stripe integration for secure checkout
- 💬 **Reviews** - Product comments and ratings
- ❤️ **Favorites** - Save liked products
- 🔍 **RAG** - Vector embeddings for intelligent product search

## Tech Stack

- **Framework:** Next.js 15.3.5 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **Database:** PostgreSQL (Neon serverless) with Prisma ORM
- **Auth:** NextAuth 5.0 (Google OAuth + Credentials)
- **AI:** Vercel AI SDK (OpenAI gpt-4o-mini, DALL-E 3)
- **Payments:** Stripe
- **Animations:** Motion (Framer Motion)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bushigear.git
cd bushigear

# Install dependencies
pnpm install

# Set up environment variables
# Create a .env file with your configuration (see Environment Variables below)

# Set up database
pnpm db:push
pnpm db:generate

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Scripts

- `pnpm dev` - Start development server (Turbopack)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run database migrations

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API routes
├── components/       # React components (layout, common, ui)
├── lib/              # Utilities and helpers
├── data/             # Static data (content.json)
└── contexts/         # React contexts
```

## License

Private - All rights reserved

---

Built with ❤️ for martial arts enthusiasts worldwide.

# 🛒 DigiMarket - Digital License Marketplace

> A premium digital marketplace for software licenses, game keys, creative tools,
> and entertainment subscriptions. Built with modern technologies and 'Tu Tiên' style animations.

## 🏗 Project Structure

```
temp-design/
├── 📁 analysis/                    # UI/UX Analysis from Stitch
│   └── ui-ux-analysis.md          # Color palette, fonts, components, flows
├── 📁 screens/                     # Stitch Screen Data
│   └── screen-data.json           # 15 screens metadata & URLs
├── 📁 backend/                     # NestJS + Prisma + MySQL
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── prisma/                # Prisma service & module
│   │   ├── app.module.ts          # Root module
│   │   └── main.ts               # Entry point
│   ├── .env.example               # Backend env template
│   └── package.json
├── 📁 frontend/                    # Next.js 14+ App Router
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx         # Root layout (Inter font)
│   │       ├── globals.css        # Design system & tokens
│   │       └── page.tsx           # Homepage
│   ├── .env.example               # Frontend env template
│   └── package.json
├── docker-compose.yml              # MySQL + phpMyAdmin + Redis
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### 1. Start Database Services

```bash
docker-compose up -d
```

This starts:

- **MySQL 8.0** on port `3306`
- **phpMyAdmin** on port `8080` (http://localhost:8080)
- **Redis** on port `6379`

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Backend runs at: http://localhost:4000

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

## 🗄 Database Schema

| Table                    | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `users`                  | User accounts with roles (Customer, Seller, Admin) |
| `seller_profiles`        | Seller store info with feedback scores             |
| `categories`             | Hierarchical product categories                    |
| `products`               | Digital products with pricing, stock, SEO          |
| `product_features`       | Product feature highlights                         |
| `assets`                 | Images, thumbnails, files per product              |
| `tags` / `product_tags`  | Tagging system                                     |
| `orders` / `order_items` | Order management with license delivery             |
| `reviews`                | User reviews with ratings                          |
| `cart_items`             | Shopping cart                                      |
| `wishlist_items`         | Wishlists                                          |
| `addresses`              | User delivery addresses                            |

## 🎨 Design System

### Colors

- **Accent**: `#0db9f2` (Cyan) → `#8b5cf6` (Purple gradient)
- **Dark BG**: `#0a0e1a` → `#111827` → `#1e293b`
- **Light BG**: `#ffffff` → `#f9fafb` → `#f3f4f6`
- **Semantic**: Success `#10b981` | Warning `#f59e0b` | Danger `#ef4444`

### Typography

- **Font**: Inter (Google Fonts)
- **Scale**: H1 3rem/800 → H2 2rem/700 → H3 1.25rem/600 → Body 1rem/400

### Components (from Stitch)

- Header/Navbar (Dark + Light)
- Product Card (with discount badges, ratings)
- Category Card (icon-based)
- Hero Banner (gradient backgrounds)
- Sidebar Filters (price, category, rating)
- Review Cards
- Footer (multi-column)

### Animations (Framer Motion - Tu Tiên Style)

- `fadeInUp` / `fadeInDown` - Entrance animations
- `slideInLeft` - Sidebar/menu transitions
- `scaleIn` - Cards/modals appearance
- `shimmer` - Loading skeleton
- `glow` - Accent highlights
- `float` - Decorative elements

## 🛠 Tech Stack

| Layer    | Technology                                            |
| -------- | ----------------------------------------------------- |
| Frontend | Next.js 14+ (App Router), Tailwind CSS, Framer Motion |
| Backend  | NestJS, Prisma ORM, TypeScript                        |
| Database | MySQL 8.0                                             |
| Cache    | Redis 7                                               |
| Auth     | JWT + Passport.js                                     |
| DevOps   | Docker Compose                                        |

## 📝 Stitch Source

- **Project ID**: `435445593819640295`
- **15 Screens**: Dark/Light Homepage, Category, Product Detail (Desktop + Mobile)
- **Design Theme**: Dark mode, Inter font, 8px roundness, `#0db9f2` accent

# 🎨 DigiMarket - UI/UX Design Analysis

> Extracted from Stitch Project ID: 435445593819640295

## 📋 Screen Inventory (15 Screens)

| #   | Screen ID | Title                               | Device  | Dimensions |
| --- | --------- | ----------------------------------- | ------- | ---------- |
| 1   | be6d4816  | Digital Marketplace Homepage (Dark) | Desktop | 2560×4016  |
| 2   | 7c8f869d  | Product Detail Page (Dark)          | Desktop | 2560×4522  |
| 3   | 2d0e4fdc  | DigiMarket Home - Light Mode        | Desktop | 2560×4794  |
| 4   | 35866279  | Category & Filter View (Dark)       | Desktop | 2560×3086  |
| 5   | 49e9e63b  | DigiMarket Mobile Category - Light  | Desktop | 2560×2130  |
| 6   | 5ae5a6a9  | DigiMarket Mobile Home - Light      | Desktop | 2560×5580  |
| 7   | 77aedf66  | DigiMarket Details - Light Mode     | Desktop | 2560×4448  |
| 8   | 82215aac  | Mobile Home Light Mode V2           | Desktop | 2560×3436  |
| 9   | 840d0522  | Mobile Home Light Mode V3           | Desktop | 2560×3758  |
| 10  | 99222a45  | Category & Filter View (Light)      | Desktop | 2560×3182  |
| 11  | d0652642  | DigiMarket Category - Light Mode    | Desktop | 2560×3146  |
| 12  | d1cc6646  | Product Detail Page (Light)         | Desktop | 2560×5472  |
| 13  | e9be8606  | Mobile Home Light Mode V1           | Desktop | 2560×6406  |
| 14  | ee49eb3c  | Digital Marketplace Homepage 2      | Desktop | 2560×4514  |
| 15  | 7958dea8  | DigiMarket Mobile Details - Light   | Desktop | 2560×3290  |

---

## 🎨 Color Palette

### Dark Mode

| Role                 | Color              | Hex                 | Usage                    |
| -------------------- | ------------------ | ------------------- | ------------------------ |
| Background Primary   | Deep Navy/Black    | `#0a0e1a`           | Main background          |
| Background Secondary | Dark Blue-Gray     | `#111827`           | Cards, sidebars          |
| Background Tertiary  | Slate              | `#1e293b`           | Input fields, cards      |
| Accent Primary       | Cyan/Electric Blue | `#0db9f2`           | CTAs, highlights, links  |
| Accent Secondary     | Purple/Violet      | `#8b5cf6`           | Badges, gradients        |
| Accent Gradient      | Cyan → Purple      | `#0db9f2 → #8b5cf6` | Hero banners, buttons    |
| Success              | Green              | `#10b981`           | Verified badges, ratings |
| Warning/Sale         | Orange/Amber       | `#f59e0b`           | Flash sale badges        |
| Danger               | Red                | `#ef4444`           | Discount tags, alerts    |
| Text Primary         | White              | `#ffffff`           | Headings                 |
| Text Secondary       | Gray-300           | `#d1d5db`           | Body text                |
| Text Muted           | Gray-500           | `#6b7280`           | Captions, labels         |

### Light Mode

| Role                 | Color     | Hex       | Usage            |
| -------------------- | --------- | --------- | ---------------- |
| Background Primary   | White     | `#ffffff` | Main background  |
| Background Secondary | Gray-50   | `#f9fafb` | Cards, sections  |
| Background Tertiary  | Gray-100  | `#f3f4f6` | Input fields     |
| Accent Primary       | Cyan/Blue | `#0db9f2` | CTAs, links      |
| Accent Secondary     | Indigo    | `#6366f1` | Tags, categories |
| Text Primary         | Gray-900  | `#111827` | Headings         |
| Text Secondary       | Gray-600  | `#4b5563` | Body text        |
| Text Muted           | Gray-400  | `#9ca3af` | Captions         |

---

## 🔤 Typography

### Font Family

- **Primary**: `Inter` (Google Fonts)
- **Design Theme Font**: Inter (confirmed from Stitch project metadata)

### Font Scale

| Element         | Size            | Weight           | Line Height |
| --------------- | --------------- | ---------------- | ----------- |
| H1 (Hero)       | 48px / 3rem     | 800 (Extra Bold) | 1.1         |
| H2 (Section)    | 32px / 2rem     | 700 (Bold)       | 1.2         |
| H3 (Card Title) | 20px / 1.25rem  | 600 (Semi Bold)  | 1.3         |
| Body            | 16px / 1rem     | 400 (Regular)    | 1.5         |
| Small / Caption | 14px / 0.875rem | 400-500          | 1.4         |
| Badge / Tag     | 12px / 0.75rem  | 500-600          | 1.2         |
| Price (Large)   | 36px / 2.25rem  | 700 (Bold)       | 1.1         |
| Price (Card)    | 18px / 1.125rem | 600              | 1.2         |

---

## 🧩 Shared Components

### 1. **Header / Navbar**

- Logo ("DigiMarket") aligned left
- Navigation links: Categories, Deals, Support
- Search bar (prominent, centered or right)
- Icons: Cart, User/Account, Notifications
- Dark/Light mode variants
- Mobile: Hamburger menu + bottom nav bar

### 2. **Product Card**

- Thumbnail image (16:9 or 4:3 ratio)
- Product title (truncated 2 lines)
- Category tag/badge
- Star rating (⭐ + count)
- Price (with strikethrough for discounts)
- Discount badge (percentage off)
- Add to cart / Quick view button
- Hover: scale(1.02) + shadow elevation

### 3. **Category Card**

- Icon (Material Icons)
- Category name
- Product count
- Rounded corners (8px - from design theme `ROUND_EIGHT`)
- Hover: background color shift + scale

### 4. **Button Variants**

| Type        | Style                                        |
| ----------- | -------------------------------------------- |
| Primary     | Solid cyan `#0db9f2`, rounded-lg, white text |
| Secondary   | Outlined/ghost, border cyan                  |
| Gradient    | Linear gradient cyan→purple                  |
| Icon Button | Circle/rounded, icon only                    |
| CTA Large   | Full width, py-4, font-semibold              |

### 5. **Input / Search**

- Rounded (8px border-radius)
- Dark: bg-slate-800, border-slate-600
- Light: bg-gray-100, border-gray-300
- Search icon prefix
- Focus ring: cyan accent

### 6. **Badge / Tag**

- Category badges (pill shape)
- Discount badges ("-50%")
- Status badges (Verified, In Stock)
- Rating stars component

### 7. **Footer**

- Multi-column layout
- Company, Legal, Payment Methods sections
- Social media links
- Newsletter subscription
- Copyright notice

### 8. **Hero Banner**

- Full-width gradient background
- Bold headline + subtitle
- CTA button
- Feature highlights (icons + text)
- Background pattern/illustration

### 9. **Sidebar (Category Page)**

- Filter sections (Price range, Brand, Rating)
- Checkbox/Radio filters
- Price range slider
- Clear filters button
- Collapsible sections

### 10. **Review Card**

- User avatar
- Star rating
- Review text
- Date
- Helpful/Report actions

---

## 🔄 User Flow: Home → Product Detail

```
┌─────────────────┐
│   Homepage       │
│  (Hero Banner)   │
│  (Categories)    │
│  (Trending)      │
│  (Flash Sale)    │
│  (For Gamers)    │
│  (Join Plus CTA) │
│  (Footer)        │
└────────┬────────┘
         │ Click Category / Product Card
         ▼
┌─────────────────┐
│  Category Page   │
│  (Breadcrumb)    │
│  (Sidebar Filter)│
│  (Sort Options)  │
│  (Product Grid)  │
│  (Pagination)    │
└────────┬────────┘
         │ Click Product Card
         ▼
┌─────────────────┐
│ Product Detail   │
│  (Breadcrumb)    │
│  (Image Gallery) │
│  (Title + Price) │
│  (Description)   │
│  (Features)      │
│  (Add to Cart)   │
│  (Seller Info)   │
│  (Reviews)       │
│  (Related Prods) │
│  (Footer)        │
└─────────────────┘
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width          | Layout                    |
| ---------- | -------------- | ------------------------- |
| Mobile     | < 768px        | Single column, bottom nav |
| Tablet     | 768px - 1024px | 2 columns product grid    |
| Desktop    | > 1024px       | Sidebar + 3-4 column grid |

---

## 🎨 Design Theme (from Stitch Metadata)

- **Color Mode**: DARK (primary)
- **Font**: INTER
- **Roundness**: ROUND_EIGHT (8px border-radius)
- **Custom Color**: `#0db9f2` (Cyan accent)
- **Saturation**: 2 (Vibrant)

---

## 📦 Product Categories Identified

1. **Entertainment** (Netflix, Spotify, YouTube Premium)
2. **Work & Productivity** (Adobe CC, Office 365, JetBrains)
3. **Gaming** (Game keys, Discord Nitro)
4. **Learning** (Educational software)
5. **Software Keys** (VPN, Antivirus)
6. **Design Assets** (UI Kits, Templates, Icons, Illustrations)

// src/data/mockData.ts
// ============================================================
// Mock data – uses Unsplash photo URLs for real product imagery
// ============================================================

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;   // now a real photo URL
  emoji: string;       // fallback emoji
  category: string;
  is_available: boolean;
  badge?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  badge?: string;
  popular?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Full-Cream Whole Milk",
    price: 68,
    description:
      "Rich, creamy whole milk sourced from grass-fed cows on our partner farms. Pasteurised, never homogenised — nature's way.",
    image_url:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80&fit=crop",
    emoji: "🥛",
    category: "milk",
    is_available: true,
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Artisan Cultured Butter",
    price: 145,
    description:
      "Slow-churned from cream aged 18 hours. Lightly salted with Himalayan pink salt. Spreadably perfect.",
    image_url:
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80&fit=crop",
    emoji: "🧈",
    category: "butter",
    is_available: true,
    badge: "Organic",
  },
  {
    id: 3,
    name: "Greek-Style Yogurt",
    price: 89,
    description:
      "Thick-strained, probiotic-rich yogurt. Zero added sugar. Pairs beautifully with wildflower honey.",
    image_url:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80&fit=crop",
    emoji: "🥣",
    category: "yogurt",
    is_available: true,
  },
  {
    id: 4,
    name: "Farm-Aged Cheddar",
    price: 220,
    description:
      "Cave-aged for 6 months on our Rajasthan farm. Sharp, crumbly, extraordinary on sourdough.",
    image_url:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80&fit=crop",
    emoji: "🧀",
    category: "cheese",
    is_available: true,
    badge: "Aged 6 months",
  },
  {
    id: 5,
    name: "Pure Desi Ghee",
    price: 380,
    description:
      "Hand-stirred using the Bilona method from A2 cow milk. Golden, aromatic, Ayurveda-approved.",
    image_url:
      "https://images.unsplash.com/photo-1631451095765-2c91616b9b8a?w=600&q=80&fit=crop",
    emoji: "✨",
    category: "ghee",
    is_available: true,
    badge: "A2 Bilona",
  },
  {
    id: 6,
    name: "Clotted Cream",
    price: 175,
    description:
      "Slow-baked Devon-style clotted cream. Irresistible on scones or stirred into morning oats.",
    image_url:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80&fit=crop",
    emoji: "🍦",
    category: "cream",
    is_available: true,
  },
  {
    id: 7,
    name: "Low-Fat Toned Milk",
    price: 52,
    description:
      "Light, fresh toned milk — 3% fat. Ideal for health-conscious households and daily cooking.",
    image_url:
      "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=600&q=80&fit=crop",
    emoji: "🫙",
    category: "milk",
    is_available: true,
  },
  {
    id: 8,
    name: "Buffalo Paneer",
    price: 130,
    description:
      "Soft, fresh paneer from pure buffalo milk. Holds shape beautifully when cooked. No preservatives.",
    image_url:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80&fit=crop",
    emoji: "🍱",
    category: "cheese",
    is_available: true,
  },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "daily-essentials",
    name: "Daily Essentials",
    price: 999,
    description: "Perfect for individuals. Start your mornings right.",
    features: [
      "500 ml Full-Cream Milk daily",
      "200 g Cultured Butter (weekly)",
      "Free doorstep delivery 6–8 AM",
      "Monthly billing, cancel anytime",
      "Freshness guarantee",
    ],
    badge: "Most Popular",
    popular: true,
  },
  {
    id: "family-farm",
    name: "Family Farm Box",
    price: 1799,
    description: "Complete dairy for the whole family, every single day.",
    features: [
      "1 L Full-Cream Milk daily",
      "500 g Greek Yogurt (weekly)",
      "200 g Artisan Butter (weekly)",
      "250 g Farm Paneer (bi-weekly)",
      "Priority morning delivery",
      "Free 100 ml Ghee on signup",
    ],
    badge: "Best Value",
  },
  {
    id: "artisan-club",
    name: "Artisan Club",
    price: 2999,
    description: "For connoisseurs. The full premium dairy experience.",
    features: [
      "1 L A2 Whole Milk daily",
      "All Family Farm inclusions",
      "Monthly Artisan Cheese Selection",
      "250 ml Desi Ghee (monthly)",
      "Clotted Cream & specialty items",
      "Dedicated relationship manager",
      "Exclusive member discounts",
    ],
    badge: "Premium",
  },
];

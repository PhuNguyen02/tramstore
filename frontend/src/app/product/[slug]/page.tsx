"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Share2,
  Heart,
  Minus,
  Plus,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatCurrency, cn } from "@/lib/utils";

const ProductDetailPage = ({ params }: { params: { slug: string } }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Mock product (would fetch by slug normally)
  const product = {
    title: "Spotify Premium Individual - 1 Year Subscription",
    category: "Entertainment",
    price: 149000,
    originalPrice: 299000,
    rating: 4.8,
    reviews: 124,
    discount: 50,
    image:
      "https://lh3.googleusercontent.com/aida/AOfcidXgCYpAV6y6RBv9t1wbl4ASlhr6IhK71DeoVoEJjzphezDJ4Yl4HS4hu8vmiInaG_kqeuoKac8yHw6rG71k8aGD2XDMLHGr1KY-g4_UTW13vEJjzphezDJ4Yl4HS4hu8vmiInaG_kqeuoKac8yHw6rG71k8aGD2XDMLHGr1KY-g4_UTW13vEEkz0lKlwONPzi7a3Vvae04gIRo9mUXJftVc62SA9x0U_6t0df9d0zj7_yLHWWN41bqYwS636SIyQj_Xfs_6Si1QnU0zKk_6Kq3yUGIIC3EhOSso0OUhmVjcErXodzA7xIqrlTceHJY",
    description:
      "Enjoy millions of songs and podcasts on your phone, tablet, computer, and more. Play any song, anywhere, even offline. No ad interruptions. High-quality audio. Group session. 1 year of continuous service with 1-to-1 warranty.",
    features: [
      "Ad-free music listening",
      "Play anywhere - even offline",
      "On-demand playback",
      "1 year Full Warranty",
      "Instant Delivery via Email",
      "Login to your own account",
    ],
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />

      <div className="container-app pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 📸 Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass border-white/5 relative group">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-accent-gradient text-xs font-black text-white shadow-glow animate-glow">
                -{product.discount}% OFF
              </div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden glass border-white/5 hover:border-accent transition-all cursor-pointer opacity-60 hover:opacity-100",
                    i === 1 && "border-accent opacity-100",
                  )}
                >
                  <img
                    src={product.image}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* 📝 Details Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold text-accent uppercase tracking-[0.2em]">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1.1]">
                {product.title}
              </h1>
            </div>

            {/* Ratings & Status */}
            <div className="flex flex-wrap items-center gap-6 mb-8 py-4 border-y border-border-color/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i <= 4
                          ? "fill-warning text-warning"
                          : "text-text-muted opacity-30",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-text-primary">
                  {product.rating}
                </span>
                <span className="text-xs font-medium text-text-muted">
                  ({product.reviews} reviews)
                </span>
              </div>
              <div className="h-4 w-px bg-border-color" />
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  In Stock / Instant Delivery
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mb-10 p-6 rounded-2xl bg-bg-secondary/50 border border-white/5 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-accent/5">
                <Sparkles className="w-24 h-24" />
              </div>
              <div className="flex items-end gap-4 mb-4">
                <span className="text-4xl font-black text-accent drop-shadow-sm">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-lg text-text-muted line-through font-medium mb-1">
                  {formatCurrency(product.originalPrice)}
                </span>
              </div>
              <p className="text-sm text-text-secondary font-medium">
                Tax included. Global version, 12 months full guarantee.
              </p>
            </div>

            {/* Purchase Operations */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between p-1 bg-bg-tertiary rounded-xl border border-border-color min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-text-primary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-black text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-text-primary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  className="flex-1 py-7 rounded-2xl shadow-glow text-lg"
                >
                  Buy Now <Zap className="w-5 h-5 ml-2 fill-white" />
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border-border-color text-text-primary hover:bg-bg-tertiary"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-14 w-14 rounded-xl border border-border-color"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Micro-Features */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                {
                  icon: <ShieldCheck className="text-accent" />,
                  title: "Secure Checkout",
                  desc: "128-bit Encryption",
                },
                {
                  icon: <Clock className="text-accent" />,
                  title: "Fast Delivery",
                  desc: "Average 2-5 mins",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl glass border-white/5"
                >
                  <div className="mt-1">{f.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold">{f.title}</h4>
                    <p className="text-[10px] text-text-muted uppercase font-bold mt-0.5 tracking-wider">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 📚 Tabs Section */}
        <div className="mt-20">
          <div className="flex gap-8 border-b border-border-color mb-10 overflow-x-auto no-scrollbar">
            {["description", "features", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                  activeTab === tab ? "text-accent" : "text-text-muted",
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-text-secondary leading-relaxed font-medium"
              >
                {product.description}
              </motion.div>
            )}
            {activeTab === "features" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {product.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl glass border-white/5"
                  >
                    <div className="p-1 rounded bg-accent/20 text-accent">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold">{f}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;

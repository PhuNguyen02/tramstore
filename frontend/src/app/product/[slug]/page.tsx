"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Heart,
  Minus,
  Plus,
  Sparkles,
  MapPin,
  Ticket,
  AlertTriangle,
  Package,
  Info,
  ChevronRight,
  Truck,
  BadgeCheck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { formatCurrency, cn } from "@/lib/utils";
import productsData from "@/data/products.json";

/* ─── types ─── */
interface AccountType { label: string; value: string; price: number }
interface Warranty { label: string; value: string; price: number; compatibleWith: string[] }
interface Product {
  id: string; title: string; slug: string; category: string;
  price: number; originalPrice: number; image: string;
  rating: number; reviews: number; discount: number;
  tag: string; brand: string; stock?: number;
  description?: string; features?: string[];
  accountTypes?: AccountType[]; warranties?: Warranty[];
}

/* ═══════════════════════════════════════════════════════════
   PRODUCT DETAIL — LUXURY MINIMALIST
   Design principles:
   • Maximum negative space
   • Monochromatic palette: charcoal + off-white + one accent
   • Typography-driven hierarchy
   • Invisible borders, defined by space alone
   • Product image = hero, everything else serves it
   ═══════════════════════════════════════════════════════════ */

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const product = useMemo(() => (productsData as Product[]).find((p) => p.slug === slug) || null, [slug]);

  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);
  const [selectedWarranty, setSelectedWarranty] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");
  const [activeTab, setActiveTab] = useState("description");
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isWished, setIsWished] = useState(false);

  const stock = product?.stock ?? 99;
  const accountTypeObj = useMemo(() => product?.accountTypes?.find((a) => a.value === selectedAccountType) ?? null, [product, selectedAccountType]);
  const warrantyObj = useMemo(() => product?.warranties?.find((w) => w.value === selectedWarranty) ?? null, [product, selectedWarranty]);
  const availableWarranties = useMemo(() => {
    if (!product?.warranties || !selectedAccountType) return product?.warranties ?? [];
    return product.warranties.map((w) => ({ ...w, disabled: !w.compatibleWith.includes(selectedAccountType) }));
  }, [product, selectedAccountType]);

  useEffect(() => {
    if (!selectedAccountType || !selectedWarranty || !product?.warranties) return;
    const c = product.warranties.find((w) => w.value === selectedWarranty);
    if (c && !c.compatibleWith.includes(selectedAccountType)) setSelectedWarranty(null);
  }, [selectedAccountType, selectedWarranty, product]);

  const accountPrice = accountTypeObj?.price ?? product?.price ?? 0;
  const warrantyPrice = warrantyObj?.price ?? 0;
  const totalPrice = (accountPrice + warrantyPrice) * quantity;
  const hasAccountTypes = (product?.accountTypes?.length ?? 0) > 0;
  const hasWarranties = (product?.warranties?.length ?? 0) > 0;
  const isFormComplete = (!hasAccountTypes || selectedAccountType !== null) && (!hasWarranties || selectedWarranty !== null);

  const handleQuantityChange = (val: number) => {
    if (val < 1) val = 1;
    if (val > stock) { val = stock; setShowStockWarning(true); setTimeout(() => setShowStockWarning(false), 3000); }
    setQuantity(val); setQuantityInput(String(val));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, ""); setQuantityInput(raw);
    if (raw !== "") { const n = parseInt(raw, 10); if (n >= 1) handleQuantityChange(n); }
  };
  const handleInputBlur = () => { if (!quantityInput || parseInt(quantityInput) < 1) { setQuantity(1); setQuantityInput("1"); } };
  const handleBuyNow = () => {
    if (!isFormComplete) {
      const m: string[] = [];
      if (hasAccountTypes && !selectedAccountType) m.push("Loại tài khoản");
      if (hasWarranties && !selectedWarranty) m.push("Bảo hành");
      setValidationError(`Vui lòng chọn ${m.join(" và ")}`);
      setTimeout(() => setValidationError(null), 4000);
      return;
    }
    alert(`Đặt hàng thành công! Mã đơn #${Date.now().toString(36).toUpperCase()}`);
  };

  /* 404 */
  if (!product) {
    return (
      <main className="min-h-screen bg-white"><Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <p className="text-[13px] tracking-[0.3em] text-gray-300 uppercase mb-4">404</p>
          <h1 className="text-xl font-medium text-[#1a1a1a]">Sản phẩm không tồn tại</h1>
        </div>
      </main>
    );
  }

  const features = product.features ?? ["Bảo hành đổi mới", "Kích hoạt tức thì", "Hỗ trợ 24/7"];
  const description = product.description ?? `${product.title} — sản phẩm chất lượng cao.`;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 pt-28 pb-24">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-[12px] tracking-wide text-[#999] mb-10 lg:mb-14">
          <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors duration-300">Trang chủ</span>
          <ChevronRight className="w-3 h-3 text-[#ccc]" />
          <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors duration-300">{product.category}</span>
          <ChevronRight className="w-3 h-3 text-[#ccc]" />
          <span className="text-[#1a1a1a]">{product.title}</span>
        </nav>

        {/* ══════════ HERO SPLIT ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── LEFT: Product Visual ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <div className="relative aspect-square bg-[#fafafa] rounded-2xl flex items-center justify-center group overflow-hidden">
              {/* Minimal badge */}
              {product.discount > 0 && (
                <span className="absolute top-6 left-6 z-10 text-[11px] tracking-[0.15em] font-medium text-[#1a1a1a] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                  –{product.discount}%
                </span>
              )}

              <button
                onClick={() => setIsWished(!isWished)}
                className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center"
              >
                <Heart className={cn("w-5 h-5 transition-all duration-300", isWished ? "fill-[#1a1a1a] text-[#1a1a1a]" : "text-[#ccc] hover:text-[#999]")} />
              </button>

              <img
                src={product.image}
                alt={product.title}
                className="max-w-[60%] max-h-[60%] object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
            </div>
          </motion.div>

          {/* ── RIGHT: Product Details ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Category & Status */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] tracking-[0.2em] text-[#999] uppercase">{product.category}</span>
              <span className="w-1 h-1 rounded-full bg-[#ddd]" />
              <span className="text-[11px] tracking-[0.1em] text-emerald-500 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Còn hàng
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[1.75rem] sm:text-[2.1rem] font-light text-[#1a1a1a] leading-[1.2] tracking-[-0.01em] mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="flex gap-[2px]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={cn("w-[14px] h-[14px]", i <= Math.round(product.rating) ? "fill-[#1a1a1a] text-[#1a1a1a]" : "fill-[#e5e5e5] text-[#e5e5e5]")} />
                ))}
              </div>
              <span className="text-[12px] text-[#999]">{product.rating} · {product.reviews} đánh giá</span>
            </div>

            {/* Price — always visible, hero-level */}
            <div className="mb-8">
              <motion.div key={totalPrice} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                <span className="text-[2rem] sm:text-[2.4rem] font-light tracking-tight text-[#1a1a1a]">
                  {formatCurrency(totalPrice)}
                </span>
              </motion.div>
              {product.originalPrice > accountPrice && (
                <span className="text-[14px] text-[#bbb] line-through ml-1">{formatCurrency(product.originalPrice * quantity)}</span>
              )}
            </div>

            {/* Divider */}
            <div className="w-12 h-[1px] bg-[#e5e5e5] mb-8" />

            {/* ━━━ ACCOUNT TYPE ━━━ */}
            {hasAccountTypes && (
              <div className="mb-7">
                <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase mb-3">
                  Thời hạn <span className="text-[#ccc]">*</span>
                </p>
                <div className="flex gap-3">
                  {product.accountTypes!.map((at) => {
                    const sel = selectedAccountType === at.value;
                    return (
                      <button key={at.value} onClick={() => setSelectedAccountType(at.value)}
                        className={cn(
                          "px-6 py-3.5 rounded-lg transition-all duration-200 cursor-pointer text-center min-w-[100px]",
                          sel
                            ? "bg-[#1a1a1a] text-white"
                            : "bg-[#fafafa] text-[#666] hover:bg-[#f0f0f0]"
                        )}>
                        <span className="block text-[13px] font-medium">{at.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ━━━ WARRANTY ━━━ */}
            {hasWarranties && (
              <div className="mb-7">
                <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase mb-3">
                  Bảo hành <span className="text-[#ccc]">*</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {availableWarranties.map((w: Warranty & { disabled?: boolean }) => {
                    const sel = selectedWarranty === w.value && !w.disabled;
                    return (
                      <button key={w.value} disabled={w.disabled}
                        onClick={() => !w.disabled && setSelectedWarranty(w.value)}
                        className={cn(
                          "px-5 py-3 rounded-lg transition-all duration-200 text-center",
                          w.disabled
                            ? "bg-[#fafafa] text-[#ddd] cursor-not-allowed"
                            : sel
                              ? "bg-[#1a1a1a] text-white cursor-pointer"
                              : "bg-[#fafafa] text-[#666] hover:bg-[#f0f0f0] cursor-pointer"
                        )}>
                        <span className="block text-[13px] font-medium">{w.label}</span>
                      </button>
                    );
                  })}
                </div>
                {!selectedAccountType && hasAccountTypes && (
                  <p className="mt-2.5 text-[11px] text-[#bbb] flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> Chọn thời hạn trước
                  </p>
                )}
              </div>
            )}

            {/* ━━━ QUANTITY ━━━ */}
            <div className="mb-8">
              <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase mb-3">Số lượng</p>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden">
                  <button className="w-11 h-11 flex items-center justify-center text-[#999] hover:text-[#1a1a1a] hover:bg-[#fafafa] transition-colors" onClick={() => handleQuantityChange(quantity - 1)}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <input type="text" value={quantityInput} onChange={handleInputChange} onBlur={handleInputBlur}
                    className="w-12 h-11 text-center text-[14px] font-medium text-[#1a1a1a] bg-transparent outline-none border-x border-[#e5e5e5]" />
                  <button className="w-11 h-11 flex items-center justify-center text-[#999] hover:text-[#1a1a1a] hover:bg-[#fafafa] transition-colors" onClick={() => handleQuantityChange(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <AnimatePresence>
                  {showStockWarning && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-[11px] text-amber-500">Tối đa {stock} sản phẩm</motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Validation */}
            <AnimatePresence>
              {validationError && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="text-[13px] text-rose-500 mb-4">{validationError}</motion.p>
              )}
            </AnimatePresence>

            {/* ━━━ CTA ━━━ */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleBuyNow}
                className={cn(
                  "flex-[2] h-[54px] bg-[#1a1a1a] text-white text-[13px] font-medium tracking-[0.12em] uppercase rounded-lg hover:bg-[#333] transition-all duration-300 flex items-center justify-center gap-2",
                  !isFormComplete && "opacity-40 cursor-not-allowed hover:bg-[#1a1a1a]"
                )}>
                Mua ngay
              </button>
              <button className="flex-1 h-[54px] border border-[#e0e0e0] text-[#666] text-[13px] font-medium tracking-[0.05em] uppercase rounded-lg hover:border-[#999] hover:text-[#1a1a1a] transition-all duration-300 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Giỏ hàng
              </button>
            </div>

            {/* Trust — minimal text only */}
            <div className="space-y-3 pt-6 border-t border-[#f0f0f0]">
              {[
                { icon: <Truck className="w-4 h-4" />, text: "Giao hàng tức thì qua Email" },
                { icon: <ShieldCheck className="w-4 h-4" />, text: "Bảo hành đổi mới trong thời gian sử dụng" },
                { icon: <BadgeCheck className="w-4 h-4" />, text: "Thanh toán an toàn · Mã hóa SSL" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-[12px] text-[#999]">
                  <span className="text-[#ccc]">{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══════════ DETAILS SECTION ══════════ */}
        <div className="mt-20 lg:mt-28 max-w-[720px]">
          {/* Tab navigation — underline style */}
          <div className="flex gap-8 border-b border-[#f0f0f0] mb-8">
            {[
              { id: "description", label: "Mô tả" },
              { id: "features", label: "Tính năng" },
              { id: "reviews", label: "Đánh giá" },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3 text-[13px] tracking-[0.05em] transition-all duration-300 relative",
                  activeTab === tab.id ? "text-[#1a1a1a] font-medium" : "text-[#bbb] hover:text-[#999]"
                )}>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a]" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.p key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[14px] leading-[1.8] text-[#666]">{description}</motion.p>
            )}
            {activeTab === "features" && (
              <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ccc] flex-shrink-0" />
                    <span className="text-[14px] text-[#666]">{f}</span>
                  </div>
                ))}
              </motion.div>
            )}
            {activeTab === "reviews" && (
              <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                <p className="text-[13px] text-[#bbb]">Chưa có đánh giá</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;

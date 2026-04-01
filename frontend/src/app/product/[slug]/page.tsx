"use client";

import { useState } from "react";
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
  Train,
  MapPin,
  Ticket
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { formatCurrency, cn } from "@/lib/utils";
import { Box, Typography, alpha } from "@mui/material";
import { keyframes } from "@mui/material/styles";

const dotPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const glowRing = keyframes`
  0% { box-shadow: 0 0 0 0px rgba(58, 183, 174, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(58, 183, 174, 0); }
  100% { box-shadow: 0 0 0 0px rgba(58, 183, 174, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const ProductDetailPage = ({ params }: { params: { slug: string } }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const accentColor = "#3AB7AE";

  // Mock product
  const product = {
    title: "Spotify Premium Individual - 1 Year",
    category: "Entertainment",
    price: 149000,
    originalPrice: 299000,
    rating: 4.8,
    reviews: 124,
    discount: 50,
    image:
      "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png",
    description:
      "Tận hưởng âm nhạc không giới hạn trên mọi nền tảng. Chuyến tàu âm thanh chất lượng cao 320kbps không quảng cáo. Bảo hành trọn đời vé trong 1 năm sử dụng.",
    features: [
      "Nghe nhạc không quảng cáo",
      "Tải xuống và nghe ngoại tuyến",
      "Phát nhạc theo yêu cầu",
      "Bảo hành 1 đổi 1 suốt 1 năm",
      "Giao vé tức thì qua Email",
      "Sử dụng trên tài khoản chính chủ",
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="container-app pt-32 pb-20 max-w-[1280px]">
        {/* Departure Board Style Wrapper */}
        <Box
          sx={{
            background:
              "linear-gradient(160deg, #f0faf9 0%, #e6f7f5 40%, #f0fdfb 100%)",
            borderRadius: { xs: "24px", md: "40px" },
            overflow: "hidden",
            position: "relative",
            boxShadow:
              "0 24px 80px -20px rgba(58, 183, 174, 0.2), 0 8px 32px -10px rgba(0,0,0,0.05)",
            border: "1px solid rgba(58, 183, 174, 0.2)",
          }}
        >
          {/* Board Header */}
          <Box
            sx={{
              background:
                "linear-gradient(135deg, rgba(58, 183, 174, 0.12) 0%, rgba(58, 183, 174, 0.04) 100%)",
              px: { xs: 3, md: 6 },
              py: { xs: 2.5, md: 3 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(58, 183, 174, 0.15)",
              position: "relative",
              zIndex: 5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Box
                sx={{
                  width: { xs: 40, md: 52 },
                  height: { xs: 40, md: 52 },
                  borderRadius: "16px",
                  bgcolor: "#fff",
                  border: "2px solid rgba(58, 183, 174, 0.2)",
                  boxShadow: "0 4px 12px rgba(58, 183, 174, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0.8,
                }}
              >
                <Train className="text-[#3AB7AE]" size={28} />
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: alpha(accentColor, 0.7),
                    fontWeight: 900,
                    letterSpacing: 2,
                    fontSize: "0.6rem",
                    display: "block",
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  GA TRUNG TÂM • PRODUCT TERMINAL
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#0f172a",
                    fontWeight: 900,
                    lineHeight: 1.2,
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Ticket size={20} className="text-warning" />
                  Chi tiết hành trình
                </Typography>
              </Box>
            </Box>
            {/* Live Status */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                borderRadius: "10px",
                px: 1.5,
                py: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  animation: `${dotPulse} 1.2s ease-in-out infinite`,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#22c55e",
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  fontSize: "0.65rem",
                }}
              >
                SẴN SÀNG KHỞI HÀNH
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 3, md: 5 }, position: "relative", zIndex: 2 }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* 📸 Image Gallery (Left, Span 5) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5 space-y-4"
              >
                <Box
                  sx={{
                    aspectRatio: "1",
                    borderRadius: "32px",
                    bgcolor: "#fff",
                    border: "2px solid rgba(58, 183, 174, 0.15)",
                    boxShadow: "0 20px 40px -10px rgba(58, 183, 174, 0.15)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 6,
                  }}
                  className="group"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-[#3AB7AE] text-xs font-black text-white shadow-lg tracking-widest">
                    GIẢM {product.discount}%
                  </div>
                </Box>
                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        aspectRatio: "1",
                        borderRadius: "16px",
                        bgcolor: "#fff",
                        border: i === 1 
                          ? "2px solid #3AB7AE"
                          : "1px solid rgba(58, 183, 174, 0.15)",
                        opacity: i === 1 ? 1 : 0.6,
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 1,
                          borderColor: "#3AB7AE",
                        },
                        transition: "all 0.2s ease",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <img
                        src={product.image}
                        className="w-full h-full object-contain"
                      />
                    </Box>
                  ))}
                </div>
              </motion.div>

              {/* 📝 Details Content (Right, Span 7) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-7 flex flex-col"
              >
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-black text-[#3AB7AE] uppercase tracking-[0.2em] bg-[#3AB7AE]/10 px-3 py-1 rounded-full">
                    <MapPin className="inline-block w-3 h-3 mr-1 -mt-0.5" />
                    {product.category}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-[1.1] mt-4">
                    {product.title}
                  </h1>
                </div>

                {/* Ratings & Status */}
                <div className="flex flex-wrap items-center gap-6 mb-8 py-4 border-y border-[#3AB7AE]/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-5 h-5",
                            i <= 4
                              ? "fill-warning text-warning"
                              : "text-gray-300 fill-gray-200",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-black text-[#0f172a]">
                      {product.rating}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      ({product.reviews} đánh giá)
                    </span>
                  </div>
                  <div className="h-5 w-px bg-[#3AB7AE]/20" />
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                      CÓ SẴN VÉ
                    </span>
                  </div>
                </div>

                {/* Pricing Box - Ticket Style */}
                <Box
                  sx={{
                    mb: 4,
                    p: 4,
                    borderRadius: "24px",
                    bgcolor: "#fff",
                    border: "2px solid rgba(58, 183, 174, 0.15)",
                    boxShadow: "0 10px 30px rgba(58, 183, 174, 0.05)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: "6px",
                      background: "linear-gradient(180deg, #3AB7AE, #5bc8c0)",
                    }
                  }}
                >
                  <div className="flex items-end gap-4 mb-2">
                    <span className="text-4xl md:text-5xl font-black text-[#0f172a]">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-lg text-gray-400 line-through font-bold mb-1.5">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-[#475569] font-semibold">
                    Giá đã bao gồm VAT. Hành lý (Dịch vụ) trọn gói 12 tháng.
                  </p>
                </Box>

                {/* Purchase Operations */}
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-between px-2 bg-white rounded-2xl border-2 border-[#3AB7AE]/20 min-w-[140px] shadow-sm">
                      <button
                        className="h-10 w-10 text-[#0f172a] flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="font-black text-xl text-[#0f172a]">{quantity}</span>
                      <button
                        className="h-10 w-10 text-[#0f172a] flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <Button
                      variant="primary"
                      className="flex-1 py-4 md:py-0 rounded-2xl shadow-xl shadow-[#3AB7AE]/30 text-lg tracking-[0.1em]"
                    >
                      MUA VÉ NGAY <Zap className="w-5 h-5 ml-2 fill-white" />
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl border-[#3AB7AE]/30 text-[#0f172a] hover:border-[#3AB7AE]"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> THÊM VÀO GIỎ
                    </Button>
                    <button className="h-14 w-14 flex items-center justify-center rounded-2xl border-2 border-[#3AB7AE]/20 text-gray-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all bg-white shadow-sm">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Micro-Features */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <ShieldCheck className="text-[#3AB7AE] w-6 h-6" />,
                      title: "Thanh toán an toàn",
                      desc: "Mã hóa 128-bit",
                    },
                    {
                      icon: <Clock className="text-[#3AB7AE] w-6 h-6" />,
                      title: "Khởi hành ngay",
                      desc: "Tự động gửi vé qua Mail",
                    },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#3AB7AE]/10 shadow-sm"
                    >
                      <div className="mt-0.5 p-2 bg-[#f0faf9] rounded-xl">{f.icon}</div>
                      <div>
                        <h4 className="text-sm font-black text-[#0f172a]">{f.title}</h4>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider mt-1">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 📚 Tabs Section / Platform Details */}
            <div className="mt-16 pt-10 border-t border-[#3AB7AE]/10">
              <div className="flex gap-8 mb-8 overflow-x-auto no-scrollbar pb-2">
                {[
                  { id: "description", label: "📄 Bản đồ hành trình" },
                  { id: "features", label: "✨ Dịch vụ cung cấp" },
                  { id: "reviews", label: "💬 Đánh giá hành khách" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "pb-4 text-sm font-black tracking-wider transition-all relative whitespace-nowrap",
                      activeTab === tab.id ? "text-[#0f172a]" : "text-gray-400 hover:text-gray-600",
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#3AB7AE] rounded-t-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="max-w-4xl bg-white rounded-3xl p-6 md:p-10 border border-[#3AB7AE]/10 shadow-sm">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-lg text-[#475569] leading-relaxed font-semibold"
                    >
                      {product.description}
                    </motion.div>
                  )}
                  {activeTab === "features" && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {product.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8fafc] border border-[#3AB7AE]/10"
                        >
                          <div className="p-1.5 rounded-lg bg-[#3AB7AE]/10 text-[#3AB7AE]">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="font-black text-[#0f172a]">{f}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-10"
                    >
                      <Sparkles className="w-10 h-10 text-[#3AB7AE]/30 mx-auto mb-4" />
                      <p className="font-bold text-gray-500">Hành khách chưa để lại đánh giá (Chuyến đi mới).</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Box>
        </Box>
      </div>
    </main>
  );
};

export default ProductDetailPage;


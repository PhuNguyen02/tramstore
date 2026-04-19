"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Chip,
  Tab,
  Tabs,
  Grid,
  Paper,
  Stack,
  Alert,
  Tooltip,
  LinearProgress,
  CircularProgress,
  Breadcrumbs,
  Card,
  CardContent,
  Snackbar,
  Divider,
  alpha,
  TextField,
} from "@mui/material";
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Share,
  Remove,
  Add,
  CheckCircle,
  LocalShipping,
  Verified,
  Security,
  FlashOn,
  AccessTime,
  Shield,
  Inventory2,
  Warning,
  Visibility,
  AutoAwesome,
  ArrowForward,
  NavigateNext,
  Home,
  Info,
  ConfirmationNumberOutlined as TicketIcon,
  TimerOutlined as TimerIcon,
  TrainOutlined as TrainIcon,
  CategoryOutlined as CategoryIcon,
  StorefrontOutlined as StoreIcon,
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  StarBorder as StarBorderIcon,
  ThumbUpOutlined as LikeIcon,
} from "@mui/icons-material";
import Navbar from "@/components/layout/Navbar";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { DepartureBoard, StationBanner } from "@/components/home/TrainJourney";
import { useCart } from "@/store/cartStore";
import { api, ApiProduct } from "@/lib/api";

/* ─── types ─── */
interface Warranty {
  label: string;
  value: string;
  price: number;
}

interface Variant {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  description: string;
  features: string[];
  warranties?: Warranty[];
}

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  tag: string;
  brand: string;
  variants: Variant[];
}

/* ═══════════════════════════════════════════════
   PRODUCT DETAIL — STATION PREMIUM REDESIGN
   Brand: TramStore teal #3AB7AE
   ═══════════════════════════════════════════════ */

const ACCENT = "#3AB7AE";
const ACCENT_DARK = "#2a9b93";
const DARK = "#0f172a";
const DARK2 = "#1e293b";

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await api.products.getBySlug(slug);
        const mapped: Product = {
          id: p.id,
          title: p.name,
          slug: p.slug,
          category: p.category.name,
          image: p.images ? JSON.parse(p.images)[0] : "/file.svg",
          tag: p.tag || "",
          brand: p.brand || "",
          variants: p.variants.map((v) => ({
            id: v.id,
            label: v.name,
            price: v.price,
            originalPrice: v.originalPrice || v.price,
            discount: v.discount || 0,
            stock: v.stock,
            description: v.description || "",
            features: v.features ? JSON.parse(v.features) : [],
            warranties: v.warranties ? JSON.parse(v.warranties) : [],
          })),
        };
        setProduct(mapped);

        // Fetch related products (optional optimization: reuse products if already in state)
        const allInCategory = await api.products.getByCategory(p.category.slug);
        const relatedMapped = allInCategory
          .filter(rel => rel.id !== p.id)
          .slice(0, 6)
          .map(rel => ({
            id: rel.id,
            title: rel.name,
            slug: rel.slug,
            category: rel.category.name,
            image: rel.images ? JSON.parse(rel.images)[0] : "/file.svg",
            tag: rel.tag || "",
            brand: rel.brand || "",
            variants: rel.variants.map(v => ({
              id: v.id,
              label: v.name,
              price: v.price,
              originalPrice: v.originalPrice || v.price,
              discount: v.discount || 0,
              stock: v.stock,
              description: v.description || "",
              features: v.features ? JSON.parse(v.features) : [],
              warranties: v.warranties ? JSON.parse(v.warranties) : [],
            })),
          }));
        setRelatedProducts(relatedMapped);
      } catch (error) {
        console.error("Failed to fetch product detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedWarrantyValue, setSelectedWarrantyValue] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isWished, setIsWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const { addItem, openDrawer } = useCart();

  // Auto-select first variant
  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product, selectedVariantId]);

  const selectedVariant = useMemo(
    () => product?.variants.find((v) => v.id === selectedVariantId) ?? null,
    [product, selectedVariantId]
  );

  const selectedWarranty = useMemo(
    () => selectedVariant?.warranties?.find((w) => w.value === selectedWarrantyValue) ?? null,
    [selectedVariant, selectedWarrantyValue]
  );

  // Reset warranty if variant changes
  useEffect(() => {
    setSelectedWarrantyValue(null);
  }, [selectedVariantId]);

  const variantPrice = selectedVariant?.price ?? 0;
  const warrantyPrice = selectedWarranty?.price ?? 0;
  const totalPrice = (variantPrice + warrantyPrice) * quantity;
  const stock = selectedVariant?.stock ?? 0;

  const handleQuantityChange = (val: number) => {
    if (val < 1) val = 1;
    if (val > stock) {
      val = stock;
      setShowStockWarning(true);
      setTimeout(() => setShowStockWarning(false), 3000);
    }
    setQuantity(val);
  };

  const handleBuyNow = () => {
    if (!selectedVariantId || !selectedVariant || !product) {
      setValidationError("Vui lòng chọn loại sản phẩm");
      setTimeout(() => setValidationError(null), 4000);
      return;
    }
    // Add to cart then navigate to checkout
    const cartId = `${product.id}-${selectedVariantId}-${selectedWarrantyValue ?? "no-warranty"}`;
    addItem({
      id: cartId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      variantId: selectedVariantId,
      variantLabel: selectedVariant.label,
      warrantyLabel: selectedWarranty?.label,
      warrantyValue: selectedWarrantyValue ?? undefined,
      price: variantPrice + warrantyPrice,
      originalPrice: selectedVariant.originalPrice,
      quantity,
      slug: product.slug,
    });
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    if (!selectedVariantId || !selectedVariant || !product) return;
    const cartId = `${product.id}-${selectedVariantId}-${selectedWarrantyValue ?? "no-warranty"}`;
    addItem({
      id: cartId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      variantId: selectedVariantId,
      variantLabel: selectedVariant.label,
      warrantyLabel: selectedWarranty?.label,
      warrantyValue: selectedWarrantyValue ?? undefined,
      price: variantPrice + warrantyPrice,
      originalPrice: selectedVariant.originalPrice,
      quantity,
      slug: product.slug,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };


  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
        <Navbar />
        <Container sx={{ py: 20, textAlign: "center" }}>
          <CircularProgress sx={{ color: ACCENT }} />
          <Typography sx={{ mt: 2, fontWeight: 700, color: DARK }}>Đang tải trạm thông tin...</Typography>
        </Container>
      </Box>
    );
  }

  /* ── 404 ── */
  if (!product) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fafbfc" }}>
        <Navbar />
        <Container maxWidth="sm">
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "70vh" }} spacing={3}>
            <Box sx={{ width: 80, height: 80, borderRadius: 4, bgcolor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Inventory2 sx={{ fontSize: 32, color: "#bbb" }} />
            </Box>
            <Typography variant="h6" fontWeight={600} color={DARK}>Sản phẩm không tồn tại</Typography>
            <Button component={Link} href="/" variant="contained" sx={{ bgcolor: DARK, borderRadius: 3, px: 4 }}>Quay lại trang chủ</Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  const savingsAmount = selectedVariant ? (selectedVariant.originalPrice - selectedVariant.price) * quantity : 0;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <Navbar />

      {/* ═══ BREADCRUMB ═══ */}
      <Box sx={{ bgcolor: "#f8fafc", borderBottom: "1px solid #f1f5f9", py: 2 }}>
        <Container maxWidth="xl">
          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14, color: "#cbd5e1" }} />}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#64748b", "&:hover": { color: ACCENT } }}>
                <Home sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>TRANG CHỦ</Typography>
              </Stack>
            </Link>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", letterSpacing: 1 }}>{product.category.toUpperCase()}</Typography>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: ACCENT, letterSpacing: 1, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.title.toUpperCase()}</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* ══════════════════════════════════════
         MAIN PRODUCT — 2-COLUMN LAYOUT
         ══════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        <Grid container spacing={4}>

          {/* ─────────── LEFT COLUMN: Image + Seller Info ─────────── */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={3}>

              {/* Product Image */}
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                <Box
                  sx={{
                    position: "relative", borderRadius: "24px", overflow: "hidden",
                    bgcolor: "#f1f5f9", minHeight: { xs: 360, lg: 480 },
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, background: `linear-gradient(180deg, ${alpha(ACCENT, 0.06)}, transparent)`, zIndex: 1 }} />
                  <Typography sx={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)", fontWeight: 900, fontSize: "0.65rem", letterSpacing: 6, color: alpha(ACCENT, 0.25), zIndex: 1, whiteSpace: "nowrap" }}>
                    TRAM STORE STATION
                  </Typography>

                  {product.tag && (
                    <Chip label={product.tag} sx={{ position: "absolute", top: 20, left: 20, zIndex: 2, bgcolor: "#fff", fontWeight: 800, fontSize: "0.65rem", letterSpacing: 0.5, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }} />
                  )}

                  <IconButton onClick={() => setIsWished(!isWished)} sx={{ position: "absolute", top: 20, right: 20, zIndex: 2, bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", "&:hover": { bgcolor: "#fff" } }}>
                    {isWished ? <Favorite sx={{ color: "#ef4444", fontSize: 20 }} /> : <FavoriteBorder sx={{ color: "#94a3b8", fontSize: 20 }} />}
                  </IconButton>

                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ zIndex: 2, padding: "40px" }}>
                    <img src={product.image} alt={product.title} style={{ maxWidth: "100%", maxHeight: "320px", objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.12))" }} />
                  </motion.div>
                </Box>
              </motion.div>

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<Share />} fullWidth sx={{ borderRadius: "14px", borderColor: "#e2e8f0", color: "#64748b", fontWeight: 700, textTransform: "none", py: 1.2, "&:hover": { borderColor: ACCENT, color: ACCENT } }}>
                  Chia sẻ
                </Button>
                <Button variant="outlined" startIcon={isWished ? <Favorite sx={{ color: "#ef4444" }} /> : <FavoriteBorder />} onClick={() => setIsWished(!isWished)} fullWidth sx={{ borderRadius: "14px", borderColor: "#e2e8f0", color: isWished ? "#ef4444" : "#64748b", fontWeight: 700, textTransform: "none", py: 1.2, "&:hover": { borderColor: isWished ? "#ef4444" : ACCENT } }}>
                  Yêu thích
                </Button>
              </Stack>

              <Paper elevation={0} sx={{ p: 3, borderRadius: "18px", border: "1px solid #f1f5f9", bgcolor: "#fafbfc" }}>
                <Typography sx={{ fontWeight: 900, fontSize: "0.75rem", letterSpacing: 1, color: "#64748b", mb: 2 }}>
                  <StoreIcon sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }} />
                  THÔNG TIN CỬA HÀNG
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "1.1rem" }}>
                    T
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontWeight: 800, color: DARK, fontSize: "0.95rem" }}>TramStore</Typography>
                      <Chip label="Uy tín" size="small" sx={{ bgcolor: alpha(ACCENT, 0.12), color: ACCENT, fontWeight: 800, fontSize: "0.6rem", height: 20 }} />
                    </Stack>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>⚡ Giao hàng tức thì • Hỗ trợ 24/7</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* ─────────── RIGHT COLUMN: Product Info ─────────── */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={3.5}>

              {/* Title + meta */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <Chip
                    icon={<TrainIcon sx={{ fontSize: "12px !important", color: "inherit" }} />}
                    label={product.category.toUpperCase()}
                    size="small"
                    sx={{ bgcolor: alpha(ACCENT, 0.12), color: ACCENT, fontWeight: 800, fontSize: "0.65rem", letterSpacing: 0.5, border: `1px solid ${alpha(ACCENT, 0.2)}` }}
                  />
                  {selectedVariant && (
                    <Chip
                      icon={<Inventory2 sx={{ fontSize: "12px !important", color: "inherit" }} />}
                      label={`${stock > 0 ? `Có sẵn: ${stock}` : "Hết hàng"}`}
                      size="small"
                      sx={{ bgcolor: stock > 0 ? alpha("#22c55e", 0.1) : alpha("#ef4444", 0.1), color: stock > 0 ? "#16a34a" : "#ef4444", fontWeight: 800, fontSize: "0.65rem" }}
                    />
                  )}
                </Stack>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900, color: DARK, lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {product.title}
                </Typography>
              </Box>

              {/* ═══ PRICE DISPLAY ═══ */}
              <Box
                sx={{
                  bgcolor: "#f8fafc", borderRadius: "20px",
                  p: 3, border: "1px solid #f1f5f9",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedVariantId}-${quantity}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="baseline">
                      <Typography
                        sx={{
                          fontSize: { xs: "2rem", md: "2.8rem" },
                          fontWeight: 900, color: ACCENT,
                          fontFamily: "'JetBrains Mono', monospace",
                          lineHeight: 1,
                        }}
                      >
                        {formatCurrency(totalPrice)}
                      </Typography>
                      {selectedVariant && selectedVariant.originalPrice > selectedVariant.price && (
                        <Typography
                          sx={{
                            fontSize: "1.1rem", color: "#94a3b8",
                            textDecoration: "line-through",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {formatCurrency(selectedVariant.originalPrice * quantity)}
                        </Typography>
                      )}
                      {selectedVariant && selectedVariant.discount > 0 && (
                        <Chip
                          label={`-${selectedVariant.discount}%`}
                          size="small"
                          sx={{
                            bgcolor: "#ef4444", color: "#fff",
                            fontWeight: 900, fontSize: "0.75rem",
                          }}
                        />
                      )}
                    </Stack>
                    {savingsAmount > 0 && (
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#16a34a", mt: 0.5 }}>
                        Tiết kiệm {formatCurrency(savingsAmount)}
                      </Typography>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Box>

              {/* ═══ CHỌN LOẠI — MAIN PRODUCT VARIANT SELECTOR ═══ */}
              {product.variants.length > 0 && (
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: DARK, mb: 2 }}>
                    <CategoryIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle", color: ACCENT }} />
                    Chọn loại:
                  </Typography>
                  <Grid container spacing={1.5}>
                    {product.variants.map((v) => {
                      const isSelected = selectedVariantId === v.id;
                      return (
                        <Grid size={{ xs: 6 }} key={v.id}>
                          <Box
                            onClick={() => setSelectedVariantId(v.id)}
                            sx={{
                              p: 2,
                              borderRadius: "14px",
                              cursor: "pointer",
                              border: isSelected
                                ? `2px solid ${ACCENT}`
                                : "2px solid #e2e8f0",
                              bgcolor: isSelected ? alpha(ACCENT, 0.04) : "#fff",
                              transition: "all 0.2s ease",
                              position: "relative",
                              minHeight: 80,
                              display: "flex",
                              alignItems: "center",
                              "&:hover": {
                                borderColor: ACCENT,
                                bgcolor: alpha(ACCENT, 0.02),
                              },
                            }}
                          >
                            {isSelected && (
                              <CheckCircle
                                sx={{
                                  position: "absolute", top: -8, right: -8,
                                  color: ACCENT, bgcolor: "#fff", borderRadius: "50%",
                                  fontSize: 22,
                                }}
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontSize: "0.82rem",
                                  fontWeight: isSelected ? 800 : 600,
                                  color: isSelected ? DARK : "#475569",
                                  lineHeight: 1.35,
                                }}
                              >
                                {v.label}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.78rem", fontWeight: 700,
                                  color: isSelected ? ACCENT : "#94a3b8",
                                  fontFamily: "'JetBrains Mono', monospace",
                                  mt: 0.5,
                                }}
                              >
                                {formatCurrency(v.price)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              {/* ═══ WARRANTY SELECTOR ═══ */}
              {selectedVariant?.warranties && selectedVariant.warranties.length > 0 && (
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: DARK, mb: 2 }}>
                    <Shield sx={{ fontSize: 18, mr: 1, verticalAlign: "middle", color: ACCENT }} />
                    Gói bảo hành:
                  </Typography>
                  <Grid container spacing={1.5}>
                    {selectedVariant.warranties.map((w) => {
                      const isSelected = selectedWarrantyValue === w.value;
                      return (
                        <Grid size={{ xs: 6, sm: 4 }} key={w.value}>
                          <Box
                            onClick={() => setSelectedWarrantyValue(w.value)}
                            sx={{
                              p: 2,
                              borderRadius: "14px",
                              cursor: "pointer",
                              border: isSelected
                                ? `2px solid ${ACCENT}`
                                : "2px solid #e2e8f0",
                              bgcolor: isSelected ? alpha(ACCENT, 0.04) : "#fff",
                              transition: "all 0.2s ease",
                              textAlign: "center",
                              position: "relative",
                              "&:hover": {
                                borderColor: ACCENT,
                                bgcolor: alpha(ACCENT, 0.02),
                              },
                            }}
                          >
                            {isSelected && (
                              <CheckCircle sx={{ position: "absolute", top: -8, right: -8, color: ACCENT, bgcolor: "#fff", borderRadius: "50%", fontSize: 22 }} />
                            )}
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: isSelected ? 800 : 600, color: isSelected ? DARK : "#475569" }}>
                              {w.label}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: isSelected ? ACCENT : "#94a3b8", fontFamily: "'JetBrains Mono', monospace", mt: 0.3 }}>
                              {w.price === 0 ? "Miễn phí" : `+${formatCurrency(w.price)}`}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              {/* ═══ TRUST BADGES ═══ */}
              <Grid container spacing={1.5}>
                {[
                  { icon: <Verified sx={{ fontSize: 24, color: ACCENT }} />, label: "Bảo vệ bởi", sub: "TramStore" },
                  { icon: <AccessTime sx={{ fontSize: 24, color: ACCENT }} />, label: "Giữ tiền", sub: "72h" },
                  { icon: <FlashOn sx={{ fontSize: 24, color: ACCENT }} />, label: "Giao hàng", sub: "tức thì" },
                ].map((badge, i) => (
                  <Grid size={4} key={i}>
                    <Box
                      sx={{
                        p: 2, borderRadius: "16px",
                        border: "1px solid #f1f5f9",
                        bgcolor: "#fafbfc",
                        textAlign: "center",
                        transition: "all 0.2s",
                        "&:hover": { borderColor: alpha(ACCENT, 0.2), bgcolor: alpha(ACCENT, 0.02) },
                      }}
                    >
                      {badge.icon}
                      <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#94a3b8", mt: 0.5, lineHeight: 1.2 }}>
                        {badge.label}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: DARK }}>
                        {badge.sub}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* ═══ QUANTITY + BUY ═══ */}
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f1f5f9", borderRadius: "14px", p: 0.5, border: "1px solid #e2e8f0" }}>
                    <IconButton onClick={() => handleQuantityChange(quantity - 1)} size="small" sx={{ color: DARK }}><Remove /></IconButton>
                    <Typography sx={{ px: 3, fontWeight: 900, minWidth: 50, textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{quantity}</Typography>
                    <IconButton onClick={() => handleQuantityChange(quantity + 1)} size="small" sx={{ color: DARK }}><Add /></IconButton>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleBuyNow}
                    disabled={!selectedVariantId}
                    fullWidth
                    startIcon={<TicketIcon />}
                    sx={{
                      height: 56, borderRadius: "16px",
                      fontSize: "1rem", fontWeight: 800,
                      letterSpacing: 1.5, bgcolor: ACCENT,
                      boxShadow: `0 8px 24px ${alpha(ACCENT, 0.35)}`,
                      textTransform: "uppercase",
                      "&:hover": { bgcolor: ACCENT_DARK, transform: "translateY(-2px)", boxShadow: `0 12px 32px ${alpha(ACCENT, 0.4)}` },
                      "&:disabled": { bgcolor: "#cbd5e1" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    MUA NGAY
                  </Button>

                  <IconButton
                    onClick={handleAddToCart}
                    sx={{
                      width: 56, height: 56, borderRadius: "16px",
                      border: "2px solid #e2e8f0",
                      color: addedToCart ? "#22c55e" : DARK,
                      transition: "all 0.2s",
                      "&:hover": { borderColor: ACCENT, color: ACCENT },
                    }}
                  >
                    {addedToCart ? <CheckCircle /> : <ShoppingCart />}
                  </IconButton>
                </Stack>

                {validationError && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                    <Alert severity="warning" sx={{ borderRadius: "12px" }}>{validationError}</Alert>
                  </motion.div>
                )}

                {showStockWarning && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Alert severity="info" sx={{ borderRadius: "12px" }}>Đã đạt giới hạn tồn kho ({stock} sản phẩm)</Alert>
                  </motion.div>
                )}
              </Stack>

            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* ══════════════════════════════════════
         TABS: DESCRIPTION / GUIDE
         ══════════════════════════════════════ */}
      <Box sx={{ borderTop: "1.5px solid #f1f5f9", pt: 6, pb: 10 }}>
        <Container maxWidth="xl">
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{
              mb: 5,
              "& .MuiTabs-indicator": { bgcolor: ACCENT, height: 3, borderRadius: "2px" },
              "& .MuiTab-root": {
                fontWeight: 800, letterSpacing: 1, color: "#94a3b8",
                textTransform: "none", fontSize: "0.9rem",
                "&.Mui-selected": { color: DARK }
              },
            }}
          >
            <Tab label="Thông tin sản phẩm" />
            <Tab label="Hướng dẫn sử dụng" />
            <Tab label="Đánh giá (12)" />
          </Tabs>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${tabValue}-${selectedVariantId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabValue === 0 && (
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: DARK, mb: 2 }}>
                        📋 Mô tả chi tiết
                      </Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.8, fontSize: "0.95rem", whiteSpace: "pre-line" }}>
                        {selectedVariant?.description}
                      </Typography>
                    </Box>

                    {selectedVariant?.features && selectedVariant.features.length > 0 && (
                      <>
                        <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: DARK, mb: 2 }}>
                          ✨ Tính năng nổi bật
                        </Typography>
                        <Stack spacing={1.5}>
                          {selectedVariant.features.map((f, i) => (
                            <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: ACCENT, flexShrink: 0 }} />
                              <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#475569" }}>{f}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, md: 5 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                      <Typography sx={{ fontWeight: 800, mb: 2.5, fontSize: "0.85rem", color: "#64748b" }}>
                        Thông số kỹ thuật
                      </Typography>
                      <Stack spacing={2}>
                        {[
                          { l: "Nền tảng", v: product.brand },
                          { l: "Danh mục", v: product.category },
                          { l: "Phiên bản", v: selectedVariant?.label ?? "Tiêu chuẩn" },
                          { l: "Bảo hành", v: selectedWarranty?.label ?? "Theo gói chọn" },
                          { l: "Hỗ trợ", v: "24/7 Live Chat" },
                          { l: "Giao hàng", v: "Tự động qua Email" },
                        ].map((item, i) => (
                          <Stack key={i} direction="row" justifyContent="space-between" sx={{ borderBottom: "1px dashed #e2e8f0", pb: 1 }}>
                            <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>{item.l}</Typography>
                            <Typography sx={{ color: DARK, fontSize: "0.85rem", fontWeight: 700 }}>{item.v}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {tabValue === 2 && (
                <Box>
                  <Grid container spacing={5}>
                    {/* Review Summary */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", bgcolor: alpha(ACCENT, 0.04), border: `1px solid ${alpha(ACCENT, 0.1)}`, textAlign: "center" }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#64748b", mb: 1.5, letterSpacing: 1 }}>ĐÁNH GIÁ TRUNG BÌNH</Typography>
                        <Typography sx={{ fontSize: "4rem", fontWeight: 900, color: DARK, lineHeight: 1 }}>4.9</Typography>
                        <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ my: 1.5 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} sx={{ color: "#fbbf24", fontSize: 24 }} />
                          ))}
                        </Stack>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8" }}>12 đánh giá thực tế</Typography>
                        
                        <Divider sx={{ my: 3, borderStyle: "dashed" }} />
                        
                        <Stack spacing={1.5}>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <Stack key={rating} direction="row" spacing={2} alignItems="center">
                              <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", width: 10 }}>{rating}</Typography>
                              <Box sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "#e2e8f0", overflow: "hidden" }}>
                                <Box sx={{ width: rating === 5 ? "92%" : rating === 4 ? "8%" : "0%", height: "100%", bgcolor: rating >= 4 ? "#fbbf24" : "#cbd5e1" }} />
                              </Box>
                              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", width: 30 }}>{rating === 5 ? "11" : rating === 4 ? "1" : "0"}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Paper>
                    </Grid>

                    {/* Review List */}
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Stack spacing={4}>
                        {[
                          { name: "Nguyễn Văn A", date: "2 ngày trước", rate: 5, content: "Sản phẩm tuyệt vời, giao hàng cực nhanh chưa đầy 30s. Rất hài lòng với dịch vụ khách hàng." },
                          { name: "Trần Thị B", date: "1 tuần trước", rate: 5, content: "Acc dùng rất mượt, đúng như mô tả. Sẽ tiếp tục ủng hộ shop trong tương lai." },
                          { name: "Phạm Minh C", date: "2 tuần trước", rate: 4, content: "Mọi thứ đều tốt, chỉ mong shop có thêm nhiều khuyến mãi hơn nữa cho khách quen." }
                        ].map((rev, i) => (
                          <Box key={i}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                              <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: alpha(ACCENT, 0.1), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: ACCENT }}>{rev.name[0]}</Box>
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                  <Typography sx={{ fontWeight: 800, color: DARK, fontSize: "0.95rem" }}>{rev.name}</Typography>
                                  <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>{rev.date}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={0.5} sx={{ mb: 1.5 }}>
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <StarIcon key={s} sx={{ fontSize: 16, color: s <= rev.rate ? "#fbbf24" : "#e2e8f0" }} />
                                  ))}
                                </Stack>
                                <Typography sx={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>{rev.content}</Typography>
                                <Button size="small" startIcon={<LikeIcon sx={{ fontSize: 14 }} />} sx={{ mt: 1, textTransform: "none", color: "#94a3b8", fontWeight: 700, "&:hover": { color: ACCENT } }}>Hữu ích</Button>
                              </Box>
                            </Stack>
                            {i < 2 && <Divider sx={{ mt: 4, borderStyle: "solid" }} />}
                          </Box>
                        ))}
                        
                        <Button variant="outlined" sx={{ borderRadius: "14px", py: 1.5, borderColor: "#e2e8f0", color: "#64748b", fontWeight: 800, textTransform: "none", fontSize: "0.9rem" }}>Xem thêm đánh giá</Button>

                        <Divider sx={{ my: 4 }} />
                        
                        {/* Write Review Form */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: DARK, mb: 1 }}>Viết đánh giá của bạn</Typography>
                          <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 3 }}>Chia sẻ trải nghiệm của bạn về sản phẩm này với những người khác.</Typography>
                          
                          <Stack spacing={3}>
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", mb: 1, color: DARK }}>Chất lượng sản phẩm:</Typography>
                              <Stack direction="row" spacing={0.5}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <IconButton key={s} onClick={() => setReviewRating(s)} sx={{ p: 0.5, color: s <= reviewRating ? "#fbbf24" : "#e2e8f0" }}>
                                    <StarIcon sx={{ fontSize: 32 }} />
                                  </IconButton>
                                ))}
                              </Stack>
                            </Box>
                            
                            <TextField
                              multiline
                              rows={4}
                              placeholder="Hãy cho chúng tôi biết bạn thích điều gì ở sản phẩm này..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              sx={{ 
                                "& .MuiOutlinedInput-root": { 
                                  bgcolor: "#fff", 
                                  borderRadius: "16px",
                                  "& fieldset": { borderColor: "#e2e8f0" },
                                  "&:hover fieldset": { borderColor: ACCENT },
                                } 
                              }}
                            />
                            
                            <Button 
                              variant="contained" 
                              sx={{ 
                                alignSelf: "flex-start", 
                                px: 4, 
                                py: 1.5, 
                                borderRadius: "12px", 
                                bgcolor: DARK, 
                                fontWeight: 800, 
                                textTransform: "none",
                                "&:hover": { bgcolor: "#000" }
                              }}
                            >
                              Gửi đánh giá
                            </Button>
                          </Stack>
                        </Paper>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>

      {/* ══════ RELATED PRODUCTS ══════ */}
      {relatedProducts.length > 0 && (
        <Box sx={{ bgcolor: "#f8fafc", py: 8 }}>
          <Container maxWidth="xl">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 5 }}>
              <Box>
                <Typography variant="overline" sx={{ color: ACCENT, fontWeight: 800, letterSpacing: 2 }}>SẢN PHẨM TƯƠNG TỰ</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: DARK }}>Sản phẩm bạn có thể thích</Typography>
              </Box>
              <Button component={Link} href="/" endIcon={<ArrowForward />} sx={{ fontWeight: 800, color: ACCENT, textTransform: "none" }}>Xem tất cả</Button>
            </Stack>
            <Grid container spacing={2}>
              {relatedProducts.map((rp) => (
                <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={rp.id}>
                  <Card
                    component={Link}
                    href={`/product/${rp.slug}`}
                    elevation={0}
                    sx={{
                      borderRadius: "16px", border: "1px solid #f1f5f9",
                      overflow: "hidden", transition: "all 0.25s", textDecoration: "none",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": { transform: "translateY(-6px)", boxShadow: "0 16px 32px rgba(0,0,0,0.06)", borderColor: alpha(ACCENT, 0.3) },
                    }}
                  >
                    <Box sx={{ p: 2.5, bgcolor: "#fff", display: "flex", justifyContent: "center", position: "relative" }}>
                      <img src={rp.image} alt={rp.title} style={{ width: "100%", height: "100px", objectFit: "contain" }} />
                      {rp.variants[0]?.discount > 0 && (
                        <Box sx={{ position: "absolute", top: 10, right: 10, bgcolor: "#ef4444", color: "#fff", px: 0.8, py: 0.2, borderRadius: "6px", fontWeight: 800, fontSize: "0.6rem" }}>
                          -{rp.variants[0].discount}%
                        </Box>
                      )}
                    </Box>
                    <CardContent sx={{ bgcolor: "#fafbfc", borderTop: "1px solid #f1f5f9", p: 2, flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: DARK, lineHeight: 1.3, mb: 0.8, height: 38, overflow: "hidden" }}>{rp.title}</Typography>
                      <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(rp.variants[0]?.price || 0)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: "12px", fontWeight: 800 }}>
          Đặt hàng thành công! Kiểm tra email của bạn.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailPage;

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  Divider,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Chip,
  alpha,
  InputAdornment,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Home,
  NavigateNext,
  ArrowBack,
  ArrowForward,
  Security,
  FlashOn,
  CheckCircle,
  AccountBalanceWallet,
  QrCode,
  LocalOffer,
  Lock,
  Email,
  Phone,
  Person,
  ExpandMore,
  ExpandLess,
  Verified,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/store/cartStore";
import { useAuth } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";

const ACCENT = "#3AB7AE";
const DARK = "#0f172a";

const STEPS = ["Thông tin", "Xác nhận", "Thanh toán"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showOrderItems, setShowOrderItems] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  // Pre-fill form nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  const finalPrice = totalPrice - discount;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "TRAMSTORE50") {
      setDiscount(50000);
      setCouponApplied(true);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Vui lòng nhập họ và tên";
    if (!form.email.trim()) errors.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Email không hợp lệ";
    if (!form.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, "")))
      errors.phone = "Số điện thoại không hợp lệ";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 0 && !validateForm()) return;
    setStep(step + 1);
  };

  /**
   * Tạo đơn hàng và chuyển đến trang thanh toán QR
   * Mỗi item trong giỏ hàng = 1 đơn hàng riêng
   * (vì mỗi sản phẩm = 1 variant cụ thể)
   */
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Tạo đơn hàng cho item đầu tiên (single-product checkout)
      // Nếu có nhiều items, tạo cho mỗi item
      const firstItem = items[0];
      if (!firstItem) {
        setSubmitError("Giỏ hàng trống");
        return;
      }

      const response = await api.orders.create({
        customerEmail: form.email.trim(),
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        productId: firstItem.productId,
        variantId: firstItem.variantId,
        paymentMethod: "VIETQR",
        note: form.note?.trim() || undefined,
      });

      // Lưu order data vào sessionStorage để payment page dùng
      sessionStorage.setItem(
        `order_${response.orderId}`,
        JSON.stringify(response)
      );

      // Clear cart
      clearCart();

      // Chuyển đến trang thanh toán QR
      router.push(`/payment?orderId=${response.orderId}`);
    } catch (error: any) {
      console.error("Order failed:", error);
      setSubmitError(
        error.message || "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step === 0) {
    return (
      <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
            Giỏ hàng trống
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/"
            sx={{ bgcolor: DARK, borderRadius: "14px", px: 5 }}
          >
            Về trang chủ
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* Breadcrumb */}
      <Box
        sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9", py: 2 }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" spacing={1} alignItems="center">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  color: "#64748b",
                  "&:hover": { color: ACCENT },
                }}
              >
                <Home sx={{ fontSize: 16 }} />
                <Typography
                  sx={{ fontSize: "0.75rem", fontWeight: 700 }}
                >
                  TRANG CHỦ
                </Typography>
              </Stack>
            </Link>
            <NavigateNext sx={{ fontSize: 14, color: "#cbd5e1" }} />
            <Link href="/cart" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  "&:hover": { color: ACCENT },
                }}
              >
                GIỎ HÀNG
              </Typography>
            </Link>
            <NavigateNext sx={{ fontSize: 14, color: "#cbd5e1" }} />
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: ACCENT,
              }}
            >
              THANH TOÁN
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        {/* Stepper */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: "1px solid #f1f5f9",
            p: { xs: 3, md: 4 },
            mb: 4,
          }}
        >
          <Stepper activeStep={step} alternativeLabel>
            {STEPS.map((label, idx) => (
              <Step key={label} completed={step > idx}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "&.MuiStepIcon-root": {
                        color:
                          step > idx
                            ? ACCENT
                            : step === idx
                              ? DARK
                              : "#e2e8f0",
                      },
                      "&.Mui-completed": { color: ACCENT },
                      "&.Mui-active": { color: DARK },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      color: step === idx ? DARK : "#94a3b8",
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={4}>
          {/* LEFT: Main content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <AnimatePresence mode="wait">
              {/* STEP 1: THÔNG TIN KHÁCH HÀNG */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <Stack spacing={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: "20px",
                        border: "1px solid #f1f5f9",
                        p: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: "1rem",
                          color: DARK,
                          mb: 3,
                        }}
                      >
                        📋 Thông tin khách hàng
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Họ và tên *"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person
                                    sx={{ fontSize: 18, color: "#94a3b8" }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                "&:hover fieldset": {
                                  borderColor: ACCENT,
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: ACCENT,
                                },
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: ACCENT,
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Số điện thoại *"
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                            error={!!formErrors.phone}
                            helperText={formErrors.phone}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone
                                    sx={{ fontSize: 18, color: "#94a3b8" }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                "&:hover fieldset": {
                                  borderColor: ACCENT,
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: ACCENT,
                                },
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: ACCENT,
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Email nhận hàng *"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            error={!!formErrors.email}
                            helperText={
                              formErrors.email ||
                              "Thông tin tài khoản sẽ được gửi vào email này"
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email
                                    sx={{ fontSize: 18, color: "#94a3b8" }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                "&:hover fieldset": {
                                  borderColor: ACCENT,
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: ACCENT,
                                },
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: ACCENT,
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Ghi chú đơn hàng (tuỳ chọn)"
                            multiline
                            rows={3}
                            value={form.note}
                            onChange={(e) =>
                              setForm({ ...form, note: e.target.value })
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                "&:hover fieldset": {
                                  borderColor: ACCENT,
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: ACCENT,
                                },
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: ACCENT,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Phương thức thanh toán - chỉ VietQR */}
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: "20px",
                        border: "1px solid #f1f5f9",
                        p: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: "1rem",
                          color: DARK,
                          mb: 2,
                        }}
                      >
                        💳 Phương thức thanh toán
                      </Typography>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: "16px",
                          border: `2px solid ${ACCENT}`,
                          bgcolor: alpha(ACCENT, 0.04),
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "12px",
                              bgcolor: alpha(ACCENT, 0.12),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: ACCENT,
                            }}
                          >
                            <QrCode />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  color: DARK,
                                  fontSize: "0.95rem",
                                }}
                              >
                                Chuyển khoản ngân hàng (VietQR)
                              </Typography>
                              <Chip
                                label="Mặc định"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.6rem",
                                  fontWeight: 800,
                                  bgcolor: alpha(ACCENT, 0.12),
                                  color: ACCENT,
                                }}
                              />
                            </Stack>
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: "#94a3b8",
                                fontWeight: 600,
                              }}
                            >
                              Quét mã QR bằng app ngân hàng • Xác nhận tự
                              động trong 2-5 phút
                            </Typography>
                          </Box>
                          <CheckCircle sx={{ color: ACCENT }} />
                        </Stack>
                      </Box>
                    </Paper>

                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNextStep}
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: DARK,
                        fontWeight: 900,
                        height: 56,
                        borderRadius: "16px",
                        textTransform: "none",
                        fontSize: "1rem",
                        alignSelf: "flex-end",
                        px: 5,
                        "&:hover": { bgcolor: "#1e293b" },
                      }}
                    >
                      Tiếp tục
                    </Button>
                  </Stack>
                </motion.div>
              )}

              {/* STEP 2: XÁC NHẬN ĐƠN HÀNG */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <Stack spacing={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: "20px",
                        border: "1px solid #f1f5f9",
                        p: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: "1rem",
                          color: DARK,
                          mb: 3,
                        }}
                      >
                        🧾 Xác nhận đơn hàng
                      </Typography>

                      {/* Customer info review */}
                      <Box
                        sx={{
                          mb: 3,
                          p: 2.5,
                          borderRadius: "14px",
                          bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: "#64748b",
                            fontSize: "0.8rem",
                            mb: 1.5,
                            letterSpacing: 1,
                          }}
                        >
                          THÔNG TIN KHÁCH HÀNG
                        </Typography>
                        <Stack spacing={0.8}>
                          {[
                            { l: "Họ tên", v: form.name || "—" },
                            { l: "Email", v: form.email || "—" },
                            { l: "SĐT", v: form.phone || "—" },
                          ].map((r, i) => (
                            <Stack key={i} direction="row" spacing={2}>
                              <Typography
                                sx={{
                                  width: 60,
                                  fontSize: "0.83rem",
                                  color: "#94a3b8",
                                  fontWeight: 600,
                                }}
                              >
                                {r.l}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.83rem",
                                  fontWeight: 800,
                                  color: DARK,
                                }}
                              >
                                {r.v}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>

                      {/* Payment method review */}
                      <Box
                        sx={{
                          mb: 3,
                          p: 2.5,
                          borderRadius: "14px",
                          bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: "#64748b",
                            fontSize: "0.8rem",
                            mb: 1.5,
                            letterSpacing: 1,
                          }}
                        >
                          PHƯƠNG THỨC THANH TOÁN
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <AccountBalanceWallet
                            sx={{ fontSize: 18, color: ACCENT }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 800,
                              color: DARK,
                              fontSize: "0.9rem",
                            }}
                          >
                            Chuyển khoản ngân hàng (VietQR)
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Terms */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          bgcolor: alpha(ACCENT, 0.04),
                          border: `1px solid ${alpha(ACCENT, 0.15)}`,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <Lock
                            sx={{
                              fontSize: 16,
                              color: ACCENT,
                              mt: 0.2,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              color: "#475569",
                              fontWeight: 600,
                              lineHeight: 1.6,
                            }}
                          >
                            Bằng cách nhấn &quot;Đặt hàng&quot;, bạn đồng
                            ý với{" "}
                            <span
                              style={{ color: ACCENT, fontWeight: 800 }}
                            >
                              Điều khoản dịch vụ
                            </span>{" "}
                            và{" "}
                            <span
                              style={{ color: ACCENT, fontWeight: 800 }}
                            >
                              Chính sách bảo mật
                            </span>{" "}
                            của TramStore.
                          </Typography>
                        </Stack>
                      </Box>
                    </Paper>

                    {submitError && (
                      <Alert
                        severity="error"
                        sx={{ borderRadius: "12px" }}
                        onClose={() => setSubmitError(null)}
                      >
                        {submitError}
                      </Alert>
                    )}

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => setStep(0)}
                        sx={{
                          borderRadius: "16px",
                          borderColor: "#e2e8f0",
                          color: "#475569",
                          fontWeight: 800,
                          px: 4,
                          height: 56,
                          textTransform: "none",
                          "&:hover": { borderColor: DARK, color: DARK },
                        }}
                      >
                        Quay lại
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handlePlaceOrder}
                        disabled={submitting}
                        startIcon={
                          submitting ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <CheckCircle />
                          )
                        }
                        sx={{
                          bgcolor: ACCENT,
                          fontWeight: 900,
                          height: 56,
                          borderRadius: "16px",
                          textTransform: "none",
                          fontSize: "1rem",
                          letterSpacing: 0.5,
                          boxShadow: `0 8px 24px ${alpha(ACCENT, 0.35)}`,
                          "&:hover": {
                            bgcolor: "#2a9b93",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.25s ease",
                        }}
                      >
                        {submitting
                          ? "Đang xử lý..."
                          : `Đặt hàng — ${formatCurrency(finalPrice)}`}
                      </Button>
                    </Stack>
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>

          {/* RIGHT: Order summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "24px",
                  border: "1px solid #f1f5f9",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 3, bgcolor: DARK }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: "#fff",
                          fontSize: "1rem",
                        }}
                      >
                        Đơn hàng của bạn
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.45)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {totalItems} sản phẩm
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => setShowOrderItems(!showOrderItems)}
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        "&:hover": { color: "#fff" },
                      }}
                    >
                      {showOrderItems ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Stack>
                </Box>

                <Collapse in={showOrderItems}>
                  <Box
                    sx={{ p: 2.5, borderBottom: "1px solid #f1f5f9" }}
                  >
                    <Stack spacing={1.5}>
                      {items.map((item) => (
                        <Stack
                          key={item.id}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "10px",
                              bgcolor: "#f8fafc",
                              border: "1px solid #f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              p: 0.5,
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.productImage}
                              alt={item.productTitle}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                color: DARK,
                                lineHeight: 1.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.productTitle}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.72rem",
                                color: "#94a3b8",
                              }}
                            >
                              {item.variantLabel} × {item.quantity}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              color: ACCENT,
                              fontFamily:
                                "'JetBrains Mono', monospace",
                              flexShrink: 0,
                            }}
                          >
                            {formatCurrency(
                              item.price * item.quantity
                            )}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Collapse>

                <Box sx={{ p: 3 }}>
                  {/* Coupon */}
                  {!couponApplied ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mb: 2.5 }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Mã giảm giá"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalOffer
                                sx={{ fontSize: 16, color: "#94a3b8" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleApplyCoupon}
                        sx={{
                          bgcolor: DARK,
                          borderRadius: "10px",
                          fontWeight: 800,
                          textTransform: "none",
                          px: 2,
                          flexShrink: 0,
                          "&:hover": { bgcolor: "#1e293b" },
                        }}
                      >
                        Áp dụng
                      </Button>
                    </Stack>
                  ) : (
                    <Box
                      sx={{
                        mb: 2.5,
                        p: 1.5,
                        borderRadius: "10px",
                        bgcolor: alpha("#16a34a", 0.08),
                        border: "1px solid rgba(22,163,74,0.2)",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <CheckCircle
                          sx={{ fontSize: 18, color: "#16a34a" }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.82rem",
                            fontWeight: 800,
                            color: "#16a34a",
                          }}
                        >
                          Mã TRAMSTORE50 — Giảm{" "}
                          {formatCurrency(50000)}
                        </Typography>
                      </Stack>
                    </Box>
                  )}

                  <Stack spacing={1.2} sx={{ mb: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        sx={{
                          color: "#64748b",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                        }}
                      >
                        Tạm tính
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: DARK,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.88rem",
                        }}
                      >
                        {formatCurrency(totalPrice)}
                      </Typography>
                    </Stack>
                    {discount > 0 && (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                          }}
                        >
                          Giảm giá
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: "#16a34a",
                            fontSize: "0.88rem",
                          }}
                        >
                          -{formatCurrency(discount)}
                        </Typography>
                      </Stack>
                    )}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        sx={{
                          color: "#64748b",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                        }}
                      >
                        Phí giao hàng
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#16a34a",
                          fontSize: "0.88rem",
                        }}
                      >
                        Miễn phí
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: DARK,
                        fontSize: "1rem",
                      }}
                    >
                      Tổng cộng
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: ACCENT,
                        fontSize: "1.4rem",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {formatCurrency(finalPrice)}
                    </Typography>
                  </Stack>

                  {/* Trust */}
                  <Stack spacing={1.2}>
                    {[
                      {
                        icon: (
                          <FlashOn sx={{ fontSize: 16, color: ACCENT }} />
                        ),
                        text: "Giao hàng tức thì qua email",
                      },
                      {
                        icon: (
                          <Security
                            sx={{ fontSize: 16, color: ACCENT }}
                          />
                        ),
                        text: "Bảo vệ mua sắm 72 giờ",
                      },
                      {
                        icon: (
                          <Verified
                            sx={{ fontSize: 16, color: ACCENT }}
                          />
                        ),
                        text: "Cam kết hoàn tiền nếu lỗi",
                      },
                    ].map((b, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        {b.icon}
                        <Typography
                          sx={{
                            fontSize: "0.76rem",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          {b.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

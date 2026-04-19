"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Stack,
  Grid,
  Paper,
  Divider,
  Chip,
  alpha,
} from "@mui/material";
import {
  Remove,
  Add,
  DeleteOutline,
  ShoppingCartOutlined as CartIcon,
  ArrowForward,
  ArrowBack,
  LocalShipping,
  Security,
  FlashOn,
  Inventory2,
  Home,
  NavigateNext,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

const ACCENT = "#3AB7AE";
const DARK = "#0f172a";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } =
    useCart();

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* Breadcrumb */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9", py: 2 }}>
        <Container maxWidth="xl">
          <Stack direction="row" spacing={1} alignItems="center">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  "&:hover": { color: ACCENT },
                }}
              >
                <Home sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700 }}>
                  TRANG CHỦ
                </Typography>
              </Stack>
            </Link>
            <NavigateNext sx={{ fontSize: 14, color: "#cbd5e1" }} />
            <Typography
              sx={{ fontSize: "0.75rem", fontWeight: 700, color: ACCENT }}
            >
              GIỎ HÀNG
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, color: DARK, letterSpacing: -0.5 }}
            >
              Giỏ hàng của bạn
            </Typography>
            {totalItems > 0 && (
              <Typography
                sx={{ color: "#64748b", fontWeight: 600, mt: 0.5 }}
              >
                {totalItems} sản phẩm đang chờ thanh toán
              </Typography>
            )}
          </Box>

          {items.length > 0 && (
            <Button
              variant="text"
              onClick={clearCart}
              sx={{
                color: "#ef4444",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: alpha("#ef4444", 0.05) },
              }}
            >
              Xóa tất cả
            </Button>
          )}
        </Stack>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "28px",
                p: { xs: 6, md: 12 },
                textAlign: "center",
                border: "1px solid #f1f5f9",
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "28px",
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Inventory2 sx={{ fontSize: 44, color: "#cbd5e1" }} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: DARK, mb: 1.5 }}
              >
                Giỏ hàng trống
              </Typography>
              <Typography
                sx={{
                  color: "#94a3b8",
                  mb: 4,
                  fontWeight: 600,
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                Hãy khám phá hàng trăm sản phẩm số premium và thêm vào giỏ
                hàng!
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/"
                size="large"
                sx={{
                  bgcolor: DARK,
                  borderRadius: "16px",
                  px: 6,
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Khám phá ngay
              </Button>
            </Paper>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            {/* LEFT: Items */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={2}>
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          borderRadius: "20px",
                          border: "1px solid #f1f5f9",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: alpha(ACCENT, 0.3),
                            boxShadow: `0 8px 24px ${alpha(ACCENT, 0.06)}`,
                          },
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={3}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                        >
                          {/* Image */}
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: "16px",
                              bgcolor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              p: 1.5,
                            }}
                          >
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

                          {/* Info */}
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: DARK,
                                fontSize: "0.95rem",
                                mb: 0.5,
                                lineHeight: 1.3,
                              }}
                            >
                              <Link
                                href={`/product/${item.slug}`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                {item.productTitle}
                              </Link>
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                              <Chip
                                label={item.variantLabel}
                                size="small"
                                sx={{
                                  bgcolor: alpha(ACCENT, 0.1),
                                  color: ACCENT,
                                  fontWeight: 800,
                                  fontSize: "0.7rem",
                                }}
                              />
                              {item.warrantyLabel && (
                                <Chip
                                  label={item.warrantyLabel}
                                  size="small"
                                  sx={{
                                    bgcolor: "#f1f5f9",
                                    color: "#64748b",
                                    fontWeight: 700,
                                    fontSize: "0.7rem",
                                  }}
                                />
                              )}
                            </Stack>

                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={2}
                              alignItems={{ xs: "flex-start", sm: "center" }}
                              justifyContent="space-between"
                            >
                              {/* Qty control */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  bgcolor: "#f8fafc",
                                  borderRadius: "12px",
                                  border: "1px solid #e2e8f0",
                                  p: 0.5,
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  sx={{ color: "#475569" }}
                                >
                                  <Remove sx={{ fontSize: 16 }} />
                                </IconButton>
                                <Typography
                                  sx={{
                                    px: 2,
                                    fontWeight: 900,
                                    fontSize: "0.95rem",
                                    color: DARK,
                                    minWidth: 40,
                                    textAlign: "center",
                                    fontFamily: "'JetBrains Mono', monospace",
                                  }}
                                >
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  sx={{ color: "#475569" }}
                                >
                                  <Add sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>

                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box>
                                  {item.originalPrice > item.price && (
                                    <Typography
                                      sx={{
                                        fontSize: "0.78rem",
                                        color: "#94a3b8",
                                        textDecoration: "line-through",
                                        fontFamily:
                                          "'JetBrains Mono', monospace",
                                      }}
                                    >
                                      {formatCurrency(
                                        item.originalPrice * item.quantity
                                      )}
                                    </Typography>
                                  )}
                                  <Typography
                                    sx={{
                                      fontWeight: 900,
                                      fontSize: "1.1rem",
                                      color: ACCENT,
                                      fontFamily: "'JetBrains Mono', monospace",
                                    }}
                                  >
                                    {formatCurrency(item.price * item.quantity)}
                                  </Typography>
                                </Box>
                                <IconButton
                                  onClick={() => removeItem(item.id)}
                                  sx={{
                                    color: "#cbd5e1",
                                    "&:hover": {
                                      color: "#ef4444",
                                      bgcolor: alpha("#ef4444", 0.06),
                                    },
                                  }}
                                >
                                  <DeleteOutline />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>
                      </Paper>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Continue shopping */}
                <Button
                  startIcon={<ArrowBack />}
                  component={Link}
                  href="/"
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "none",
                    alignSelf: "flex-start",
                    "&:hover": { color: ACCENT },
                  }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Stack>
            </Grid>

            {/* RIGHT: Summary */}
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
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: "#fff",
                        fontSize: "1rem",
                        mb: 0.3,
                      }}
                    >
                      Tóm tắt đơn hàng
                    </Typography>
                    <Typography
                      sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}
                    >
                      {totalItems} sản phẩm
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Items list */}
                    <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                      {items.map((item) => (
                        <Stack
                          key={item.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              color: "#475569",
                              fontWeight: 600,
                              flex: 1,
                              pr: 1,
                              lineHeight: 1.3,
                            }}
                          >
                            {item.productTitle}
                            <span
                              style={{ color: "#94a3b8", fontWeight: 700 }}
                            >
                              {" "}
                              ×{item.quantity}
                            </span>
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              fontWeight: 800,
                              color: DARK,
                              fontFamily: "'JetBrains Mono', monospace",
                              flexShrink: 0,
                            }}
                          >
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* Totals */}
                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          Tạm tính
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: DARK,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {formatCurrency(totalPrice)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          Phí vận chuyển
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: "#16a34a",
                            fontSize: "0.9rem",
                          }}
                        >
                          Miễn phí
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ mb: 2.5 }} />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Typography sx={{ fontWeight: 900, color: DARK, fontSize: "1.1rem" }}>
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
                        {formatCurrency(totalPrice)}
                      </Typography>
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      href="/checkout"
                      endIcon={<ArrowForward />}
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
                          boxShadow: `0 12px 32px ${alpha(ACCENT, 0.4)}`,
                        },
                        transition: "all 0.25s ease",
                        mb: 2,
                      }}
                    >
                      Thanh toán ngay
                    </Button>

                    {/* Trust badges */}
                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      {[
                        {
                          icon: <LocalShipping sx={{ fontSize: 16, color: ACCENT }} />,
                          text: "Giao hàng kỹ thuật số tức thì",
                        },
                        {
                          icon: <Security sx={{ fontSize: 16, color: ACCENT }} />,
                          text: "Bảo vệ mua sắm 72h",
                        },
                        {
                          icon: <FlashOn sx={{ fontSize: 16, color: ACCENT }} />,
                          text: "Hỗ trợ 24/7 — Phản hồi trong 5 phút",
                        },
                      ].map((b, i) => (
                        <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                          {b.icon}
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
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
        )}
      </Container>
    </Box>
  );
}

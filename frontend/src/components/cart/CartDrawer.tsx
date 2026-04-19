"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Divider,
  Badge,
  alpha,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCartOutlined as CartIcon,
  Remove,
  Add,
  DeleteOutline,
  ArrowForward,
  LocalShipping,
  Inventory2,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

const ACCENT = "#3AB7AE";
const DARK = "#0f172a";

export default function CartDrawer() {
  const {
    items,
    drawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  const shipping = totalPrice >= 500000 ? 0 : 0; // digital: always free
  const finalPrice = totalPrice + shipping;

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 460 },
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* ── HEADER ── */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f1f5f9",
          bgcolor: "#fafbfc",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              bgcolor: alpha(ACCENT, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CartIcon sx={{ color: ACCENT, fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              sx={{ fontWeight: 900, fontSize: "1rem", color: DARK, lineHeight: 1 }}
            >
              Giỏ hàng
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", fontWeight: 600 }}
            >
              {totalItems} sản phẩm
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={closeDrawer}
          sx={{
            bgcolor: "#f1f5f9",
            borderRadius: "10px",
            "&:hover": { bgcolor: "#e2e8f0" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── ITEMS ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2 }}>
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Stack alignItems="center" spacing={2} sx={{ py: 10 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "24px",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Inventory2 sx={{ fontSize: 36, color: "#cbd5e1" }} />
                </Box>
                <Typography
                  sx={{ fontWeight: 700, color: "#94a3b8", fontSize: "0.95rem" }}
                >
                  Giỏ hàng trống
                </Typography>
                <Button
                  variant="contained"
                  onClick={closeDrawer}
                  component={Link}
                  href="/"
                  sx={{
                    bgcolor: DARK,
                    borderRadius: "12px",
                    fontWeight: 800,
                    textTransform: "none",
                    px: 4,
                  }}
                >
                  Khám phá sản phẩm
                </Button>
              </Stack>
            </motion.div>
          ) : (
            items.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    mb: 1.5,
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#fafbfc",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: alpha(ACCENT, 0.3) },
                  }}
                >
                  {/* Product image */}
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "12px",
                      bgcolor: "#fff",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      overflow: "hidden",
                      p: 1,
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
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        color: DARK,
                        lineHeight: 1.3,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.productTitle}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                      <Chip
                        label={item.variantLabel}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          bgcolor: alpha(ACCENT, 0.1),
                          color: ACCENT,
                        }}
                      />
                      {item.warrantyLabel && (
                        <Chip
                          label={item.warrantyLabel}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            bgcolor: "#f1f5f9",
                            color: "#64748b",
                          }}
                        />
                      )}
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {/* Quantity control */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          bgcolor: "#fff",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          sx={{ p: 0.3, color: "#64748b" }}
                        >
                          <Remove sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Typography
                          sx={{
                            px: 1.5,
                            fontWeight: 900,
                            fontSize: "0.8rem",
                            color: DARK,
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
                          sx={{ p: 0.3, color: "#64748b" }}
                        >
                          <Add sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          sx={{
                            fontWeight: 900,
                            fontSize: "0.9rem",
                            color: ACCENT,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {formatCurrency(item.price * item.quantity)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          sx={{
                            color: "#cbd5e1",
                            p: 0.5,
                            "&:hover": { color: "#ef4444" },
                          }}
                        >
                          <DeleteOutline sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Box>

      {/* ── FOOTER / SUMMARY ── */}
      {items.length > 0 && (
        <Box sx={{ borderTop: "1px solid #f1f5f9", p: 3, bgcolor: "#fafbfc" }}>
          {/* Free shipping notice */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              mb: 2.5,
              p: 1.5,
              borderRadius: "10px",
              bgcolor: alpha(ACCENT, 0.06),
              border: `1px solid ${alpha(ACCENT, 0.15)}`,
            }}
          >
            <LocalShipping sx={{ fontSize: 18, color: ACCENT }} />
            <Typography
              sx={{ fontSize: "0.78rem", fontWeight: 700, color: ACCENT }}
            >
              🎉 Giao hàng kỹ thuật số — Miễn phí & Tức thì
            </Typography>
          </Stack>

          {/* Price breakdown */}
          <Stack spacing={1.2} sx={{ mb: 2.5 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}
              >
                Tạm tính ({totalItems} SP)
              </Typography>
              <Typography
                sx={{
                  color: DARK,
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {formatCurrency(totalPrice)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}
              >
                Phí giao hàng
              </Typography>
              <Typography
                sx={{ color: "#16a34a", fontSize: "0.85rem", fontWeight: 800 }}
              >
                Miễn phí
              </Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: DARK, fontWeight: 900, fontSize: "1rem" }}>
                Tổng cộng
              </Typography>
              <Typography
                sx={{
                  color: ACCENT,
                  fontWeight: 900,
                  fontSize: "1.2rem",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {formatCurrency(finalPrice)}
              </Typography>
            </Stack>
          </Stack>

          {/* Actions */}
          <Stack spacing={1.5}>
            <Button
              variant="contained"
              fullWidth
              component={Link}
              href="/checkout"
              onClick={closeDrawer}
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: ACCENT,
                fontWeight: 900,
                fontSize: "0.95rem",
                height: 52,
                borderRadius: "14px",
                textTransform: "none",
                letterSpacing: 0.5,
                boxShadow: `0 8px 24px ${alpha(ACCENT, 0.35)}`,
                "&:hover": {
                  bgcolor: "#2a9b93",
                  transform: "translateY(-1px)",
                  boxShadow: `0 12px 32px ${alpha(ACCENT, 0.4)}`,
                },
                transition: "all 0.25s ease",
              }}
            >
              Tiến hành thanh toán
            </Button>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/cart"
              onClick={closeDrawer}
              sx={{
                fontWeight: 800,
                height: 44,
                borderRadius: "14px",
                textTransform: "none",
                borderColor: "#e2e8f0",
                color: "#475569",
                "&:hover": { borderColor: ACCENT, color: ACCENT },
              }}
            >
              Xem giỏ hàng
            </Button>
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}

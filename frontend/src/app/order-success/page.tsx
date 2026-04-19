"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Email,
  FlashOn,
  Security,
  SupportAgent,
  ArrowForward,
  Home,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import confetti from "canvas-confetti";
import { api, OrderDetail } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

import { useSearchParams } from "next/navigation";

const ACCENT = "#3AB7AE";
const DARK = "#0f172a";

function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors: ["#3AB7AE", "#0f172a", "#f59e0b", "#ef4444", "#8b5cf6"],
  });
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(fireConfetti, 300);
    return () => clearTimeout(timer);
  }, []);

  // Fetch order details
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    api.orders
      .getById(orderId)
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        console.error("Failed to fetch order:", err);
      })
      .finally(() => {
        setLoading(false);
        // Cleanup session storage
        sessionStorage.removeItem(`order_${orderId}`);
      });
  }, [orderId]);

  const orderNumber = orderId
    ? orderId.slice(0, 8).toUpperCase()
    : `TS${Date.now().toString().slice(-8)}`;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 12 } }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <CircularProgress sx={{ color: ACCENT }} />
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "32px",
                border: "1px solid #f1f5f9",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {/* Header gradient */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${DARK} 0%, #1e293b 100%)`,
                  pt: 8,
                  pb: 6,
                  px: 4,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative blurs */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -60,
                    right: -60,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    bgcolor: ACCENT,
                    opacity: 0.07,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -40,
                    left: -40,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    bgcolor: ACCENT,
                    opacity: 0.05,
                  }}
                />

                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      bgcolor: alpha(ACCENT, 0.15),
                      border: `3px solid ${alpha(ACCENT, 0.3)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 54, color: ACCENT }} />
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: "#fff",
                      mb: 1.5,
                      letterSpacing: -0.5,
                    }}
                  >
                    Thanh toán thành công! 🎉
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 600,
                      maxWidth: 480,
                      mx: "auto",
                      fontSize: "1rem",
                    }}
                  >
                    Cảm ơn bạn đã tin tưởng TramStore. Chúng tôi sẽ xử lý
                    đơn hàng và gửi thông tin qua email sớm nhất.
                  </Typography>
                </motion.div>
              </Box>

              <Box sx={{ p: { xs: 4, md: 6 } }}>
                {/* Order number */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 3,
                      py: 1.5,
                      borderRadius: "14px",
                      bgcolor: alpha(ACCENT, 0.08),
                      border: `1px solid ${alpha(ACCENT, 0.2)}`,
                      mb: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      Mã đơn hàng:
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: ACCENT,
                        fontSize: "1rem",
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: 1,
                      }}
                    >
                      #{orderNumber}
                    </Typography>
                  </Box>
                </motion.div>

                {/* Order info */}
                {order && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Box
                      sx={{
                        mb: 4,
                        p: 2.5,
                        borderRadius: "14px",
                        bgcolor: "#f8fafc",
                        border: "1px solid #f1f5f9",
                        textAlign: "left",
                        maxWidth: 400,
                        mx: "auto",
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                            }}
                          >
                            Tổng thanh toán
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              color: ACCENT,
                              fontFamily:
                                "'JetBrains Mono', monospace",
                              fontSize: "0.9rem",
                            }}
                          >
                            {formatCurrency(order.totalAmount)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                            }}
                          >
                            Email nhận hàng
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: DARK,
                              fontSize: "0.82rem",
                            }}
                          >
                            {order.customerEmail}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </motion.div>
                )}

                {/* Steps */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <Stack
                    spacing={3}
                    sx={{
                      mb: 5,
                      textAlign: "left",
                      maxWidth: 480,
                      mx: "auto",
                    }}
                  >
                    {[
                      {
                        icon: (
                          <Email
                            sx={{ fontSize: 22, color: ACCENT }}
                          />
                        ),
                        title: "Kiểm tra email",
                        desc: "Thông tin tài khoản sẽ được gửi đến hộp thư của bạn sau khi chúng tôi xử lý đơn hàng",
                      },
                      {
                        icon: (
                          <FlashOn
                            sx={{ fontSize: 22, color: "#f59e0b" }}
                          />
                        ),
                        title: "Kích hoạt ngay",
                        desc: "Đăng nhập vào dịch vụ và thay đổi mật khẩu nếu cần",
                      },
                      {
                        icon: (
                          <Security
                            sx={{ fontSize: 22, color: "#8b5cf6" }}
                          />
                        ),
                        title: "Bảo vệ đơn hàng 72h",
                        desc: "Liên hệ chúng tôi nếu gặp bất kỳ vấn đề nào",
                      },
                      {
                        icon: (
                          <SupportAgent
                            sx={{ fontSize: 22, color: "#ef4444" }}
                          />
                        ),
                        title: "Hỗ trợ 24/7",
                        desc: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn",
                      },
                    ].map((item, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={2.5}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            bgcolor: "#f8fafc",
                            border: "1px solid #f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              color: DARK,
                              fontSize: "0.9rem",
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              mt: 0.3,
                            }}
                          >
                            {item.desc}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </motion.div>

                <Divider sx={{ mb: 4 }} />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="center"
                  >
                    <Button
                      variant="contained"
                      component={Link}
                      href="/"
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: ACCENT,
                        fontWeight: 900,
                        height: 52,
                        borderRadius: "16px",
                        textTransform: "none",
                        fontSize: "0.95rem",
                        px: 4,
                        boxShadow: `0 8px 24px ${alpha(ACCENT, 0.35)}`,
                        "&:hover": { bgcolor: "#2a9b93" },
                      }}
                    >
                      Tiếp tục mua sắm
                    </Button>
                    <Button
                      variant="outlined"
                      component={Link}
                      href="/"
                      startIcon={<Home />}
                      sx={{
                        fontWeight: 800,
                        height: 52,
                        borderRadius: "16px",
                        textTransform: "none",
                        borderColor: "#e2e8f0",
                        color: "#475569",
                        px: 4,
                        "&:hover": { borderColor: DARK, color: DARK },
                      }}
                    >
                      Về trang chủ
                    </Button>
                  </Stack>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }} />
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

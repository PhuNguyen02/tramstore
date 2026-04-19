"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  LinearProgress,
  alpha,
} from "@mui/material";
import {
  QrCode,
  ContentCopy,
  CheckCircle,
  Timer,
  ArrowBack,
  Home,
  SupportAgent,
  Refresh,
  CancelOutlined,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { api, CreateOrderResponse } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const ACCENT = "#3AB7AE";
const DARK = "#0f172a";
const POLL_INTERVAL = 5000; // poll mỗi 5 giây
const PAYMENT_TIMEOUT = 15 * 60; // 15 phút

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
  const [status, setStatus] = useState<string>("AWAITING_PAYMENT");
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lấy order data từ sessionStorage (set từ checkout page)
  useEffect(() => {
    if (!orderId) {
      router.replace("/checkout");
      return;
    }

    const stored = sessionStorage.getItem(`order_${orderId}`);
    if (stored) {
      try {
        setOrderData(JSON.parse(stored));
      } catch {
        setError("Không thể tải thông tin đơn hàng");
      }
    } else {
      // Fallback: fetch from API
      api.orders.getById(orderId).then((order) => {
        // Nếu đã thanh toán, redirect
        if (order.status === "PAID" || order.status === "COMPLETED") {
          router.replace(`/order-success?id=${orderId}`);
          return;
        }
        if (order.status === "EXPIRED" || order.status === "CANCELLED") {
          setStatus(order.status);
        }
      }).catch(() => {
        setError("Đơn hàng không tồn tại");
      });
    }
  }, [orderId, router]);

  // Polling trạng thái thanh toán
  const pollStatus = useCallback(async () => {
    if (!orderId) return;
    try {
      const order = await api.orders.getById(orderId);
      setStatus(order.status);

      if (order.status === "PAID" || order.status === "COMPLETED") {
        // Thanh toán thành công → redirect
        sessionStorage.removeItem(`order_${orderId}`);
        router.replace(`/order-success?id=${orderId}`);
      }
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (
      status !== "AWAITING_PAYMENT" &&
      status !== "PENDING"
    ) return;

    const interval = setInterval(pollStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [status, pollStatus]);

  // Countdown timer
  useEffect(() => {
    if (status !== "AWAITING_PAYMENT" && status !== "PENDING") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const bankInfo = orderData?.bankInfo;

  // Error state
  if (error) {
    return (
      <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
            {error}
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

  // Expired state
  if (status === "EXPIRED" || status === "CANCELLED") {
    return (
      <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: alpha("#ef4444", 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <CancelOutlined sx={{ fontSize: 40, color: "#ef4444" }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight={900}
              color={DARK}
              sx={{ mb: 1 }}
            >
              {status === "EXPIRED"
                ? "Đơn hàng đã hết hạn"
                : "Đơn hàng đã bị huỷ"}
            </Typography>
            <Typography sx={{ color: "#64748b", mb: 4 }}>
              Bạn có thể tạo đơn hàng mới để tiếp tục mua sắm
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                component={Link}
                href="/"
                sx={{
                  bgcolor: ACCENT,
                  borderRadius: "14px",
                  px: 5,
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#2a9b93" },
                }}
              >
                Mua sắm tiếp
              </Button>
              <Button
                variant="outlined"
                component={Link}
                href="/"
                startIcon={<Home />}
                sx={{
                  borderRadius: "14px",
                  borderColor: "#e2e8f0",
                  color: "#475569",
                  fontWeight: 800,
                }}
              >
                Trang chủ
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // Loading state
  if (!orderData || !bankInfo) {
    return (
      <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
          <CircularProgress sx={{ color: ACCENT }} />
          <Typography sx={{ mt: 2, fontWeight: 700, color: DARK }}>
            Đang tải thông tin thanh toán...
          </Typography>
        </Container>
      </Box>
    );
  }

  const progressPercent = (timeLeft / PAYMENT_TIMEOUT) * 100;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: "28px",
              border: "1px solid #f1f5f9",
              overflow: "hidden",
            }}
          >
            {/* ═══ HEADER ═══ */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${DARK} 0%, #1e293b 100%)`,
                p: { xs: 3, md: 4 },
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  bgcolor: ACCENT,
                  opacity: 0.07,
                }}
              />

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 2 }}
              >
                <QrCode sx={{ color: ACCENT, fontSize: 28 }} />
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: "1.2rem",
                  }}
                >
                  Quét mã QR để thanh toán
                </Typography>
              </Stack>

              {/* Timer */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Timer sx={{ color: timeLeft < 120 ? "#ef4444" : ACCENT, fontSize: 18 }} />
                <Typography
                  sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 900,
                    fontSize: "1.3rem",
                    color: timeLeft < 120 ? "#ef4444" : ACCENT,
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  mt: 2,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.1)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: timeLeft < 120 ? "#ef4444" : ACCENT,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* ═══ QR CODE ═══ */}
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                  p: 2,
                  bgcolor: "#fff",
                  borderRadius: "20px",
                  border: "1px solid #f1f5f9",
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={orderData.qrData}
                      alt="QR Thanh toán VietQR"
                      style={{
                        width: 300,
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                </motion.div>
              </Box>

              {/* Instructions */}
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "0.85rem",
                  color: "#64748b",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Mở app ngân hàng → Quét QR → Xác nhận thanh toán
              </Typography>

              {/* Polling indicator */}
              <Box
                sx={{
                  textAlign: "center",
                  mb: 3,
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: alpha(ACCENT, 0.06),
                  border: `1px solid ${alpha(ACCENT, 0.15)}`,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <CircularProgress size={14} sx={{ color: ACCENT }} />
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: ACCENT,
                    }}
                  >
                    Đang chờ xác nhận thanh toán...
                  </Typography>
                </Stack>
              </Box>

              {/* Divider */}
              <Divider sx={{ mb: 3, borderStyle: "dashed" }}>
                <Chip
                  label="Hoặc chuyển khoản thủ công"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    color: "#94a3b8",
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                />
              </Divider>

              {/* Bank Info */}
              <Stack spacing={0}>
                {[
                  {
                    label: "Ngân hàng",
                    value: bankInfo.bankName,
                    copyable: false,
                  },
                  {
                    label: "Số tài khoản",
                    value: bankInfo.accountNumber,
                    copyable: true,
                  },
                  {
                    label: "Tên tài khoản",
                    value: bankInfo.accountName,
                    copyable: false,
                  },
                  {
                    label: "Số tiền",
                    value: formatCurrency(bankInfo.amount),
                    copyable: true,
                    copyValue: String(bankInfo.amount),
                    highlight: true,
                  },
                  {
                    label: "Nội dung CK",
                    value: bankInfo.transferContent,
                    copyable: true,
                    important: true,
                  },
                ].map((row) => (
                  <Stack
                    key={row.label}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      py: 1.5,
                      borderBottom: "1px dashed #f1f5f9",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      {row.label}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: "0.92rem",
                          fontFamily:
                            row.highlight || row.important
                              ? "'JetBrains Mono', monospace"
                              : "inherit",
                          color: row.highlight
                            ? ACCENT
                            : row.important
                              ? "#ef4444"
                              : DARK,
                        }}
                      >
                        {row.value}
                      </Typography>
                      {row.copyable && (
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopy(
                              row.copyValue || row.value,
                              row.label
                            )
                          }
                          sx={{
                            color:
                              copied === row.label ? ACCENT : "#94a3b8",
                            "&:hover": { color: ACCENT },
                          }}
                        >
                          {copied === row.label ? (
                            <CheckCircle sx={{ fontSize: 16 }} />
                          ) : (
                            <ContentCopy sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                ))}
              </Stack>

              {/* Important note */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: "14px",
                  bgcolor: alpha("#ef4444", 0.04),
                  border: `1px solid ${alpha("#ef4444", 0.15)}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#ef4444",
                    lineHeight: 1.6,
                  }}
                >
                  ⚠️ Vui lòng nhập đúng nội dung chuyển khoản{" "}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 900,
                    }}
                  >
                    {bankInfo.transferContent}
                  </span>{" "}
                  để đơn hàng được xác nhận tự động.
                </Typography>
              </Box>

              {/* Actions */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  component={Link}
                  href="/"
                  sx={{
                    borderRadius: "14px",
                    borderColor: "#e2e8f0",
                    color: "#475569",
                    fontWeight: 800,
                    textTransform: "none",
                    "&:hover": { borderColor: DARK },
                  }}
                >
                  Quay lại
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SupportAgent />}
                  sx={{
                    borderRadius: "14px",
                    borderColor: alpha(ACCENT, 0.3),
                    color: ACCENT,
                    fontWeight: 800,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: ACCENT,
                      bgcolor: alpha(ACCENT, 0.04),
                    },
                  }}
                >
                  Liên hệ hỗ trợ 24/7
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={pollStatus}
                  sx={{
                    bgcolor: ACCENT,
                    borderRadius: "14px",
                    fontWeight: 800,
                    textTransform: "none",
                    flex: 1,
                    boxShadow: `0 4px 16px ${alpha(ACCENT, 0.3)}`,
                    "&:hover": { bgcolor: "#2a9b93" },
                  }}
                >
                  Kiểm tra trạng thái
                </Button>
              </Stack>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }} />
      }
    >
      <PaymentContent />
    </Suspense>
  );
}

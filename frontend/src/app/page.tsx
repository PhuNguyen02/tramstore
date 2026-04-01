"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Button,
  Paper,
  Stack,
  alpha,
  IconButton,
} from "@mui/material";
import {
  ArrowForward as ArrowIcon,
  AutoAwesome as SparklesIcon,
  Facebook as FBIcon,
  YouTube as YTIcon,
  Telegram as TeleIcon,
} from "@mui/icons-material";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import BrandStrip from "@/components/home/BrandStrip";
import ProductGrid from "@/components/home/ProductGrid";
import FlashSaleStation from "@/components/home/FlashSaleStation";
import {
  TrainTrack,
  RunningTrain,
  StationBanner,
} from "@/components/home/TrainJourney";
import StationNav from "@/components/home/StationNav";
import productsData from "@/data/products.json";

export default function Home() {
  const flashSaleProducts = [...productsData]
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 6);
  const aiProducts = productsData
    .filter((p) => p.category === "AI")
    .slice(0, 6);
  const entertainmentProducts = productsData
    .filter((p) => p.category === "Giải trí")
    .slice(0, 6);
  const workProducts = productsData
    .filter((p) => p.category === "Làm việc - lưu trữ")
    .slice(0, 6);
  const educationProducts = productsData
    .filter((p) => p.category === "Học tập")
    .slice(0, 6);
  const vpnProducts = productsData
    .filter((p) => p.category === "VPN")
    .slice(0, 6);
  const softwareProducts = productsData
    .filter((p) => p.category === "Phần mềm")
    .slice(0, 6);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <StationNav />

      <Box id="hero">
        <Hero />
      </Box>

      {/* Running train transition */}
      <RunningTrain />

      {/* Flash Sale as Departure Board */}
      <Box id="flash-sale">
        <FlashSaleStation products={flashSaleProducts} />
      </Box>

      <Container maxWidth="xl" id="station-1">
        <TrainTrack
          stationName="AI & Công nghệ"
          stationNumber={1}
          gif="/charging-station.gif"
          accentColor="#3AB7AE"
        />
      </Container>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <StationBanner
            title="Trạm AI & Công nghệ"
            subtitle="ChatGPT Plus, Claude Pro, Midjourney và các công cụ AI hàng đầu — Nạp năng lượng trí tuệ nhân tạo"
            gif="/charging-station.gif"
          />
        </Container>
        <ProductGrid title="" products={aiProducts} accentColor="primary" />
      </Box>

      <Container maxWidth="xl" id="station-2">
        <TrainTrack
          stationName="Giải trí đỉnh cao"
          stationNumber={2}
          gif="/train-station-gif.gif"
          accentColor="#ef4444"
        />
      </Container>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <StationBanner
            title="Trạm Giải trí"
            subtitle="Netflix, Spotify, YouTube Premium — Chuyến tàu giải trí không giới hạn"
            gif="/train-station-gif.gif"
            accentColor="#ef4444"
          />
        </Container>
        <ProductGrid
          title=""
          products={entertainmentProducts}
          accentColor="secondary"
        />
      </Box>

      <RunningTrain />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            py: { xs: 6, md: 10 },
            px: { xs: 4, md: 12 },
            borderRadius: "48px",
            bgcolor: "#0f172a",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative blurs */}
          <Box
            sx={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              bgcolor: "primary.main",
              borderRadius: "50%",
              filter: "blur(100px)",
              opacity: 0.2,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -50,
              left: 100,
              width: 200,
              height: 200,
              bgcolor: "secondary.main",
              borderRadius: "50%",
              filter: "blur(80px)",
              opacity: 0.15,
            }}
          />

          {/* Decorative GIFs */}
          <Box
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 56,
              height: 56,
              opacity: 0.2,
              display: { xs: "none", md: "block" },
            }}
          >
            <img
              src="/fire-station.gif"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 24,
              left: 24,
              width: 56,
              height: 56,
              opacity: 0.2,
              display: { xs: "none", md: "block" },
            }}
          >
            <img
              src="/clock.gif"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>

          <Grid
            container
            spacing={6}
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: "rgba(58, 183, 174, 0.15)",
                    p: 0.4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/train-gif.gif"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "primary.main",
                    fontWeight: 900,
                    letterSpacing: 2,
                  }}
                >
                  CHUYẾN TÀU NHANH — ACADEMIC EXPRESS
                </Typography>
              </Box>
              <Typography
                variant="h2"
                sx={{ fontWeight: 900, mt: 2, mb: 3, lineHeight: 1.15 }}
              >
                Nâng tầm kiến thức <br />
                với ChatGPT Plus & Coursera
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  mb: 5,
                  color: "rgba(255,255,255,0.7)",
                  maxWidth: 500,
                }}
              >
                Sở hữu ngay các công cụ hỗ trợ học tập và làm việc mạnh mẽ nhất
                hiện nay. Lên tàu tốc hành để đến trạm tri thức.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowIcon />}
                sx={{ px: 6, py: 2, borderRadius: "18px" }}
              >
                LÊN TÀU NGAY
              </Button>
            </Grid>
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: "40px",
                  p: 4,
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Stack spacing={3}>
                  {aiProducts.slice(0, 3).map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        p: 1.5,
                        borderRadius: "16px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.05)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "16px",
                          bgcolor: "rgba(255,255,255,0.1)",
                          p: 1.2,
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 800, color: "#fff" }}
                        >
                          {product.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          Chỉ từ {product.price.toLocaleString("vi-VN")}đ
                        </Typography>
                      </Box>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: "primary.main",
                          fontWeight: 800,
                          minWidth: "auto",
                        }}
                      >
                        ĐẶT VÉ
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* ═══════════════════════════════════════════════
          🚉 TRẠM 3 — LÀM VIỆC
          ═══════════════════════════════════════════════ */}
      <Container maxWidth="xl" id="station-3">
        <TrainTrack
          stationName="Làm việc chuyên nghiệp"
          stationNumber={3}
          gif="/fire-station.gif"
          accentColor="#f59e0b"
        />
      </Container>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <StationBanner
            title="Trạm Làm việc"
            subtitle="Bộ công cụ thiết kế, văn phòng và lưu trữ đám mây — Trạm tiếp nhiên liệu cho dân công sở"
            gif="/fire-station.gif"
            accentColor="#f59e0b"
          />
        </Container>
        <ProductGrid title="" products={workProducts} accentColor="primary" />
      </Box>

      {/* ═══════════════════════════════════════════════
          🚉 TRẠM 4 — HỌC TẬP
          ═══════════════════════════════════════════════ */}
      <Container maxWidth="xl" id="station-4">
        <TrainTrack
          stationName="Học tập & Kỹ năng"
          stationNumber={4}
          gif="/clock.gif"
          accentColor="#8b5cf6"
        />
      </Container>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <StationBanner
            title="Trạm Học tập"
            subtitle="Nâng cao kiến thức với các ứng dụng học ngoại ngữ và kỹ năng — Đúng giờ, đúng lộ trình"
            gif="/clock.gif"
            accentColor="#8b5cf6"
          />
        </Container>
        <ProductGrid
          title=""
          products={educationProducts}
          accentColor="primary"
        />
      </Box>

      {/* ═══════════════════════════════════════════════
          🚉 TRẠM 5 — BẢO MẬT & VPN
          ═══════════════════════════════════════════════ */}
      <Container maxWidth="xl" id="station-5">
        <TrainTrack
          stationName="Bảo mật & VPN"
          stationNumber={5}
          gif="/bus-stop.gif"
          accentColor="#06b6d4"
        />
      </Container>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <StationBanner
            title="Trạm Bảo mật"
            subtitle="Duyệt web an toàn và không giới hạn — Trạm bảo vệ an ninh số"
            gif="/bus-stop.gif"
            accentColor="#06b6d4"
          />
        </Container>
        <ProductGrid title="" products={vpnProducts} accentColor="secondary" />
      </Box>

      {/* ═══════════════════════════════════════════════
          🚉 TRẠM 6 — PHẦN MỀM (GA CUỐI)
          ═══════════════════════════════════════════════ */}
      <Container maxWidth="xl" id="station-6">
        <TrainTrack
          stationName="Phần mềm & Tiện ích"
          stationNumber={6}
          gif="/train-station.gif"
          accentColor="#ec4899"
          isLast
        />
      </Container>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <StationBanner
            title="Ga cuối — Phần mềm"
            subtitle="Các công cụ hỗ trợ công việc và tiện ích máy tính — Ga cuối, xuống tàu và sắm ngay"
            gif="/train-station.gif"
            accentColor="#ec4899"
          />
        </Container>
        <ProductGrid
          title=""
          products={softwareProducts}
          accentColor="primary"
        />
      </Box>

      {/* ═══════════════════════════════════════════════
          ĐẾN TRẠM — FINAL DESTINATION CTA
          ═══════════════════════════════════════════════ */}
      <RunningTrain />

      <Box
        sx={{
          background: "linear-gradient(180deg, #f0faf9 0%, #fff 100%)",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "24px",
              bgcolor: alpha("#3AB7AE", 0.1),
              border: "3px solid rgba(58, 183, 174, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              p: 1,
            }}
          >
            <img
              src="/train-station-gif.gif"
              alt="Trạm Byte"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 900, color: "#0f172a", mb: 2 }}
          >
            Bạn đã đến <span style={{ color: "#3AB7AE" }}>Trạm Byte</span> 🎉
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 5,
              maxWidth: 500,
              mx: "auto",
              fontWeight: 500,
              lineHeight: 1.7,
            }}
          >
            Cảm ơn bạn đã lên tàu cùng chúng tôi! Khám phá thêm hàng trăm tài
            khoản số Premium với giá cực hời. Mỗi chuyến tàu đều mang đến ưu đãi
            mới.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{ px: 5, py: 2, borderRadius: "16px", fontWeight: 800 }}
            >
              KHÁM PHÁ TOÀN BỘ
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 2,
                borderRadius: "16px",
                fontWeight: 800,
                borderWidth: 2,
                borderColor: "#e2e8f0",
                color: "#475569",
                "&:hover": { borderWidth: 2, borderColor: "primary.main" },
              }}
            >
              LIÊN HỆ HỖ TRỢ
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════ */}
      <Box
        sx={{ bgcolor: "#fff", pt: 12, pb: 6, borderTop: "1px solid #f1f5f9" }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={8}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "primary.main",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <SparklesIcon />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: -1 }}
                >
                  TRAM STORE
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: 340,
                }}
              >
                Hệ thống cung cấp sản phẩm số, tài khoản cao cấp và dịch vụ giải
                trí hàng đầu Việt Nam. Chúng tôi cam kết chất lượng dịch vụ và
                chế độ hậu mãi tốt nhất cho khách hàng.
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton sx={{ bgcolor: "#f8fafc", color: "#1e293b" }}>
                  <FBIcon />
                </IconButton>
                <IconButton sx={{ bgcolor: "#f8fafc", color: "#1e293b" }}>
                  <YTIcon />
                </IconButton>
                <IconButton sx={{ bgcolor: "#f8fafc", color: "#1e293b" }}>
                  <TeleIcon />
                </IconButton>
              </Stack>
            </Grid>

            {["VỀ TRÂM STORE", "DỊCH VỤ", "HỖ TRỢ"].map((title, i) => (
              <Grid size={{ xs: 6, md: 2 }} key={i}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 900, color: "#0f172a", mb: 4 }}
                >
                  {title}
                </Typography>
                <Stack spacing={2}>
                  {[
                    "Link item 1",
                    "Link item 2",
                    "Link item 3",
                    "Link item 4",
                  ].map((item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Grid>
            ))}

            <Grid size={{ xs: 12, md: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 900, color: "#0f172a", mb: 4 }}
              >
                LIÊN HỆ
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 600, mb: 2 }}
              >
                Email: support@tramstore.vn
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                Hotline: 1900 xxxx
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 8 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontWeight: 700 }}
            >
              © 2026 TRAM STORE. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={4}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.disabled",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Chính sách bảo mật
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.disabled",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Điều khoản dịch vụ
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

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
import Link from "next/link";
import productsData from "@/data/products.json";

const CATEGORIES = ["AI", "Làm việc - lưu trữ", "Giải trí", "Học tập", "VPN"];

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

      <Hero />

      <BrandStrip />

      {/* Flash Sale Section */}
      <ProductGrid
        title="Ưu đãi giới hạn"
        subtitle="Flash Sale - Cơ hội sở hữu tài khoản Premium với giá cực rẻ"
        products={flashSaleProducts}
        showFlashSale={true}
      />

      {/* Promotion Hero Banner */}
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
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Decorative elements */}
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
              opacity: 0.2,
            }}
          />

          <Grid
            container
            spacing={6}
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 900,
                  letterSpacing: 2,
                }}
              >
                TÀI KHOẢN HÀN LÂM & CÔNG CỤ AI
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, mt: 2, mb: 3 }}>
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
                hiện nay. Cam kết giá rẻ nhất thị trường và bảo hành toàn diện.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowIcon />}
                sx={{ px: 6, py: 2, borderRadius: "18px" }}
              >
                XEM NGAY DANH MỤC
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
                      sx={{ display: "flex", alignItems: "center", gap: 3 }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "20px",
                          bgcolor: "rgba(255,255,255,0.1)",
                          p: 1.5,
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
                          variant="subtitle1"
                          sx={{ fontWeight: 800 }}
                        >
                          {product.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          Chỉ từ {product.price.toLocaleString("vi-VN")}đ
                        </Typography>
                      </Box>
                      <Button variant="text" sx={{ color: "primary.main" }}>
                        MUA
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Category Sections */}
      <ProductGrid
        title="AI & Công nghệ"
        subtitle="ChatGPT Plus, Claude Pro, Midjourney và các công cụ AI hàng đầu"
        products={aiProducts}
        accentColor="primary"
      />

      <ProductGrid
        title="Giải trí đỉnh cao"
        subtitle="Netflix, Spotify, YouTube Premium cùng nhiều dịch vụ hot khác"
        products={entertainmentProducts}
        accentColor="secondary"
      />

      <ProductGrid
        title="Làm việc chuyên nghiệp"
        subtitle="Bộ công cụ thiết kế, văn phòng và lưu trữ đám mây"
        products={workProducts}
        accentColor="primary"
      />

      <ProductGrid
        title="Học tập & Kỹ năng"
        subtitle="Nâng cao kiến thức với các ứng dụng học ngoại ngữ và kỹ năng"
        products={educationProducts}
        accentColor="primary"
      />

      <ProductGrid
        title="Bảo mật & VPN"
        subtitle="Duyệt web an toàn và không giới hạn với dịch vụ VPN hàng đầu"
        products={vpnProducts}
        accentColor="secondary"
      />

      <ProductGrid
        title="Phần mềm & Tiện ích"
        subtitle="Các công cụ hỗ trợ công việc và tiện ích máy tính"
        products={softwareProducts}
        accentColor="primary"
      />

      {/* Footer Section */}
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

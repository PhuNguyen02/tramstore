"use client";

import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  alpha,
} from "@mui/material";
import {
  ArrowForward as ArrowIcon,
  VerifiedUserOutlined as TrustIcon,
  BoltOutlined as FastIcon,
  HeadsetMicOutlined as SupportIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HeroWrapper = styled(Box)(({ theme }) => ({
  background: "#fff",
  paddingBottom: theme.spacing(10),
  position: "relative",
  overflow: "hidden",
}));

const FloatingLogo = ({
  src,
  delay = 0,
  size = 60,
  top,
  left,
  bottom,
  right,
}: any) => (
  <Box
    sx={{
      position: "absolute",
      top,
      left,
      bottom,
      right,
      width: size,
      height: size,
      borderRadius: "20px",
      bgcolor: "#fff",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 1.5,
      animation: `float 6s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      zIndex: 2,
      "@keyframes float": {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-20px)" },
      },
    }}
  >
    <img
      src={src}
      alt="Brand"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  </Box>
);

const Hero = () => {
  return (
    <HeroWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{ minHeight: "70vh", pt: 5 }}
        >
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ maxWidth: 640 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2.5,
                  py: 1,
                  borderRadius: "99px",
                  bgcolor: alpha("#3AB7AE", 0.08),
                  color: "primary.main",
                  mb: 4,
                }}
              >
                <FastIcon fontSize="small" />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  Hệ thống giao hàng tự động 24/7
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.8rem", md: "4.5rem" },
                  mb: 3,
                  lineHeight: 1.05,
                  color: "#1e293b",
                }}
              >
                Nâng cấp <br />
                <span style={{ color: "#3AB7AE" }}>Trải nghiệm Số</span> <br />
                với giá cực hời.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  mb: 6,
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                Tram Store cung cấp tài khoản Premium cho các ứng dụng xem phim,
                học tập, công cụ AI và Game với mức giá rẻ hơn tới 70% so với
                giá gốc.
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowIcon />}
                  sx={{
                    px: 6,
                    py: 2.2,
                    fontSize: "1.1rem",
                  }}
                >
                  SẮM NGAY BÂY GIỜ
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 6,
                    py: 2.2,
                    fontSize: "1.1rem",
                    borderWidth: 2,
                    borderColor: "#e2e8f0",
                    color: "#475569",
                    "&:hover": { borderWidth: 2, borderColor: "primary.main" },
                  }}
                >
                  XEM KHUYẾN MÃI
                </Button>
              </Box>

              <Box
                sx={{ mt: 8, display: "flex", alignItems: "center", gap: 3 }}
              >
                <Box sx={{ display: "flex" }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "3px solid #fff",
                        ml: i > 1 ? -1.5 : 0,
                        bgcolor: "#f1f5f9",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${10 + i}`}
                        alt="user"
                      />
                    </Box>
                  ))}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "text.secondary" }}
                >
                  <span style={{ color: "#3AB7AE" }}>50.000+</span> khách hàng
                  tin dùng
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid
            size={{ xs: 12, lg: 6 }}
            sx={{
              display: { xs: "none", lg: "block" },
              position: "relative",
              height: "600px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "40px",
                bgcolor: "#f1f5f9",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Decorative backgrounds */}
              <Box
                sx={{
                  position: "absolute",
                  width: "120%",
                  height: "120%",
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(58, 183, 174, 0.1) 0%, transparent 70%)",
                }}
              />

              {/* Main Visual Component - Can be a large product card or featured offer */}
              <Paper
                elevation={0}
                sx={{
                  width: "70%",
                  p: 4,
                  borderRadius: "32px",
                  bgcolor: "#fff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.08)",
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    mb: 3,
                  }}
                >
                  <img
                    src="/netflix.png"
                    alt="Featured"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                      background: "#000",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "secondary.main",
                      color: "#fff",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 900,
                    }}
                  >
                    HOT DEAL
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Netflix Premium 4K
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 3 }}
                >
                  Trọn gói 1 tháng tài khoản xem phim riêng tư không giới hạn.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "primary.main", fontWeight: 900 }}
                  >
                    65.000đ
                  </Typography>
                  <Button variant="contained">XEM NGAY</Button>
                </Box>
              </Paper>

              {/* Floating Brand Icons */}
              <FloatingLogo
                src="/adobe.png"
                size={70}
                top="15%"
                left="10%"
                delay={0}
              />
              <FloatingLogo
                src="/Spotify.png"
                size={80}
                bottom="15%"
                left="5%"
                delay={1.5}
              />
              <FloatingLogo
                src="/youtube.png"
                size={70}
                top="10%"
                right="15%"
                delay={0.8}
              />
              <FloatingLogo
                src="/canva.png"
                size={90}
                bottom="20%"
                right="10%"
                delay={2.2}
              />
              <FloatingLogo
                src="/chatgpt-icon.webp"
                size={60}
                top="45%"
                right="0"
                delay={0.5}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Trust Bar */}
        <Box
          sx={{
            mt: 4,
            py: 4,
            px: { xs: 2, md: 8 },
            borderRadius: "32px",
            bgcolor: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
          }}
        >
          <Grid container spacing={4} justifyContent="space-between">
            {[
              {
                icon: <FastIcon />,
                title: "Giao hàng siêu tốc",
                desc: "Tự động gửi key qua mail trong 30s",
              },
              {
                icon: <TrustIcon />,
                title: "Bảo hành tin cậy",
                desc: "Cam kết 1 đổi 1 suốt thời gian sử dụng",
              },
              {
                icon: <SupportIcon />,
                title: "Hỗ trợ 24/7",
                desc: "Đội ngũ kỹ thuật hỗ trợ tận tình nhất",
              },
              {
                icon: <TrustIcon />,
                title: "Thanh toán an toàn",
                desc: "Đa dạng phương thức chuyển khoản, ví điện tử",
              },
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
                  <Box
                    sx={{
                      color: "primary.main",
                      bgcolor: alpha("#3AB7AE", 0.08),
                      width: 54,
                      height: 54,
                      borderRadius: 3.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(item.icon, { sx: { fontSize: 32 } })}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ lineHeight: 1.2, mb: 0.5 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        display: "block",
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </HeroWrapper>
  );
};

export default Hero;

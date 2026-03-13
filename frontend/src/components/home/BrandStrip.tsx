"use client";

import React from "react";
import { Box, Container, Typography, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const LogoMarquee = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(8),
  padding: theme.spacing(4, 0),
  overflow: "hidden",
  position: "relative",
  "@keyframes scroll": {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(-50%)" },
  },
}));

const BrandLogo = styled("img")(({ theme }) => ({
  height: "40px",
  width: "auto",
  filter: "grayscale(1) opacity(0.5)",
  transition: "all 0.3s ease",
  "&:hover": {
    filter: "grayscale(0) opacity(1)",
    transform: "scale(1.1)",
  },
}));

const BrandStrip = () => {
  const brands = [
    "/adobe.png",
    "/canva.png",
    "/chatgpt-icon.webp",
    "/netflix.png",
    "/Spotify.png",
    "/youtube.png",
  ];

  return (
    <Box sx={{ borderBottom: "1px solid #f1f5f9", bgcolor: "#fff" }}>
      <Container maxWidth="xl">
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography
            variant="overline"
            sx={{ fontWeight: 900, color: "text.disabled", letterSpacing: 2 }}
          >
            THƯƠNG HIỆU PHỔ BIẾN
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 6,
              mt: 4,
              px: { md: 10 },
            }}
          >
            {brands.map((brand, i) => (
              <Box key={i} sx={{ px: 2 }}>
                <BrandLogo src={brand} alt="Brand" />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BrandStrip;

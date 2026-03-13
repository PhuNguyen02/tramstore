"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  alpha,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart as CartIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  discount: number;
  tag: string;
}

interface ProductRowProps {
  title: string;
  products: Product[];
}

const ScrollContainer = styled(Box)({
  display: "flex",
  gap: "16px",
  overflowX: "auto",
  paddingBottom: "16px",
  paddingTop: "8px",
  "&::-webkit-scrollbar": { display: "none" },
  scrollbarWidth: "none",
  scrollSnapType: "x mandatory",
});

const ProductCard = styled(Card)(({ theme }) => ({
  flex: "none",
  width: "280px",
  borderRadius: "16px",
  position: "relative",
  scrollSnapAlign: "start",
  transition: "all 0.3s ease",
  border: "1px solid #f1f5f9",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    borderColor: theme.palette.primary.main,
  },
}));

const ProductRow = ({ title, products }: ProductRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ py: 4, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => scroll("left")}
            size="small"
            sx={{ border: "1px solid #f1f5f9" }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => scroll("right")}
            size="small"
            sx={{ border: "1px solid #f1f5f9" }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <ScrollContainer ref={scrollRef} sx={{ px: 4 }}>
        {products.map((product) => (
          <ProductCard key={product.id} elevation={0}>
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                image={product.image}
                sx={{ aspectRatio: "16/9", bgcolor: "#f8fafc" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  bgcolor: "secondary.main",
                  color: "#fff",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                  fontWeight: 900,
                  fontSize: 10,
                }}
              >
                {product.discount}% OFF
              </Box>
            </Box>

            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="overline"
                sx={{ color: "text.disabled", fontWeight: 800 }}
              >
                {product.category}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                  mb: 1.5,
                  height: 40,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {product.title}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}
              >
                <Rating
                  value={product.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: "text.disabled" }}
                >
                  ({product.reviews})
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.disabled",
                      fontWeight: 800,
                      display: "block",
                      lineHeight: 1,
                    }}
                  >
                    {formatCurrency(product.originalPrice)}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: "primary.main",
                      lineHeight: 1,
                    }}
                  >
                    {formatCurrency(product.price)}
                  </Typography>
                </Box>
                <IconButton
                  color="primary"
                  sx={{ bgcolor: alpha("#3AB7AE", 0.1), borderRadius: 3 }}
                >
                  <CartIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </ProductCard>
        ))}
      </ScrollContainer>
    </Box>
  );
};

export default ProductRow;

"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Button,
  alpha,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface Variant {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  tag?: string;
  variants: Variant[];
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
        {products.map((product) => {
          const baseVariant = product.variants[0];
          return (
            <Link href={`/product/${product.slug}`} key={product.id} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <ProductCard elevation={0}>
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    sx={{ aspectRatio: "16/9", bgcolor: "#f8fafc", objectFit: "contain", p: 2 }}
                  />
                  {baseVariant?.discount > 0 && (
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
                      {baseVariant.discount}% OFF
                    </Box>
                  )}
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <Box>
                      {baseVariant?.originalPrice > baseVariant?.price && (
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
                          {formatCurrency(baseVariant.originalPrice)}
                        </Typography>
                      )}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 900,
                          color: "primary.main",
                          lineHeight: 1,
                        }}
                      >
                        {formatCurrency(baseVariant?.price || 0)}
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
            </Link>
          );
        })}
      </ScrollContainer>
    </Box>
  );
};

export default ProductRow;

"use client";

import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  ShoppingCartOutlined as CartIcon,
  VisibilityOutlined as EyeIcon,
  ChevronRight,
  FlashOn as FlashIcon,
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
  tag?: string;
}

interface ProductGridProps {
  title: string;
  products: Product[];
  subtitle?: string;
  accentColor?: "primary" | "secondary";
  showFlashSale?: boolean;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "24px",
  backgroundColor: "#fff",
  border: "1px solid #f1f5f9",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    borderColor: "transparent",
    "& .action-overlay": {
      opacity: 1,
    },
    "& .product-image": {
      transform: "scale(1.05)",
    },
  },
}));

const ImageWrapper = styled(Box)({
  position: "relative",
  borderRadius: "20px",
  margin: "10px",
  aspectRatio: "1/1",
  overflow: "hidden",
  backgroundColor: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ProductGrid = ({
  title,
  products,
  subtitle,
  accentColor = "primary",
  showFlashSale = false,
}: ProductGridProps) => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "flex-end" },
            mb: 6,
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 28,
                  bgcolor:
                    accentColor === "primary"
                      ? "primary.main"
                      : "secondary.main",
                  borderRadius: "99px",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "#0f172a",
                  fontWeight: 900,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </Typography>
              {showFlashSale && (
                <Box
                  sx={{
                    bgcolor: "secondary.main",
                    color: "#fff",
                    px: 2,
                    py: 0.6,
                    borderRadius: "99px",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
                  }}
                >
                  <FlashIcon sx={{ fontSize: 18 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 900, letterSpacing: 0.5 }}
                  >
                    FLASH SALE
                  </Typography>
                </Box>
              )}
            </Box>
            {subtitle && (
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={product.id}>
              <StyledCard elevation={0}>
                <ImageWrapper>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    className="product-image"
                    sx={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />

                  {/* Top Badges */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.8,
                      zIndex: 2,
                    }}
                  >
                    {product.discount > 0 && (
                      <Box
                        sx={{
                          bgcolor: "rgba(239, 68, 68, 0.9)",
                          color: "#fff",
                          px: 1.2,
                          py: 0.4,
                          borderRadius: "12px",
                          fontWeight: 900,
                          fontSize: "0.7rem",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        -{product.discount}%
                      </Box>
                    )}
                  </Box>

                  {/* Hover Overlay */}
                  <Box
                    className="action-overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: alpha("#0f172a", 0.4),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      opacity: 0,
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(4px)",
                      zIndex: 3,
                    }}
                  >
                    <Tooltip title="Thêm vào giỏ">
                      <IconButton
                        sx={{
                          bgcolor: "#fff",
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "#fff",
                            transform: "scale(1.1)",
                          },
                          width: 48,
                          height: 48,
                        }}
                      >
                        <CartIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.3)",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.3)",
                            transform: "scale(1.1)",
                          },
                          width: 48,
                          height: 48,
                        }}
                      >
                        <EyeIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ImageWrapper>

                <CardContent sx={{ px: 2, pt: 1, pb: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    {product.category}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      color: "#1e293b",
                      mb: 1.5,
                      height: 40,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      lineHeight: 1.4,
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
                      {product.originalPrice > product.price && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.disabled",
                            fontWeight: 700,
                            textDecoration: "line-through",
                            display: "block",
                            mb: -0.5,
                          }}
                        >
                          {formatCurrency(product.originalPrice)}
                        </Typography>
                      )}
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#0f172a",
                          fontWeight: 900,
                          fontSize: "1.1rem",
                        }}
                      >
                        {formatCurrency(product.price)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Rating
                        value={product.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                        sx={{ fontSize: "0.75rem" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled", fontWeight: 700 }}
                      >
                        {product.rating}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ChevronRight />}
            sx={{
              borderRadius: "14px",
              px: 4,
              py: 1.5,
              fontWeight: 800,
              color: "#1e293b",
              borderColor: "#e2e8f0",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: alpha("#3AB7AE", 0.05),
                transform: "translateY(-2px)",
              },
            }}
          >
            Xem tất cả {title}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductGrid;

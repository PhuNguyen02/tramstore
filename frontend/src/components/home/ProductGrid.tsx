"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  alpha,
  Stack,
} from "@mui/material";
import {
  ShoppingCartOutlined as CartIcon,
  VisibilityOutlined as EyeIcon,
  ChevronRight,
  FlashOn as FlashIcon,
  ConfirmationNumberOutlined as TicketIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { formatCurrency } from "@/lib/utils";
import { StoreIcon } from "lucide-react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────── */
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

interface ProductGridProps {
  title: string;
  products: Product[];
  subtitle?: string;
  accentColor?: "primary" | "secondary";
  showFlashSale?: boolean;
}

/* ── Animations ────────────────────────────────────── */
const trackMotion = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -40px 0; }
`;

const steam = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0; }
  50% { opacity: 0.4; }
  100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

/* ── Styled Components ─────────────────────────────── */
const RailTrack = styled(Box)(({ theme }) => ({
  position: "relative",
  paddingBottom: "40px",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "#64748b",
    borderRadius: "2px",
    opacity: 0.3,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -12,
    left: 0,
    right: 0,
    height: "20px",
    backgroundImage: `repeating-linear-gradient(90deg, #64748b, #64748b 4px, transparent 4px, transparent 40px)`,
    opacity: 0.2,
    animation: `${trackMotion} 2s linear infinite`,
  },
}));

const TrainCar = styled(Card)(({ theme }) => ({
  flex: "0 0 auto",
  width: "190px",
  height: "380px",
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px",
  backgroundColor: "#fff",
  border: "1px solid #e2e8f0",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
    borderColor: "#3AB7AE",
    "& .car-window": {
      borderColor: alpha("#3AB7AE", 0.4),
      backgroundColor: alpha("#3AB7AE", 0.02),
    },
    "& .car-connector": {
      width: "24px",
      backgroundColor: "#3AB7AE",
    },
    "& .wheel": {
      transform: "rotate(180deg)",
    },
  },
}));

const WindowFrame = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  margin: "12px 12px 0",
  aspectRatio: "1/1",
  overflow: "hidden",
  backgroundColor: "#f8fafc",
  border: "4px solid #f1f5f9",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CarConnector = styled(Box)({
  position: "absolute",
  right: "-20px",
  bottom: "40px", // Baseline for all connectors
  width: "20px",
  height: "10px",
  backgroundColor: "#cbd5e1",
  borderRadius: "4px",
  zIndex: -1,
  transition: "all 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "6px",
    height: "14px",
    backgroundColor: alpha("#0f172a", 0.2),
    borderRadius: "2px",
  },
});

const Wheel = styled(Box)({
  backgroundColor: "#1e293b",
  borderRadius: "50%",
  position: "absolute",
  bottom: "-9px",
  transition: "all 0.6s ease",
  border: "2.5px solid #334155",
  zIndex: 10,
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "40%",
    backgroundColor: "#64748b",
    borderRadius: "50%",
  },
});

const TrainEngine = styled(Card)(({ theme }) => ({
  flex: "0 0 auto",
  width: "300px",
  height: "350px", // Closer to car height but still distinct
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px 100px 16px 16px",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "#fff",
  position: "relative",
  overflow: "visible",
  border: "none",
  boxShadow: "0 24px 48px rgba(15, 23, 42, 0.3)",
  "&::before": {
    content: '""',
    position: "absolute",
    right: "12%",
    top: "35%",
    width: "48px",
    height: "48px",
    background: "rgba(58, 183, 174, 0.5)",
    filter: "blur(24px)",
    borderRadius: "50%",
  },
}));

const SteamCloud = styled(Box)({
  position: "absolute",
  top: "-24px",
  left: "30%",
  width: "22px",
  height: "22px",
  backgroundColor: alpha("#fff", 0.3),
  borderRadius: "50%",
  filter: "blur(10px)",
  animation: `${steam} 2.5s infinite ease-out`,
});

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha("#fff", 0.1),
  color: "#fff",
  border: `1px solid ${alpha("#fff", 0.2)}`,
  width: "36px",
  height: "36px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha("#fff", 0.2),
    borderColor: "#3AB7AE",
    boxShadow: "0 0 15px rgba(58, 183, 174, 0.4)",
    transform: "scale(1.1)",
  },
  "&.Mui-disabled": {
    display: "none",
  },
}));

/* ── Component ─────────────────────────────────────── */
const ProductGrid = ({
  title,
  products,
  subtitle,
  accentColor = "primary",
  showFlashSale = false,
}: ProductGridProps) => {
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const [showControls, setShowControls] = React.useState(false);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const carriagesRef = React.useRef<HTMLDivElement>(null);

  const accent = accentColor === "primary" ? "#3AB7AE" : "#ef4444";
  const step = 210;

  React.useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && carriagesRef.current) {
        const isOverflowing =
          carriagesRef.current.offsetWidth > containerRef.current.offsetWidth;
        setShowControls(isOverflowing);

        const leftHidden =
          carriagesRef.current.offsetWidth -
          containerRef.current.offsetWidth -
          scrollIndex * step;
        setCanScrollLeft(leftHidden > 0);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [products.length, scrollIndex]);

  const handleNext = () => {
    setScrollIndex((prev) => prev - 1);
  };

  const handlePrev = () => {
    setScrollIndex((prev) => prev + 1);
  };

  return (
    <Box sx={{ py: title ? 8 : 4, overflow: "hidden" }}>
      <Container maxWidth="xl">
        {title && (
          <Box sx={{ mb: 6 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 1 }}
            >
              <Box
                sx={{ width: 40, height: 4, bgcolor: accent, borderRadius: 2 }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-0.03em",
                }}
              >
                {title}
              </Typography>
              {showFlashSale && (
                <Box
                  sx={{
                    bgcolor: "#ef4444",
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    animation: `${pulse} 2s infinite`,
                  }}
                >
                  <FlashIcon fontSize="small" />
                  <Typography variant="caption" sx={{ fontWeight: 900 }}>
                    TOP SPEED
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "#fff",
                      borderRadius: "50%",
                      ml: 1,
                      animation: "pulse 1s infinite",
                    }}
                  />
                </Box>
              )}
            </Stack>
            {subtitle && (
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        <RailTrack>
          <Box
            sx={{
              display: "flex",
              pb: 6,
              pt: 4,
              px: { xs: 2, md: 0 },
              alignItems: "flex-end",
              justifyContent: "flex-end",
              position: "relative",
            }}
          >
            {/* 1. MASK CONTAINER */}
            <Box
              ref={containerRef}
              sx={{
                overflow: "hidden",
                flex: "1 1 auto",
                display: "flex",
                justifyContent: "flex-end",
                height: "400px",
                mr: 2,
              }}
            >
              {/* 2. SLIDING CARRIAGES */}
              <Box
                ref={carriagesRef}
                sx={{
                  display: "flex",
                  gap: "20px",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: `translateX(${scrollIndex * step}px)`,
                }}
              >
                {products.map((product) => (
                  <Link href={`/product/${product.slug}`} key={product.id} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <TrainCar elevation={0}>
                    <CarConnector className="car-connector" />
                    <Wheel
                      className="wheel"
                      sx={{ left: "20%", width: 18, height: 18 }}
                    />
                    <Wheel
                      className="wheel"
                      sx={{ right: "20%", width: 18, height: 18 }}
                    />

                    <WindowFrame className="car-window">
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.title}
                        sx={{
                          width: "80%",
                          height: "80%",
                          objectFit: "contain",
                          transition: "transform 0.5s ease",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          bgcolor: accent,
                          color: "#fff",
                          px: 1,
                          py: 0.3,
                          borderRadius: "6px",
                          fontSize: "0.6rem",
                          fontWeight: 900,
                          textTransform: "uppercase",
                        }}
                      >
                        {product.category}
                      </Box>
                      {product.variants[0]?.discount > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "#ef4444",
                            color: "#fff",
                            px: 1,
                            py: 0.3,
                            borderRadius: "6px",
                            fontSize: "0.65rem",
                            fontWeight: 900,
                          }}
                        >
                          -{product.variants[0].discount}%
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: alpha("#0f172a", 0.7),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          opacity: 0,
                          transition: "0.3s ease",
                          backdropFilter: "blur(4px)",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <IconButton
                          sx={{
                            bgcolor: "#fff",
                            color: accent,
                            "&:hover": { bgcolor: "#fff", scale: "1.1" },
                          }}
                        >
                          <CartIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{
                            border: "1px solid #fff",
                            color: "#fff",
                            "&:hover": {
                              bgcolor: alpha("#fff", 0.1),
                              scale: "1.1",
                            },
                          }}
                        >
                          <EyeIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </WindowFrame>

                    <CardContent
                      sx={{
                        px: 2,
                        pt: 2,
                        pb: 2.5,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 800,
                          color: "#1e293b",
                          mb: 1,
                          height: 40,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          fontSize: "0.85rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {product.title}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 600 }}
                            >
                              Từ
                            </Typography>
                            <Typography
                              sx={{
                                color: accent,
                                fontWeight: 900,
                                fontSize: "1.1rem",
                                lineHeight: 1.1,
                              }}
                            >
                              {formatCurrency(Math.min(...product.variants.map(v => v.price)))}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              bgcolor: alpha(accent, 0.1),
                              color: accent,
                              borderRadius: "8px",
                              px: 1,
                              py: 0.3,
                              fontSize: "0.65rem",
                              fontWeight: 800,
                            }}
                          >
                            {product.variants.length} gói
                          </Box>
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          disableElevation
                          startIcon={<TicketIcon fontSize="small" />}
                          sx={{
                            borderRadius: "10px",
                            py: 1,
                            fontWeight: 800,
                            fontSize: "0.75rem",
                            bgcolor: "#f1f5f9",
                            color: "#475569",
                            textTransform: "none",
                            "&:hover": { bgcolor: accent, color: "#fff" },
                          }}
                        >
                          Chọn gói
                        </Button>
                      </Box>
                    </CardContent>
                  </TrainCar>
                  </Link>
                ))}
              </Box>
            </Box>

            {/* 3. FIXED ENGINE */}
            <TrainEngine
              elevation={0}
              sx={{ zIndex: 20, marginBottom: "20px" }}
            >
              {/* Connector for the engine to the first carriage */}
              <Box
                sx={{
                  position: "absolute",
                  left: "-25px",
                  bottom: "40px",
                  width: "25px",
                  height: "10px",
                  bgcolor: "#cbd5e1",
                  borderRadius: "4px",
                  zIndex: -1,
                }}
              />

              <SteamCloud sx={{ left: "20%", animationDelay: "0s" }} />
              <SteamCloud sx={{ left: "35%", animationDelay: "0.5s" }} />
              <SteamCloud sx={{ left: "50%", animationDelay: "1s" }} />

              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: accent,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 15px ${alpha(accent, 0.4)}`,
                    }}
                  >
                    <StoreIcon size={24} color="#fff" />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 900, letterSpacing: -0.5 }}
                  >
                    TRAM<span style={{ color: accent }}>STORE</span>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    bgcolor: alpha("#fff", 0.05),
                    borderRadius: "16px",
                    p: 2,
                    border: `1px solid ${alpha("#fff", 0.1)}`,
                    mb: "auto",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      mb: 0.5,
                      color: "#fff",
                      lineHeight: 1.1,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha("#fff", 0.5),
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                    }}
                  >
                    Express Journey • 2024
                  </Typography>
                </Box>

                {/* SLIDER CONTROLS */}
                <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                  <ControlButton
                    onClick={handlePrev}
                    disabled={!showControls || !canScrollLeft}
                  >
                    <ChevronRight sx={{ transform: "rotate(180deg)" }} />
                  </ControlButton>
                  <ControlButton
                    onClick={handleNext}
                    disabled={!showControls || scrollIndex <= 0}
                  >
                    <ChevronRight />
                  </ControlButton>

                  <Box
                    sx={{ ml: "auto", display: "flex", alignItems: "center" }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "#fbbf24",
                          borderRadius: "50%",
                          boxShadow: "0 0 10px #fbbf24",
                          animation: "pulse 1.5s infinite",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 900, color: "#fbbf24" }}
                      >
                        ACTIVE
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Box>

              <Wheel
                sx={{ left: "15%", width: 26, height: 26, bottom: "-9px" }}
              />
              <Wheel
                sx={{ left: "45%", width: 26, height: 26, bottom: "-9px" }}
              />
            </TrainEngine>
          </Box>
        </RailTrack>

        {title && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="text"
              endIcon={<ChevronRight />}
              sx={{
                fontWeight: 800,
                color: "#64748b",
                "&:hover": { color: accent, bgcolor: "transparent" },
              }}
            >
              Xem tất cả chặng đường
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductGrid;

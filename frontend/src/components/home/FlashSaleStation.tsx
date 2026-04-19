"use client";

import React from "react";
import { Box, Container, Grid, Typography, Button, alpha, Chip } from "@mui/material";
import {
  ConfirmationNumberOutlined as TicketIcon,
  FlashOn as FlashIcon,
  ArrowForward as ArrowIcon,
  TrainOutlined as TrainIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { formatCurrency } from "@/lib/utils";
import { DepartureBoard } from "./TrainJourney";
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

/* ── Animations ────────────────────────────────────── */
const flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const slideGlow = keyframes`
  0% { left: -100%; }
  100% { left: 200%; }
`;

const pulseGreen = keyframes`
  0%, 100% { background-color: #22c55e; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { background-color: #16a34a; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0); }
`;

/* ── Styled: Departure Row ─────────────────────────── */
const DepartureRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.8, 2),
  borderRadius: "16px",
  backgroundColor: "#fff",
  border: "1px solid rgba(58, 183, 174, 0.12)",
  borderLeft: `4px solid ${alpha("#3AB7AE", 0.3)}`,
  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  cursor: "pointer",
  position: "relative",
  overflow: "visible",
  boxShadow: "0 6px 16px rgba(58, 183, 174, 0.08), 0 1px 3px rgba(0,0,0,0.02)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "60%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(58, 183, 174, 0.08), transparent)",
    transition: "none",
  },
  "&:hover": {
    backgroundColor: "#fff",
    borderColor: "#3AB7AE",
    borderLeft: `6px solid #3AB7AE`,
    transform: "translateY(-6px) translateX(4px)",
    zIndex: 10,
    boxShadow:
      "0 24px 48px -12px rgba(58, 183, 174, 0.28), 0 8px 16px -8px rgba(0,0,0,0.1)",
    "&::before": {
      animation: `${slideGlow} 0.8s ease-out`,
    },
    "& .row-ticket-btn": {
      opacity: 1,
      transform: "translateX(0)",
    },
    "& .row-number": {
      color: "#3AB7AE",
      borderColor: "rgba(58, 183, 174, 0.4)",
      backgroundColor: alpha("#3AB7AE", 0.05),
    },
    "& .row-image": {
      borderColor: "rgba(58, 183, 174, 0.3)",
      transform: "scale(1.05)",
      backgroundColor: "#fff",
    },
  },
}));

/* ── Component ─────────────────────────────────────── */
const FlashSaleStation = ({ products }: { products: Product[] }) => {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <DepartureBoard>
          {/* ── Column headers ── */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              px: 2,
              py: 1.5,
              mb: 1.5,
              borderBottom: "1.5px solid rgba(58, 183, 174, 0.1)",
            }}
          >
            {[
              { label: "SỐ", width: "4%", align: "center" as const },
              { label: "SẢN PHẨM", width: "38%", align: "left" as const },
              { label: "TUYẾN", width: "14%", align: "center" as const },
              { label: "TRẠNG THÁI", width: "12%", align: "center" as const },
              { label: "GIÁ GỐC", width: "10%", align: "right" as const },
              { label: "GIÁ VÉ", width: "12%", align: "right" as const },
              { label: "", width: "10%", align: "right" as const },
            ].map((col) => (
              <Typography
                key={col.label}
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 900,
                  letterSpacing: 2.5,
                  fontSize: "0.55rem",
                  width: col.width,
                  textAlign: col.align,
                }}
              >
                {col.label}
              </Typography>
            ))}
          </Box>

          {/* ── Departure rows ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
            {products.map((product, index) => (
              <Link
                href={`/product/${product.slug}`}
                key={product.id}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <DepartureRow>
                  {/* Row number — ticket style */}
                  <Box
                    className="row-number"
                    sx={{
                      width: { xs: 28, md: "4%" },
                      minWidth: 28,
                      height: 28,
                      borderRadius: "8px",
                      border: "1.5px solid rgba(58, 183, 174, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3b8",
                      fontWeight: 900,
                      fontSize: "0.7rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Box>

                  {/* Product image + title */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      width: { xs: "55%", md: "38%" },
                      minWidth: 0,
                    }}
                  >
                    <Box
                      className="row-image"
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                        border: "1.5px solid rgba(58, 183, 174, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 0.6,
                        flexShrink: 0,
                        transition: "all 0.3s ease",
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
                    <Box sx={{ overflow: "hidden", minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#0f172a",
                          fontWeight: 800,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "0.85rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {product.title}
                      </Typography>
                      {/* Mobile: show category inline */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 600,
                          fontSize: "0.65rem",
                          display: { xs: "block", md: "none" },
                        }}
                      >
                        {product.category} • -{product.variants[0]?.discount || 0}%
                      </Typography>
                    </Box>
                  </Box>

                  {/* Category — route badge */}
                  <Box
                    sx={{
                      width: "14%",
                      textAlign: "center",
                      display: { xs: "none", md: "flex" },
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1.5,
                        py: 0.4,
                        borderRadius: "8px",
                        bgcolor: alpha("#3AB7AE", 0.08),
                        border: "1px solid rgba(58, 183, 174, 0.12)",
                      }}
                    >
                      <TrainIcon
                        sx={{
                          fontSize: 11,
                          color: "#3AB7AE",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#3AB7AE",
                          fontWeight: 800,
                          fontSize: "0.6rem",
                          letterSpacing: 0.3,
                        }}
                      >
                        {product.category}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status — live indicator */}
                  <Box
                    sx={{
                      width: "12%",
                      display: { xs: "none", md: "flex" },
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.6,
                        px: 1.2,
                        py: 0.4,
                        borderRadius: "8px",
                        bgcolor: "rgba(34, 197, 94, 0.06)",
                        border: "1px solid rgba(34, 197, 94, 0.15)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          animation: `${pulseGreen} 2s ease-in-out infinite`,
                          animationDelay: `${index * 0.25}s`,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#16a34a",
                          fontWeight: 800,
                          fontSize: "0.55rem",
                          letterSpacing: 0.5,
                        }}
                      >
                        CÒN VÉ
                      </Typography>
                    </Box>
                  </Box>

                  {/* Original price */}
                  <Box
                    sx={{
                      width: "10%",
                      textAlign: "right",
                      display: { xs: "none", md: "block" },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94a3b8",
                        textDecoration: "line-through",
                        fontWeight: 600,
                        fontSize: "0.65rem",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {formatCurrency(product.variants[0]?.originalPrice || 0)}
                    </Typography>
                  </Box>

                  {/* Sale price + discount */}
                  <Box
                    sx={{
                      width: { xs: "30%", md: "12%" },
                      textAlign: "right",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#3AB7AE",
                          fontWeight: 900,
                          fontSize: { xs: "0.85rem", md: "1rem" },
                          fontFamily: "'JetBrains Mono', monospace",
                          lineHeight: 1,
                        }}
                      >
                        {formatCurrency(product.variants[0]?.price || 0)}
                      </Typography>
                    </Box>
                    {/* Mobile discount */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94a3b8",
                        textDecoration: "line-through",
                        fontWeight: 600,
                        fontSize: "0.6rem",
                        display: { xs: "block", md: "none" },
                      }}
                    >
                      {formatCurrency(product.variants[0]?.originalPrice || 0)}
                    </Typography>
                  </Box>

                  {/* Action: Ticket button + discount pill */}
                  <Box
                    sx={{
                      width: { xs: "15%", md: "10%" },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    {/* Discount badge */}
                    <Box
                      sx={{
                        bgcolor: alpha("#ef4444", 0.08),
                        border: "1px solid rgba(239, 68, 68, 0.15)",
                        color: "#ef4444",
                        px: 1,
                        py: 0.3,
                        borderRadius: "8px",
                        fontWeight: 900,
                        fontSize: "0.65rem",
                        animation: `${flicker} 2.5s ease-in-out infinite`,
                        animationDelay: `${index * 0.4}s`,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <FlashIcon sx={{ fontSize: 10 }} />-{product.variants[0]?.discount || 0}%
                    </Box>

                    {/* Ticket button (desktop: slide in on hover) */}
                    <Button
                      className="row-ticket-btn"
                      size="small"
                      sx={{
                        minWidth: 0,
                        p: 0.8,
                        borderRadius: "10px",
                        bgcolor: alpha("#3AB7AE", 0.1),
                        color: "#3AB7AE",
                        opacity: { xs: 1, md: 0 },
                        transform: { md: "translateX(8px)" },
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: alpha("#3AB7AE", 0.2),
                          color: "#3AB7AE",
                        },
                        display: { xs: "none", md: "flex" },
                      }}
                    >
                      <TicketIcon sx={{ fontSize: 18 }} />
                    </Button>
                  </Box>
                </DepartureRow>
              </Link>
            ))}
          </Box>

          {/* ── Board footer ── */}
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1.5px solid rgba(58, 183, 174, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Left: station info + GIF accents */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                {["/bus-stop.gif", "/train-gif.gif"].map((gif, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "8px",
                      bgcolor: "#fff",
                      border: "1px solid rgba(58, 183, 174, 0.12)",
                      p: 0.3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(58, 183, 174, 0.04)",
                    }}
                  >
                    <img
                      src={gif}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ))}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  fontSize: "0.6rem",
                }}
              >
                TRẠM BYTE • {products.length} CHUYẾN ĐÃ SẴN SÀNG
              </Typography>
            </Box>

            {/* Right: CTA */}
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowIcon sx={{ fontSize: "14px !important" }} />}
              sx={{
                color: "#3AB7AE",
                borderColor: "rgba(58, 183, 174, 0.3)",
                fontWeight: 800,
                borderRadius: "12px",
                fontSize: "0.7rem",
                px: 2.5,
                textTransform: "none",
                borderWidth: 1.5,
                "&:hover": {
                  borderColor: "#3AB7AE",
                  bgcolor: alpha("#3AB7AE", 0.05),
                  borderWidth: 1.5,
                },
              }}
            >
              Xem tất cả ưu đãi
            </Button>
          </Box>
        </DepartureBoard>
      </Container>
    </Box>
  );
};

export default FlashSaleStation;

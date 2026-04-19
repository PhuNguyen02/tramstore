"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Stack,
  Breadcrumbs,
  alpha,
} from "@mui/material";
import { Home, Search as SearchIcon, NavigateNext } from "@mui/icons-material";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ProductCard from "@/components/home/ProductGrid"; 
// Note: ProductGrid.tsx might contain ProductCard. Let me check the component structure.

const ACCENT = "#3AB7AE";
const DARK = "#0f172a";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/v1/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        // Map backend fields to frontend expected format
        const mapped = data.map((p: any) => ({
          ...p,
          title: p.name,
          image: p.images ? JSON.parse(p.images)[0] : '/file.svg',
          variants: p.variants || [],
        }));
        setProducts(mapped);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />
      
      {/* Breadcrumb */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9", py: 2 }}>
        <Container maxWidth="xl">
          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 16 }} />} aria-label="breadcrumb">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#64748b", "&:hover": { color: ACCENT } }}>
                <Home sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }}>TRANG CHỦ</Typography>
              </Stack>
            </Link>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ACCENT }}>
              TÌM KIẾM
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
          <SearchIcon sx={{ color: DARK, fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 900, color: DARK }}>
            Kết quả tìm kiếm cho: "{query}"
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: ACCENT }} />
          </Box>
        ) : products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "24px", border: "1px solid #f1f5f9", transition: "all 0.3s", "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.05)", transform: "translateY(-5px)" } }}>
                  <Link href={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
                    <Box sx={{ height: 180, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", p: 2, bgcolor: "#f8fafc", borderRadius: "16px" }}>
                       <img src={product.image} alt={product.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: DARK, mb: 1, height: 44, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3 }}>
                      {product.title}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 900 }}>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.variants[0].price)}
                      </Typography>
                      <Box sx={{ bgcolor: alpha(ACCENT, 0.1), color: ACCENT, px: 1, py: 0.5, borderRadius: "8px", fontSize: "0.7rem", fontWeight: 800 }}>
                        PREMIUM
                      </Box>
                    </Stack>
                  </Link>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 700 }}>
              Không tìm thấy sản phẩm nào phù hợp.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>}>
      <SearchResults />
    </Suspense>
  );
}

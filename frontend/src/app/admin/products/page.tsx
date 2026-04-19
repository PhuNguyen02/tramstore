"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  alpha,
  useTheme,
  Pagination,
  CircularProgress,
} from "@mui/material";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const displayed = filtered.slice((page - 1) * perPage, page * perPage);

  const getImage = (p: any) => {
    if (p.images) {
      try { return JSON.parse(p.images)[0]; } catch { return "/file.svg"; }
    }
    return "/file.svg";
  };

  const getStatus = (p: any) => {
    if (p.stock === 0) return "Out of Stock";
    if (p.status === "inactive") return "Inactive";
    return "Active";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Danh sách sản phẩm</Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Quản lý kho hàng và thông tin sản phẩm của bạn.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={<Plus size={20} />}
          sx={{ borderRadius: 3, px: 3, py: 1.2, textTransform: "none", fontWeight: 700 }}
        >
          Thêm sản phẩm mới
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {/* Filters Bar */}
        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.action.hover, 0.4), borderBottom: "1px solid", borderColor: "divider" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              placeholder="Tìm tên sản phẩm, mã ID..."
              size="small"
              fullWidth
              sx={{ 
                "& .MuiOutlinedInput-root": { bgcolor: "white", borderRadius: 2.5 },
                maxWidth: { sm: 400 }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<Filter size={18} />}
                sx={{ borderRadius: 2.5, bgcolor: "white", color: "text.secondary", borderColor: "divider" }}
              >
                Bộ lọc
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowUpDown size={18} />}
                sx={{ borderRadius: 2.5, bgcolor: "white", color: "text.secondary", borderColor: "divider" }}
              >
                Sắp xếp
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.2) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Sản phẩm</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Danh mục</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Giá bán</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Tồn kho</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.map((product) => {
                const status = getStatus(product);
                return (
                <TableRow
                  key={product.id}
                  sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) }, transition: "all 0.2s" }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        variant="rounded"
                        src={getImage(product)}
                        sx={{
                          width: 48,
                          height: 48,
                          p: 1,
                          bgcolor: "action.hover",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{product.name}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>{product.slug}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={product.category?.name || "—"}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: 10, bgcolor: "action.hover" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: 800 }}>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: product.stock < 10 ? 800 : 500,
                        color: product.stock < 10 ? "error.main" : "text.primary",
                      }}
                    >
                      {product.stock}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                      {status === "Active" ? (
                        <>
                          <CheckCircle2 size={16} color={theme.palette.success.main} />
                          <Typography variant="caption" sx={{ color: "success.main", fontWeight: 800 }}>Hoạt động</Typography>
                        </>
                      ) : status === "Inactive" ? (
                        <>
                          <XCircle size={16} color={theme.palette.text.disabled} />
                          <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 800 }}>Ngừng bán</Typography>
                        </>
                      ) : (
                        <>
                          <Clock size={16} color={theme.palette.warning.main} />
                          <Typography variant="caption" sx={{ color: "warning.main", fontWeight: 800 }}>Hết hàng</Typography>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" sx={{ color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton size="small" sx={{ color: "error.main", bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                        <Trash2 size={16} />
                      </IconButton>
                      <IconButton size="small">
                        <MoreHorizontal size={16} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        )}

        {/* Footer / Pagination */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: alpha(theme.palette.action.hover, 0.2) }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
            Hiển thị <strong>{displayed.length}</strong> trên <strong>{filtered.length}</strong> sản phẩm
          </Typography>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" shape="rounded" color="primary" />
        </Box>
      </Paper>
    </Box>
  );
}

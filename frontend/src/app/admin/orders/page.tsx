"use client";

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
  alpha,
  useTheme,
  Pagination,
} from "@mui/material";
import {
  Search,
  Filter,
  Eye,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Calendar,
} from "lucide-react";

const orders = [
  { id: "TRM1234", customer: "Nguyễn Văn A", email: "vana@gmail.com", product: "Gói Netflix 1 Năm", date: "10/04/2024", total: "250,000₫", status: "Completed", method: "Momo" },
  { id: "TRM1235", customer: "Trần Thị B", email: "thib@outlook.com", product: "Spotify Premium 6 Tháng", date: "10/04/2024", total: "150,000₫", status: "Processing", method: "ZaloPay" },
  { id: "TRM1236", customer: "Lê Văn C", email: "vanc@yahoo.com", product: "Adobe Full Apps vĩnh viễn", date: "09/04/2024", total: "1,200,000₫", status: "Pending", method: "Bank Transfer" },
  { id: "TRM1237", customer: "Phạm Minh D", email: "minhd@gmail.com", product: "YouTube Premium 1 Tháng", date: "09/04/2024", total: "30,000₫", status: "Cancelled", method: "Momo" },
  { id: "TRM1238", customer: "Hoàng Anh E", email: "anhe@gmail.com", product: "Canva Pro", date: "08/04/2024", total: "199,000₫", status: "Shipping", method: "Momo" },
];

export default function OrdersPage() {
  const theme = useTheme();

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
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý đơn hàng</Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Theo dõi và xử lý đơn hàng của khách hàng.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Calendar size={18} />}
            sx={{ borderRadius: 2.5, px: 3, textTransform: "none", fontWeight: 700, borderColor: "divider", color: "text.secondary" }}
          >
            Ngày tháng
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Download size={18} />}
            sx={{ borderRadius: 3, px: 3, py: 1.2, textTransform: "none", fontWeight: 700 }}
          >
            Xuất file Excel
          </Button>
        </Stack>
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
              placeholder="Tìm theo Mã đơn, Email, Tên khách..."
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
            />
            <Button
              variant="outlined"
              startIcon={<Filter size={18} />}
              sx={{ borderRadius: 2.5, bgcolor: "white", color: "text.secondary", borderColor: "divider" }}
            >
              Phân loại
            </Button>
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.2) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Mã đơn</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Sản phẩm</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Tổng tiền</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Phương thức</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, textTransform: "uppercase" }}>Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>#{order.id}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>{order.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{order.customer}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>{order.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.product}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{order.total}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={order.method} size="small" sx={{ fontWeight: 800, fontSize: 9, textTransform: "uppercase", height: 20 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={
                        order.status === "Completed" ? <CheckCircle2 size={14} /> :
                        order.status === "Processing" ? <Clock size={14} /> :
                        order.status === "Shipping" ? <Truck size={14} /> :
                        <XCircle size={14} />
                      }
                      label={
                        order.status === "Completed" ? "Thành công" :
                        order.status === "Processing" ? "Đang xử lý" :
                        order.status === "Shipping" ? "Đang giao" :
                        order.status === "Cancelled" ? "Đã hủy" : "Chờ duyệt"
                      }
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: 10,
                        bgcolor: 
                          order.status === "Completed" ? alpha(theme.palette.success.main, 0.1) :
                          order.status === "Processing" ? alpha(theme.palette.primary.main, 0.1) :
                          order.status === "Shipping" ? alpha(theme.palette.info.main, 0.1) :
                          alpha(theme.palette.error.main, 0.1),
                        color: 
                          order.status === "Completed" ? "success.main" :
                          order.status === "Processing" ? "primary.main" :
                          order.status === "Shipping" ? "info.main" : "error.main",
                        "& .MuiChip-icon": { color: "inherit" },
                        border: "none",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" sx={{ color: "primary.main" }}>
                      <Eye size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: alpha(theme.palette.action.hover, 0.2) }}>
           <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
             Hiển thị 5 đơn hàng gần nhất
          </Typography>
          <Button variant="text" size="small" sx={{ fontWeight: 800, textTransform: "none" }}>Xem tất cả lịch sử</Button>
        </Box>
      </Paper>
    </Box>
  );
}

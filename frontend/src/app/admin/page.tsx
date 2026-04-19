"use client";

import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Tổng doanh thu",
    value: "128,450,000₫",
    change: "+12.5%",
    isUp: true,
    icon: CreditCard,
    color: "primary",
  },
  {
    title: "Đơn hàng mới",
    value: "256",
    change: "+18.2%",
    isUp: true,
    icon: ShoppingBag,
    color: "success",
  },
  {
    title: "Khách hàng mới",
    value: "1,240",
    change: "-3.1%",
    isUp: false,
    icon: Users,
    color: "secondary",
  },
  {
    title: "Lượt truy cập",
    value: "45,678",
    change: "+24.5%",
    isUp: true,
    icon: TrendingUp,
    color: "warning",
  },
];

const recentOrders = [
  { id: "#TRM1234", customer: "Nguyễn Văn A", product: "Gói Netflix 1 Năm", amount: "250,000₫", status: "Completed", date: "10/04/2024" },
  { id: "#TRM1235", customer: "Trần Thị B", product: "Spotify Premium 6 Tháng", amount: "150,000₫", status: "Processing", date: "10/04/2024" },
  { id: "#TRM1236", customer: "Lê Văn C", product: "Adobe Full Apps", amount: "1,200,000₫", status: "Pending", date: "09/04/2024" },
  { id: "#TRM1237", customer: "Phạm Minh D", product: "YouTube Premium", amount: "30,000₫", status: "Cancelled", date: "09/04/2024" },
];

export default function Dashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
            Chào buổi sáng, Ad!
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Đây là tóm tắt hoạt động của cửa hàng ngày hôm nay.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            sx={{ borderRadius: 2.5, px: 3, py: 1, textTransform: "none", fontWeight: 700 }}
          >
            Tải báo cáo
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Plus size={18} />}
            sx={{ borderRadius: 2.5, px: 3, py: 1, textTransform: "none", fontWeight: 700 }}
          >
            Thêm sản phẩm
          </Button>
        </Stack>
      </Stack>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.04)" },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette[stat.color as any].main, 0.1),
                        color: `${stat.color}.main`,
                      }}
                    >
                      <stat.icon size={24} />
                    </Box>
                    <Chip
                      label={stat.change}
                      size="small"
                      icon={stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      sx={{
                        fontWeight: 800,
                        height: 24,
                        bgcolor: stat.isUp ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                        color: stat.isUp ? "success.main" : "error.main",
                        "& .MuiChip-icon": { color: "inherit" },
                        border: "none",
                      }}
                    />
                  </Stack>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Chart Section */}
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Biểu đồ doanh thu</Typography>
                <Select
                  defaultValue="7d"
                  size="small"
                  sx={{ borderRadius: 2, fontSize: 13, fontWeight: 700 }}
                >
                  <MenuItem value="7d">7 ngày qua</MenuItem>
                  <MenuItem value="30d">30 ngày qua</MenuItem>
                  <MenuItem value="1y">Năm nay</MenuItem>
                </Select>
              </Stack>
              
              <Box sx={{ height: 260, display: "flex", alignItems: "flex-end", gap: 1, px: 2 }}>
                {[40, 65, 45, 90, 55, 75, 50, 85, 60, 95, 40, 70].map((height, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      height: `${height}%`,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      borderRadius: "8px 8px 0 0",
                      transition: "all 0.3s",
                      "&:hover": {
                        bgcolor: "primary.main",
                        cursor: "pointer",
                      },
                    }}
                  />
                ))}
              </Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, px: 2 }}>
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN", "T2", "T3", "T4", "T5", "T6"].map((day, i) => (
                  <Typography key={i} variant="caption" sx={{ color: "text.disabled", fontWeight: 800, fontSize: 10 }}>
                    {day}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Đơn hàng mới</Typography>
                <Button variant="text" size="small" sx={{ fontWeight: 700, textTransform: "none" }}>Xem tất cả</Button>
              </Stack>

              <Stack spacing={3}>
                {recentOrders.map((order) => (
                  <Stack key={order.id} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.action.hover, 1),
                          color: "text.secondary",
                          borderRadius: 2.5,
                          width: 40,
                          height: 40,
                        }}
                      >
                        <ShoppingBag size={20} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{order.customer}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>{order.product}</Typography>
                      </Box>
                    </Stack>
                    <Box textAlign="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{order.amount}</Typography>
                      <Chip
                        label={order.status}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 9,
                          fontWeight: 800,
                          mt: 0.5,
                          bgcolor: 
                            order.status === 'Completed' ? alpha(theme.palette.success.main, 0.1) :
                            order.status === 'Processing' ? alpha(theme.palette.primary.main, 0.1) :
                            order.status === 'Pending' ? alpha(theme.palette.warning.main, 0.1) :
                            alpha(theme.palette.error.main, 0.1),
                          color: 
                             order.status === 'Completed' ? "success.main" :
                             order.status === 'Processing' ? "primary.main" :
                             order.status === 'Pending' ? "warning.dark" : "error.main",
                        }}
                      />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

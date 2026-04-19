"use client";

import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  MoreVertical,
  ChevronRight,
  UserPlus,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

const customers = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nguyen@gmail.com", phone: "0901234567", city: "Hồ Chí Minh", orders: 12, totalSpent: "5,400,000₫", status: "Active" },
  { id: 2, name: "Lê Thị Bình", email: "binh.le@outlook.com", phone: "0987654321", city: "Hà Nội", orders: 5, totalSpent: "1,200,000₫", status: "Active" },
  { id: 3, name: "Trần Minh Cường", email: "cuongtm@yahoo.com", phone: "0912345678", city: "Đà Nẵng", orders: 1, totalSpent: "350,000₫", status: "Inactive" },
  { id: 4, name: "Phạm Thu Dung", email: "dungpham@gmail.com", phone: "0345678901", city: "Cần Thơ", orders: 25, totalSpent: "12,800,000₫", status: "Active" },
  { id: 5, name: "Đỗ Gia Bảo", email: "baodo@gmail.com", phone: "0765432109", city: "Hải Phòng", orders: 0, totalSpent: "0₫", status: "New" },
];

export default function CustomersPage() {
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
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý khách hàng</Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Xem thông tin và hành vi mua sắm của người dùng.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={<UserPlus size={20} />}
          sx={{ borderRadius: 3, px: 3, py: 1.2, textTransform: "none", fontWeight: 700 }}
        >
          Thêm khách hàng
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {customers.map((customer, index) => (
          <Grid item xs={12} sm={6} lg={4} key={customer.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  position: "relative",
                  "&:hover": {
                    boxShadow: "0 12px 24px rgba(0,0,0,0.05)",
                    transform: "translateY(-4px)",
                  },
                  transition: "all 0.3s",
                }}
              >
                {/* Status Bar */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 4,
                    height: "100%",
                    bgcolor: 
                      customer.status === "Active" ? "success.main" :
                      customer.status === "New" ? "primary.main" : "text.disabled",
                  }}
                />

                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: alpha(theme.palette.primary.main, 1),
                          color: "white",
                          fontWeight: 800,
                          fontSize: 18,
                        }}
                      >
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{customer.name}</Typography>
                        <Chip
                          label={customer.status}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: 9,
                            fontWeight: 800,
                            mt: 0.5,
                            bgcolor: 
                              customer.status === 'Active' ? alpha(theme.palette.success.main, 0.1) :
                              customer.status === 'New' ? alpha(theme.palette.primary.main, 0.1) : "action.hover",
                            color: 
                              customer.status === 'Active' ? "success.main" :
                              customer.status === 'New' ? "primary.main" : "text.secondary",
                          }}
                        />
                      </Box>
                    </Stack>
                    <IconButton size="small">
                      <MoreVertical size={20} />
                    </IconButton>
                  </Stack>

                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "text.secondary" }}>
                      <Mail size={16} />
                      <Typography variant="body2">{customer.email}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "text.secondary" }}>
                      <Phone size={16} />
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "text.secondary" }}>
                      <MapPin size={16} />
                      <Typography variant="body2">{customer.city}</Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ mb: 3, borderStyle: "dashed" }} />

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "text.disabled", textTransform: "uppercase" }}>Đơn hàng</Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <ShoppingBag size={16} color={theme.palette.primary.main} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{customer.orders}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "text.disabled", textTransform: "uppercase" }}>Tổng chi</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 0.5 }}>{customer.totalSpent}</Typography>
                    </Grid>
                  </Grid>

                  <Button
                    fullWidth
                    variant="contained"
                    color="inherit"
                    disableElevation
                    endIcon={<ChevronRight size={16} />}
                    sx={{
                      borderRadius: 2.5,
                      bgcolor: "action.hover",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: 12,
                      "&:hover": { bgcolor: "primary.main", color: "white" },
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        <Grid item xs={12} sm={6} lg={4}>
          <Box
            sx={{
              height: "100%",
              minHeight: 330,
              borderRadius: 4,
              border: "2px dashed",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.01) },
              transition: "all 0.2s",
            }}
          >
            <Avatar sx={{ bgcolor: "white", color: "text.disabled", border: "1px solid", borderColor: "divider", width: 48, height: 48 }}>
              <Plus size={24} />
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.disabled" }}>
              Thêm khách hàng mới
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

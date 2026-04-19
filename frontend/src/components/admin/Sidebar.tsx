"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Store,
} from "lucide-react";

const drawerWidth = 260;

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Sản phẩm", icon: Package, href: "/admin/products" },
  { name: "Đơn hàng", icon: ShoppingBag, href: "/admin/orders" },
  { name: "Khách hàng", icon: Users, href: "/admin/customers" },
  { name: "Thống kê", icon: BarChart3, href: "/admin/analytics" },
  { name: "Cài đặt", icon: Settings, href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#0f172a", // slate-900
          color: "white",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        },
      }}
    >
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "primary.main",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
          }}
        >
          <Store size={24} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
            tramStore
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "slate.500",
              fontWeight: 600,
              opacity: 0.6,
            }}
          >
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)", my: 1 }} />

      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.href)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent",
                  color: isActive ? "#818cf8" : "#94a3b8",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "white",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "inherit",
                  }}
                >
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)", mb: 2 }} />
        <ListItemButton
          sx={{
            borderRadius: 2,
            color: "#94a3b8",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}

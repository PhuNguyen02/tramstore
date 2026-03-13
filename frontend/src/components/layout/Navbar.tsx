"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Divider,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCartOutlined as CartIcon,
  PersonOutline as UserIcon,
  Menu as MenuIcon,
  FavoriteBorder as HeartIcon,
  StorefrontOutlined as StoreIcon,
  HelpOutline as HelpIcon,
  NotificationsOutlined as NotifyIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Link from "next/link";

const NavAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(20px)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "16px",
  backgroundColor: "#f1f5f9", // Slate 100
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#e2e8f0", // Slate 200
  },
  marginLeft: 0,
  width: "100%",
  flexGrow: 1,
  maxWidth: "500px",
  height: "46px",
  display: "flex",
  alignItems: "center",
  border: "1px solid transparent",
  "&:focus-within": {
    backgroundColor: "#fff",
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 2, 1, 5),
    fontSize: "0.875rem",
    fontWeight: 600,
    width: "100%",
  },
}));

const Navbar = () => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const navLinks = [
    { name: "Sản phẩm", href: "/products" },
    { name: "Dịch vụ Game", href: "/gaming" },
    { name: "Ứng dụng AI", href: "/ai-tools" },
    { name: "Khuyến mãi", href: "/deals" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Banner Information */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 0.8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 800, letterSpacing: 1 }}
        >
          🎁 NHẬN NGAY VOUCHER 20K KHI ĐĂNG KÝ THÀNH VIÊN MỚI
        </Typography>
      </Box>

      <NavAppBar position="sticky" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1, gap: { xs: 1, md: 4 } }}>
            {/* Logo */}
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "primary.main",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StoreIcon sx={{ color: "#fff", fontSize: 26 }} />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1,
                    color: "primary.main",
                    letterSpacing: -1,
                  }}
                >
                  TRAM<span style={{ color: "#0f172a" }}>STORE</span>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: "text.disabled",
                    letterSpacing: 2,
                    fontSize: 8,
                  }}
                >
                  PREMIUM DIGITAL SERVICES
                </Typography>
              </Box>
            </Link>

            {/* Main Nav Links (Desktop) */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 3 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      transition: "color 0.2s",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {link.name}
                  </Typography>
                </Link>
              ))}
            </Box>

            {/* Search Bar */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <Search>
                <Box
                  sx={{
                    position: "absolute",
                    left: 16,
                    color: "text.disabled",
                    display: "flex",
                  }}
                >
                  <SearchIcon fontSize="small" />
                </Box>
                <StyledInputBase placeholder="Bạn đang tìm kiếm ứng dụng gì?" />
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    mr: 0.5,
                    borderRadius: "12px",
                    px: 3,
                    boxShadow: "none",
                    height: "36px",
                  }}
                >
                  Tìm
                </Button>
              </Search>
            </Box>

            {/* Right Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, md: 1.5 },
              }}
            >
              <Tooltip title="Câu hỏi thường gặp">
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              <IconButton color="inherit" size="small">
                <Badge badgeContent={0} color="secondary">
                  <NotifyIcon />
                </Badge>
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Tooltip title="Giỏ hàng">
                <IconButton color="inherit">
                  <Badge badgeContent={2} color="secondary" overlap="circular">
                    <CartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<UserIcon />}
                sx={{
                  display: { xs: "none", md: "flex" },
                  fontWeight: 900,
                  px: 3,
                  py: 1.2,
                }}
              >
                Tài khoản
              </Button>
              <IconButton
                sx={{ display: { lg: "none" } }}
                onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </NavAppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={() => setMobileMenuAnchor(null)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "100%",
            borderRadius: 0,
            mt: 1.5,
            p: 2,
          },
        }}
      >
        {navLinks.map((link) => (
          <MenuItem
            key={link.name}
            onClick={() => setMobileMenuAnchor(null)}
            sx={{ borderRadius: "12px", mb: 1 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {link.name}
            </Typography>
          </MenuItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <Button fullWidth variant="contained" sx={{ py: 1.5 }}>
          Đăng nhập / Đăng ký
        </Button>
      </Menu>
    </Box>
  );
};

export default Navbar;

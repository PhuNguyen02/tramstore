"use client";

import React, { useState, useEffect } from "react";
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
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  alpha,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCartOutlined as CartIcon,
  PersonOutline as UserIcon,
  Menu as MenuIcon,
  NotificationsOutlined as NotifyIcon,
  Close as CloseIcon,
  StorefrontOutlined as StoreIcon,
  AutoAwesomeOutlined as AIIcon,
  SportsEsportsOutlined as GameIcon,
  RouteOutlined as RouteIcon,
  LocalActivityOutlined as DealIcon,
  HelpOutline as HelpIcon,
  Translate as LangIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cartStore";
import { useAuth } from "@/store/authStore";
import AuthModal from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════════════════════
   ⭐ ANIMATIONS & KEYFRAMES
   ══════════════════════════════════════════════════════ */
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

/* ══════════════════════════════════════════════════════
   🏙️ STYLED COMPONENTS
   ══════════════════════════════════════════════════════ */
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "scrolled",
})<{ scrolled?: boolean }>(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "#fff",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  color: theme.palette.text.primary,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.04)" : "none",
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "14px",
  backgroundColor: "#f1f5f9",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: "460px",
  border: "1px solid transparent",
  height: "44px",
  "&:hover": {
    backgroundColor: "#e2e8f0",
  },
  "&:focus-within": {
    backgroundColor: "#fff",
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const InputField = styled(InputBase)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 2, 1, 5),
    fontSize: "0.875rem",
    fontWeight: 500,
    width: "100%",
  },
}));

const StationLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  textDecoration: "none",
  color: active ? theme.palette.primary.main : "#475569",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  padding: "8px 24px",
  position: "relative",
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.main,
    "& .link-icon": { transform: "translateY(-2px)" },
    "& .active-indicator": { width: "24px", opacity: 1 },
  },
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#f1f5f9",
  color: "#1e293b",
  borderRadius: "12px",
  padding: "10px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    transform: "translateY(-2px)",
  },
}));

/* ══════════════════════════════════════════════════════
   🏗️ NAVBAR COMPONENT
   ══════════════════════════════════════════════════════ */
const Navbar = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stations = [
    { name: "Sản phẩm", href: "/products", icon: <StoreIcon /> },
    { name: "Lộ trình", href: "#flash-sale", icon: <RouteIcon /> },
    { name: "Dịch vụ Game", href: "/gaming", icon: <GameIcon /> },
    { name: "Ứng dụng AI", href: "/ai-tools", icon: <AIIcon /> },
    { name: "Khuyến mãi", href: "/deals", icon: <DealIcon /> },
  ];

  return (
    <>
      <StyledAppBar position="sticky" elevation={0} scrolled={scrolled}>
        <Container maxWidth="xl">
          {/* LEVEL 1: BRANDING, SEARCH, ACTIONS */}
          <Toolbar disableGutters sx={{ height: { xs: 70, md: 84 }, gap: { xs: 2, lg: 4 } }}>
            {/* LOGO AREA */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
              <Box sx={{ 
                width: 44, height: 44, 
                bgcolor: "primary.main", 
                borderRadius: "14px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(58, 183, 174, 0.25)",
                color: "#fff"
              }}>
                <StoreIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="h6" sx={{ fontWeight: 900, fontSize: "1.4rem", color: "#0f172a", letterSpacing: -1, lineHeight: 1 }}>
                  TRAM<span style={{ color: "#3AB7AE" }}>STORE</span>
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "text.disabled", letterSpacing: 2, fontSize: 8 }}>
                  PREMIUM DIGITAL SERVICES
                </Typography>
              </Box>
            </Link>

            {/* SEARCH AREA (HIDDEN ON MOBILE, CENTRAL ON DESKTOP) */}
            <Box 
              component="form" 
              onSubmit={handleSearch}
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}
            >
              <SearchWrapper>
                <SearchIcon sx={{ position: "absolute", left: 14, color: "text.disabled", fontSize: 20 }} />
                <InputField 
                  placeholder="Tìm kiếm ứng dụng, dịch vụ premium..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Box 
                  sx={{ 
                    position: "absolute", right: 6, 
                    px: 1, py: 0.5, bgcolor: "#fff", 
                    borderRadius: "8px", border: "1px solid #e2e8f0",
                    display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "text.disabled", fontSize: 10 }}>ENTER</Typography>
                </Box>
              </SearchWrapper>
            </Box>

            {/* ACTION GROUP */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <NavButton sx={{ display: { xs: "none", xl: "inline-flex" } }}>
                <HelpIcon fontSize="small" />
              </NavButton>

              <NavButton>
                <Badge badgeContent={3} color="primary" sx={{ "& .MuiBadge-badge": { fontWeight: 900 } }}>
                  <NotifyIcon fontSize="small" />
                </Badge>
              </NavButton>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 28, alignSelf: "center", display: { xs: "none", md: "block" } }} />

              <Tooltip title="Giỏ hàng">
                <Button
                  onClick={openDrawer}
                  sx={{
                    px: { xs: 1.5, md: 2.5 }, py: 1.2,
                    borderRadius: "14px",
                    bgcolor: alpha("#3AB7AE", 0.08),
                    color: "primary.main",
                    "&:hover": { bgcolor: alpha("#3AB7AE", 0.15) },
                    display: "flex", alignItems: "center", gap: 1.5
                  }}
                >
                  <Badge badgeContent={totalItems} color="primary" sx={{ "& .MuiBadge-badge": { fontWeight: 900, fontSize: "0.6rem" } }}>
                    <CartIcon />
                  </Badge>
                  <Box sx={{ textAlign: "left", display: { xs: "none", xl: "block" } }}>
                    <Typography variant="caption" sx={{ display: "block", color: "inherit", fontWeight: 800, lineHeight: 1 }}>Giỏ hàng</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1, mt: 0.3 }}>
                      {totalItems > 0 ? `${totalItems} SP` : "Trống"}
                    </Typography>
                  </Box>
                </Button>
              </Tooltip>

              {isAuthenticated ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-end",
                      display: { xs: "none", lg: "flex" }
                    }}
                  >
                    <Typography sx={{ fontWeight: 900, fontSize: "0.85rem", color: "#0f172a", lineHeight: 1 }}>
                      {user?.name}
                    </Typography>
                    <Typography 
                      onClick={logout}
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: "0.65rem", 
                        color: "error.main", 
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" }
                      }}
                    >
                      Đăng xuất
                    </Typography>
                  </Box>
                  <IconButton
                    sx={{ 
                      width: 44, height: 44, 
                      bgcolor: alpha("#3AB7AE", 0.1), 
                      border: "2px solid #fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                    }}
                  >
                    <UserIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<UserIcon />}
                  onClick={() => setAuthOpen(true)}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    bgcolor: "#0f172a",
                    fontWeight: 800,
                    px: 3, height: 44, borderRadius: "14px",
                    textTransform: "none", fontSize: "0.85rem",
                    "&:hover": { bgcolor: "#1e293b" }
                  }}
                >
                  Đăng nhập
                </Button>
              )}

              <IconButton sx={{ display: { md: "none" }, bgcolor: "#f1f5f9", borderRadius: "12px" }} onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>

        {/* LEVEL 2: NAVIGATION RIBBON (DESKTOP ONLY) */}
        <Box sx={{ display: { xs: "none", md: "block" }, borderTop: "1px solid rgba(0,0,0,0.03)", bgcolor: alpha("#f8fafc", 0.5) }}>
          <Container maxWidth="xl">
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ py: 1 }}>
              {stations.map((item) => (
                <StationLink key={item.name} href={item.href} active={pathname === item.href}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box className="link-icon" sx={{ transition: "all 0.3s ease", display: "flex", color: pathname === item.href ? "primary.main" : "inherit" }}>
                      {React.cloneElement(item.icon as React.ReactElement<any>, { sx: { fontSize: 18 } })}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: -0.2 }}>{item.name}</Typography>
                  </Box>
                  <Box
                    className="active-indicator"
                    sx={{
                      width: pathname === item.href ? "24px" : "0",
                      height: "3px",
                      bgcolor: "primary.main",
                      borderRadius: "2px",
                      transition: "all 0.3s ease",
                      opacity: pathname === item.href ? 1 : 0,
                      mt: 0.5
                    }}
                  />
                </StationLink>
              ))}
            </Stack>
          </Container>
        </Box>
      </StyledAppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: "100%", maxWidth: 320, p: 0 } }}
      >
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>MENU</Typography>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ bgcolor: "#f1f5f9" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ mb: 4 }}>
            {stations.map((item) => (
              <ListItem 
                key={item.name} 
                component={Link} 
                href={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: "12px", mb: 1.5, p: 2, bgcolor: pathname === item.href ? alpha("#3AB7AE", 0.08) : "transparent" }}
              >
                <ListItemIcon sx={{ minWidth: 44, color: pathname === item.href ? "primary.main" : "text.secondary" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} primaryTypographyProps={{ sx: { fontWeight: 800, color: pathname === item.href ? "primary.main" : "#0f172a" } }} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ mt: "auto" }}>
            <Button fullWidth variant="contained" size="large" sx={{ py: 2, borderRadius: "16px", fontWeight: 800, mb: 2 }}>
              Đăng nhập ngay
            </Button>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ opacity: 0.6 }}>
              <LangIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>Tiếng Việt / English</Typography>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* AUTH MODAL */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;

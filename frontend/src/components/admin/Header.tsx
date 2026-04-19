"use client";

import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  Typography,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              backgroundColor: alpha(theme.palette.text.primary, 0.05),
              borderRadius: 50,
              px: 2,
              py: 0.5,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Search size={18} color={theme.palette.text.secondary} />
            <InputBase
              placeholder="Tìm kiếm nhanh..."
              sx={{ ml: 1, flex: 1, fontSize: 14 }}
            />
          </Box>
          <IconButton sx={{ display: { xs: "flex", md: "none" } }}>
            <Menu size={24} />
          </IconButton>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="large" sx={{ color: "text.secondary" }}>
            <Badge badgeContent={3} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              p: 0.5,
              pr: 1.5,
              borderRadius: 50,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
              transition: "all 0.2s",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundImage: "linear-gradient(45deg, #6366f1, #a855f7)",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              A
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                Admin
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10, fontWeight: 600, textTransform: "uppercase" }}>
                Super Admin
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function Divider({ orientation, flexItem, sx }: any) {
  return <Box sx={{ width: 1, backgroundColor: "divider", ...sx }} />;
}

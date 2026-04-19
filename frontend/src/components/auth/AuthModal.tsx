"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Stack,
  Divider,
  Tab,
  Tabs,
  InputAdornment,
  Chip,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  AutoAwesome,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/store/authStore";

const ACCENT = "#3AB7AE";
const DARK = "#0f172a";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: number;
}

export default function AuthModal({
  open,
  onClose,
  defaultTab = 0,
}: AuthModalProps) {
  const [tab, setTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const { login } = useAuth();

  const handleLogin = () => {
    setLoading(true);
    // Mocking a login response
    setTimeout(() => {
      login(
        {
          id: "1",
          name: "Guest User",
          email: loginForm.email || "guest@example.com",
        },
        "mock-token-" + Date.now()
      );
      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleRegister = () => {
    setLoading(true);
    // Mocking an registration and login
    setTimeout(() => {
      login(
        {
          id: "2",
          name: registerForm.name,
          email: registerForm.email,
        },
        "mock-token-" + Date.now()
      );
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Hero header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${DARK} 0%, #1e293b 100%)`,
          p: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            bgcolor: ACCENT,
            opacity: 0.08,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: ACCENT,
            opacity: 0.06,
          }}
        />

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "rgba(255,255,255,0.1)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              bgcolor: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AutoAwesome sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 900,
                fontSize: "1.3rem",
                letterSpacing: -0.5,
                lineHeight: 1,
              }}
            >
              TRAM<span style={{ color: ACCENT }}>STORE</span>
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: 2 }}
            >
              DIGITAL STATION
            </Typography>
          </Box>
        </Stack>

        <Typography
          sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: "0.9rem" }}
        >
          {tab === 0
            ? "Đăng nhập để mua sắm và quản lý đơn hàng"
            : "Tạo tài khoản — Nhận ngay ưu đãi chào mừng"}
        </Typography>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            borderBottom: "1px solid #f1f5f9",
            "& .MuiTabs-indicator": { bgcolor: ACCENT, height: 3 },
            "& .MuiTab-root": {
              fontWeight: 800,
              textTransform: "none",
              fontSize: "0.9rem",
              color: "#94a3b8",
              "&.Mui-selected": { color: DARK },
            },
          }}
        >
          <Tab label="Đăng nhập" />
          <Tab label="Đăng ký" />
        </Tabs>

        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          <AnimatePresence mode="wait">
            {tab === 0 ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Stack spacing={2.5}>
                  {/* Social login */}
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Google />}
                      sx={{
                        borderRadius: "12px",
                        borderColor: "#e2e8f0",
                        color: "#475569",
                        fontWeight: 700,
                        textTransform: "none",
                        py: 1.2,
                        "&:hover": { borderColor: "#db4437", color: "#db4437" },
                      }}
                    >
                      Google
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Facebook />}
                      sx={{
                        borderRadius: "12px",
                        borderColor: "#e2e8f0",
                        color: "#475569",
                        fontWeight: 700,
                        textTransform: "none",
                        py: 1.2,
                        "&:hover": { borderColor: "#1877f2", color: "#1877f2" },
                      }}
                    >
                      Facebook
                    </Button>
                  </Stack>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Divider sx={{ flex: 1 }} />
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      HOẶC
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Box>

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": { borderColor: ACCENT },
                        "&.Mui-focused fieldset": { borderColor: ACCENT },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <VisibilityOff sx={{ fontSize: 18 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 18 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": { borderColor: ACCENT },
                        "&.Mui-focused fieldset": { borderColor: ACCENT },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
                    }}
                  />

                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: ACCENT,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Quên mật khẩu?
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{
                      bgcolor: DARK,
                      fontWeight: 900,
                      height: 52,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontSize: "0.95rem",
                      "&:hover": { bgcolor: "#1e293b" },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={22} sx={{ color: "#fff" }} />
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>

                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "0.8rem",
                      color: "#94a3b8",
                      fontWeight: 600,
                    }}
                  >
                    Chưa có tài khoản?{" "}
                    <span
                      onClick={() => setTab(1)}
                      style={{
                        color: ACCENT,
                        fontWeight: 800,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Đăng ký ngay
                    </span>
                  </Typography>
                </Stack>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Stack spacing={2.5}>
                  <Chip
                    label="🎁 Đăng ký hôm nay — Nhận ngay voucher 50.000đ"
                    sx={{
                      bgcolor: alpha(ACCENT, 0.1),
                      color: ACCENT,
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      height: 32,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": { borderColor: ACCENT },
                        "&.Mui-focused fieldset": { borderColor: ACCENT },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": { borderColor: ACCENT },
                        "&.Mui-focused fieldset": { borderColor: ACCENT },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <VisibilityOff sx={{ fontSize: 18 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 18 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": { borderColor: ACCENT },
                        "&.Mui-focused fieldset": { borderColor: ACCENT },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Nhập lại mật khẩu"
                    type={showPassword ? "text" : "password"}
                    value={registerForm.confirm}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        confirm: e.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": { borderColor: ACCENT },
                        "&.Mui-focused fieldset": { borderColor: ACCENT },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleRegister}
                    disabled={loading}
                    sx={{
                      bgcolor: ACCENT,
                      fontWeight: 900,
                      height: 52,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontSize: "0.95rem",
                      boxShadow: `0 8px 24px ${alpha(ACCENT, 0.35)}`,
                      "&:hover": { bgcolor: "#2a9b93" },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={22} sx={{ color: "#fff" }} />
                    ) : (
                      "Tạo tài khoản"
                    )}
                  </Button>

                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "0.8rem",
                      color: "#94a3b8",
                      fontWeight: 600,
                    }}
                  >
                    Đã có tài khoản?{" "}
                    <span
                      onClick={() => setTab(0)}
                      style={{
                        color: DARK,
                        fontWeight: 800,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Đăng nhập
                    </span>
                  </Typography>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

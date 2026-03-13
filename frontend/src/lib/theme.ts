"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3AB7AE",
      light: "#5BC8C0",
      dark: "#2A9B93",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ef4444", // Red
      light: "#f87171",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc", // Very light slate
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // Darker slate
      secondary: "#64748b", // Slate 500
    },
    divider: "#f1f5f9",
  },
  typography: {
    fontFamily: ["Inter", '"Outfit"', "Roboto", "sans-serif"].join(","),
    h1: { fontWeight: 900, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.01em" },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 800 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 700 },
    button: {
      textTransform: "none",
      fontWeight: 800,
      letterSpacing: "0.025em",
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.05)",
    "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
    ...Array(20).fill("none"), // Fill the rest to satisfy MUI
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 28px",
          borderRadius: "14px",
          boxShadow: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 8px 20px rgba(58, 183, 174, 0.15)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #3AB7AE, #2A9B93)",
          "&:hover": {
            background: "linear-gradient(135deg, #2A9B93, #1e706a)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          border: "1px solid #f1f5f9",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
            borderColor: "rgba(58, 183, 174, 0.2)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;

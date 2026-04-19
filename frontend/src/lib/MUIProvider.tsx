"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { CartProvider } from "@/store/cartStore";
import CartDrawer from "@/components/cart/CartDrawer";

export default function MUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

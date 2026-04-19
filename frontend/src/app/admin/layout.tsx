import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { Box } from "@mui/material";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column",
          width: { sm: `calc(100% - 260px)` },
        }}
      >
        <Header />
        <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

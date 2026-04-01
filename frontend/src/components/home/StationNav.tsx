"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  alpha,
  Tooltip,
  IconButton,
  Stack,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  MapOutlined as MapIcon,
  TrainOutlined as StationIcon,
} from "@mui/icons-material";

/* ── Animations ────────────────────────────────────── */
const pulseLive = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 183, 174, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(58, 183, 174, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 183, 174, 0); }
`;

const entrance = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

/* ── Styled Components ─────────────────────────────── */
const FloatingStationMap = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isHovered",
})<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  position: "fixed",
  right: "32px",
  bottom: "32px",
  zIndex: 1100,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "12px",
  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  padding: isHovered ? "16px" : "0px",
  borderRadius: isHovered ? "28px" : "50%",
  backgroundColor: isHovered ? "rgba(255, 255, 255, 0.9)" : "transparent",
  backdropFilter: isHovered ? "blur(20px)" : "none",
  border: isHovered ? "1.5px solid rgba(58, 183, 174, 0.2)" : "none",
  boxShadow: isHovered ? "0 20px 40px -12px rgba(0,0,0,0.15)" : "none",
  [theme.breakpoints.down("md")]: {
    bottom: "24px",
    right: "24px",
  },
}));

const BubbleTrigger = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isHovered",
})<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  backgroundColor: "#fff",
  border: "2.5px solid #3AB7AE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#3AB7AE",
  boxShadow: isHovered
    ? "0 8px 20px rgba(58, 183, 174, 0.2)"
    : "0 4px 12px rgba(58, 183, 174, 0.15)",
  transition: "all 0.3s ease",
  animation: isHovered ? "none" : `${pulseLive} 2s infinite`,
  "&:hover": {
    transform: isHovered ? "none" : "scale(1.1)",
    backgroundColor: isHovered ? "#fff" : alpha("#3AB7AE", 0.05),
  },
}));

const MapMenu = styled(Stack)(({ theme }) => ({
  animation: `${entrance} 0.4s ease-out forwards`,
  gap: "10px",
  maxHeight: "75vh",
  overflowY: "auto",
  paddingRight: "4px",
  "&::-webkit-scrollbar": { width: 0 }, // Hide scrollbar
}));

const RouteNode = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "color",
})<{ active?: boolean; color?: string }>(({ active, color = "#3AB7AE" }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  borderRadius: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: active ? alpha(color, 0.08) : "transparent",
  "&:hover": {
    backgroundColor: alpha(color, 0.12),
    "& .node-dot": { transform: "scale(1.3)", backgroundColor: color },
    "& .node-text": { color: "#0f172a" },
  },
}));

const NodeDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "color",
})<{ active?: boolean; color?: string }>(({ active, color = "#3AB7AE" }) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: active ? color : alpha("#94a3b8", 0.4),
  border: `2px solid ${active ? color : "transparent"}`,
  transition: "all 0.3s ease",
  flexShrink: 0,
}));

/* ── Configuration ─────────────────────────────────── */
const STATIONS = [
  { id: "hero", name: "Ga Khởi Hành", color: "#3AB7AE" },
  { id: "flash-sale", name: "Trạm Siêu Ưu Đãi ⚡", color: "#f59e0b" },
  { id: "station-1", name: "Trạm 1: AI & Công nghệ", color: "#3AB7AE" },
  { id: "station-2", name: "Trạm 2: Trạm Giải Trí", color: "#ef4444" },
  { id: "station-3", name: "Trạm 3: Trạm Làm Việc", color: "#f59e0b" },
  { id: "station-4", name: "Trạm 4: Trạm Học Tập", color: "#8b5cf6" },
  { id: "station-5", name: "Trạm 5: Trạm Bảo Mật", color: "#06b6d4" },
  { id: "station-6", name: "Ga Cuối: Phần Mềm", color: "#ec4899" },
];

const StationNav = () => {
  const [activeId, setActiveId] = useState("hero");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const station of STATIONS) {
        const element = document.getElementById(station.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveId(station.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      // Optionally shrink after click on mobile or small screens
      // setIsHovered(false);
    }
  };

  return (
    <FloatingStationMap
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      {isHovered && (
        <MapMenu>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 900,
              px: 1.5,
              color: "text.disabled",
              letterSpacing: 2,
              fontSize: "0.6rem",
            }}
          >
            LỘ TRÌNH GA BYTE
          </Typography>
          {STATIONS.map((station) => (
            <RouteNode
              key={station.id}
              active={activeId === station.id}
              color={station.color}
              onClick={(e) => scrollToSection(station.id, e)}
            >
              <Typography
                className="node-text"
                sx={{
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  color: activeId === station.id ? "#0f172a" : "#64748b",
                  transition: "all 0.2s",
                }}
              >
                {station.name}
              </Typography>
              <NodeDot
                color={station.color}
                className="node-dot"
                active={activeId === station.id}
              />
            </RouteNode>
          ))}
        </MapMenu>
      )}

      <BubbleTrigger isHovered={isHovered}>
        {isHovered ? (
          <StationIcon sx={{ fontSize: 26 }} />
        ) : (
          <MapIcon sx={{ fontSize: 26 }} />
        )}
      </BubbleTrigger>
    </FloatingStationMap>
  );
};

export default StationNav;

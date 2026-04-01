"use client";

import React from "react";
import { Box, Typography, alpha, Button } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

/* ══════════════════════════════════════════════════════
   🎬 ANIMATIONS
   ══════════════════════════════════════════════════════ */
const trainRun = keyframes`
  0% { transform: translateX(-140px) translateY(-96%) rotate(0deg); }
  5% { transform: translateX(-140px) translateY(-96.5%) rotate(0.2deg); }
  10% { transform: translateX(-140px) translateY(-96%) rotate(0deg); }
  25% { transform: translateX(25vw) translateY(-96.5%) rotate(0.1deg); }
  50% { transform: translateX(50vw) translateY(-96%) rotate(-0.1deg); }
  75% { transform: translateX(75vw) translateY(-96.5%) rotate(0.1deg); }
  100% { transform: translateX(calc(100vw + 140px)) translateY(-96%) rotate(0deg); }
`;

const dotPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const glowRing = keyframes`
  0% { box-shadow: 0 0 0 0px rgba(58, 183, 174, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(58, 183, 174, 0); }
  100% { box-shadow: 0 0 0 0px rgba(58, 183, 174, 0); }
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* ══════════════════════════════════════════════════════
   🚉 TRAIN TRACK — Metro-style station connector
   ══════════════════════════════════════════════════════ */
export const TrainTrack = ({
  stationName,
  stationNumber,
  gif,
  isLast = false,
  accentColor = "#3AB7AE",
}: {
  stationName: string;
  stationNumber: number;
  gif: string;
  isLast?: boolean;
  accentColor?: string;
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 4, md: 6 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Vertical track line (metro style) */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: 36, md: "50%" },
          top: 0,
          bottom: isLast ? "50%" : 0,
          width: "6px",
          borderRadius: "3px",
          background: `linear-gradient(180deg, ${accentColor}, ${alpha(accentColor, 0.3)})`,
          transform: { md: "translateX(-50%)" },
          zIndex: 1,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: -5,
            right: -5,
            bottom: 0,
            background: `linear-gradient(180deg, ${alpha(accentColor, 0.08)}, transparent)`,
            borderRadius: "8px",
          },
        }}
      />

      {/* Station node */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "center" },
          position: "relative",
          zIndex: 2,
          gap: 0,
          width: "100%",
          maxWidth: { md: 600 },
          flexDirection: {
            xs: "row",
            md: stationNumber % 2 === 0 ? "row-reverse" : "row",
          },
        }}
      >
        {/* Station circle — pulsing metro node */}
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Outer glow ring */}
          <Box
            sx={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              animation: `${glowRing} 2.5s ease-in-out infinite`,
              animationDelay: `${stationNumber * 0.4}s`,
            }}
          />
          <Box
            sx={{
              width: { xs: 72, md: 88 },
              height: { xs: 72, md: 88 },
              borderRadius: "50%",
              bgcolor: "#fff",
              border: `5px solid ${accentColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 0 6px ${alpha(accentColor, 0.12)}, 0 12px 32px rgba(0,0,0,0.1)`,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.12) rotate(5deg)",
                boxShadow: `0 0 0 10px ${alpha(accentColor, 0.18)}, 0 16px 48px rgba(0,0,0,0.15)`,
              },
            }}
          >
            <img
              src={gif}
              alt={stationName}
              style={{ width: "58%", height: "58%", objectFit: "contain" }}
            />
            {/* Station number badge */}
            <Box
              sx={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 26,
                height: 26,
                borderRadius: "50%",
                bgcolor: accentColor,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "0.7rem",
                border: "3px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              {stationNumber}
            </Box>
          </Box>
        </Box>

        {/* Station info card */}
        <Box
          sx={{
            ml: { xs: 2.5, md: stationNumber % 2 === 0 ? 0 : 3 },
            mr: { xs: 0, md: stationNumber % 2 === 0 ? 3 : 0 },
            flex: 1,
            maxWidth: 360,
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              px: 3,
              py: 2.5,
              borderRadius: "20px",
              border: `2px solid ${alpha(accentColor, 0.12)}`,
              boxShadow: `0 8px 24px ${alpha(accentColor, 0.06)}, 0 2px 8px rgba(0,0,0,0.04)`,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              "&:hover": {
                borderColor: accentColor,
                boxShadow: `0 12px 36px ${alpha(accentColor, 0.12)}, 0 4px 12px rgba(0,0,0,0.06)`,
                transform: "translateY(-4px)",
                "& .station-arrow": {
                  transform: "translateX(4px)",
                  opacity: 1,
                },
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${accentColor}, ${alpha(accentColor, 0.3)})`,
              },
            }}
          >
            {/* Shimmer effect on top */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, transparent, ${alpha("#fff", 0.6)}, transparent)`,
                backgroundSize: "200% 100%",
                animation: `${shimmer} 3s linear infinite`,
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 0.8,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: alpha(accentColor, 0.1),
                      color: accentColor,
                      px: 1.2,
                      py: 0.3,
                      borderRadius: "8px",
                      fontWeight: 900,
                      fontSize: "0.6rem",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      border: `1px solid ${alpha(accentColor, 0.15)}`,
                    }}
                  >
                    TRẠM {String(stationNumber).padStart(2, "0")}
                  </Box>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#22c55e",
                      animation: `${dotPulse} 2s ease-in-out infinite`,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#22c55e",
                      fontWeight: 800,
                      fontSize: "0.6rem",
                      letterSpacing: 0.5,
                    }}
                  >
                    ĐANG HOẠT ĐỘNG
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1.2,
                    fontSize: { xs: "1rem", md: "1.15rem" },
                  }}
                >
                  {stationName}
                </Typography>
              </Box>
              <ArrowIcon
                className="station-arrow"
                sx={{
                  color: accentColor,
                  opacity: 0.4,
                  transition: "all 0.3s ease",
                  fontSize: 20,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════════
   🚂 RUNNING TRAIN — Full-width animated section
   ══════════════════════════════════════════════════════ */
export const RunningTrain = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 40, md: 60 },
        overflow: "hidden",
        my: { xs: 1, md: 2 },
        mx: 2,
      }}
    >
      {/* Railroad bed */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "24px",
          transform: "translateY(-50%)",
          bgcolor: "#f8fafc",
          borderRadius: "12px",
        }}
      />

      {/* Rail 1 */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "3px",
          transform: "translateY(-6px)",
          background: "linear-gradient(90deg, #cbd5e1, #94a3b8, #cbd5e1)",
          borderRadius: "1.5px",
        }}
      />
      {/* Rail 2 */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "3px",
          transform: "translateY(3px)",
          background: "linear-gradient(90deg, #cbd5e1, #94a3b8, #cbd5e1)",
          borderRadius: "1.5px",
        }}
      />

      {/* Sleepers (ties) */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "16px",
          transform: "translateY(-50%)",
          background: `repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 22px,
            #e2e8f0 22px,
            #e2e8f0 28px
          )`,
        }}
      />

      {/* Station markers at edges */}
      <Box
        sx={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: "#3AB7AE",
          border: "3px solid #fff",
          boxShadow: "0 0 0 3px rgba(58,183,174,0.2)",
          zIndex: 4,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: "#3AB7AE",
          border: "3px solid #fff",
          boxShadow: "0 0 0 3px rgba(58,183,174,0.2)",
          zIndex: 4,
        }}
      />
    </Box>
  );
};

/* ══════════════════════════════════════════════════════
   📋 DEPARTURE BOARD — Flash Sale wrapper (Light Teal)
   ══════════════════════════════════════════════════════ */
export const DepartureBoard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(160deg, #f0faf9 0%, #e6f7f5 40%, #f0fdfb 100%)",
        borderRadius: { xs: "24px", md: "40px" },
        overflow: "hidden",
        position: "relative",
        boxShadow:
          "0 24px 80px -20px rgba(58, 183, 174, 0.2), 0 8px 32px -10px rgba(0,0,0,0.05)",
        border: "1px solid rgba(58, 183, 174, 0.2)",
      }}
    >
      {/* Board header — teal tinted */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(58, 183, 174, 0.08) 0%, rgba(58, 183, 174, 0.03) 100%)",
          px: { xs: 3, md: 6 },
          py: { xs: 2.5, md: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(58, 183, 174, 0.12)",
          boxShadow: "0 4px 12px -2px rgba(58, 183, 174, 0.08)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <Box
            sx={{
              width: { xs: 40, md: 52 },
              height: { xs: 40, md: 52 },
              borderRadius: "16px",
              bgcolor: "#fff",
              border: "2px solid rgba(58, 183, 174, 0.2)",
              boxShadow: "0 4px 12px rgba(58, 183, 174, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0.6,
            }}
          >
            <img
              src="/train-station-gif.gif"
              alt="Station"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: alpha("#3AB7AE", 0.5),
                fontWeight: 900,
                letterSpacing: 3,
                fontSize: "0.55rem",
                display: "block",
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              BẢNG KHỞI HÀNH • DEPARTURE BOARD
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#0f172a",
                fontWeight: 900,
                lineHeight: 1.2,
                fontSize: { xs: "1rem", md: "1.25rem" },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span style={{ color: "#f59e0b" }}>⚡</span>
              Flash Sale — Chuyến tàu ưu đãi
            </Typography>
          </Box>
        </Box>

        {/* Status indicators */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Clock */}
          <Box
            sx={{
              width: 36,
              height: 36,
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
            }}
          >
            <img
              src="/clock.gif"
              alt="Clock"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
          {/* Live indicator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(239, 68, 68, 0.06)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              borderRadius: "10px",
              px: 1.5,
              py: 0.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#ef4444",
                animation: `${dotPulse} 1.2s ease-in-out infinite`,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#ef4444",
                fontWeight: 900,
                letterSpacing: 1.5,
                fontSize: "0.6rem",
                display: { xs: "none", sm: "block" },
              }}
            >
              LIVE
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Board content area - recessed body to make cards "pop" */}
      <Box
        sx={{
          p: { xs: 2.5, md: 5 },
          position: "relative",
          zIndex: 2,
          bgcolor: alpha("#3AB7AE", 0.04),
          backgroundImage: `radial-gradient(circle at 2px 2px, ${alpha("#3AB7AE", 0.08)} 1px, transparent 0)`,
          backgroundSize: "32px 32px",
          boxShadow: "inset 0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        {children}
      </Box>

      {/* Footer decorative GIFs */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          right: 24,
          display: { xs: "none", lg: "flex" },
          gap: 1.5,
          opacity: 0.25,
        }}
      >
        <Box sx={{ width: 36, height: 36 }}>
          <img
            src="/bus-stop.gif"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
        <Box sx={{ width: 36, height: 36 }}>
          <img
            src="/fire-station.gif"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════════
   🏷️ STATION BANNER — Platform announcement board
   ══════════════════════════════════════════════════════ */
export const StationBanner = ({
  title,
  subtitle,
  gif,
  accentColor = "#3AB7AE",
}: {
  title: string;
  subtitle: string;
  gif: string;
  accentColor?: string;
}) => {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(accentColor, 0.04)} 0%, ${alpha(accentColor, 0.01)} 100%)`,
        border: `1px solid ${alpha(accentColor, 0.1)}`,
        borderRadius: "24px",
        px: { xs: 3, md: 5 },
        py: { xs: 3, md: 4 },
        mb: 4,
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 3,
        flexDirection: { xs: "column", md: "row" },
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: alpha(accentColor, 0.25),
          boxShadow: `0 8px 32px ${alpha(accentColor, 0.08)}`,
        },
      }}
    >
      {/* Decorative corner accent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 80,
          height: 4,
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          borderRadius: "0 0 4px 0",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: 80,
          background: `linear-gradient(180deg, ${accentColor}, transparent)`,
          borderRadius: "0 0 4px 0",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
        {/* Station GIF icon with frame */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "20px",
            bgcolor: alpha(accentColor, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            flexShrink: 0,
            border: `2px solid ${alpha(accentColor, 0.15)}`,
            boxShadow: `0 4px 16px ${alpha(accentColor, 0.1)}`,
            position: "relative",
          }}
        >
          <img
            src={gif}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: "#0f172a",
              fontWeight: 900,
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                maxWidth: 550,
                lineHeight: 1.5,
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      <Button
        variant="outlined"
        endIcon={<ArrowIcon />}
        sx={{
          borderColor: alpha(accentColor, 0.3),
          color: accentColor,
          fontWeight: 800,
          borderRadius: "14px",
          px: 3,
          py: 1,
          flexShrink: 0,
          borderWidth: 2,
          textTransform: "none",
          "&:hover": {
            borderColor: accentColor,
            bgcolor: alpha(accentColor, 0.06),
            borderWidth: 2,
          },
        }}
      >
        Xem tất cả
      </Button>
    </Box>
  );
};

"use client";

import React from "react";
import { TextField, TextFieldProps, Box, Typography } from "@mui/material";

interface InputProps extends Omit<TextFieldProps, "error"> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, ...props }, ref) => {
    return (
      <Box sx={{ width: "100%" }}>
        {label && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "text.secondary",
              ml: 0.5,
              mb: 0.5,
              display: "block",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {label}
          </Typography>
        )}
        <TextField
          inputRef={ref}
          fullWidth
          variant="outlined"
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: leftIcon ? (
              <Box sx={{ mr: 1, color: "text.disabled", display: "flex" }}>
                {leftIcon}
              </Box>
            ) : null,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#f8fafc",
              border: "1px solid #f1f5f9",
              transition: "all 0.2s",
              "& fieldset": { border: "none" },
              "&:hover": { bgcolor: "#f1f5f9" },
              "&.Mui-focused": {
                bgcolor: "#fff",
                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.1)",
              },
            },
            "& .MuiInputBase-input": {
              py: 1.5,
              fontSize: "0.875rem",
              fontWeight: 600,
            },
            "& .MuiFormHelperText-root": {
              ml: 1,
              fontWeight: 700,
              fontSize: "0.65rem",
            },
          }}
          {...props}
        />
      </Box>
    );
  },
);

Input.displayName = "Input";

export default Input;

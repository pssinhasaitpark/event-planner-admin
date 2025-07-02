import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowDown } from "@mui/icons-material";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          px: { xs: 1, sm: 2 },
          pt: 0.5,
        }}
      >
        <div
          style={{
            flexGrow: 1,
            textAlign: "center",
            paddingLeft: isMobile ? "37px" : "250px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "14px", sm: "18px" },
              color: "#D4AF37", // Golden color
              fontFamily: "'YourCustomFont', sans-serif", // Replace with your custom font
            }}
          >
            Utsavya By Parkhya Solutions Pvt. Ltd.
          </Typography>
        </div>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            alt="Admin"
            src="https://via.placeholder.com/150"
            sx={{ width: 35, height: 35, cursor: "pointer" }}
            onClick={handleMenuClick}
          />

          <KeyboardArrowDown
            fontSize="small"
            sx={{ cursor: "pointer" }}
            onClick={handleMenuClick}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: "45px" }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

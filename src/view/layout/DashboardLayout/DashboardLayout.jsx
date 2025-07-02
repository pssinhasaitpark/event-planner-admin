import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/Header/AdminHeader";
import Sidebar from "../../components/SideBar/Sidebar";

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ flexShrink: 0 }}>
        <Header toggleDrawer={toggleDrawer} />
      </Box>

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Sidebar
          isMobile={isMobile}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
        />

        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            minWidth: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

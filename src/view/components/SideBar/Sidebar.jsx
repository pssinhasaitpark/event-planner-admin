import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Dashboard,
  PersonAdd,
  ContactPhone,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import CollectionsIcon from "@mui/icons-material/Collections";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import CategoryIcon from "@mui/icons-material/Category";
import DetailsIcon from "@mui/icons-material/Details";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PeopleIcon from "@mui/icons-material/People";
import logo from "../../../assets/Images/logo1.png";
import SafetyCheckIcon from "@mui/icons-material/SafetyCheck";
import GavelIcon from "@mui/icons-material/Gavel";
import EventNoteIcon from "@mui/icons-material/EventNote";
import QuizIcon from "@mui/icons-material/Quiz";
import GroupIcon from "@mui/icons-material/Group";

const Sidebar = ({ isMobile, drawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeParent, setActiveParent] = useState(null);
  const [programmesOpen, setProgrammesOpen] = useState(false);
  const activeColor = "#FFB84D"; // Golden-orange color

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Artist", icon: <ViewCarouselIcon />, path: "/artist" },
    { text: "Products", icon: <PeopleIcon />, path: "/products" },
    {
      text: "Quick Links",
      icon: <ConnectWithoutContactIcon />,
      path: "/socialmedia",
    },
    { text: "Booking", icon: <Diversity3Icon />, path: "/booking" },
    { text: "Events", icon: <EventNoteIcon />, path: "/events" },
    {
      text: "Terms And Conditions",
      icon: <GavelIcon />,
      path: "/termsandconditions",
    },
    // {
    //   text: "Privacy Policy",
    //   icon: <SafetyCheckIcon />,
    //   path: "/privarypolicy  ",
    // },
    {
      text: "FAQ'S",
      icon: <QuizIcon />,
      path: "/faq  ",
    },
    // {
    //   text: "About Us",
    //   icon: <GroupIcon />,
    //   path: "/aboutus  ",
    // },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = menuItems.findIndex((item) =>
      currentPath.startsWith(item.path)
    );
    if (currentPath === "/") {
      setActiveParent(0);
      navigate("/dashboard");
    } else {
      setActiveParent(activeIndex !== -1 ? activeIndex : null);
    }
  }, [location.pathname, navigate]);

  const handleParentClick = (index, item) => {
    if (item.dropdown) {
      setProgrammesOpen(!programmesOpen);
    } else {
      setActiveParent(index);
      navigate(item.path);
      if (isMobile) toggleDrawer();
    }
  };

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: "absolute", top: "10px", left: "10px", zIndex: 1300 }}
        >
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? drawerOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: { xs: "75%", sm: 240 },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { xs: "75%", sm: 240 },
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 68,
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={logo}
              alt="DAVKT Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                cursor: "pointer",
              }}
            />
          </Link>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => handleParentClick(index, item)}
                sx={{
                  backgroundColor:
                    activeParent === index
                      ? "rgba(255, 184, 77, 0.7)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 184, 77, 0.7)",
                    cursor: "pointer",
                  },
                  marginBottom: "4px", // Add margin at the bottom of each ListItem
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.dropdown &&
                  (programmesOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              {item.dropdown && (
                <Collapse in={programmesOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, idx) => (
                      <ListItem
                        button
                        sx={{ pl: 4 }}
                        key={idx}
                        onClick={() => navigate(child.path)}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;

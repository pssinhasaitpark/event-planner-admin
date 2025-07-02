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

const Sidebar = ({ isMobile, drawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeParent, setActiveParent] = useState(null);
  const [programmesOpen, setProgrammesOpen] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Artist", icon: <ViewCarouselIcon />, path: "/artist" },
    // {
    //   text: "Contact Details",
    //   icon: <ContactPhone />,
    //   path: "/contactdetails",
    // },
    // { text: "Get A Quote", icon: <FormatQuoteIcon />, path: "/getaquote" },
    {
      text: "Products",
      icon: <PeopleIcon />,
      path: "/products",
    },
    // { text: "Gallery", icon: <CollectionsIcon />, path: "/gallery" },
    // {
    //   text: "Social Media",
    //   icon: <ConnectWithoutContactIcon />,
    //   path: "/socialmedia",
    // },
    // { text: "Category", icon: <CategoryIcon />, path: "/category" },
    // {
    //   text: "Sub Category",
    //   icon: <CategoryIcon />,
    //   path: "/subcategory",
    // },
    // { text: "Page Details", icon: <DetailsIcon />, path: "/page-details" },
    // {
    //   text: "Committee Or Trustee",
    //   icon: <Diversity3Icon />,
    //   path: "/committeeortrustee",
    // },
    // {
    //   text: "Registration And Certificates",
    //   icon: <AppRegistrationIcon />,
    //   path: "/registrationandcertificates",
    // },
    // {
    //   text: "Projects",
    //   icon: <AccountTreeIcon />,
    //   path: "/projects",
    // },
    // {
    //   text: "Get Involved",
    //   icon: <DescriptionIcon />,
    //   path: "/getinvolved",
    // },
    // {
    //   text: "Awards",
    //   icon: <EmojiEventsIcon />,
    //   path: "/awards",
    // },
    // {
    //   text: "News and Stories",
    //   icon: <NewspaperIcon />,
    //   path: "/newsandstories",
    // },
    {
      text: "Events",
      icon: <EmojiEventsIcon />,
      path: "/events",
    },
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
    // eslint-disable-next-line
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
                    activeParent === index ? "#eafaf1" : "transparent",
                  "&:hover": { backgroundColor: "#eafaf1", cursor: "pointer" },
                }}
              >
                <ListItemIcon
                  sx={{ color: activeParent === index ? "#1e1871" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
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

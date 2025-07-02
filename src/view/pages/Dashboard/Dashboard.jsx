import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubscribersCount,
  fetchInquiriesCount,
  fetchMessagesCount,
  fetchEventsCount,
} from "../../redux/slice/dashboardSlice";
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Chat, Email, Event, People } from "@mui/icons-material";
import banner from "../../../assets/Images/bannerimage.jpg";

const Dashboard = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.banner.status);
  const [showLoader, setShowLoader] = useState(true);
  const {
    totalSubscribers,
    totalInquiries,
    totalMessages,
    totalEvents,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  // useEffect(() => {
  //   dispatch(fetchSubscribersCount());
  //   dispatch(fetchInquiriesCount());
  //   dispatch(fetchMessagesCount());
  //   dispatch(fetchEventsCount());
  // }, [dispatch]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  if (status === "loading" || showLoader)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress sx={{ color: "#1e1871" }} />
      </Box>
    );

  if (status === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {status}
      </Typography>
    );

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 4 }}>
      {/* Banner Image */}
      <Box
        sx={{
          width: "100%",
          height: 350,
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", p: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#333" }}>
          Admin Dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mx: 4, mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      {/* <Box sx={{ px: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {[
            {
              title: "Total Subscribers",
              value: totalSubscribers,
              icon: <People sx={{ fontSize: 40, color: "#ff9800" }} />,
            },
            {
              title: "Total Inquiries",
              value: totalInquiries,
              icon: <Email sx={{ fontSize: 40, color: "#4caf50" }} />,
            },
            {
              title: "Total Messages",
              value: totalMessages,
              icon: <Chat sx={{ fontSize: 40, color: "#2196f3" }} />,
            },
            {
              title: "Total Events & Programs",
              value: totalEvents,
              icon: <Event sx={{ fontSize: 40, color: "#e91e63" }} />,
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
                {item.icon}
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {loading ? <CircularProgress size={24} /> : item.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box> */}

      {/* Biography Section */}
      <Paper
        sx={{ p: 4, mx: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}
      >
        {/* <Typography variant="h5" fontWeight="bold" gutterBottom>
          Biography
        </Typography> */}
        <Typography color="textSecondary">
          Utsavya Admin Panel by Parkhya Solutions Pvt. Ltd. Utsavya, developed
          by Parkhya Solutions Pvt. Ltd., is a powerful, intuitive, and fully
          scalable admin panel built to streamline event management operations
          from end to end. Designed with modern businesses and event organizers
          in mind, Utsavya serves as the centralized control hub for managing
          events, bookings, user access, payments, reports, and more — all from
          one seamless dashboard. With a clean, responsive UI and robust backend
          capabilities, Utsavya empowers admins to handle day-to-day operations
          efficiently while maintaining full visibility over every aspect of the
          platform. Whether it's managing large-scale public events, ticket
          sales, user roles, or real-time analytics, Utsavya delivers unmatched
          performance and reliability.
        </Typography>

        {/* Key Achievements */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 5 }}>
          Key Achievements
        </Typography>
        <List>
          {[
            "Utsavya is not just a tool — it’s your strategic partner in event success. Whether you're hosting a local concert or a national festival, our admin panel offers all the tools you need to deliver exceptional experiences, all while saving time, minimizing human error, and optimizing your workflow..",
            "Key Achievements of Utsavya Admin Panel",
"✅ Launched and Deployed Successfully Across Multiple Events",

"Used to manage high-profile events, including festivals, concerts, and corporate gatherings, with thousands of attendees.",
"🧩 Fully Modular and Scalable Architecture",

"Built with a future-ready architecture that allows easy integration of new features, APIs, and third-party tools without major code rewrites.",

"⚡ Achieved 99.9% Uptime Since Deployment",

"Highly stable and optimized performance, ensuring uninterrupted access for event managers and admins.",

"🔐 Integrated Secure Role-Based Access System",
"Implemented a fully functional RBAC system allowing fine-grained control over admin privileges, minimizing unauthorized access.",

"📈 Built Real-Time Analytics and Reporting Dashboard",

"Created insightful dashboards for tracking event performance, ticket sales, user registrations, and revenue in real-time.",

"📨 Automated Email & QR Code Ticketing System",

"Enabled automated email notifications and ticket generation with QR code integration for quick check-ins and validation.",

"💡 Designed With a User-Centric UX/UI",

"Developed a clean, responsive, and mobile-friendly interface to enhance user productivity and reduce training time.",

"🚀 Reduced Manual Workload by 70%",

"Automated core operations like booking, user management, and reporting, significantly reducing manual admin tasks.",
          ].map((achievement, index) => (
            <ListItem sx={{ display: "list-item" }} key={index}>
              <ListItemText primary={achievement} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard;

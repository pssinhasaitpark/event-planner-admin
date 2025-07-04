import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  // Static data for cards
  const cardData = [
    { title: "Total Users", value: "1,234" },
    { title: "Total Revenue", value: "$12,345" },
    { title: "Active Projects", value: "56" },
    { title: "New Messages", value: "789" },
  ];

  // Data for charts
  const barChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Revenue",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Users",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  const pieChartData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Dataset 1",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Dataset 1",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {cardData.map((card, index) => (
          <Box key={index} sx={{ flex: "1 1 200px" }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="h4">{card.value}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
        <Box sx={{ flex: "1 1 45%", minWidth: "300px" }}>
          <Card>
            <CardContent>
              <Bar data={barChartData} />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 45%", minWidth: "300px" }}>
          <Card>
            <CardContent>
              <Line data={lineChartData} />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 45%", minWidth: "300px", height: "500px" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "90%" }}>
              <Pie data={pieChartData} />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 45%", minWidth: "300px", height: "500px" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "90%" }}>
              <Doughnut data={doughnutChartData} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

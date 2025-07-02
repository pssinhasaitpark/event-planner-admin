import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import JoditEditor from "jodit-react";

const About = () => {
  const [aboutText, setAboutText] = useState("");
  const [dob, setDob] = useState("");
  const [achievements, setAchievements] = useState("");
  const [contributions, setContributions] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const aboutData = {
      aboutText,
      dob,
      achievements,
      contributions,
      image: selectedImage,
    };
  };

  return (
    <Box sx={{ p: 5, pt: "50px" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        अटल
      </Typography>

      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Box display="flex" flexWrap="wrap" spacing={2}>
          {/* Profile Image Upload */}
          <Box
            sx={{
              flexBasis: { xs: "100%", md: "33%" },
              textAlign: "center",
              mb: 2,
            }}
          >
            <Avatar
              src={selectedImage}
              alt="Dr. Ambedkar"
              sx={{ width: 120, height: 120, mb: 1, mx: "auto" }}
            />
            <IconButton color="primary" component="label">
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
              <PhotoCamera />
            </IconButton>
          </Box>

          {/* Form Fields */}
          <Box sx={{ flexBasis: { xs: "100%", md: "66%" }, mb: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value="अटल"
              disabled
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              variant="outlined"
              value={dob}
              onChange={(e) => handleChange(e, setDob)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Key Achievements"
              variant="outlined"
              placeholder="key achievements..."
              value={achievements}
              onChange={(e) => handleChange(e, setAchievements)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Contributions"
              variant="outlined"
              placeholder="Describe his contributions..."
              value={contributions}
              onChange={(e) => handleChange(e, setContributions)}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <JoditEditor
              value={aboutText}
              onChange={setAboutText}
              config={{
                readonly: false,
                placeholder: "Write about अटल 's life...",
              }}
              style={{ width: "100%", minHeight: "200px" }}
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default About;

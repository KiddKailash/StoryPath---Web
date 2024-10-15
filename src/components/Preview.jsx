// src/components/Preview.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "./PageTitle";
import UserSelect from "./UserSelect";
import useProject from "../hooks/useProject";
import useLocations from "../hooks/useLocations";

// ================================
// MUI Component Imports
// ================================
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

/**
 * Preview component displays a preview of the project with interactive elements.
 *
 * @return {JSX.Element} - The rendered Preview component.
 */
const Preview = () => {
  const { projectId } = useParams();
  const { project, loadingProject, error: projectError } = useProject(projectId);
  const { locations, loadingLocations, error: locationsError, maxScore } = useLocations(projectId);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  // Combine errors from both hooks
  const error = projectError || locationsError;

  // Handle errors
  if (error) {
    return (
      <Typography
        variant="body1"
        color="error"
        sx={{ textAlign: "left", mt: 4 }}
      >
        {error}
      </Typography>
    );
  }

  // Show loading messages if the project or locations are still loading
  if (loadingProject)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Project...</Typography>
      </Box>
    );
  if (loadingLocations)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Locations...</Typography>
      </Box>
    );

  // Determine the display text for UserSelect based on participant_scoring
  const getUserSelectText = () => {
    if (project.participant_scoring === "Number of Scanned QR Codes") {
      return "Scan QR Code at Location:";
    }
    // For "Not Scored" and "Number of Locations Entered", default to "Go to Location:"
    return "Go to Location:";
  };

  const userSelectText = getUserSelectText();

  // Prepare options for the UserSelect component
  const locationOptions =
    locations.length > 0
      ? locations.map((location) => ({
          value: location.id.toString(),
          label: location.location_name,
        }))
      : [];

  /**
   * Handles the change event when a new location is selected.
   *
   * @param {string} name - The name of the select input (not used here).
   * @param {string} selectedValue - The selected value from the dropdown.
   */
  const handleLocationChange = (name, selectedValue) => {
    const locationId = parseInt(selectedValue, 10);
    const location = locations.find((loc) => loc.id === locationId);

    if (location && !visitedLocations.includes(locationId)) {
      setVisitedLocations([...visitedLocations, locationId]);
      setTotalScore((prevScore) => prevScore + (location.score_points || 0));
    }

    setSelectedLocation(location || null); // Ensure it's null if not found
  };

  /**
   * Resets the selected location to null.
   */
  const resetSelectedLocation = () => {
    setSelectedLocation(null);
  };

  /**
   * Renders the content for the homescreen based on the project's settings.
   *
   * @return {JSX.Element|null} - The homescreen content or a list of all locations.
   */
  const renderHomescreenContent = () => {
    if (project.homescreen_display === "display_initial_clue") {
      return (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Initial Clue
          </Typography>
          <Typography variant="body1">{project.initial_clue}</Typography>
        </Box>
      );
    } else if (project.homescreen_display === "display_all_locations") {
      return (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            All Locations
          </Typography>
          {locations.map((location) => (
            <Typography key={location.id} variant="body1">
              {location.location_name} - {location.clue || "No clue provided"}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={1} justifyContent="center">
        <PageTitle title="Preview Project" />
        {/* Location Selector Box */}
        <Grid size={{ xs: 0, sm: "grow", md: "grow" }}></Grid>
        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            {locations.length > 0 ? (
              <UserSelect
                name="location"
                text={userSelectText} // Dynamically set the text
                options={locationOptions}
                onChange={handleLocationChange}
                value={selectedLocation ? selectedLocation.id.toString() : ""}
              />
            ) : (
              <Grid size={12}>
                <Typography>No locations found for this project.</Typography>
              </Grid>
            )}
          </Box>
        </Grid>
        {/* Score and Location Count */}
        <Grid size={{ xs: 5, sm: 3, md: 4 }}>
          <Box
            sx={{
              marginTop: { xs: 1, sm: 2.5, md: 2.5 },
              textAlign: "left",
            }}
          >
            <Typography variant="body1">
              Score: {totalScore}/{maxScore}
            </Typography>
            <Typography variant="body2">
              Locations Visited: {visitedLocations.length}/{locations.length}
            </Typography>
          </Box>
        </Grid>
        <Grid size={12}></Grid> {/* Create a break */}
        {/* Phone UI Container */}
        <Grid size={{ xs: 12, sm: 7, md: 5 }}>
          <Box
            sx={{
              height: "auto",
              border: "1px solid #ccc",
              borderRadius: "30px",
              padding: 4,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "flex-start",
              gap: 3,
            }}
          >
            {/* Project Title & Instructions */}
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {project.title || "Untitled Project"}
              </Typography>
              <Divider />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {project.instructions || "No instructions provided."}
              </Typography>
            </Box>

            {/* Homescreen Content */}
            {!selectedLocation && renderHomescreenContent()}

            {/* Location Details */}
            {selectedLocation && (
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {`Location: ${selectedLocation.location_name || "Unnamed Location"}`}
                </Typography>
                <Typography variant="body1">
                  {selectedLocation.clue || "No clue provided."}
                </Typography>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html: selectedLocation.location_content || "",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={resetSelectedLocation}
                  sx={{ marginTop: 2, width: "100%" }}
                >
                  Back to Homescreen
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Preview;

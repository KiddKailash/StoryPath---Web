// src/components/Locations.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AddEditForm from "./AddEditForm";
import CardView from "./CardView";
import QRCodeGenerator from "./QRCodeGenerator";
import PageTitle from "./PageTitle";
import useProject from "../hooks/useProject";
import useLocations from "../hooks/useLocations";
import downloadQRCode from "../utils/downloadQRCode";
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "../api/location-crud-commands";

// ================================
// MUI Component Imports
// ================================
import Masonry from "@mui/lab/Masonry";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/**
 * Locations component displays a list of locations for a given project and allows CRUD operations.
 *
 * @return {JSX.Element} - The rendered Locations component.
 */
const Locations = () => {
  const { projectId } = useParams(); // Extract projectId from the URL
  const {
    project,
    loading: projectLoading,
    error: projectError,
  } = useProject(projectId);
  const {
    locations,
    loadingLocations,
    setLocations,
    error: locationsError,
    fetchAllLocations,
  } = useLocations(projectId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  /**
   * Handles saving a location, either by creating a new one or updating an existing one.
   *
   * @param {object} data - The data of the location to save.
   */
  const handleSaveLocation = async (data) => {
    const saveData = {
      project_id: parseInt(projectId, 10),
      location_name: data.location_name,
      location_trigger: data.location_trigger,
      location_position: data.location_position,
      score_points: data.score_points ? parseInt(data.score_points, 10) : null,
      clue: data.clue ?? "",
      location_content: data.location_content ?? "",
    };

    try {
      if (currentLocation) {
        // Update existing location
        const updatedLocationResponse = await updateLocation(
          currentLocation.id,
          saveData
        );
        const updatedLocation = Array.isArray(updatedLocationResponse)
          ? updatedLocationResponse[0]
          : updatedLocationResponse;
        // Update state
        setLocations((prevLocations) =>
          prevLocations.map((loc) =>
            loc.id === currentLocation.id ? updatedLocation : loc
          )
        );
      } else {
        // Create new location
        const newLocationResponse = await createLocation(saveData);
        const newLocation = Array.isArray(newLocationResponse)
          ? newLocationResponse[0]
          : newLocationResponse;
        // Update state
        setLocations((prevLocations) => [...prevLocations, newLocation]);
      }
    } catch (err) {
      console.error(
        currentLocation
          ? "Error updating location:"
          : "Error creating location:",
        err
      );
    } finally {
      setIsFormOpen(false);
      setCurrentLocation(null);
      fetchAllLocations(); // Refetch locations to ensure data consistency
    }
  };

  /**
   * Handles deleting a location.
   *
   * @param {string} locationId - The ID of the location to delete.
   */
  const handleDeleteLocation = async (locationId) => {
    try {
      await deleteLocation(locationId);
      setLocations((prevLocations) =>
        prevLocations.filter((loc) => loc.id !== locationId)
      );
    } catch (err) {
      console.error("Error deleting location:", err);
    }
  };

  /**
   * Opens the form to create a new location.
   */
  const openCreateForm = () => {
    setCurrentLocation(null);
    setIsFormOpen(true);
  };

  /**
   * Opens the form to edit an existing location.
   *
   * @param {object} location - The location data to edit.
   */
  const openEditForm = (location) => {
    setCurrentLocation(location);
    setIsFormOpen(true);
  };

  // Handle Project Loading and Errors
  if (projectLoading)
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
  if (projectError)
    return (
      <Typography variant="body1" color="error">
        {projectError}
      </Typography>
    );

  // Handle Locations Loading and Errors
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
  if (locationsError)
    return (
      <Typography variant="body1" color="error">
        {locationsError}
      </Typography>
    );

  /**
   * Handles saving a location, either by creating a new one or updating an existing one.
   *
   * @param {object} data - The data of the location to save.
   */
  // Removed duplicated handleSaveLocation as it's now defined above.

  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <PageTitle title={project?.title || "Untitled Project"} />
        <Grid>
          <Button
            variant="contained"
            onClick={openCreateForm}
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
          >
            Create Location
          </Button>
        </Grid>
        <Grid size={12}></Grid>

        {/* Display the list of locations */}
        {locations.length > 0 ? (
          <Masonry columns={{ xs: 1, md: 3 }} spacing={2}>
            {locations.map((location) => (
              <Grid key={location.id} size={{ xs: 12, sm: 6, md: 4 }}>
                {/* Hidden QRCode for downloading */}
                <div style={{ display: "none" }}>
                  <QRCodeGenerator
                    value={`${projectId},${location.id}`}
                    id={`qr-code-${projectId}-${location.id}`}
                    size={1200}
                  />
                </div>
                <CardView
                  title={location.location_name}
                  trigger={location.location_trigger}
                  position={location.location_position}
                  scorePoints={location.score_points}
                  location_id={location.id}
                  project_id={projectId}
                  buttons={[
                    {
                      onClick: () => openEditForm(location),
                      label: "Edit",
                      color: "primary",
                    },
                    {
                      onClick: () =>
                        downloadQRCode(
                          location.id,
                          projectId,
                          location.location_name
                        ),
                      label: "Print QR Code",
                    },
                    {
                      onClick: () => handleDeleteLocation(location.id),
                      label: "Delete",
                      color: "error",
                    },
                  ]}
                  type="location"
                />
              </Grid>
            ))}
          </Masonry>
        ) : (
          <Typography>No locations available</Typography>
        )}
      </Grid>

      {/* Form for adding or editing a location */}
      {isFormOpen && (
        <AddEditForm
          type="location"
          item={currentLocation}
          onSave={handleSaveLocation}
          onClose={() => {
            setIsFormOpen(false);
            setCurrentLocation(null);
          }}
          projectId={parseInt(projectId, 10)}
        />
      )}
    </>
  );
};

export default Locations;

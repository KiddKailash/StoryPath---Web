// src/components/Projects.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEditForm from "./AddEditForm";
import AiAssist from "./AiAssist";
import PageTitle from "./PageTitle";
import useProjects from "../hooks/useProjects";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../api/project-crud-commands";

// ================================
// MUI Component Imports
// ================================
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles"; // Import useTheme to access theme transitions

/**
 * Projects component displays a list of projects and allows CRUD operations.
 *
 * @return {JSX.Element} - The rendered Projects component.
 */
const Projects = () => {
  const theme = useTheme(); // Access theme
  const navigate = useNavigate();
  const { projects, loading, error, fetchAllProjects } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  /**
   * Handles saving a project by creating or updating.
   *
   * @param {object} data - The project data to save.
   */
  const handleSaveProject = async (data) => {
    const projectData = {
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      initial_clue: data.initial_clue,
      participant_scoring: data.participant_scoring,
      homescreen_display: data.homescreen_display,
      is_published: data.is_published,
    };

    try {
      if (currentProject) {
        // Update existing project
        await updateProject(currentProject.id, projectData);
      } else {
        // Create new project
        await createProject(projectData);
      }
      fetchAllProjects();
    } catch (err) {
      console.error(
        currentProject ? "Error editing project:" : "Error creating project:",
        err
      );
    } finally {
      setIsFormOpen(false);
      setCurrentProject(null);
    }
  };

  /**
   * Handles deleting a project by its ID.
   *
   * @param {number} projectId - The ID of the project to delete.
   */
  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      fetchAllProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  /**
   * Opens the form to create a new project.
   */
  const openCreateForm = () => {
    setCurrentProject(null);
    setIsFormOpen(true);
  };

  /**
   * Opens the form to edit an existing project.
   *
   * @param {object} project - The project data to edit.
   */
  const openEditForm = (project) => {
    setCurrentProject(project);
    setIsFormOpen(true);
  };

  // Define columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "is_published",
      headerName: "Published",
      width: 100,
      type: "boolean",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 400,
      sortable: false,
      renderCell: (params) => {
        const project = params.row;
        return (
          <Box>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => navigate(`/Project/Preview/${project.id}`)}
              sx={{ mr: 1 }}
            >
              Preview
            </Button>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => openEditForm(project)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate(`/Project/${project.id}`)}
              sx={{ mr: 1 }}
            >
              Locations
            </Button>
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => handleDeleteProject(project.id)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  // Map projects to rows
  const rows = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    instructions: project.instructions, 
    initial_clue: project.initial_clue, 
    participant_scoring: project.participant_scoring, 
    homescreen_display: project.homescreen_display, 
    is_published: project.is_published,
  }));

  if (loading) {
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
        <Typography sx={{ ml: 2 }}>Loading Projects...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <PageTitle title="Manage Projects" />
        </Grid>

        <Grid>
          <Button
            variant="contained"
            onClick={openCreateForm}
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
          >
            Project
          </Button>
        </Grid>
        <Grid>
          {/* AI Assist Button with fetchAllProjects function passed as a prop */}
          <AiAssist onJsonResponse={fetchAllProjects} />
        </Grid>

        {/* Display the list of projects in DataGrid */}
        {projects.length > 0 ? (
          <Grid size={12}>
            <Box
              sx={{
                maxWidth: "82vw",
                overflowX: "auto",
                transition: theme.transitions.backgroundAndText
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                  transition: 'background-color 0.3s ease, color 0.2s ease',
                  "& .MuiDataGrid-root": {
                    backgroundColor: "inherit", // Ensures consistent background inside the DataGrid
                  },
                }}
              />
            </Box>
          </Grid>
        ) : (
          <Grid size={12}>
            <Typography sx={{ textAlign: "left", ml: 0.5 }}>
              No projects available
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Project form for creating or editing */}
      {isFormOpen && (
        <AddEditForm
          type="project"
          item={currentProject}
          onSave={handleSaveProject}
          onClose={() => {
            setIsFormOpen(false);
            setCurrentProject(null);
          }}
        />
      )}
    </>
  );
};

export default Projects;

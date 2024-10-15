// src/components/Projects.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEditForm from "./AddEditForm";
import AiAssist from "./AiAssist";
import CardView from "./CardView";
import PageTitle from "./PageTitle";
import useProjects from "../hooks/useProjects";
import { createProject, updateProject, deleteProject } from "../api/project-crud-commands";

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
 * Projects component displays a list of projects and allows CRUD operations.
 *
 * @return {JSX.Element} - The rendered Projects component.
 */
const Projects = () => {
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
      <Grid container columnSpacing={2} rowSpacing={2}>
        <PageTitle title="Manage Your Projects" />

        <Grid>
          <Button
            variant="contained"
            onClick={openCreateForm}
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
          >
            Create Project
          </Button>
        </Grid>
        <Grid>
          {/* AI Assist Button with fetchAllProjects function passed as a prop */}
          <AiAssist onJsonResponse={fetchAllProjects} />
        </Grid>
      </Grid>

      {/* Display the list of projects */}
      {projects.length > 0 ? (
        <Masonry columns={{ xs: 1, md: 2 }} spacing={2}>
          {projects.map((project) => (
            <Grid key={project.id} container spacing={2}>
              <CardView
                key={project.id}
                type="project"
                title={project.title}
                description={project.description}
                isPublished={project.is_published}
                buttons={[
                  {
                    onClick: () => navigate(`/Project/Preview/${project.id}`),
                    label: "Preview",
                    color: "primary",
                  },
                  {
                    onClick: () => openEditForm(project),
                    label: "Edit",
                    color: "primary",
                  },
                  {
                    onClick: () => navigate(`/Project/${project.id}`),
                    label: "Locations",
                  },
                  {
                    onClick: () => handleDeleteProject(project.id),
                    label: "Delete",
                    color: "error",
                  },
                ]}
              />
            </Grid>
          ))}
        </Masonry>
      ) : (
        <Typography sx={{ textAlign: "left", mt: 4 }}>
          No projects available
        </Typography>
      )}

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

import { useState, useEffect } from "react";
import { getProjectById } from "../api/project-crud-commands";

/**
 * Custom hook to fetch a single project by ID.
 *
 * @param {string} projectId - The ID of the project to fetch.
 * @return {object} - An object containing the project data, loading state, and error state.
 */
const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoadingProject(true);
      setError(null);

      if (!navigator.onLine) {
        setError("You are offline. Please check your internet connection.");
        setLoadingProject(false);
        return;
      }

      try {
        const fetchedProject = await getProjectById(projectId);
        if (!fetchedProject || fetchedProject.length === 0) {
          throw new Error("Project not found");
        }
        setProject(fetchedProject[0]);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Error fetching project. Please check that the project exists.");
      } finally {
        setLoadingProject(false);
      }
    };
    fetchProject();
  }, [projectId]);

  return { project, loadingProject, error };
};

export default useProject;

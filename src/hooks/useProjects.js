import { useState, useEffect } from "react";
import { getProjects } from "../api/project-crud-commands";

/**
 * Custom hook to fetch all projects.
 *
 * @return {object} - An object containing the list of projects, loading state, error state, and a refetch function.
 */
const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllProjects = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.onLine) {
      setError("Error: You are offline. Please check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Error fetching projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return { projects, loading, error, fetchAllProjects };
};

export default useProjects;

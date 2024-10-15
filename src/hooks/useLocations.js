// src/hooks/useLocations.js

import { useState, useEffect, useCallback } from "react";
import { getLocationsByProjectID } from "../api/location-crud-commands";

/**
 * Custom hook to fetch locations data.
 *
 * @param {string} projectId - The ID of the project to fetch locations for.
 * @return {object} - An object containing locations data, loading state, error state, max score, and a refetch function.
 */
const useLocations = (projectId) => {
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [error, setError] = useState(null);
  const [maxScore, setMaxScore] = useState(0);

  /**
   * Fetches all locations associated with the given project ID.
   * This function is memoized to prevent unnecessary re-creations.
   */
  const fetchAllLocations = useCallback(async () => {
    setLoadingLocations(true);
    setError(null);

    if (!navigator.onLine) {
      setError("Error: You are offline. Please check your internet connection.");
      setLoadingLocations(false);
      return;
    }

    try {
      const fetchedLocations = await getLocationsByProjectID(projectId);
      const locationsData = fetchedLocations || [];
      setLocations(locationsData);

      // Calculate the total possible score
      const totalMaxScore = locationsData.reduce(
        (total, loc) => total + (loc.score_points || 0),
        0
      );
      setMaxScore(totalMaxScore);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Error fetching locations. Please try again later.");
    } finally {
      setLoadingLocations(false);
    }
  }, [projectId]);

  /**
   * useEffect to fetch locations when the projectId changes.
   * It now includes fetchAllLocations in its dependency array.
   */
  useEffect(() => {
    fetchAllLocations();
  }, [fetchAllLocations]);

  return { locations, loadingLocations, setLocations, error, maxScore, fetchAllLocations };
};

export default useLocations;

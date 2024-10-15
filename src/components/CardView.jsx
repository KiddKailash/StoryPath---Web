import React from "react";
import PropTypes from "prop-types";

// ================================
// MUI Component Imports
// ================================
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";

/**
 * Object containing functions to render details based on the type.
 */
const renderDetails = {
  /**
   * Renders the details section for a project.
   *
   * @param {object} props - The properties of the project.
   * @param {string} props.title - The title of the project.
   * @param {boolean} props.isPublished - Indicates if the project is published.
   * @param {string} props.description - The description of the project.
   *
   * @return {JSX.Element} - The rendered project details section.
   */
  project: ({ title, isPublished, description }) => (
    <>
      <Grid size={"grow"} sx={{ marginBottom: 1 }}>
        <Typography variant="h5">{title}</Typography>
      </Grid>
      <Grid>
        <Typography
          sx={{
            backgroundColor: isPublished ? "#a2cf6e" : "#f6685e",
            padding: "0 8px",
            borderRadius: 1,
          }}
        >
          {isPublished ? "Published" : "Unpublished"}
        </Typography>
      </Grid>
      {description && (
        <Grid size={12} sx={{ marginBottom: 1 }}>
          <Typography>{description}</Typography>
        </Grid>
      )}
    </>
  ),

  /**
   * Renders the details section for a location.
   *
   * @param {object} props - The properties of the location.
   * @param {string} props.title - The title of the location.
   * @param {string} props.trigger - The trigger method for the location.
   * @param {string} props.position - The geographical position of the location.
   * @param {number} props.scorePoints - The score points awarded at the location.
   * @param {string} props.location_id - The ID of the location.
   * @param {string} props.project_id - The ID of the associated project.
   *
   * @return {JSX.Element} - The rendered location details section.
   */
  location: ({
    title,
    trigger,
    position,
    scorePoints,
  }) => (
    <>
      <Grid size={"grow"} sx={{ marginBottom: 1 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2">Trigger: {trigger}</Typography>
        <Typography variant="body2">Position: {position}</Typography>
        <Typography variant="body2">Score Points: {scorePoints}</Typography>
      </Grid>
    </>
  ),
};

/**
 * Renders a group of action buttons.
 *
 * @param {Array} buttons - An array of button configuration objects.
 * @param {function} buttons[].onClick - The click handler for the button.
 * @param {string} buttons[].label - The display label of the button.
 * @param {string} [buttons[].color] - The color theme of the button.
 *
 * @return {JSX.Element} - The rendered button group.
 */
const renderButtons = (buttons) => (
  <Grid size={12}>
    <ButtonGroup>
      {buttons.map(({ onClick, label, color }, index) => (
        <Button key={index} onClick={onClick} color={color || "primary"}>
          {label}
        </Button>
      ))}
    </ButtonGroup>
  </Grid>
);

/**
 * CardView component displays a card with details and action buttons based on the type.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.type - The type of card to render ("project" or "location").
 * @param {Array} props.buttons - An array of button configuration objects.
 *
 * @return {JSX.Element} - The rendered card view component.
 */
const CardView = ({
  title = "",
  description = "",
  isPublished = false,
  trigger = "",
  position = "",
  scorePoints = 0,
  buttons,
  type,
  location_id = "",
  project_id = "",
}) => {
  const theme = useTheme(); // Access the current theme settings

  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: "flex",
        border: 1,
        borderRadius: 2,
        textAlign: "left",
        padding: 2,
        transition: theme.transitions.backgroundAndText,
      }}
    >
      {/* Render the details section based on the type */}
      {renderDetails[type]?.({
        title,
        description,
        isPublished,
        trigger,
        position,
        scorePoints,
        location_id,
        project_id,
      })}
      {/* Render the action buttons */}
      {renderButtons(buttons)}
    </Grid>
  );
};

CardView.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  isPublished: PropTypes.bool,
  trigger: PropTypes.string,
  position: PropTypes.string,
  scorePoints: PropTypes.number,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  type: PropTypes.oneOf(["project", "location"]).isRequired,
  location_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Accept string or number
  project_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Accept string or number
};

export default CardView;

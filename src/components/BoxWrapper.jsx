import React from "react";
import PropTypes from "prop-types";

// ================================
// MUI Component Imports
// ================================
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

/**
 * BoxWrapper component that wraps its children in a styled Box with theming.
 *
 * @param {string} id - The unique identifier for the Box element.
 * @param {number} size - The size (width and height) of the Box in pixels.
 * @param {object} containerStyle - Additional styles to apply to the Box.
 * @param {React.Node} children - The child elements to be rendered inside the Box.
 *
 * @return {JSX.Element} - The styled Box component containing the children.
 */
const BoxWrapper = ({ id, size, containerStyle = {}, children }) => {
  const theme = useTheme(); // Access the current theme settings

  return (
    <Box
      id={id}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${size}px`, // Set the width based on the size prop
        height: `${size}px`, // Set the height based on the size prop
        backgroundColor: theme.palette.background.default, // Use theme background color
        color: theme.palette.text.primary, // Use theme text color
        transition: theme.transitions.backgroundAndText, // Apply theme transitions
        ...containerStyle, // Spread any additional container styles
      }}
    >
      {children} {/* Render any child components or elements */}
    </Box>
  );
};

BoxWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  containerStyle: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default BoxWrapper;

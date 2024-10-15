import React from "react";
import PropTypes from "prop-types";

// ================================
// MUI Component Import
// ================================
import MenuItem from "@mui/material/MenuItem";

/**
 * OptionMenuItem component renders a single option as a MenuItem.
 *
 * @param {string|number} value - The value assigned to the MenuItem.
 * @param {string} label - The text displayed for the MenuItem.
 * @return {JSX.Element} - The rendered MenuItem component.
 */
const OptionMenuItem = ({ value, label }) => (
  <MenuItem value={value}>{label}</MenuItem>
);

OptionMenuItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
};

export default OptionMenuItem;

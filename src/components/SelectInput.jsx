import React from "react";
import PropTypes from "prop-types";
import OptionMenuItem from "./OptionMenuItem";

// ================================
// MUI Component Import
// ================================
import Select from "@mui/material/Select";

/**
 * SelectInput component renders a customized Select input with options.
 *
 * @param {string} name - The name attribute for the select input.
 * @param {string} text - The label text for the select input.
 * @param {string|number} value - The current selected value.
 * @param {function} onChange - The handler function to call when the value changes.
 * @param {Array} options - An array of option objects to populate the select menu.
 * @param {string} labelId - The id for the label element.
 * @param {string} id - The id for the select element.
 *
 * @return {JSX.Element} - The rendered Select input component.
 */
const SelectInput = ({ name, text, value, onChange, options, labelId, id }) => {
  /**
   * Handles the change event for the select input.
   *
   * @param {object} event - The change event object.
   */
  const handleSelectChange = (event) => {
    // Manually set the name on the event.target to ensure it is available in the onChange handler
    event.target.name = name;
    onChange(event);
  };

  return (
    <Select
      labelId={labelId}
      id={id}
      value={value}
      label={text}
      onChange={handleSelectChange}
    >
      {/* Render each option using the OptionMenuItem component */}
      {options.map((option) => (
        <OptionMenuItem
          key={option.value}
          value={option.value}
          label={option.label}
        />
      ))}
    </Select>
  );
};

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  labelId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default SelectInput;

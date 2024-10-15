import React from "react";
import PropTypes from "prop-types";

// ================================
// MUI Component Imports
// ================================
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

/**
 * UserSelect component renders a dropdown (Select) field.
 *
 * @param {string} name - The name of the select field.
 * @param {string} text - The label for the select field.
 * @param {array} options - Array of option objects with value and label.
 * @param {function} onChange - Callback for change event.
 * @param {string|number} value - Current value of the select input.
 *
 * @return {JSX.Element} - Rendered Select component.
 */
const UserSelect = ({ name, text, options, onChange, value }) => {
  const labelId = `${name}-select-label`;
  const id = `${name}-select`;

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    onChange(name, selectedValue);
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 120, mt: 1, mb: 0.5 }}>
      <InputLabel id={labelId}>{text}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        value={value}
        label={text}
        onChange={handleSelectChange}
      >
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

UserSelect.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default UserSelect;

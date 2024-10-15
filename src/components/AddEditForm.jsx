import React, { useReducer, useRef } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's snow theme
import UserSelect from "./UserSelect";

// ================================
// MUI Component Imports
// ================================
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

/**
 * Initializes the form state based on the provided type and item.
 *
 * @param {string} type - Either "project" or "location" to define the form structure.
 * @param {object|null} item - Pre-existing form data, if any.
 *
 * @return {object} - The initial state of the form.
 */
const initialFormState = (type, item) => {
  const baseState =
    type === "project"
      ? {
          id: null,
          title: "",
          description: "",
          instructions: "",
          initial_clue: "",
          participant_scoring: "",
          homescreen_display: "",
          is_published: false,
        }
      : type === "location"
      ? {
          id: null,
          location_name: "",
          location_trigger: "",
          location_position: "",
          score_points: "",
          clue: "",
          location_content: "",
        }
      : {}; // Return empty object if type is neither 'project' nor 'location'

  // If an item is provided, merge it with the base state
  return item ? { ...baseState, ...mapFormData(type, item) } : baseState;
};

/**
 * Maps the form data based on the provided type.
 *
 * @param {string} type - Either "project" or "location".
 * @param {object} formData - The form data to be mapped.
 *
 * @return {object} - The mapped form data.
 */
const mapFormData = (type, formData) => {
  if (type === "project") {
    return {
      id: formData.id || null,
      title: formData.title || "",
      description: formData.description || "",
      instructions: formData.instructions || "",
      initial_clue: formData.initial_clue || "",
      participant_scoring: formData.participant_scoring || "",
      homescreen_display: formData.homescreen_display || "",
      is_published: formData.is_published || false,
    };
  } else if (type === "location") {
    return {
      id: formData.id || null,
      location_name: formData.location_name || "",
      location_trigger: formData.location_trigger || "",
      location_position: formData.location_position || "",
      score_points: formData.score_points || "",
      clue: formData.clue || "",
      location_content: formData.location_content || "",
    };
  }
  // Return empty object if type is neither 'project' nor 'location'
  return {};
};

/**
 * Reducer function to manage the form state.
 *
 * @param {object} state - The current form state.
 * @param {object} action - Action object containing the type and payload.
 *
 * @return {object} - The updated state.
 */
const formReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        formData: action.payload,
        errors: {},
      };
    case "UPDATE_FIELD":
      // Update a specific field in the form state
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: "" }, // Clear error on field change
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
};

/**
 * AddEditForm component to create or edit a project or location.
 *
 * @param {object} item - The item to be edited (null if creating new).
 * @param {function} onSave - Callback function to save the form data.
 * @param {function} onClose - Callback function to close the dialog.
 * @param {string} type - Type of form, either "project" or "location".
 * @param {number|null} projectId - Project ID associated with the location.
 *
 * @return {JSX.Element} - The rendered AddEditForm component.
 */
const AddEditForm = ({
  item = null, // Default to null
  onSave,
  onClose,
  type,
  projectId = null, // Default to null
}) => {
  // Initialize form state using useReducer hook
  const [state, dispatch] = useReducer(formReducer, {
    formData: initialFormState(type, item),
    errors: {},
  });

  const { formData, errors } = state;

  // Ref for accessing the ReactQuill editor
  const quillRef = useRef(null);

  /**
   * Handles changes in form fields.
   *
   * @param {object|string} eventOrName - The change event or field name.
   * @param {any} value - The value to be set for the field (for non-event cases).
   */
  const handleChange = (eventOrName, value) => {
    if (typeof eventOrName === "object" && eventOrName.target) {
      // Handles TextField or Checkbox changes
      const { name, value: inputValue, type, checked } = eventOrName.target;
      dispatch({
        type: "UPDATE_FIELD",
        field: name,
        value: type === "checkbox" ? checked : inputValue,
      });
    } else {
      // Handles UserSelect changes
      const name = eventOrName;
      dispatch({
        type: "UPDATE_FIELD",
        field: name,
        value: value,
      });
    }
  };

  /**
   * Handles changes in WYSIWYG editor content.
   *
   * @param {string} value - The new value for the location content field.
   */
  const handleContentChange = (value) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "location_content",
      value,
    });
  };

  /**
   * Validates the form data and returns an object containing errors.
   *
   * @return {object} - An object containing validation errors.
   */
  const validateForm = () => {
    const newErrors = {};
    if (type === "project") {
      if (!formData.title || formData.title.trim() === "") {
        newErrors.title = "Project Title is required";
      }
    } else if (type === "location") {
      if (!formData.location_name || formData.location_name.trim() === "") {
        newErrors.location_name = "Location Name is required";
      }
      if (
        formData.score_points === undefined ||
        formData.score_points === null ||
        formData.score_points === ""
      ) {
        newErrors.score_points = "Score Points are required";
      } else if (isNaN(parseInt(formData.score_points, 10))) {
        newErrors.score_points = "Score Points must be a number";
      }

      // ======= Simplified Validation for location_position =======
      if (
        !formData.location_position ||
        formData.location_position.trim() === ""
      ) {
        newErrors.location_position = "Location Position is required";
      }
      // ===========================================================
    }
    return newErrors;
  };

  /**
   * Prepares form data and triggers the onSave callback.
   */
  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: "SET_ERRORS", payload: validationErrors });
      return;
    }

    const saveData =
      type === "project"
        ? mapFormData("project", formData)
        : {
            ...mapFormData("location", formData),
            project_id: projectId,
            // Ensure score_points is an integer or null
            score_points: isNaN(parseInt(formData.score_points, 10))
              ? null
              : parseInt(formData.score_points, 10),
          };
    onSave(saveData);
  };

  /**
   * Renders a TextField with specified properties.
   *
   * @param {string} name - The name of the field.
   * @param {string} label - The label for the TextField.
   * @param {boolean} [multiline=false] - Whether the TextField should support multiple lines.
   * @param {string} [type="text"] - The input type of the TextField.
   *
   * @return {JSX.Element} - The rendered TextField component.
   */
  const renderTextField = (name, label, multiline = false, type = "text") => (
    <div key={name}>
      <TextField
        margin="dense"
        name={name}
        label={label}
        fullWidth
        multiline={multiline}
        type={type}
        value={formData[name] || ""}
        onChange={handleChange}
        error={!!errors[name]}
        helperText={errors[name]}
        required={
          name === "title" ||
          name === "location_name" ||
          name === "score_points" ||
          name === "location_position" // Added location_position as required
        }
      />
      {/* If the field is location_position, add the helper text */}
      {name === "location_position" && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ ml: 1, mt: 0 }}
        >
          Format: Latitude, Longitude (e.g., 40.7128, -74.0060)
        </Typography>
      )}
    </div>
  );

  /**
   * Renders a Checkbox with a label.
   *
   * @param {string} name - The name of the field.
   * @param {string} label - The label for the Checkbox.
   *
   * @return {JSX.Element} - The rendered Checkbox component.
   */
  const renderCheckbox = (name, label) => (
    <FormControlLabel
      key={name}
      control={
        <Checkbox
          name={name}
          checked={!!formData[name]}
          onChange={handleChange}
        />
      }
      label={label}
    />
  );

  /**
   * Renders the UserSelect component.
   *
   * @param {string} name - The name of the field.
   * @param {string} label - The label for the select field.
   * @param {array} options - Array of option objects for the select field.
   *
   * @return {JSX.Element} - The rendered UserSelect component.
   */
  const renderUserSelect = (name, label, options) => (
    <UserSelect
      key={name}
      name={name}
      text={label}
      options={options}
      value={formData[name] || ""}
      onChange={handleChange}
      error={!!errors[name]}
      helperText={errors[name]}
    />
  );

  // Determine dialog title and description based on whether editing or creating a new item
  const dialogTitle = item
    ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
    : `Create New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const dialogDescription = item
    ? `Edit the ${type} details below.`
    : `Fill out the details to create a new ${type}.`;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogDescription}</DialogContentText>
        {type === "project" ? (
          <>
            {/* Render fields specific to 'project' */}
            {renderTextField("title", "Project Title")}
            {renderTextField("description", "Project Description", true)}
            {renderTextField("instructions", "Participant Instructions", true)}
            {renderTextField("initial_clue", "First Clue")}
            {renderUserSelect("participant_scoring", "Participant Scoring", [
              { value: "Not Scored", label: "Not Scored" },
              {
                value: "Number of Scanned QR Codes",
                label: "Number of Scanned QR Codes",
              },
              {
                value: "Number of Locations Entered",
                label: "Number of Locations Entered",
              },
            ])}
            {renderUserSelect("homescreen_display", "Homescreen Display", [
              { value: "display_initial_clue", label: "Display Initial Clue" },
              {
                value: "display_all_locations",
                label: "Display All Locations",
              },
            ])}
            {renderCheckbox("is_published", "Publish")}
          </>
        ) : (
          <>
            {/* Render fields specific to 'location' */}
            {renderTextField("location_name", "Location Name")}
            {renderUserSelect("location_trigger", "Location Trigger", [
              { value: "Location Entry", label: "Location Entry" },
              { value: "QR Code Scan", label: "QR Code Scan" },
              {
                value: "Both Location Entry and QR Code Scan",
                label: "Both Location Entry and QR Code Scan",
              },
            ])}
            {renderTextField(
              "location_position",
              "Location Position (latitude, longitude)"
            )}
            {renderTextField(
              "score_points",
              "Score Points (numeric)",
              false,
              "number"
            )}
            {renderTextField("clue", "Clue", true)}
            {/* Replace the TextField with the WYSIWYG editor for location_content */}
            <Typography
              variant="caption"
              gutterBottom
              sx={{ color: "#000000de", ml: 1.9 }}
            >
              Location Content
            </Typography>
            <ReactQuill
              ref={quillRef} // Reference to the editor
              value={formData.location_content}
              onChange={handleContentChange}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ align: [] }],
                  ["link", "image"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "font",
                "size",
                "bold",
                "italic",
                "underline",
                "strike",
                "color",
                "background",
                "link",
                "image",
                "list",
                "bullet",
                "align",
              ]}
              placeholder="Enter location content"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: "4px",
                padding: "8px",
                "&:hover": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                },
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddEditForm.propTypes = {
  item: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["project", "location"]).isRequired,
  projectId: PropTypes.number,
};

export default AddEditForm;

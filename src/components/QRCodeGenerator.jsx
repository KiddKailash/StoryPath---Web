import React from "react";
import PropTypes from "prop-types";
import QRCodeDisplay from "./QRCodeDisplay";
import BoxWrapper from "./BoxWrapper";

/**
 * QRCodeGenerator component wraps the QRCodeDisplay with a styled BoxWrapper.
 *
 * @param {string} value - The content to encode in the QR code.
 * @param {string} id - The unique identifier for the QR code element.
 * @param {number} [size=1000] - The size of the QR code in pixels.
 * @param {object} [containerStyle={}] - Additional styles to apply to the container.
 *
 * @return {JSX.Element} - The rendered QR code within a styled container.
 */
const QRCodeGenerator = ({ value, id, size = 1000, containerStyle = {} }) => (
  <BoxWrapper id={id} size={size} containerStyle={containerStyle}>
    {/* Render the QR code with the specified value and size */}
    <QRCodeDisplay value={value} size={size} />
  </BoxWrapper>
);

QRCodeGenerator.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  size: PropTypes.number,
  containerStyle: PropTypes.object,
};

export default QRCodeGenerator;

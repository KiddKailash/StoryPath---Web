import React from "react";
import PropTypes from "prop-types";
import QRCode from "react-qr-code";

/**
 * QRCodeDisplay component renders a QR code based on the provided value and size.
 *
 * @param {string} value - The content to encode in the QR code.
 * @param {number} size - The size of the QR code in pixels.
 *
 * @return {JSX.Element} - The rendered QR code component.
 */
const QRCodeDisplay = ({ value, size }) => (
  <QRCode
    value={value}
    size={size}
    bgColor="transparent"  // Set background color to transparent
    fgColor="currentColor" // Set foreground color to the current text color
  />
);

QRCodeDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default QRCodeDisplay;

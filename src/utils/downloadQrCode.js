// src/utils/downloadQRCode.js

/**
 * Downloads a QR Code as a PNG image.
 *
 * @param {number|string} location_id - The ID of the location.
 * @param {number|string} project_id - The ID of the project.
 * @param {string} location_name - The name of the location.
 */
const downloadQRCode = (location_id, project_id, location_name) => {
    // Construct the SVG element's ID based on project and location IDs
    const svgElementId = `qr-code-${project_id}-${location_id}`;
    
    // Retrieve the SVG element from the DOM
    const svgElement = document.getElementById(svgElementId);
    if (!svgElement) {
      console.error(`QR Code element with ID "${svgElementId}" not found.`);
      return;
    }
  
    // Serialize the SVG element to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement.querySelector("svg"));
  
    // Create a canvas element to draw the SVG
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();
  
    // Create a Blob from the SVG string
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
  
    // Handle the image load event
    img.onload = () => {
      // Set canvas dimensions to match the SVG
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Draw the SVG image onto the canvas
      context.drawImage(img, 0, 0);
  
      // Convert the canvas content to a PNG data URL
      const pngDataUrl = canvas.toDataURL("image/png");
  
      // Create a temporary link element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = pngDataUrl;
      downloadLink.download = `${location_name.replace(/ /g, "_")}.png`;
      document.body.appendChild(downloadLink); // Append to the DOM
      downloadLink.click(); // Trigger the download
      document.body.removeChild(downloadLink); // Clean up
  
      // Revoke the Blob URL to free up memory
      URL.revokeObjectURL(url);
    };
  
    // Set the image source to the Blob URL
    img.src = url;
  };
  
  export default downloadQRCode;
  
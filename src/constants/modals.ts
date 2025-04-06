// Modal spacing constants in pixels
export const MODAL_SPACING = {
  // Container spacing
  CONTAINER_PADDING_X: 16,    // Horizontal padding
  CONTAINER_PADDING_Y: 20,    // Vertical padding
  CONTAINER_MAX_WIDTH: 360,   // Maximum width (reduced from 420)
  CONTAINER_MAX_HEIGHT: '70vh', // Maximum height (reduced from 80vh)
  BORDER_RADIUS: 16,         // Border radius
  
  // Header spacing
  HEADER_PADDING_X: 16,      // Header horizontal padding
  HEADER_PADDING_Y: 10,      // Header vertical padding (reduced from 12)
  HEADER_ICON_SIZE: 24,      // Header icon size
  HEADER_FONT_SIZE: 18,      // Header font size (reduced from 20)
  
  // Content spacing
  CONTENT_PADDING_X: 16,     // Content horizontal padding
  CONTENT_PADDING_Y: 12,     // Content vertical padding (reduced from 16)
  CONTENT_GAP: 12,          // Gap between content elements (reduced from 16)
  
  // Footer spacing
  FOOTER_PADDING_X: 16,      // Footer horizontal padding
  FOOTER_PADDING_Y: 12,      // Footer vertical padding (reduced from 16)
  FOOTER_BUTTON_HEIGHT: 36,  // Footer button height (reduced from 40)
  
  // Close button
  CLOSE_BUTTON_SIZE: 20,    // Close button icon size (reduced from 24)
  CLOSE_BUTTON_POSITION: 12, // Close button position from edge (reduced from 16)
} as const;

// Modal animation timing
export const MODAL_ANIMATION = {
  DURATION: 200,            // Animation duration in ms
  OVERLAY_OPACITY: 0.5,     // Overlay opacity
} as const;
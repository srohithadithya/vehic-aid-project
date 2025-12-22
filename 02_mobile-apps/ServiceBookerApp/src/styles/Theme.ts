// ServiceBookerApp/src/styles/Theme.ts

// --- Color Palette ---
export const COLORS = {
    // Primary Brand Colors (Matching backend admin/UI)
    primary: '#007bff',       // Deep Blue (Dispatch/Call to Action)
    primaryDark: '#0056b3',   // Dark Blue
    
    // Status & Action Colors
    success: '#28a745',       // Green (Success, Verified)
    danger: '#dc3545',        // Red (Error, Logout, Urgent)
    accent: '#ffc107',        // Yellow/Amber (Upgrade, Warning)
    
    // Neutral Colors
    white: '#FFFFFF',
    background: '#F4F4F9',    // Light Gray Background
    border: '#DEE2E6',        // Light Border Gray
    gray: '#6C757D',          // Standard Text Gray
    darkText: '#343A40',      // Body Text
};

// --- Spacing ---
export const SPACING = {
    xsmall: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
};

// --- Typography ---
export const FONT_SIZES = {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32,
};

// --- Export All for Simple Import ---
export const Theme = {
    COLORS,
    SPACING,
    FONT_SIZES
};
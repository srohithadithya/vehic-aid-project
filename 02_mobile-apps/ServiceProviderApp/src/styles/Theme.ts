// ServiceProviderApp/src/styles/Theme.ts

// --- Color Palette ---
export const COLORS = {
    // Primary Brand Colors (Used for main actions and branding)
    primary: '#1E293B',       // Deep Navy/Dark Blue (Headers, backgrounds)
    primaryLight: '#FF8C00',  // Deep Orange/Amber (Accent, Toggle Active, Button Highlights)
    
    // Status Colors (Crucial for job queue status)
    success: '#28A745',       // Green (Job Accepted, Verified, Processed Payout)
    danger: '#DC3545',        // Red (Job Rejected, Urgent Priority)
    accent: '#FFC107',        // Yellow/Amber (Warning, Quote Tool Highlight)
    
    // Neutral Colors
    white: '#FFFFFF',
    background: '#F4F4F9',    // Light Gray Background
    border: '#DEE2E6',        // Light Border Gray
    gray: '#6C757D',          // Standard Text Gray (for labels)
    darkText: '#343A40',      // Body Text
    lightText: '#FFFFFF',     // Used on dark headers
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
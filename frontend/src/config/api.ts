// Central API configuration
// Set VITE_API_URL in your .env file to point to your backend
// If not set, API calls that require a backend will gracefully fail
export const API_URL = import.meta.env.VITE_API_URL || '';

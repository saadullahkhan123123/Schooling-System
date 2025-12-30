// API Configuration - Works for both development and production
const getApiBaseUrl = () => {
  // Check if we're in production (Vercel)
  if (import.meta.env.PROD || window.location.hostname.includes('vercel.app')) {
    return 'https://schooling-system-backend.vercel.app';
  }
  // Development
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API URL being used (for debugging)
console.log('🌐 API Base URL:', API_BASE_URL);


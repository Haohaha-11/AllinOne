/// <reference types="vite/client" />

// API Configuration
// Automatically uses production URL when deployed, localhost for development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API URL:', API_URL);

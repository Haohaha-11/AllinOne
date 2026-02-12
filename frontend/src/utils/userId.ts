/**
 * User ID Management
 * 
 * Generates and stores a unique user ID in localStorage for each browser.
 * This ensures each user has their own isolated data without requiring authentication.
 */

const USER_ID_KEY = 'allinone_user_id';

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or create user ID
 * 
 * Returns the existing user ID from localStorage, or creates a new one if it doesn't exist.
 */
export function getUserId(): string {
  // Check if user ID exists in localStorage
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Generate new user ID
    userId = generateUUID();
    
    // Store in localStorage
    localStorage.setItem(USER_ID_KEY, userId);
    
    console.log('New user ID generated:', userId);
  } else {
    console.log('Existing user ID loaded:', userId);
  }
  
  return userId;
}

/**
 * Reset user ID (for testing or clearing data)
 * 
 * WARNING: This will make the current user's data inaccessible!
 */
export function resetUserId(): string {
  const newUserId = generateUUID();
  localStorage.setItem(USER_ID_KEY, newUserId);
  console.log('User ID reset to:', newUserId);
  return newUserId;
}

/**
 * Get current user ID without creating a new one
 */
export function getCurrentUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

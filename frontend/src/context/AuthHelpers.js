// src/context/AuthHelpers.js

// -----------------------------
// Logout Helper
// -----------------------------
let logoutFn = null;

/**
 * Call the registered logout function.
 * @param {boolean} showToast - Whether to show a toast message.
 */
export const logout = (showToast = true) => {
  if (typeof logoutFn === 'function') {
    logoutFn(showToast);
  } else {
    console.warn('⚠️ Logout function is not registered yet.');
  }
};

/**
 * Register a logout function (usually from AuthContext).
 * @param {Function} fn - The logout function.
 */
export const setLogoutFn = (fn) => {
  if (typeof fn === 'function') {
    logoutFn = fn;
  } else {
    console.error('❌ setLogoutFn expects a function.');
  }
};

// -----------------------------
// Access Token Helper
// -----------------------------
let setAccessTokenFn = null;

/**
 * Call the registered setAccessToken function.
 * @param {string} newAccess - New access token.
 */
export const setAccessToken = (newAccess) => {
  if (typeof setAccessTokenFn === 'function') {
    setAccessTokenFn(newAccess);
  } else {
    console.warn('⚠️ setAccessToken function is not registered yet.');
  }
};

/**
 * Register a setAccessToken function (usually from AuthContext).
 * @param {Function} fn - Function that updates the access token.
 */
export const setAccessTokenFnHelper = (fn) => {
  if (typeof fn === 'function') {
    setAccessTokenFn = fn;
  } else {
    console.error('❌ setAccessTokenFnHelper expects a function.');
  }
};

/**
 * Checks if the code is running in a browser environment
 * @returns {boolean} True if running in browser, false otherwise
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Checks if the code is running on the server side (SSR)
 * @returns {boolean} True if running on server, false otherwise
 */
export const isServer = !isBrowser;

/**
 * Tests if localStorage is available and accessible in the current environment
 * Performs a read/write test to ensure localStorage is working properly
 * @returns {boolean} True if localStorage is available and functional
 */
export const isLocalStorageAvailable = () => {
  if (!isBrowser) return false;

  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Tests if sessionStorage is available and accessible in the current environment
 * Performs a read/write test to ensure sessionStorage is working properly
 * @returns {boolean} True if sessionStorage is available and functional
 */
export const isSessionStorageAvailable = () => {
  if (!isBrowser) return false;

  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Detects if the current device supports touch interactions
 * Checks for both touch events and maximum touch points
 * @returns {boolean} True if device supports touch, false otherwise
 */
export const isTouchDevice = () => {
  if (!isBrowser) return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Determines if the current device should be considered mobile
 * Uses screen width and touch capability as indicators
 * @returns {boolean} True if device is mobile, false otherwise
 */
export const isMobileDevice = () => {
  if (!isBrowser) return false;
  return window.innerWidth < 768 || isTouchDevice();
};

/**
 * Checks if WebGL is supported in the current browser
 * Tests for both standard and experimental WebGL contexts
 * @returns {boolean} True if WebGL is supported, false otherwise
 */
export const isWebGLAvailable = () => {
  if (!isBrowser) return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};

/**
 * Checks if WebGL2 is supported in the current browser
 * Tests for WebGL2 rendering context specifically
 * @returns {boolean} True if WebGL2 is supported, false otherwise
 */
export const isWebGL2Available = () => {
  if (!isBrowser) return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
};

/**
 * Verifies if Intersection Observer API is available
 * Used for detecting when elements enter/exit viewport
 * @returns {boolean} True if IntersectionObserver is supported
 */
export const isIntersectionObserverAvailable = () => {
  if (!isBrowser) return false;
  return 'IntersectionObserver' in window;
};

/**
 * Verifies if Resize Observer API is available
 * Used for detecting element size changes
 * @returns {boolean} True if ResizeObserver is supported
 */
export const isResizeObserverAvailable = () => {
  if (!isBrowser) return false;
  return 'ResizeObserver' in window;
};

/**
 * Verifies if Mutation Observer API is available
 * Used for detecting DOM changes
 * @returns {boolean} True if MutationObserver is supported
 */
export const isMutationObserverAvailable = () => {
  if (!isBrowser) return false;
  return 'MutationObserver' in window;
};

/**
 * Verifies if Performance Observer API is available
 * Used for monitoring performance metrics
 * @returns {boolean} True if PerformanceObserver is supported
 */
export const isPerformanceObserverAvailable = () => {
  if (!isBrowser) return false;
  return 'PerformanceObserver' in window;
};

/**
 * Safely retrieves browser information without causing errors
 * Returns null if not in browser environment
 * @returns {Object|null} Browser information object or null
 */
export const getBrowserInfo = () => {
  if (!isBrowser) return null;

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    platform: navigator.platform,
    vendor: navigator.vendor,
  };
};

/**
 * Safely retrieves screen information without causing errors
 * Returns null if not in browser environment
 * @returns {Object|null} Screen information object or null
 */
export const getScreenInfo = () => {
  if (!isBrowser) return null;

  return {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth,
  };
};

/**
 * Safely retrieves viewport information without causing errors
 * Includes device pixel ratio for high-DPI displays
 * @returns {Object|null} Viewport information object or null
 */
export const getViewportInfo = () => {
  if (!isBrowser) return null;

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
};
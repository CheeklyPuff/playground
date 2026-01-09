import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that manages the data-theme attribute on the document root
 * based on the current route.
 * 
 * Route to theme mapping:
 * - /bin → "bin"
 * - /mhitems → "monsterhunter"
 * - all other routes → "default"
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */
export function useTheme(): void {
  const location = useLocation();

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof document === 'undefined' || !document.documentElement) {
      // Skip theme application in SSR or non-browser environments
      return;
    }

    // Map routes to theme names
    let theme: string;
    
    if (location.pathname === '/bin') {
      theme = 'bin';
    } else if (location.pathname === '/mhitems') {
      theme = 'monsterhunter';
    } else {
      theme = 'default';
    }

    // Set data-theme attribute on document root
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {
      console.warn('Failed to set data-theme attribute:', error);
    }
  }, [location.pathname]); // Update theme when route changes
}

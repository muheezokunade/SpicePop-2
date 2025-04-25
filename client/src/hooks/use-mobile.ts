import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Default to false on SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Get the initial match
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    // Set up the listener
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    
    // Clean up
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
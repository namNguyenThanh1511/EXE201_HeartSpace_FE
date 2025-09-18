import { useEffect, useState } from "react";

/**
 * Custom React hook to determine if a media query matches the current viewport.
 * @param query - The media query string (e.g., '(max-width: 639px)')
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia(q).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    const handleChange = () => setMatches(matchMedia.matches);
    matchMedia.addEventListener("change", handleChange);
    setMatches(matchMedia.matches);
    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

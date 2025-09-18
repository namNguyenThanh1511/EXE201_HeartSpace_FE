import { useState, useEffect, useCallback } from "react";

interface ScrollDirection {
  isScrollingDown: boolean;
  isScrollingUp: boolean;
  isAtTop: boolean;
  scrollY: number;
}

export function useScrollDirection(threshold: number = 10): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>({
    isScrollingDown: false,
    isScrollingUp: false,
    isAtTop: true,
    scrollY: 0,
  });

  const updateScrollDirection = useCallback(
    (lastScrollY: number, setTicking: (value: boolean) => void) => {
      const currentScrollY = window.scrollY;

      // Check if we're at the top
      const isAtTop = currentScrollY <= threshold;

      // Determine scroll direction with a minimum scroll distance
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      const minScrollDistance = 5; // Minimum pixels to consider as scrolling

      const isScrollingDown =
        currentScrollY > lastScrollY &&
        currentScrollY > threshold &&
        scrollDifference > minScrollDistance;
      const isScrollingUp = currentScrollY < lastScrollY && scrollDifference > minScrollDistance;

      setScrollDirection({
        isScrollingDown,
        isScrollingUp,
        isAtTop,
        scrollY: currentScrollY,
      });

      setTicking(false);
      return currentScrollY > 0 ? currentScrollY : 0;
    },
    [threshold]
  );

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let timeoutId: NodeJS.Timeout;

    const setTicking = (value: boolean) => {
      ticking = value;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          lastScrollY = updateScrollDirection(lastScrollY, setTicking);
        });
        ticking = true;
      }

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a timeout to reset scroll direction after scrolling stops
      timeoutId = setTimeout(() => {
        setScrollDirection((prev) => ({
          ...prev,
          isScrollingDown: false,
          isScrollingUp: false,
        }));
      }, 150); // Reset after 150ms of no scrolling
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold]);

  return scrollDirection;
}

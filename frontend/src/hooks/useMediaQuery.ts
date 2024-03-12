import { getTheme } from "@f/styles/theme.style";
import { useEffect, useState } from "react";

export const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(getTheme("light").mediaQuery.mobile).matches
  );

  const handleResize = () => {
    setIsMobile(window.matchMedia(getTheme("light").mediaQuery.mobile).matches);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(getTheme("light").mediaQuery.mobile);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return { isMobile };
};

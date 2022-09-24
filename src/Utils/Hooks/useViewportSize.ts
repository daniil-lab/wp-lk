import React, { useState } from "react";

const getViewportWidth = () =>
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

const getViewportHeight = () =>
  Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

export const useViewportSize = () => {
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth);
  const [viewportHeight, setViewportHeight] = useState(getViewportHeight);

  React.useEffect(() => {
    const resizeWindowListener = (event) => {
      setViewportWidth(getViewportWidth);
      setViewportHeight(getViewportHeight);
    };
    window.addEventListener("resize", resizeWindowListener);
    return () => window.removeEventListener("resize", resizeWindowListener);
  }, []);

  return { viewportWidth, viewportHeight };
};

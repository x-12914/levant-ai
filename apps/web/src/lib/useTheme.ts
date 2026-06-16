import { useCallback, useEffect, useState } from "react";

type Theme = "dark" | "light";
const KEY = "levant-theme";

function read(): Theme {
  const stored = localStorage.getItem(KEY);
  return stored === "light" ? "light" : "dark";
}

/** Persisted dark/light theme bound to <html data-theme>. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}

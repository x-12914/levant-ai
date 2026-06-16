import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply persisted theme before first paint to avoid a flash.
const stored = localStorage.getItem("levant-theme");
document.documentElement.setAttribute("data-theme", stored === "light" ? "light" : "dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

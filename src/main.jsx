// ============================================================
// AP3X BUILD CONTROL OS — Entry Point
// /src/main.jsx
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.jsx";

const root = document.getElementById("root");
if (!root) throw new Error("[AP3X] #root element not found in index.html");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);

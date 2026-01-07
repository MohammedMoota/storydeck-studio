import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@radix-ui/themes/styles.css";
import "./index.css";

console.log("main.tsx: Starting initialization...");

const rootElement = document.getElementById("root");
console.log("main.tsx: Root element found:", rootElement);

if (rootElement) {
  console.log("main.tsx: Creating React root...");
  const root = ReactDOM.createRoot(rootElement);
  console.log("main.tsx: Rendering App...");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log("main.tsx: Render called");
} else {
  console.error("main.tsx: Root element not found!");
}

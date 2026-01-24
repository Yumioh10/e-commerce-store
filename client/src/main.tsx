import { StrictMode } from "react";
import { AppRouter } from "./router"; 
import { createRoot } from "react-dom/client";    
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
import { StrictMode } from "react";
import { AppRouter } from "./router"; 
import { createRoot } from "react-dom/client";    
import "./styles/index.css";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <AppRouter />
    </CartProvider>
  </StrictMode>,
);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./contexts/ThemeProvider.jsx";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID"}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
          },
        }}
      />
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

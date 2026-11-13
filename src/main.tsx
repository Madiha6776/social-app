import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </AuthContextProvider>,
);

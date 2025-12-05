import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./css/cb-store.css"; // ✅ GARANTE que o CSS carrega no app inteiro

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

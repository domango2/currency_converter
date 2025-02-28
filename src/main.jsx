import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import ConverterPage from "./pages/ConverterPage.jsx";
import CurrencyRatesPage from "./pages/CurrencyRatesPage.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
      <Routes>
        <Route path="/" element={<ConverterPage />} />
        <Route path="/rates" element={<CurrencyRatesPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

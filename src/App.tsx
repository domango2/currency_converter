import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import ConverterPage from "./pages/ConverterPage.tsx";
import CurrencyRatesPage from "./pages/CurrencyRatesPage.tsx";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<ConverterPage />} />
          <Route path="/rates" element={<CurrencyRatesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

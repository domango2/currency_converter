import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ConverterPage from "@/pages/ConverterPage";
import CurrencyRatesPage from "@/pages/CurrencyRatesPage";

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

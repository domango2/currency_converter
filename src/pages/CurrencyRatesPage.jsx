import CurrencyRates from "../components/CurrencyRates";

export default function CurrencyRatesPage() {
  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Текущие курсы валют</h1>
      <CurrencyRates />
    </div>
  );
}

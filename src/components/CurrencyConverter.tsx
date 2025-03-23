import { useState, useEffect } from "react";
import { getRates } from "../services/currencyAPI.ts";
import CurrencySwapButton from "./CurrencySwapButton.tsx";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("BYN");
  const [amount, setAmount] = useState<string>("1");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const debouncedAmount = useDebounce(amount, 200);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const fetchedRates = await getRates(baseCurrency);
        setRates((prevRates) => ({ ...prevRates, ...fetchedRates }));
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить курсы валют. Попробуйте позже.");
        console.error("Ошибка при загрузке курсов валют:", err);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  useEffect(() => {
    if (debouncedAmount === "") {
      setConvertedAmount(0);
    } else if (rates[targetCurrency] && rates[baseCurrency]) {
      const baseRate = rates[baseCurrency];
      const targetRate = rates[targetCurrency];
      const convertedValue =
        (parseFloat(debouncedAmount) * targetRate) / baseRate;
      setConvertedAmount(Math.round(convertedValue * 100) / 100);
    }
  }, [debouncedAmount, rates, targetCurrency, baseCurrency]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value || "");
  };

  const handleSwap = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  const usedCurrencies: string[] = [
    "BYN",
    "USD",
    "EUR",
    "RUB",
    "PLN",
    "CNY",
    "GBP",
  ];

  return (
    <div className="card shadow-sm mb-4 mx-auto" style={{ maxWidth: "800px" }}>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3 row align-items-center">
          <label className="col-sm-1 col-form-label fw-semibold">Из:</label>
          <div className="col-sm-3">
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="form-select"
            >
              {usedCurrencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-8">
            <input
              type="number"
              defaultValue={amount}
              onChange={handleAmountChange}
              placeholder="Введите сумму"
              className="form-control"
            />
          </div>
        </div>
        <CurrencySwapButton onClick={handleSwap} />
        <div className="mb-3 row align-items-center">
          <label className="col-sm-1 col-form-label fw-semibold">В:</label>
          <div className="col-sm-3">
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="form-select"
            >
              {usedCurrencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-8">
            <input
              type="number"
              value={convertedAmount}
              placeholder="Конвертированная сумма"
              readOnly
              className="form-control"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

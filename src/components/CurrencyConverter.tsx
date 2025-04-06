import { useState, useEffect } from "react";
import { getRates } from "../services/currencyAPI.ts";
import CurrencySwapButton from "./CurrencySwapButton.tsx";
import { useDebounce } from "../hooks/useDebounce.ts";
import {
  DEBOUNCE_DELAY,
  DEFAULT_BASE_CURRENCY,
  DEFAULT_TARGET_CURRENCY,
  USED_CURRENCIES,
} from "../constants/constants.ts";
import CurrencySelect from "./CurrencySelect.tsx";

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [baseCurrency, setBaseCurrency] = useState<string>(
    DEFAULT_BASE_CURRENCY
  );
  const [targetCurrency, setTargetCurrency] = useState<string>(
    DEFAULT_TARGET_CURRENCY
  );
  const [amount, setAmount] = useState<string>("1");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const debouncedAmount = useDebounce(amount, DEBOUNCE_DELAY);

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
      setConvertedAmount(+convertedValue.toFixed(2));
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

  return (
    <div className="card shadow-sm mb-4 mx-auto" style={{ maxWidth: "800px" }}>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3 row align-items-center">
          <CurrencySelect
            label="Из:"
            value={baseCurrency}
            onChange={setBaseCurrency}
            options={USED_CURRENCIES}
            colClass="col-sm-3"
          />
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
          <CurrencySelect
            label="Из:"
            value={targetCurrency}
            onChange={setTargetCurrency}
            options={USED_CURRENCIES}
            colClass="col-sm-3"
          />
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

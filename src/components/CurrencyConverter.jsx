import { useState, useEffect } from "react";
import { getRates } from "../services/currencyAPI";
import debounce from "lodash.debounce";

export default function CurrencyConverter() {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("BYN");
  const [amount, setAmount] = useState("1");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const fetchedRates = await getRates(baseCurrency);
        setRates(fetchedRates);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить курсы валют. Попробуйте позже.");
        console.error("Ошибка при загрузке курсов валют:", err);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  useEffect(() => {
    if (amount === "") {
      setConvertedAmount(0);
    } else if (rates[targetCurrency] && rates[baseCurrency]) {
      const baseRate = rates[baseCurrency];
      const targetRate = rates[targetCurrency];
      const convertedValue = (parseFloat(amount) * targetRate) / baseRate;
      setConvertedAmount(Math.round(convertedValue * 100) / 100);
    }
  }, [amount, rates, targetCurrency, baseCurrency]);

  const debouncedSetAmount = debounce((val) => {
    setAmount(val);
  }, 200);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    debouncedSetAmount(value || "");
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
          <label className="col-sm-1 col-form-label fw-semibold">Из:</label>
          <div className="col-sm-3">
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="form-select"
            >
              {["BYN", "USD", "EUR", "RUB", "PLN", "CNY", "GBP"].map((curr) => (
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

        <div className="d-flex justify-content-center mb-3">
          <button
            onClick={handleSwap}
            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
            title="Поменять валюты местами"
            style={{ width: "48px", height: "48px", padding: "0" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-down-up"
              viewBox="0 0 16 16"
              style={{ display: "block", margin: "auto" }}
            >
              <path
                fillRule="evenodd"
                d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
              />
            </svg>
          </button>
        </div>

        <div className="mb-3 row align-items-center">
          <label className="col-sm-1 col-form-label fw-semibold">В:</label>
          <div className="col-sm-3">
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="form-select"
            >
              {["BYN", "USD", "EUR", "RUB", "PLN", "CNY", "GBP"].map((curr) => (
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

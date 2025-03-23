import { useState, useEffect } from "react";
import { getRates } from "../services/currencyAPI";
import { loadFavorites, saveFavorites } from "../utils/favorites";
import FavoriteButton from "./FavoritesButton";

export default function CurrencyRates() {
  const [rates, setRates] = useState({});
  const [favorites, setFavorites] = useState(loadFavorites());
  const [baseCurrency, setBaseCurrency] = useState("USD");

  useEffect(() => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter(
        (currency) => currency !== baseCurrency
      );
      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });

    const controller = new AbortController();
    const fetchRates = async () => {
      try {
        const fetchedRates = await getRates(baseCurrency, controller.signal);
        setRates(fetchedRates);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    };
    fetchRates();

    return () => controller.abort();
  }, [baseCurrency]);

  const toggleFavorite = (currency) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites = prevFavorites.includes(currency)
        ? prevFavorites.filter((item) => item !== currency)
        : [currency, ...prevFavorites.slice(0, 5)];

      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };

  const handleDragStart = (e, currency) => {
    e.dataTransfer.setData("currency", currency);
  };

  const handleDrop = (e, targetCurrency) => {
    const draggedCurrency = e.dataTransfer.getData("currency");
    if (!draggedCurrency || draggedCurrency === targetCurrency) return;

    setFavorites((prevFavorites) => {
      const updatedFavorites = [...prevFavorites];
      const draggedIndex = updatedFavorites.indexOf(draggedCurrency);
      const targetIndex = updatedFavorites.indexOf(targetCurrency);

      updatedFavorites.splice(draggedIndex, 1);
      updatedFavorites.splice(targetIndex, 0, draggedCurrency);

      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const usedCurrencies = ["USD", "EUR", "RUB", "PLN", "CNY", "GBP", "BYN"];
  const formatAmount = (amount) =>
    typeof amount === "number" ? amount.toFixed(2) : "—";

  const sortedCurrencies = [
    ...favorites,
    ...usedCurrencies.filter((currency) => !favorites.includes(currency)),
  ];

  return (
    <div className="container my-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <div className="mb-4">
            <label className="fw-semibold me-2">Основная валюта:</label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="form-select d-inline-block w-auto"
            >
              {usedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {favorites.length > 0 && (
            <>
              <h5 className="fw-bold mb-3">Избранные валюты</h5>
              <div
                className="d-flex flex-wrap gap-2 mb-4"
                onDragOver={handleDragOver}
              >
                {favorites.map((currency) => (
                  <button
                    key={currency}
                    className="btn btn-outline-secondary"
                    draggable
                    onDragStart={(e) => handleDragStart(e, currency)}
                    onDrop={(e) => handleDrop(e, currency)}
                    onClick={() => toggleFavorite(currency)}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </>
          )}

          <h5 className="fw-bold mb-3">Все курсы</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Валюта</th>
                  <th>Курс к {baseCurrency}</th>
                </tr>
              </thead>
              <tbody>
                {sortedCurrencies
                  .filter((currency) => currency !== baseCurrency)
                  .map((currency) => (
                    <tr key={currency}>
                      <td>
                        {currency}{" "}
                        <FavoriteButton
                          isFavorite={favorites.includes(currency)}
                          onClick={() => toggleFavorite(currency)}
                        />
                      </td>
                      <td>{formatAmount(rates[currency])}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

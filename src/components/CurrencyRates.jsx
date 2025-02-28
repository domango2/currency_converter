import { useState, useEffect } from "react";
import { getRates } from "../services/currencyAPI";
import { loadFavorites, saveFavorites } from "../utils/favorites";

export default function CurrencyRates() {
  const [rates, setRates] = useState({});
  const [favorites, setFavorites] = useState(loadFavorites());
  const [baseCurrency, setBaseCurrency] = useState("USD");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const fetchedRates = await getRates(baseCurrency);
        setRates(fetchedRates);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  const toggleFavorite = (currency) => {
    let updatedFavorites = [...favorites];
    if (updatedFavorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((item) => item !== currency);
    } else {
      if (updatedFavorites.length >= 6) {
        updatedFavorites.pop();
      }
      updatedFavorites.unshift(currency);
    }
    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  const handleDragStart = (e, currency) => {
    e.dataTransfer.setData("currency", currency);
  };

  const handleDrop = (e, targetCurrency) => {
    const draggedCurrency = e.dataTransfer.getData("currency");
    if (draggedCurrency === targetCurrency) return;
    const updatedFavorites = [...favorites];
    const draggedIndex = updatedFavorites.indexOf(draggedCurrency);
    const targetIndex = updatedFavorites.indexOf(targetCurrency);
    updatedFavorites.splice(draggedIndex, 1);
    updatedFavorites.splice(targetIndex, 0, draggedCurrency);
    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const usedCurrencies = ["USD", "EUR", "RUB", "PLN", "CNY", "GBP", "BYN"];
  const formatAmount = (amount) => (amount ? amount.toFixed(2) : "0.00");

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
                        <button
                          className="btn p-0 ms-2"
                          onClick={() => toggleFavorite(currency)}
                          title="Добавить/убрать из избранного"
                        >
                          {favorites.includes(currency) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-star-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-star"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                            </svg>
                          )}
                        </button>
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

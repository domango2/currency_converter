import { useState, useEffect } from "react";
import { getRates } from "../services/currencyAPI.ts";
import { loadFavorites, saveFavorites } from "../utils/favorites.ts";
import FavoriteButton from "./FavoritesButton.tsx";
import {
  DEFAULT_BASE_CURRENCY,
  USED_CURRENCIES,
} from "../constants/constants.ts";
import { formatAmount } from "../utils/formatAmount.ts";
import { useAbortController } from "../hooks/useAbortController.ts";
import { rearrangeFavorites } from "../utils/rearrangeFavorites.ts";
import CurrencySelect from "./CurrencySelect.tsx";

type Rates = Record<string, number>;

export default function CurrencyRates() {
  const [rates, setRates] = useState<Rates>({});
  const [favorites, setFavorites] = useState<string[]>(loadFavorites());
  const [baseCurrency, setBaseCurrency] = useState<string>(
    DEFAULT_BASE_CURRENCY
  );

  const controller = useAbortController();

  useEffect(() => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter(
        (currency) => currency !== baseCurrency
      );
      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });

    const fetchRates = async () => {
      try {
        const fetchedRates = await getRates(baseCurrency, controller.signal);
        setRates(fetchedRates);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    };
    fetchRates();
  }, [baseCurrency, controller]);

  const toggleFavorite = (currency: string) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(currency)
        ? prevFavorites.filter((item) => item !== currency)
        : [currency, ...prevFavorites.slice(0, 5)];

      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    currency: string
  ) => {
    e.dataTransfer.setData("currency", currency);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLElement>,
    targetCurrency: string
  ) => {
    const draggedCurrency = e.dataTransfer.getData("currency");
    if (!draggedCurrency || draggedCurrency === targetCurrency) return;

    setFavorites((prevFavorites) => {
      const updatedFavorites = rearrangeFavorites(
        prevFavorites,
        draggedCurrency,
        targetCurrency
      );

      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const sortedCurrencies = [
    ...favorites,
    ...USED_CURRENCIES.filter((currency) => !favorites.includes(currency)),
  ];

  return (
    <div className="container my-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <div className="row align-items-center mb-4">
            <CurrencySelect
              label="Основная валюта:"
              value={baseCurrency}
              onChange={setBaseCurrency}
              options={USED_CURRENCIES}
              colClass="col-sm-3"
              labelWidth="col-sm-3"
            />
          </div>

          {favorites.length > 0 && (
            <>
              <h5 className="fw-bold mb-3">Избранные валюты</h5>
              <div
                className="d-flex flex-wrap gap-2 mb-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "")}
              >
                {favorites.map((currency) => (
                  <button
                    key={currency}
                    className="btn btn-outline-secondary"
                    draggable
                    onDragStart={(e) => handleDragStart(e, currency)}
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

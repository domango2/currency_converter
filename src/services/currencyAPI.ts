import { fetchRatesFromAPI } from "../api/fetchRates";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
} from "../utils/localStorageUtils";

const convertRates = (
  baseCurrency: string,
  rates: Record<string, number>
): Record<string, number> => {
  if (!rates[baseCurrency])
    throw new Error(`Нет данных для валюты ${baseCurrency}`);

  return Object.fromEntries(
    Object.entries(rates).map(([key, value]) => [
      key,
      value / rates[baseCurrency],
    ])
  );
};

export const getRates = async (
  baseCurrency: string,
  signal?: AbortSignal
): Promise<Record<string, number>> => {
  let rates = loadFromLocalStorage();

  if (Object.keys(rates).length === 0) {
    try {
      console.log("⏳ Запрос данных с API...");
      const responseData = await fetchRatesFromAPI(signal);
      if (!responseData || responseData.length === 0) {
        throw new Error("Не удалось получить данные от API");
      }
      const apiDate = responseData[0].Date.split("T")[0];

      rates = { BYN: 1 };

      responseData.forEach(
        ({ Cur_Abbreviation, Cur_OfficialRate, Cur_Scale }) => {
          rates[Cur_Abbreviation] = 1 / (Cur_OfficialRate / Cur_Scale);
        }
      );

      saveToLocalStorage(rates, apiDate);
    } catch (error) {
      console.error("Ошибка при загрузке курсов валют:", error);
    }
  }

  return convertRates(baseCurrency, rates);
};

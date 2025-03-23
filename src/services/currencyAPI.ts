import axios from "axios";

const API_URL = "https://api.nbrb.by/exrates/rates?periodicity=0";
const STORAGE_KEY = "currencyRates";

interface CurrencyRate {
  Cur_Abbreviation: string;
  Cur_OfficialRate: number;
  Cur_Scale: number;
  Date: string;
}

const saveToLocalStorage = (
  data: Record<string, number>,
  date: string
): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, date }));
};

const loadFromLocalStorage = (): Record<string, number> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return {};

  const { data, date } = JSON.parse(saved) as {
    data: Record<string, number>;
    date: string;
  };
  const today = new Date().toISOString().split("T")[0];

  return date === today ? data : {};
};

export const getRates = async (
  baseCurrency: string,
  signal?: AbortSignal
): Promise<Record<string, number>> => {
  let rates = loadFromLocalStorage();

  if (Object.keys(rates).length === 0) {
    try {
      console.log("⏳ Запрос данных с API...");
      const response = await axios.get<CurrencyRate[]>(API_URL, { signal });
      if (response?.data?.length) {
        const apiDate = response.data[0].Date.split("T")[0];
        rates = { BYN: 1 };

        response.data.forEach(
          ({ Cur_Abbreviation, Cur_OfficialRate, Cur_Scale }) => {
            rates[Cur_Abbreviation] = 1 / (Cur_OfficialRate / Cur_Scale);
          }
        );

        saveToLocalStorage(rates, apiDate);
      } else {
        throw new Error("Не удалось получить курсы валют");
      }
    } catch (error) {
      console.error("Ошибка при загрузке курсов валют:", error);
    }
  }

  return convertRates(baseCurrency, rates);
};

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

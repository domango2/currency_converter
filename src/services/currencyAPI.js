import axios from "axios";

const API_URL = "https://api.nbrb.by/exrates/rates?periodicity=0";
const STORAGE_KEY = "currencyRates";

const saveToLocalStorage = (data, date) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, date }));
};

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const { data, date } = JSON.parse(saved);
  const today = new Date().toISOString().split("T")[0];

  return date === today ? data : null;
};

export const getRates = async (baseCurrency) => {
  let rates = loadFromLocalStorage();

  if (!rates) {
    try {
      console.log("⏳ Запрос данных с API...");
      const response = await axios.get(API_URL);
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

const convertRates = (baseCurrency, rates) => {
  if (!rates[baseCurrency])
    throw new Error(`Нет данных для валюты ${baseCurrency}`);

  return Object.fromEntries(
    Object.entries(rates).map(([key, value]) => [
      key,
      value / rates[baseCurrency],
    ])
  );
};

import axios from "axios";

const API_URL = "https://api.nbrb.by/exrates/rates?periodicity=0";
const CACHE_DURATION = 60 * 60 * 1000;
const STORAGE_KEY = "currencyRates";

const saveToLocalStorage = (data) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ data, timestamp: Date.now() })
  );
};

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const { data, timestamp } = JSON.parse(saved);
  if (Date.now() - timestamp > CACHE_DURATION) return null;

  return data;
};

export const getRates = async (baseCurrency) => {
  let rates = loadFromLocalStorage();

  if (!rates) {
    try {
      console.log("⏳ Запрос данных с API...");
      const response = await axios.get(API_URL);
      if (response?.data) {
        rates = { BYN: 1 };
        response.data.forEach((rate) => {
          rates[rate.Cur_Abbreviation] =
            1 / (rate.Cur_OfficialRate / rate.Cur_Scale);
        });

        saveToLocalStorage(rates);
      } else {
        throw new Error("Не удалось получить курсы валют");
      }
    } catch (error) {
      console.error("Ошибка при загрузке курсов валют:", error);
      throw new Error("Ошибка при загрузке данных курсов валют.");
    }
  }

  return convertRates(baseCurrency, rates);
};

const convertRates = (baseCurrency, rates) => {
  if (baseCurrency === "BYN") return rates;
  const baseRate = rates[baseCurrency];
  if (!baseRate) throw new Error(`Нет данных для валюты ${baseCurrency}`);

  const convertedRates = {};
  Object.keys(rates).forEach((key) => {
    convertedRates[key] = rates[key] / baseRate;
  });

  return convertedRates;
};

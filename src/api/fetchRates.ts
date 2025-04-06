import axios from "axios";

const API_URL = "https://api.nbrb.by/exrates/rates?periodicity=0";

interface CurrencyRate {
  Cur_Abbreviation: string;
  Cur_OfficialRate: number;
  Cur_Scale: number;
  Date: string;
}

export const fetchRatesFromAPI = async (signal?: AbortSignal) => {
  try {
    const response = await axios.get<CurrencyRate[]>(API_URL, { signal });
    if (response?.data?.length) {
      return response.data;
    }
    throw new Error("Не удалось получить курсы валют");
  } catch (error) {
    console.error("Ошибка при загрузке курсов валют:", error);
  }
};

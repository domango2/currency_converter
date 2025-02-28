import axios from "axios";

const API_URL = "https://api.exchangerate-api.com/v4/latest";

export const getRates = async (baseCurrency) => {
  try {
    const response = await axios.get(`${API_URL}/${baseCurrency}`);
    if (response && response.data && response.data.rates) {
      return response.data.rates;
    } else {
      throw new Error("Не удалось получить курсы валют");
    }
  } catch (error) {
    console.error("Ошибка при загрузке курсов валют:", error);
    throw new Error("Ошибка при загрузке данных курсов валют.");
  }
};

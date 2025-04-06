const STORAGE_KEY = "currencyRates";

export const saveToLocalStorage = (
  data: Record<string, number>,
  date: string
): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, date }));
};

export const loadFromLocalStorage = (): Record<string, number> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return {};

  const { data, date } = JSON.parse(saved) as {
    data: Record<string, number>;
    date: string;
  };
  const today = new Date().toISOString().split("T")[0];

  return date === today ? data : {};
};

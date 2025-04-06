export const formatAmount = (amount: number | "—") =>
  typeof amount === "number" ? amount.toFixed(2) : "—";

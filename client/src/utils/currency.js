export const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const getCurrencySymbol = (
  currency
) => {
  return (
    currencySymbols[currency] ||
    "₹"
  );
};
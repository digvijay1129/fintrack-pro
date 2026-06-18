export const exchangeRates = {
  INR: 1,
  USD: 94.4,
  EUR: 108.5,
  GBP: 127.5,
};

export const convertCurrency = (
  amount,
  currency
) => {
  const rate =
    exchangeRates[currency] || 1;

  return (
    amount / rate
  ).toFixed(2);
};
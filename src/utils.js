// Change this one line to use another currency label (for example "USD").
export const CURRENCY = "ETB";

// Two names count as the same when they match after trimming,
// ignoring capital letters and extra spaces.
export const normalize = (text) =>
  String(text).trim().toLowerCase().replace(/\s+/g, " ");

export const number = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const money = (value) => `${number(value)} ${CURRENCY}`;

export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const lineTotals = (product) => {
  const totalBuy = product.quantity * product.buyPrice;
  const totalSell = product.quantity * product.sellPrice;
  return { totalBuy, totalSell, profit: totalSell - totalBuy };
};

export const sumTotals = (products) =>
  products.reduce(
    (acc, p) => {
      const t = lineTotals(p);
      acc.quantity += p.quantity;
      acc.totalBuy += t.totalBuy;
      acc.totalSell += t.totalSell;
      acc.profit += t.profit;
      return acc;
    },
    { count: products.length, quantity: 0, totalBuy: 0, totalSell: 0, profit: 0 }
  );

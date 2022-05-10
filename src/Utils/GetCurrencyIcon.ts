import { WalletModel } from "Models/WalletModel";

const GetCurrencySymbol = (currency: WalletModel) =>
  (0)
    .toLocaleString("ru-RU", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();

export default GetCurrencySymbol;

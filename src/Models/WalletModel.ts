export type WalletModel =
  | "RUB"
  | "USD"
  | "UAH"
  | "BYR"
  | "BRL"
  | "MDL"
  | "TRY"
  | "NOK"
  | "KZT"
  | "SEK"
  | "AZN"
  | "GEL"
  | "EUR"
  | "HUF"
  | "DKK"
  | "CZK"
  | "BGN"
  | "PLN"
  | "AUD"
  | "MXN"
  | "ZAR"
  | "JPY"
  | "CAD"
  | "ISK"
  | "CLP"
  | "GBR"
  | "INR"
  | "CHF"
  | "ARS"
  | "CNY"
  | "NONE";

export type CourseType = {
  wallet: WalletModel;
  value: number;
};

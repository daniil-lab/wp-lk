import React from "react";

import { TransactionType } from "Models/TransactionModel";
import { WalletModel } from "Models/WalletModel";
import { API_URL } from "Utils/Config";
import GetCurrencySymbol from "Utils/GetCurrencyIcon";
import HexToRgbA from "Utils/HexToRgbA";
import NumberWithSpaces from "Utils/NumberWithSpaces";

import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistoryItem/ChartBlockHistoryItem.scss";

interface ChartBlockHistoryItemProps {
  transactionType: TransactionType;
  price: string | number;
  title: string | undefined;
  subtitle: string;
  icon: {
    color: string | undefined;
    path: string | undefined;
  } | null;
  currency?: string;
  onClick?: () => void;
}

const ChartBlockHistoryItem: React.FunctionComponent<
  ChartBlockHistoryItemProps
> = ({ transactionType, price, title, subtitle, icon, currency, onClick }) => (
  <div className="chart-block-history-item" onClick={onClick}>
    <div
      className="chart-block-history-item-image"
      style={{
        background:
          icon != null
            ? `linear-gradient(135deg, ${
                icon.color ?? "#8fe87b"
              } 0%, ${HexToRgbA(icon.color ?? "#8fe87b")} 100%)`
            : "yellow",
      }}
    >
      {icon != null && (
        <img
          src={`${API_URL}api/v1/image/content/${icon.path}`}
          alt="Icon category"
        />
      )}
    </div>

    <div className="column-start chart-block-history-info">
      <span className="chart-block-history-item-title">{title}</span>
      <span className="chart-block-history-item-subtitle">{subtitle}</span>
    </div>
    <div className="chart-block-history-item-price-wrapper">
      <span>
        {transactionType === "SPEND" &&
          `-${NumberWithSpaces(price)} ${
            currency && GetCurrencySymbol(currency as WalletModel)
          }`}
        {transactionType === "WITHDRAW" &&
          `-${NumberWithSpaces(price)} ${
            currency && GetCurrencySymbol(currency as WalletModel)
          }`}

        {transactionType === "EARN" &&
          `+${NumberWithSpaces(price)} ${
            currency && GetCurrencySymbol(currency as WalletModel)
          }`}
        {transactionType === "DEPOSIT" &&
          `+${NumberWithSpaces(price)} ${
            currency && GetCurrencySymbol(currency as WalletModel)
          }`}
      </span>
    </div>
  </div>
);

export default ChartBlockHistoryItem;

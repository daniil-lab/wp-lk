import { AmountType, TransactionType } from "Models/TransactionModel";
import { WalletModel } from "Models/WalletModel";
import React from "react";
import { useSelector } from "react-redux";
import { GetUserWallet } from "Redux/Selectors";
import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistoryItem/ChartBlockHistoryItem.scss";
import { API_URL } from "Utils/Config";
import GetCurrencySymbol from "Utils/GetCurrencyIcon";
import HexToRgbA from "Utils/HexToRgbA";
import NumberWithSpaces from "Utils/NumberWithSpaces";

interface Props {
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

const ChartBlockHistoryItem: React.FunctionComponent<Props> = (
  props: Props
) => {
  const wallet = useSelector(GetUserWallet);
  return (
    <div className="chart-block-history-item" onClick={props.onClick}>
      <div
        className="chart-block-history-item-image"
        style={{
          background:
            props.icon != null
              ? `linear-gradient(135deg, ${
                  props.icon.color ?? "#8fe87b"
                } 0%, ${HexToRgbA(props.icon.color ?? "#8fe87b")} 100%)`
              : "yellow",
        }}
      >
        {props.icon != null && (
          <img
            src={`${API_URL}api/v1/image/content/${props.icon.path}`}
            alt="Icon category"
          />
        )}
      </div>

      <div className="column-start chart-block-history-info">
        <span className="chart-block-history-item-title">{props.title}</span>
        <span className="chart-block-history-item-subtitle">
          {props.subtitle}
        </span>
      </div>
      <div className="chart-block-history-item-price-wrapper">
        <span>
          {props.transactionType === "SPEND" &&
            `-${NumberWithSpaces(props.price)} ${
              props.currency && GetCurrencySymbol(props.currency as WalletModel)
            }`}
          {props.transactionType === "WITHDRAW" &&
            `-${NumberWithSpaces(props.price)} ${
              props.currency && GetCurrencySymbol(props.currency as WalletModel)
            }`}

          {props.transactionType === "EARN" &&
            `+${NumberWithSpaces(props.price)} ${
              props.currency && GetCurrencySymbol(props.currency as WalletModel)
            }`}
          {props.transactionType === "DEPOSIT" &&
            `+${NumberWithSpaces(props.price)} ${
              props.currency && GetCurrencySymbol(props.currency as WalletModel)
            }`}
        </span>
      </div>
    </div>
  );
};

export default ChartBlockHistoryItem;

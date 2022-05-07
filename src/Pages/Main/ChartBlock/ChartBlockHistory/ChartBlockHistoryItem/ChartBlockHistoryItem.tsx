import { AmountType, TransactionType } from "Models/TransactionModel";
import React from "react";
import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistoryItem/ChartBlockHistoryItem.scss";
import { API_URL } from "Utils/Config";
import HexToRgbA from "Utils/HexToRgbA";

interface Props {
  transactionType: TransactionType;
  price: AmountType | number;
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
            `-${props.price} ${props.currency}`}
          {props.transactionType === "WITHDRAW" &&
            `-${props.price} ${props.currency}`}

          {props.transactionType === "EARN" &&
            `+${props.price} ${props.currency}`}
          {props.transactionType === "DEPOSIT" &&
            `+${props.price} ${props.currency}`}
        </span>
      </div>
    </div>
  );
};

export default ChartBlockHistoryItem;

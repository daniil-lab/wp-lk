import React from "react";
import { IconType, TransactionType } from "Services/Interfaces";

import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistoryItem/ChartBlockHistoryItem.scss";
import { API_URL } from "Utils/Config";
import HexToRgbA from "Utils/HexToRgbA";

interface Props {
  type: TransactionType;
  price: string | number;
  title: string | undefined;
  subtitle: string;
  icon: {
    color: string | undefined;
    path: string | undefined;
  };
  currency?: string;
}

const ChartBlockHistoryItem: React.FunctionComponent<Props> = (
  props: Props
) => {
  return (
    <div className="chart-block-history-item">
      <div
        className="chart-block-history-item-image"
        style={{
          background: `linear-gradient(135deg, ${
            props.icon.color ?? "#8fe87b"
          } 0%, ${HexToRgbA(props.icon.color ?? "#8fe87b")} 100%)`,
        }}
      >
        {props.icon.path && (
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
          {props.type === "WITHDRAW" || props.type === "SPEND"
            ? `-${props.price} ${props.currency || "₽"}`
            : `+${props.price} ${props.currency || "₽"}`}
        </span>
      </div>
    </div>
  );
};

export default ChartBlockHistoryItem;

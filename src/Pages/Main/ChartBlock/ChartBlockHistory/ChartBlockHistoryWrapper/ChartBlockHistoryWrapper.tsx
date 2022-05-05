import React from "react";
import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistoryWrapper/ChartBlockHistoryWrapper.scss";

interface Props {
  date: string;
  children: React.ReactNode;
}

const ChartBlockHistoryWrapper: React.FunctionComponent<Props> = (
  props: Props
) => {
  let dateStr = "";
  if (new Date(props.date) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 1))
    dateStr = "Сегодня";
  else if (
    new Date(props.date) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  )
    dateStr = "Вчера";
  else dateStr = new Date(props.date).toLocaleDateString();
  return (
    <div className="chart-block-history-wrapper">
      <span className="chart-block-history-wrapper-title">{dateStr}</span>
      {props.children}
    </div>
  );
};

export default ChartBlockHistoryWrapper;

import React from "react";
import Transaction from "Services/Transaction";
import DonutChartBlock from "./DonutChartBlock/DonutChartBlock";
import Load from "Components/Load/Load";
import ChartBlockHistory from "./ChartBlockHistory/ChartBlockHistory";
import "Styles/Pages/Main/ChartBlock/ChartBlock.scss";

interface Props {}

const ChartBlock: React.FunctionComponent<Props> = (props: Props) => {
  const { useGetTransaction } = Transaction;
  const {
    load,
    transactions,
    selectedDate,
    setDate,
    prices,
    income,
    expenses,
  } = useGetTransaction();

  return (
    <Load {...{ load }}>
      <div className="chart-block">
        <ChartBlockHistory {...{ transactions }} />
        {load ? (
          <DonutChartBlock
            data={prices}
            income={income}
            expenses={expenses}
            {...{ selectedDate, setDate }}
          />
        ) : null}
      </div>
    </Load>
  );
};

export default ChartBlock;

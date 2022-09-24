import React, { useMemo, useState } from "react";

import DonutChartBlock from "./DonutChartBlock/DonutChartBlock";
import ChartBlockHistory from "./ChartBlockHistory/ChartBlockHistory";
import Load from "Components/Load/Load";
import TransactionsIcon from "Static/icons/transaction.svg";
import Image from "Components/Image/Image";
import { ChartMode } from "./types";
import useGetTransaction from "../../../Hooks/useGetTransaction";
import useGetCategories from "../../../Hooks/useGetCategories";
import useGetBill from "../../../Hooks/useGetBill";
import { calculateCategoriesBudget } from "../../../Utils/calculateCategoriesBudget";

import "Styles/Pages/Main/ChartBlock/ChartBlock.scss";

type ChartBlockProps = {
  transactionsData: ReturnType<typeof useGetTransaction>;
  categoriesData: ReturnType<typeof useGetCategories>;
  billsData: ReturnType<typeof useGetBill>;
};

const ChartBlock: React.FunctionComponent<ChartBlockProps> = ({
  transactionsData,
  categoriesData,
  billsData,
}) => {
  const [chartMode, setChartMode] = useState<ChartMode>(ChartMode.INCOME);

  const handleChartModeClick = () =>
    setChartMode(
      chartMode === ChartMode.INCOME ? ChartMode.EXPENSES : ChartMode.INCOME
    );

  const chartData = useMemo(
    () =>
      calculateCategoriesBudget(
        transactionsData.transactions.map((t) => t.transactions).flat(1),
        chartMode === ChartMode.INCOME ? "income" : "expenses"
      ),
    [chartMode, transactionsData.transactions]
  );

  return (
    <div className="chart-block">
      <Load
        {...{ load: transactionsData.load }}
        className="chart-block-history"
      >
        {transactionsData.transactions.length > 0 ? (
          <ChartBlockHistory
            billsData={billsData}
            transactions={transactionsData.transactions}
            selectedBill={transactionsData.bill}
            billType={transactionsData.billType}
            updateTransactions={transactionsData.updateTransactions}
            categoriesData={categoriesData}
            updateBills={billsData.updateBill}
          />
        ) : (
          <div className="transaction-history-isEmpty">
            <Image
              src={TransactionsIcon}
              alt="Transactions"
              frame={{ width: 100, height: 100 }}
            />
          </div>
        )}
      </Load>
      <Load {...{ load: transactionsData.load }} className="chart-block__load">
        <DonutChartBlock
          data={chartData}
          nextMonth={transactionsData.date.nextMonth}
          prevMonth={transactionsData.date.prevMonth}
          selectedDate={transactionsData.date.date}
          setStartDate={transactionsData.date.setStart}
          setEndDate={transactionsData.date.setEnd}
          income={transactionsData.income}
          expenses={transactionsData.expenses}
          isLastMonth={transactionsData.isLastMonth}
          mode={chartMode}
        />
        <button onClick={handleChartModeClick} className="button-primary">
          Показать {chartMode === ChartMode.INCOME ? "расходы" : "доходы"}
        </button>
      </Load>
    </div>
  );
};

export default ChartBlock;

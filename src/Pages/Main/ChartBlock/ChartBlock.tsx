import React from "react";
import DonutChartBlock from "./DonutChartBlock/DonutChartBlock";
import ChartBlockHistory from "./ChartBlockHistory/ChartBlockHistory";
import "Styles/Pages/Main/ChartBlock/ChartBlock.scss";
import Load from "Components/Load/Load";
import { UseTransactionParams } from "Services/Transaction";
import TransactionsIcon from "Static/icons/transaction.svg";
import Image from "Components/Image/Image";
import { UseGetCategoryType } from "Services/Category";

interface Props {
  transaction: UseTransactionParams;
  categories: UseGetCategoryType;
}

const ChartBlock: React.FunctionComponent<Props> = (props: Props) => {
  const { transaction, categories } = props;
  return (
    <div className="chart-block">
      <Load {...{ load: transaction.load }} className="chart-block-history">
        {transaction.transactions.length > 0 ? (
          <ChartBlockHistory
            transactions={transaction.transactions}
            selectedBill={transaction.bill}
            billType={transaction.billType}
            updateTransactions={transaction.updateTransactions}
            categories={categories}
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
      <Load {...{ load: transaction.load }}>
        <DonutChartBlock
          data={transaction.prices}
          nextMonth={transaction.date.nextMonth}
          prevMonth={transaction.date.prevMonth}
          selectedDate={transaction.date.date}
          setStartDate={transaction.date.setStart}
          setEndDate={transaction.date.setEnd}
          income={transaction.income}
          expenses={transaction.expenses}
          isLastMonth={transaction.isLastMonth}
        />
      </Load>
    </div>
  );
};

export default ChartBlock;

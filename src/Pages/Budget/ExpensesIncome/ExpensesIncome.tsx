import React, { useMemo } from "react";
import NumberWithSpaces from "../../../Utils/NumberWithSpaces";
import CircleChart from "../../../Components/CircleChart/CircleChart";

interface ExpensesIncomeProps {
  type: "income" | "expenses";
  value: number;
  limit: number;
}

const ExpensesIncome: React.FC<ExpensesIncomeProps> = ({
  type,
  value,
  limit,
}) => {
  const percents = useMemo(() => {
    if (limit <= 0) return 100;
    const percents = Number(Math.floor((100 * value) / limit).toFixed(0));
    return percents > 100 ? 100 : percents;
  }, [value, limit]);

  return (
    <React.Fragment>
      <div className="expense-income-card expense-income-wrapper">
        <div className="expense-income-card-content">
          <span>{type === "income" ? "Доход" : "Расход"}</span>
          <span className="expense-income-card-content-title">Сейчас</span>
          <span>{NumberWithSpaces(value)} ₽</span>
          <span className="expense-income-card-content-title">
            Запланировано
          </span>
          <span>{NumberWithSpaces(limit)} ₽</span>
        </div>
        <div className="expense-income-card-bar">
          <CircleChart
            strokeDashoffset={100 - percents}
            color={type === "expenses" ? "#F0187B" : "#6A82FB"}
          />
          <div className="expense-income-card-bar-value">{percents}%</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ExpensesIncome;

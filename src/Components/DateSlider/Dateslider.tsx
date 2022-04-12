import React from "react";

import PervIcon from "../../Static/icons/prev.svg";
import NextIcon from "../../Static/icons/next.svg";
import Transaction from "Services/Transaction";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";
const Dateslider = () => {
  const { useGetBudget } = Transaction;
  const { selectedMonth, expenses, prev, next } = useGetBudget();
  return (
    <div className="expense-income-header-date expense-income-wrapper">
      <span onClick={prev}>
        <img src={PervIcon} alt="" />
      </span>
      <span>{selectedMonth}</span>
      <span onClick={next}>
        <img src={NextIcon} alt="" />
      </span>
    </div>
  );
};

export default Dateslider;

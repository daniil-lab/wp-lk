import React, { FC } from "react";
import PervIcon from "../../Static/icons/prev.svg";
import NextIcon from "../../Static/icons/next.svg";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";

interface IDatesSlider {
  prev: () => void;
  next: () => void;
  selectedDate: string;
}

const Dateslider: FC<IDatesSlider> = ({ prev, next, selectedDate }) => {
  return (
    <div className="expense-income-header-date expense-income-wrapper">
      <span onClick={prev}>
        <img src={PervIcon} alt="" />
      </span>
      <span>{selectedDate}</span>
      <span onClick={next}>
        <img src={NextIcon} alt="" />
      </span>
    </div>
  );
};

export default Dateslider;

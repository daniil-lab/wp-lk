import CircleChart from "Components/CircleChart/CircleChart";
import Dateslider from "Components/DateSlider/Dateslider";
import LineChart from "Components/LineChart/LineChart";
import Load from "Components/Load/Load";
import React from "react";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";
import { API_URL } from "Utils/Config";
import useCircleChart from "Utils/Hooks/useCircleChart";
import Catigories, { ICategory } from "../../../Services/Category";

interface Props {
  selectedCategory: ICategory;
  setCategody: React.Dispatch<React.SetStateAction<ICategory>>;
  expenses: number;
  income: number;
  prev: () => void;
  next: () => void;
  selectedDate: string;
}

const ExpenseIncomeBlock: React.FunctionComponent<Props> = ({
  selectedCategory,
  setCategody,
  income,
  prev,
  next,
  expenses,
  selectedDate,
}) => {
  const { load, categories } = Catigories.useGetCategory();

  const expenseCircle = useCircleChart(
    expenses / selectedCategory?.categoryLimit
  );
  const incomeCircle = useCircleChart(income / selectedCategory?.categoryLimit);
  return (
    <div className="expense-income-block">
      <div className="expense-income-info">
        <Dateslider prev={prev} next={next} selectedDate={selectedDate} />
        <div className="expense-income-card expense-income-wrapper">
          <div className="expense-income-card-content">
            <span>Расход</span>
            <span className="expense-income-card-content-title">Сейчас</span>
            <span>{expenses} ₽</span>
            <span className="expense-income-card-content-title">
              Запланировано
            </span>
            <span>{selectedCategory?.categoryLimit} ₽</span>
          </div>
          <div className="expense-income-card-bar">
            <CircleChart
              strokeDashoffset={
                expenseCircle.strokeDashOffsetValue <= 0
                  ? 0
                  : expenseCircle.strokeDashOffsetValue
              }
              color="#F0187B"
            />
            <div className="expense-income-card-bar-value">
              {expenses / selectedCategory?.categoryLimit <= 100 || 0} %
            </div>
          </div>
        </div>
        <div className="expense-income-card expense-income-wrapper">
          <div className="expense-income-card-content">
            <span>Доход</span>
            <span className="expense-income-card-content-title">Сейчас</span>
            <span>{income} ₽</span>
            <span className="expense-income-card-content-title">
              Запланировано
            </span>
            <span>{selectedCategory?.categoryLimit} ₽</span>
          </div>
          <div className="expense-income-card-bar">
            <CircleChart
              strokeDashoffset={
                incomeCircle.strokeDashOffsetValue <= 0
                  ? 0
                  : incomeCircle.strokeDashOffsetValue
              }
              color="#6A82FB"
            />
            <div className="expense-income-card-bar-value">
              {income / selectedCategory?.categoryLimit <= 100 || 0} %
            </div>
          </div>
        </div>
      </div>
      <Load load={load}>
        <div className="expense-income-history expense-income-wrapper">
          {categories.map((data, i) => {
            return (
              <div
                key={i}
                className="expense-income-history-row"
                onClick={() => {
                  setCategody(data);
                }}
              >
                <div className="expense-income-history-icon-wrapper">
                  <div
                    className="expense-income-history-icon"
                    style={{
                      backgroundColor: data.color.hex,
                    }}
                  >
                    <img
                      src={`${API_URL}api/v1/image/content/${data.icon.name}`}
                      alt=""
                    />
                  </div>
                </div>
                <div className="expense-income-history-row-info">
                  <div>
                    <span className="expense-income-history-row-info-title">
                      {data.name}
                    </span>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.86743 2.22083C5.1954 1.83116 5.8046 1.83116 6.13257 2.22083L10.311 7.18524C10.7522 7.70932 10.3717 8.50001 9.67846 8.50001H1.32154C0.628273 8.50001 0.247849 7.70932 0.688962 7.18523L4.86743 2.22083Z"
                        fill="#6A82FB"
                      />
                    </svg>
                  </div>
                  <span className="expense-income-history-row-info-amount">
                    {data?.user?.plannedIncome} из {data?.categoryLimit} ₽
                  </span>
                  <LineChart
                    value={
                      data?.user?.plannedIncome / (data?.categoryLimit || 1)
                    }
                    color="#6A82FB"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Load>
    </div>
  );
};

export default ExpenseIncomeBlock;

import CircleChart from "Components/CircleChart/CircleChart";
import Dateslider from "Components/DateSlider/Dateslider";
import LineChart from "Components/LineChart/LineChart";
import Load from "Components/Load/Load";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";
import { API_URL } from "Utils/Config";
import useCircleChart from "Utils/Hooks/useCircleChart";
import Catigories, { ICategory } from "../../../Services/Category";

interface Props {
  selectedCategory: ICategory | null;
  setCategody: React.Dispatch<React.SetStateAction<ICategory | null>>;
  expenses: number;
  income: number;
  prev: () => void;
  next: () => void;
  selectedDate: string;
  load: boolean;
}

const ExpenseIncomeBlock: React.FunctionComponent<Props> = ({
  selectedCategory,
  setCategody,
  income,
  prev,
  next,
  expenses,
  selectedDate,
  load,
}) => {
  const { categories } = Catigories.useGetCategory();

  const [categoryLimit, setCategoryLimit] = useState<number>(0);

  useMemo(() => {
    if (selectedCategory) {
      if (selectedCategory.categoryLimit != 0)
        setCategoryLimit(selectedCategory.categoryLimit);
    }
  }, [selectedCategory]);

  const dispatch = useDispatch();

  const setLimit = async () => {
    const limit = categoryLimit;

    if (limit < 0 || limit > 1000000) {
      dispatch(
        ShowToast({
          type: "error",
          title: "Ошибка",
          text: "Неверный лимит",
        })
      );

      return;
    }
    if (selectedCategory) {
      await Catigories.setCategoryLimit(selectedCategory.id, dispatch, limit);
      window.location.reload();
    }
  };

  const getPercentsFromLimit = useMemo(() => {
    if (selectedCategory?.percentsFromLimit) {
      return selectedCategory?.percentsFromLimit < 100
        ? selectedCategory?.percentsFromLimit
        : 100;
    } else {
      return 100;
    }
  }, [selectedCategory?.percentsFromLimit]);

  return (
    <div className="expense-income-block">
      <div className="expense-income-info">
        <Load {...{ load }}>
          <Dateslider prev={prev} next={next} selectedDate={selectedDate} />
          {!selectedCategory?.onlyForEarn && (
            <div className="expense-income-card expense-income-wrapper">
              <div className="expense-income-card-content">
                <span>Расход</span>
                <span className="expense-income-card-content-title">
                  Сейчас
                </span>
                <span>{selectedCategory?.categorySpend ?? 0} ₽</span>
                <span className="expense-income-card-content-title">
                  Запланировано
                </span>
                <span>{selectedCategory?.categoryLimit ?? 0} ₽</span>
              </div>
              <div className="expense-income-card-bar">
                <CircleChart
                  strokeDashoffset={100 - getPercentsFromLimit}
                  color="#F0187B"
                />
                <div className="expense-income-card-bar-value">
                  {selectedCategory?.percentsFromLimit
                    ? `${Math.round(selectedCategory.percentsFromLimit)}%`
                    : "0%"}
                </div>
              </div>
            </div>
          )}
          {selectedCategory?.onlyForEarn && (
            <div className="expense-income-card expense-income-wrapper">
              <div className="expense-income-card-content">
                <span>Доход</span>
                <span className="expense-income-card-content-title">
                  Сейчас
                </span>
                <span>{income} ₽</span>
                <span className="expense-income-card-content-title">
                  Запланировано
                </span>
                <span>{selectedCategory?.categoryLimit} ₽</span>
              </div>
              <div className="expense-income-card-bar">
                <CircleChart
                  strokeDashoffset={100 - getPercentsFromLimit}
                  color="#6A82FB"
                />
                <div className="expense-income-card-bar-value">
                  {selectedCategory?.percentsFromLimit}%
                </div>
              </div>
            </div>
          )}

          {!selectedCategory?.onlyForEarn && (
            <>
              <div className="add-operation-modal-block">
                <span className="add-operation-modal-block-title">
                  Управление лимитом для категории
                </span>
                <input
                  type="number"
                  value={categoryLimit}
                  onChange={(e) => setCategoryLimit(e.currentTarget.value)}
                  placeholder="Установить лимит на категорию"
                  className="add-operation-modal-input"
                />
              </div>

              <button
                onClick={setLimit}
                style={{
                  width: "100%",
                }}
                className="button-primary"
                type="submit"
              >
                Установить
              </button>
            </>
          )}
        </Load>
      </div>
      <Load {...{ load }}>
        <div className="expense-income-history expense-income-wrapper">
          {categories
            .sort((a, b) => b.categorySpend - a.categorySpend)
            .map((data, i) => {
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
                      {data?.categorySpend ?? 0} из {data?.categoryLimit ?? 0} ₽
                    </span>
                    <LineChart
                      value={data?.percentsFromLimit ?? 0}
                      color={
                        (data?.percentsFromLimit ?? 0) < 100 ? "#6A82FB" : "red"
                      }
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

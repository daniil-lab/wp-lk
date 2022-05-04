import CircleChart from "Components/CircleChart/CircleChart";
import Dateslider from "Components/DateSlider/Dateslider";
import LineChart from "Components/LineChart/LineChart";
import Load from "Components/Load/Load";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";
import { API_URL } from "Utils/Config";
import useCircleChart from "Utils/Hooks/useCircleChart";
import Catigories, { ICategory } from "../../../Services/Category";

interface Props {
  prev: () => void;
  next: () => void;
  selectedCategory: ICategory;
  selectedDate: string;
  load: boolean;
  categories: ICategory[];
  selectCategory: React.Dispatch<React.SetStateAction<ICategory | null>>;
  setCategoryLimit: (
    categoryId: string,
    dispatch: AppDispatch,
    categoryLimit: number
  ) => Promise<void>;
  updateCategories: () => void;
  percentsFromLimit: number;
}

const ExpenseIncomeBlock: React.FunctionComponent<Props> = (props: Props) => {
  const {
    prev,
    next,
    selectedCategory,
    selectedDate,
    load,
    categories,
    selectCategory,
    updateCategories,
    percentsFromLimit,
  } = props;
  const dispatch = useDispatch<AppDispatch>();

  const [categoryLimit, setCategoryLimit] = useState<number>(0);
  useMemo(() => {
    if (selectedCategory.categoryLimit != 0)
      setCategoryLimit(selectedCategory.categoryLimit);
  }, [selectedCategory]);

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
      updateCategories();
      setCategoryLimit(selectedCategory.categoryLimit);
    }
  };

  return (
    <div className="expense-income-block">
      <div className="expense-income-info">
        <Load {...{ load }}>
          <Dateslider prev={prev} next={next} selectedDate={selectedDate} />
          <div className="expense-income-card expense-income-wrapper">
            <div className="expense-income-card-content">
              <span>Расход</span>
              <span className="expense-income-card-content-title">Сейчас</span>
              <span>{selectedCategory.categorySpend} ₽</span>
              <span className="expense-income-card-content-title">
                Запланировано
              </span>
              <span>{selectedCategory.categoryLimit} ₽</span>
            </div>
            <div className="expense-income-card-bar">
              <CircleChart
                strokeDashoffset={100 - percentsFromLimit}
                color="#F0187B"
              />
              <div className="expense-income-card-bar-value">
                {selectedCategory.percentsFromLimit.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="add-operation-modal-block">
            <span className="add-operation-modal-block-title">
              Управление лимитом для категории
            </span>
            <input
              type="number"
              value={categoryLimit}
              onChange={(e) => setCategoryLimit(e.target.value)}
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
        </Load>
      </div>
      <Load {...{ load }}>
        <div className="expense-income-history expense-income-wrapper">
          {categories
            .filter((c) => !c.onlyForEarn)
            .sort((a, b) => b.categorySpend - a.categorySpend)
            .map((data, i) => {
              return (
                <div
                  key={i}
                  className={`expense-income-history-row ${
                    selectedCategory.id === data.id &&
                    "expense-income-history-row-active"
                  }`}
                  onClick={() => {
                    selectCategory(data);
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
                        style={{ marginRight: 5 }}
                      >
                        <path
                          d="M4.86743 8.20775C5.1954 8.59742 5.8046 8.59742 6.13257 8.20775L10.311 3.24335C10.7522 2.71926 10.3717 1.92857 9.67846 1.92857H1.32154C0.628273 1.92857 0.247849 2.71926 0.688962 3.24335L4.86743 8.20775Z"
                          fill="#F0187B"
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

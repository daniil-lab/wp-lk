import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Dateslider from "Components/DateSlider/Dateslider";
import Load from "Components/Load/Load";
import { CategoryModel } from "Models/CategoryModel";
import { ChangeUserPlans, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import CategoriesEmpty from "Static/icons/categories-empty.svg";
import Image from "Components/Image/Image";
import { GeneralBudgetType } from "Utils/CreateBudget";
import UserRepository from "../../../Repository/UserRepository";
import {
  GetUserPlannedEarn,
  GetUserPlannedSpend,
} from "../../../Redux/Selectors";
import ExpensesIncome from "../ExpensesIncome/ExpensesIncome";
import CategoryItem from "../CategoryItem/CategoryItem";
import { CategoryBudgetType } from "../../../Utils/calculateCategoriesBudget";

import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";

const userRepository = new UserRepository();

interface ExpenseIncomeBlockProps {
  prev: () => void;
  next: () => void;
  selectedCategory: CategoryModel | null;
  selectedDate: string;
  load: boolean;
  categories: CategoryModel[];
  selectCategory: React.Dispatch<React.SetStateAction<CategoryModel | null>>;
  generalBudget: GeneralBudgetType;
  categoriesBudget: CategoryBudgetType[];
}

const ExpenseIncomeBlock: React.FC<ExpenseIncomeBlockProps> = ({
  prev,
  next,
  selectedCategory,
  selectedDate,
  load,
  categories,
  selectCategory,
  generalBudget,
  categoriesBudget,
}) => {
  const [plannedBudget, setPlannedBudget] = useState({
    plannedEarn: 0,
    plannedSpend: 0,
  });
  const [isChangingBudgetPlans, setChangingBudgetPlans] = useState(false);

  const plannedSpend = useSelector(GetUserPlannedSpend);
  const plannedEarn = useSelector(GetUserPlannedEarn);

  const dispatch = useDispatch<AppDispatch>();

  const calculatedSpendCategories = useMemo(
    () =>
      categories.map((categoryModel) => {
        const foundCategory = categoriesBudget.find(
          (category) => category.id === categoryModel.id
        );
        return {
          category: categoryModel,
          sum: foundCategory ? foundCategory.sum : 0,
        };
      }),
    [categories, categoriesBudget]
  );

  const changePlannedBudget = async () => {
    if (isChangingBudgetPlans) return;

    try {
      setChangingBudgetPlans(true);
      if (
        plannedSpend < 0 ||
        plannedSpend > 1000000 ||
        plannedEarn < 0 ||
        plannedEarn > 1000000
      ) {
        dispatch(
          ShowToast({
            type: "error",
            title: "Ошибка",
            text: "Неверный бюджет",
          })
        );

        return;
      }

      await userRepository.changeUserPlans(plannedBudget);
      dispatch(ChangeUserPlans(plannedBudget));
    } catch (error) {
      dispatch(
        ShowToast({
          type: "error",
          title: "Ошибка",
          text: "Не удалось изменить данные бюджета",
        })
      );
      setPlannedBudget({ plannedEarn, plannedSpend });
    } finally {
      setChangingBudgetPlans(false);
    }
  };

  useEffect(() => {
    setPlannedBudget({ plannedSpend, plannedEarn });
  }, [plannedSpend, plannedEarn]);

  return (
    <div className="expense-income-block">
      <div className="expense-income-info">
        <Load {...{ load }}>
          <Dateslider prev={prev} next={next} selectedDate={selectedDate} />
          <ExpensesIncome
            type="expenses"
            value={generalBudget.expenses}
            limit={plannedSpend}
          />
          <ExpensesIncome
            type="income"
            value={generalBudget.income}
            limit={plannedEarn}
          />

          <div className="add-operation-modal-block">
            <span className="add-operation-modal-block-title">
              Управление запланированным расходом
            </span>
            <input
              type="number"
              value={plannedBudget.plannedSpend}
              onChange={(e) =>
                setPlannedBudget({
                  ...plannedBudget,
                  plannedSpend: parseInt(e.target.value),
                })
              }
              placeholder="Установить запланированный расход"
              className="add-operation-modal-input"
            />
          </div>

          <div className="add-operation-modal-block">
            <span className="add-operation-modal-block-title">
              Управление запланированным доходом
            </span>
            <input
              type="number"
              value={plannedBudget.plannedEarn}
              onChange={(e) =>
                setPlannedBudget({
                  ...plannedBudget,
                  plannedEarn: parseInt(e.target.value),
                })
              }
              placeholder="Установить запланировнный доход"
              className="add-operation-modal-input"
            />
          </div>

          <button
            onClick={changePlannedBudget}
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
        <div
          className={`expense-income-history expense-income-wrapper ${
            categories.length === 0 && "categories-empty"
          }`}
        >
          {categories.length === 0 ? (
            <Image
              src={CategoriesEmpty}
              alt="Transactions"
              frame={{ width: 100, height: 100 }}
            />
          ) : (
            calculatedSpendCategories
              .sort(
                (a, b) => b.category.categorySpend - a.category.categorySpend
              )
              .map((data, i) => {
                return (
                  <CategoryItem
                    key={i}
                    selectedCategory={selectedCategory}
                    selectCategory={selectCategory}
                    data={data}
                  />
                );
              })
          )}
        </div>
      </Load>
    </div>
  );
};

export default ExpenseIncomeBlock;

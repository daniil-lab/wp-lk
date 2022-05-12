import CircleChart from "Components/CircleChart/CircleChart";
import Dateslider from "Components/DateSlider/Dateslider";
import LineChart from "Components/LineChart/LineChart";
import Load from "Components/Load/Load";
import { CategoryModel } from "Models/CategoryModel";
import { TransactionsSortedModel } from "Models/TransactionModel";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import { GeneralBudget } from "Services/Budget/Models";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";
import { API_URL } from "Utils/Config";
import CategoriesEmpty from "Static/icons/categories-empty.svg";
import Image from "Components/Image/Image";
import NumberWithSpaces from "Utils/NumberWithSpaces";
import { GeneralBudgetType } from "Utils/CreateBudget";

interface Props {
  prev: () => void;
  next: () => void;
  selectedCategory: CategoryModel | null;
  selectedDate: string;
  load: boolean;
  categories: CategoryModel[];
  selectCategory: React.Dispatch<React.SetStateAction<CategoryModel | null>>;
  updateCategoryLimit: (config) => Promise<void>;
  updateCategories: () => void;
  getIncomeCategory: (id: string) => number;
  generalBudget: GeneralBudgetType;
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
    updateCategoryLimit,
    getIncomeCategory,
    generalBudget,
  } = props;
  const dispatch = useDispatch<AppDispatch>();

  const [categoryLimit, setCategoryLimit] = useState<number>(0);
  useMemo(() => {
    if (selectedCategory) {
      if (selectedCategory.categoryLimit != 0)
        setCategoryLimit(selectedCategory.categoryLimit);
    }
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
      await updateCategoryLimit({
        categoryId: selectedCategory.id,
        categoryLimit: limit,
      });
      updateCategories();
      setCategoryLimit(selectedCategory.categoryLimit);
    }
  };

  return (
    <div className="expense-income-block">
      <div className="expense-income-info">
        <Load {...{ load }}>
          <Dateslider prev={prev} next={next} selectedDate={selectedDate} />
          <ExpensesIncome
            type="expenses"
            value={generalBudget.expenses}
            limit={generalBudget.expensesLimit}
          />
          <ExpensesIncome
            type="income"
            value={generalBudget.income}
            limit={generalBudget.incomeLimit}
          />
          <div className="add-operation-modal-block">
            <span className="add-operation-modal-block-title">
              Управление лимитом для категории
            </span>
            <input
              type="number"
              value={categoryLimit}
              onChange={(e) => setCategoryLimit(parseInt(e.target.value))}
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
            categories
              .sort((a, b) => b.categorySpend - a.categorySpend)
              .map((data, i) => {
                console.log(data);
                return (
                  <CategoryItem
                    key={i}
                    selectedCategory={selectedCategory}
                    selectCategory={selectCategory}
                    data={data}
                    getIncomeCategory={getIncomeCategory}
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

interface CategoryItemProps {
  selectedCategory: CategoryModel;
  selectCategory: (data: CategoryModel) => void;
  data: CategoryModel;
}

const CategoryItem = (props: CategoryItemProps) => {
  const { selectedCategory, selectCategory, data } = props;
  const getCurrentAmount = (): number => {
    let res = 0;
    if (data.forEarn) res = res + data.categoryEarn;
    if (data.forSpend) res = res + data.categorySpend;
    return res;
  };
  return (
    <div
      className={`expense-income-history-row ${
        selectedCategory.id === data.id && "expense-income-history-row-active"
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
          {data.forSpend && (
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
          )}

          {data.forEarn && (
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
          )}
        </div>
        <React.Fragment>
          <span className="expense-income-history-row-info-amount">
            {NumberWithSpaces(getCurrentAmount())} из{" "}
            {NumberWithSpaces(data?.categoryLimit ?? 0)} ₽
          </span>
          <LineChart
            value={data?.percentsFromLimit ?? 0}
            color={(data?.percentsFromLimit ?? 0) < 100 ? "#6A82FB" : "red"}
          />
        </React.Fragment>
        {/* {!data.forEarn && (
          
        ) : (
          <React.Fragment>
            <span className="expense-income-history-row-info-amount">
              {getIncomeCategory(data.id)} из {data?.categoryLimit ?? 0} ₽
            </span>
            <LineChart
              value={data?.percentsFromLimit ?? 0}
              color={(data?.percentsFromLimit ?? 0) < 100 ? "#6A82FB" : "red"}
            />
          </React.Fragment>
        )} */}
      </div>
    </div>
  );
};

interface ExpensesBlockProps {
  type: "income" | "expenses";
  value: number;
  limit: number;
}
export const ExpensesIncome = (props: ExpensesBlockProps) => {
  const { type, value, limit } = props;
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
            strokeDashoffset={
              100 -
              (isNaN(Math.floor((value / limit) * 100))
                ? 0
                : Math.floor((value / limit) * 100))
            }
            color={type === "expenses" ? "#F0187B" : "#6A82FB"}
          />
          <div className="expense-income-card-bar-value">
            {isNaN(Math.floor((value / limit) * 100))
              ? 0
              : ((value / limit) * 100).toFixed(1)}
            %
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const c = {
  id: "a4d410d6-52b0-4897-9ed2-d8cfdd19689d",
  name: "Инвестиции",
  color: { name: "Желтый", hex: "#FAC91D", systemName: "YELLOW" },
  icon: {
    id: "9bf5e5e6-c4d4-44bc-95b6-180076f15dbc",
    name: "2022-03-14T08:50:00.126102201Z-e8d17a47-9ea9-4a83-aa2b-1aea3840f4d2.svg",
    path: "images/2022-03-14T08:50:00.126102201Z-e8d17a47-9ea9-4a83-aa2b-1aea3840f4d2.svg",
    tag: "CATEGORY_ICON",
  },
  description: "description",
  categoryLimit: 50000,
  user: {
    id: "56c64a3c-690e-41aa-b95f-28d1f126ad7c",
    username: "+79962193990",
    role: {
      id: "5a255c7a-d014-4673-b0cf-87ec60bb9928",
      name: "LiteRole",
      autoApply: true,
      roleAfterBuy: false,
      roleAfterBuyExpiration: false,
      roleForBlocked: false,
      admin: false,
    },
    email: { address: "t@t.ru", activated: false },
    type: "SYSTEM",
    walletType: "INR",
    touchID: true,
    faceID: false,
    pinCode: null,
    plannedIncome: 0,
    notificationsEnable: true,
    createAt: "2022-05-11T09:26:29.508064Z",
  },
  forEarn: true,
  forSpend: true,
  percentsFromLimit: 30,
  categorySpend: 15000,
  categoryEarn: 0,
};

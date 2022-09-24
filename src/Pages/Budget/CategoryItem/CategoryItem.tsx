import React, { useMemo } from "react";
import { CategoryModel } from "../../../Models/CategoryModel";
import { API_URL } from "../../../Utils/Config";
import NumberWithSpaces from "../../../Utils/NumberWithSpaces";
import LineChart from "../../../Components/LineChart/LineChart";

interface CategoryItemProps {
  selectedCategory: CategoryModel | null;
  selectCategory: (data: CategoryModel) => void;
  data: {
    category: CategoryModel;
    sum: number;
  };
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  data: { category, sum },
  selectCategory,
  selectedCategory,
}) => {
  const percentsFromStatistic = useMemo(() => {
    if (category.spendStatistic === 0) return 100;
    const percents = Number(((100 * sum) / category.spendStatistic).toFixed(0));
    return percents > 100 ? 100 : percents;
  }, [category]);

  return (
    <div
      className={`expense-income-history-row ${
        selectedCategory?.id === category.id &&
        "expense-income-history-row-active"
      }`}
      onClick={() => {
        selectCategory(category);
      }}
    >
      <div className="expense-income-history-icon-wrapper">
        <div
          className="expense-income-history-icon"
          style={{
            backgroundColor: category.color.hex,
          }}
        >
          <img
            src={`${API_URL}api/v1/image/content/${category.icon.name}`}
            alt=""
          />
        </div>
      </div>
      <div className="expense-income-history-row-info">
        <div>
          <span className="expense-income-history-row-info-title">
            {category.name}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {category.forSpend && (
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

            {category.forEarn && (
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
        </div>
        <React.Fragment>
          <span className="expense-income-history-row-info-amount">
            {NumberWithSpaces(sum)} из{" "}
            {NumberWithSpaces(category.spendStatistic ?? 0)} ₽
          </span>
          <LineChart
            value={percentsFromStatistic}
            color={percentsFromStatistic < 100 ? "#6A82FB" : "red"}
          />
        </React.Fragment>
      </div>
    </div>
  );
};

export default CategoryItem;

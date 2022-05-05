import Checkmark from "Components/Checkmark/Checkmark";
import { ColorType, IconType } from "Models/CategoryModel";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserId } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import useAddCategory from "Services/Category/useAddCategory";
import "Styles/Pages/Main/CategoryBlock/CategoryConstructor/CategoryConstructor.scss";
import { API_URL } from "Utils/Config";
import ColorsBlock from "./ColorsBlock/ColorsBlock";
import IconsBlock from "./IconsBlock/IconsBlock";

interface Props {
  close: () => void;
  updateCategory: () => void;
}

export type CategoryType = {
  color: ColorType | null;
  icon: IconType | null;
  name: string;
  onlyForEarn: boolean;
  expenses: string;
};

const CategoryConstructor: React.FunctionComponent<Props> = (props: Props) => {
  const userId = useSelector(GetUserId);
  const [category, setCategory] = useState<CategoryType>({
    icon: null,
    color: null,
    name: "",
    onlyForEarn: false,
    expenses: "0",
  });

  const addCategory = useAddCategory({ params: category, userId: userId! });

  const setIcon = (icon: IconType): void => setCategory({ ...category, icon });

  const setColor = (color: ColorType): void =>
    setCategory({ ...category, color });

  const handleStoreCategory = async () => {
    await addCategory();
    props.updateCategory();
    props.close();
  };

  return (
    <div className="category-constructor">
      <div className="category-constructor-selected">
        <div
          style={{
            backgroundColor: category.color
              ? category.color.hex
              : "rgb(223, 223, 223)",
          }}
        >
          {category.icon && (
            <img src={`${API_URL}api/v1/image/content/${category.icon.name}`} />
          )}
        </div>
        <input
          type="text"
          placeholder="Название"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
        />
      </div>
      <div className="category-constructor-row">
        <span>Иконка</span>
        <IconsBlock onIconChange={setIcon} icon={category.icon} />
      </div>
      <div className="category-constructor-row">
        <span>Цвет</span>
        <ColorsBlock onColorChange={setColor} color={category.color} />
      </div>
      <Checkbox
        value={category.onlyForEarn}
        onChange={(e) =>
          setCategory({
            ...category,
            onlyForEarn: !category.onlyForEarn,
          })
        }
      />

      <input
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}
        type="number"
        placeholder="Запланированный расход"
        value={category.expenses}
        onChange={(e) => {
          setCategory({
            ...category,
            expenses: e.target.value,
          });
        }}
      />
      <div className="category-constructor-controll">
        <button className="button-primary" onClick={handleStoreCategory}>
          Добавить
        </button>
        <button className="button-secondary" onClick={props.close}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default CategoryConstructor;

const Checkbox = ({ value, onChange }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
      onClick={onChange}
    >
      <div
        style={{
          width: 25,
          height: 25,
          borderRadius: 50,
          background: "#eaeaea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        {value && (
          <div
            style={{
              width: 17,
              height: 17,
              borderRadius: 50,
              background: "#f0187b",
            }}
          />
        )}
      </div>
      <span style={{ color: "#383838" }}>Только для доходов</span>
    </div>
  );
};

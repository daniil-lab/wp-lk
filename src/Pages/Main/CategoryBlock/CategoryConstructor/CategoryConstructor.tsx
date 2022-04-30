import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserId } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import Category from "Services/Category";
import { ColorType, IconType } from "Services/Interfaces";
import "Styles/Pages/Main/CategoryBlock/CategoryConstructor/CategoryConstructor.scss";
import { API_URL } from "Utils/Config";
import ColorsBlock from "./ColorsBlock/ColorsBlock";
import IconsBlock from "./IconsBlock/IconsBlock";

interface Props {
  close: () => void;
}

export type CategoryType = {
  color: ColorType | null;
  icon: IconType | null;
  name: string;
  onlyForEarn: boolean;
};

const CategoryConstructor: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(GetUserId);

  const { addCategory } = Category;

  const [category, setCategory] = useState<CategoryType>({
    icon: null,
    color: null,
    name: "",
    onlyForEarn: false
  });

  const setIcon = (icon: IconType): void => setCategory({ ...category, icon });

  const setColor = (color: ColorType): void =>
    setCategory({ ...category, color });

  const handleStoreCategory = async () => {
    const isAdded = await addCategory(category, userId!, dispatch);
    isAdded && props.close();
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
      <div className="category-constructor-row">
        <label className="checkbox">
          <input
            style={{
              marginRight: 10
            }}
            type="radio"
            name="radio"
            checked={category.onlyForEarn}
            onChange={(e) => setCategory({
              ...category,
              onlyForEarn: !category.onlyForEarn
            })}
          />
          <span>Только для доходов</span>
        </label>
      </div>
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

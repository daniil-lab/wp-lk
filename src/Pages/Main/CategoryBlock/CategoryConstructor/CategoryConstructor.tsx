import Checkbox from "Components/Checkbox/Checkbox";
import Checkmark from "Components/Checkmark/Checkmark";
import useAddCategory from "Hooks/useAddCategory";
import useGetCategoryColors from "Hooks/useGetCategoryColors";
import useGetCategoryIcons from "Hooks/useGetCategoryIcons";
import { ColorType, IconType } from "Models/CategoryModel";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserId } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
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
  forEarn: boolean;
  forSpend: boolean;
  categoryLimit: number;
};

const CategoryConstructor: React.FunctionComponent<Props> = (props: Props) => {
  const userId = useSelector(GetUserId);
  const colors = useGetCategoryColors();
  const icons = useGetCategoryIcons();
  const [category, setCategory] = useState<CategoryType>({
    icon: null,
    color: null,
    name: "",
    forEarn: true,
    forSpend: false,
    categoryLimit: 0,
  });

  const __clearState = (): void => {
    setCategory({
      icon: icons.icons[0],
      color: colors.colors[0],
      name: "",
      forEarn: true,
      forSpend: false,
      categoryLimit: 0,
    });
  };

  const __close = (): void => {
    props.close();
    __clearState();
  };

  const addCategory = useAddCategory({ params: category, userId: userId! });

  const setIcon = (icon: IconType): void => setCategory({ ...category, icon });

  const setColor = (color: ColorType): void =>
    setCategory({ ...category, color });

  useEffect(() => {
    if (colors.load) setColor(colors.colors[0]);
  }, [colors.load]);

  useEffect(() => {
    if (icons.load) setIcon(icons.icons[0]);
  }, [icons.load]);

  const handleStoreCategory = async () => {
    const action = await addCategory();
    if (action) {
      props.updateCategory();
      props.close();
      __clearState();
    }
  };

  if (!colors.load && !icons.load) return null;

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
          style={{
            borderRadius: 15,
          }}
        />
      </div>
      <div className="category-constructor-row">
        <span>Иконка</span>
        <IconsBlock
          icons={icons.icons}
          onIconChange={setIcon}
          icon={category.icon}
        />
      </div>
      <div className="category-constructor-row" style={{ marginBottom: 20 }}>
        <span>Цвет</span>
        <ColorsBlock
          colors={colors.colors}
          onColorChange={setColor}
          color={category.color}
        />
      </div>
      <div
        className="category-constructor-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <Checkbox
          value={category.forEarn}
          onChange={() =>
            setCategory({ ...category, forEarn: !category.forEarn })
          }
          lable="Доходы"
        />
        <Checkbox
          value={category.forSpend}
          onChange={() =>
            setCategory({ ...category, forSpend: !category.forSpend })
          }
          lable="Расходы"
        />
      </div>

      <div className="category-constructor-controll">
        <button className="button-primary" onClick={handleStoreCategory}>
          Добавить
        </button>
        <button className="button-secondary" onClick={__close}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default CategoryConstructor;

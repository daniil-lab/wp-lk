import useGetCategoryColors from "Hooks/useGetCategoryColors";
import useGetCategoryIcons from "Hooks/useGetCategoryIcons";
import { ColorType, IconType } from "Models/CategoryModel";
import React, { useEffect } from "react";
import { API_URL } from "Utils/Config";
import ColorsBlock from "../CategoryConstructor/ColorsBlock/ColorsBlock";
import IconsBlock from "../CategoryConstructor/IconsBlock/IconsBlock";
import "Styles/Pages/Main/CategoryBlock/EditCategory/EditCategory.scss";
import CategoryConstructor from "../CategoryConstructor/CategoryConstructor";
import Checkbox from "Components/Checkbox/Checkbox";

interface Props {
  edit: () => Promise<boolean | undefined>;
  remove: () => Promise<void>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  icon: IconType | null;
  setIcon: React.Dispatch<React.SetStateAction<IconType | null>>;
  color: ColorType | null;
  setColor: React.Dispatch<React.SetStateAction<ColorType | null>>;
  categoryLimit: number;
  setCategoryLimit: React.Dispatch<React.SetStateAction<number>>;
  forEarn: boolean;
  forSpend: boolean;
  setForSpend: React.Dispatch<React.SetStateAction<boolean>>;
  setForEarn: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  updateCategory: () => void;
  clearState: () => void;
}

const EditCategory: React.FunctionComponent<Props> = ({
  edit,
  name,
  setName,
  icon,
  setIcon,
  color,
  setColor,
  categoryLimit,
  setCategoryLimit,
  remove,
  onClose,
  updateCategory,
  clearState,
  forEarn,
  forSpend,
  setForSpend,
  setForEarn,
}: Props) => {
  const colors = useGetCategoryColors();
  const icons = useGetCategoryIcons();

  const __remove = async (): Promise<void> => {
    await remove();
    onClose();
    clearState();
    updateCategory();
  };

  const __editCategory = async (): Promise<void> => {
    const action = await edit();
    if (action) {
      onClose();
      clearState();
      updateCategory();
    } else {
      onClose();
      clearState();
    }
  };

  const __close = (): void => {
    onClose();
    clearState();
  };

  if (!colors.load && !icons.load) return null;

  return (
    <div>
      <h1 className="add-operation-modal-title">Редактирование категории</h1>
      <div
        style={{
          boxShadow: "none",
          padding: 0,
        }}
        className="category-constructor"
      >
        <div className="category-constructor-selected">
          <div
            style={{
              backgroundColor: color ? color.hex : "rgb(223, 223, 223)",
              width: 35,
              height: 35,
            }}
          >
            {icon && (
              <img
                style={{
                  filter: "invert(1)",
                  width: 20,
                  height: 20,
                }}
                src={`${API_URL}api/v1/image/content/${icon.name}`}
              />
            )}
          </div>
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              borderRadius: 15,
            }}
          />
        </div>
        <div className="category-constructor-row">
          <span>Иконка</span>
          <IconsBlock icons={icons.icons} onIconChange={setIcon} icon={icon} />
        </div>
        <div className="category-constructor-row">
          <span>Цвет</span>
          <ColorsBlock
            colors={colors.colors}
            onColorChange={setColor}
            color={color}
          />
        </div>
        <div className="category-constructor-row" style={{ marginBottom: 15 }}>
          <span>Лимит категории</span>
          <input
            type="number"
            placeholder="Лимит категории"
            value={categoryLimit}
            onChange={(e) => setCategoryLimit(parseInt(e.target.value))}
            style={{
              borderRadius: 15,
            }}
          />
        </div>
        <div
          className="category-constructor-row"
          style={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <div style={{ marginRight: 20 }}>
            <Checkbox
              value={forEarn}
              onChange={() => setForEarn(!forEarn)}
              lable="Для доходов"
            />
          </div>
          <div>
            <Checkbox
              value={forSpend}
              onChange={() => setForSpend(!forSpend)}
              lable="Для расходов"
            />
          </div>
        </div>

        <button
          style={{
            marginBottom: 15,
          }}
          className="button-primary"
          onClick={__remove}
        >
          Удалить
        </button>

        <div className="category-constructor-controll">
          <button className="button-secondary" onClick={__close}>
            Отмена
          </button>

          <button
            style={{
              background: "rgb(137, 238, 179)",
            }}
            className="button-primary"
            onClick={__editCategory}
          >
            Изменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;

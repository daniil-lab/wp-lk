import Select from "Components/Select/Select";
import { CategoryModel } from "Models/CategoryModel";
import React from "react";
import { API_URL } from "Utils/Config";
import HexToRgbA from "Utils/HexToRgbA";

interface Props {
  operationType: string | null;
  selectedCategory: CategoryModel | null;
  transactionType: string | null;
  categories: CategoryModel[];
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<CategoryModel | null>
  >;
  onClose: () => void;
  edit: () => Promise<boolean | undefined>;
  updateTransactions: () => void;
}

const BankAddCategoryModal: React.FC<Props> = ({
  onClose,
  selectedCategory,
  transactionType,
  categories,
  setSelectedCategory,
  edit,
  updateTransactions,
}: Props) => {
  const _editTransaction = async (): Promise<void> => {
    const res = await edit();
    onClose();
    if (res) updateTransactions();
  };

  if (!transactionType && !selectedCategory && categories.length === 0)
    return null;
  return (
    <div style={{ height: 250 }}>
      <h1 className="add-operation-modal-title">
        Изменить категорию транзакции
      </h1>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div className="add-operation-modal-block">
          <span className="add-operation-modal-block-title">Категория</span>
          <div
            className="add-operation-modal-base-category-container"
            style={{
              width: 350,
            }}
          >
            <React.Fragment>
              <div
                className="image"
                style={{
                  background: `linear-gradient(135deg, ${
                    selectedCategory?.color.hex ?? "#8fe87b"
                  } 0%, ${HexToRgbA(
                    selectedCategory?.color.hex ?? "#8fe87b"
                  )} 100%)`,
                }}
              >
                {selectedCategory != null && (
                  <img
                    src={`${API_URL}api/v1/image/content/${selectedCategory?.icon.name}`}
                    alt="Category base icon"
                  />
                )}
              </div>
              <Select
                value={selectedCategory?.name ?? ""}
                data={categories.map((i) => ({
                  label: i.name,
                }))}
                handler={(index) => setSelectedCategory(categories[index])}
              />
            </React.Fragment>
          </div>
        </div>
        <div className="add-operation-modal-controll">
          <button className="button-secondary" onClick={onClose}>
            Отмена
          </button>
          <button
            className="button-primary"
            style={{
              background: "rgb(137, 238, 179)",
            }}
            onClick={_editTransaction}
          >
            Изменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankAddCategoryModal;

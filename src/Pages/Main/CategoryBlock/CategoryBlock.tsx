import Load from "Components/Load/Load";
import Modal from "Components/Modal/Modal";
import { CategoryModel } from "Models/CategoryModel";
import React, { useState } from "react";
import "Styles/Pages/Main/CategoryBlock/CategoryBlock.scss";
import DeleteModal from "../BalanceBlock/DeleteModal/DeleteModal";
import CategoryItem from "./CategoryItem/CategoryItem";
import useRemoveCategory from "Services/Category/useRemoveCategory";
import Image from "Components/Image/Image";
import CategoriesEmpty from "Static/icons/categories-empty.svg";

interface Props {
  categories: CategoryModel[];
  load: boolean;
  updateCategory: () => void;
}

const CategoryBlock: React.FC<Props> = ({
  categories,
  load,
  updateCategory,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const removeCategory = useRemoveCategory({
    categoryId: categoryId!,
  });

  if (!load) {
    return (
      <Load {...{ load }}>
        <span></span>
      </Load>
    );
  }
  return (
    <React.Fragment>
      <div className="category-block">
        <Load
          {...{ load }}
          className={`category-block-wrapper ${
            categories.length === 0 && "categories-empty"
          }`}
        >
          <div
            className={`category-block-wrapper ${
              categories.length === 0 && "categories-empty"
            }`}
          >
            {categories.length === 0 ? (
              <div className="categories-empty">
                <Image
                  src={CategoriesEmpty}
                  alt="Categories"
                  frame={{ width: 100, height: 100 }}
                />
              </div>
            ) : (
              categories.map((category, i) => {
                return (
                  <CategoryItem
                    onlyForEarn={category.onlyForEarn}
                    key={i}
                    icon={category.icon.name}
                    color={category.color.hex}
                    name={category.name}
                    onClick={() => {
                      setShowDeleteModal(true);
                      setCategoryId(category.id);
                    }}
                  />
                );
              })
            )}
          </div>
        </Load>
      </div>
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteModal
          closeModal={() => setShowDeleteModal(false)}
          transactionId={categoryId}
          deleteOp={() => categoryId && removeCategory()}
          updateCategory={updateCategory}
        />
      </Modal>
    </React.Fragment>
  );
};

export default CategoryBlock;

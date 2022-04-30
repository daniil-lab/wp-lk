import Load from "Components/Load/Load";
import Modal from "Components/Modal/Modal";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Category, { ICategory } from "Services/Category";
import "Styles/Pages/Main/CategoryBlock/CategoryBlock.scss";
import DeleteModal from "../BalanceBlock/DeleteModal/DeleteModal";
import CategoryItem from "./CategoryItem/CategoryItem";

interface Props {
  categories: ICategory[];
  load: boolean;
}

const CategoryBlock: React.FC<Props> = ({ categories, load }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { deleteCategory } = Category;
  const dispatch = useDispatch();
  return (
    <Load {...{ load }}>
      <div className="category-block">
        <div className="category-block-wrapper">
          {categories.map((category, i) => {
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
          })}
        </div>
      </div>
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteModal
          closeModal={() => setShowDeleteModal(false)}
          transactionId={categoryId}
          deleteOp={() => categoryId && deleteCategory(categoryId, dispatch)}
        />
      </Modal>
    </Load>
  );
};

export default CategoryBlock;

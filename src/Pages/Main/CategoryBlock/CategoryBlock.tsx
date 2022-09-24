import React, { useState, useMemo } from "react";

import Load from "Components/Load/Load";
import Modal from "Components/Modal/Modal";
import { CategoryModel } from "Models/CategoryModel";
import CategoryItem from "./CategoryItem/CategoryItem";
import Image from "Components/Image/Image";
import CategoriesEmpty from "Static/icons/categories-empty.svg";
import EditCategory from "./EditCategory/EditCategory";
import useEditCategory from "Hooks/useEditCategory";

import "Styles/Pages/Main/CategoryBlock/CategoryBlock.scss";
import { CategoryFilterEnum, ICategoryFilter } from "../types";

interface Props {
  filters: ICategoryFilter;
  categories: CategoryModel[];
  load: boolean;
  updateCategory: () => void;
  modifyCategory: (categoryId: string, categoryData: CategoryModel) => void;
}

const CategoryBlock: React.FC<Props> = ({
  filters,
  categories,
  load,
  updateCategory,
  modifyCategory,
}) => {
  const editCategory = useEditCategory(categories, modifyCategory);

  const filteredCategories = useMemo(() => {
    return Object.entries(filters).reduce(
      (accum, filter) =>
        filter[1]
          ? accum.filter((category) => category[CategoryFilterEnum[filter[0]]])
          : accum,
      categories
    );
  }, [categories, filters]);

  if (!load)
    return (
      <Load {...{ load }}>
        <span></span>
      </Load>
    );

  return (
    <React.Fragment>
      <div className="category-block">
        <Load
          {...{ load }}
          className={`category-block-wrapper ${
            filteredCategories.length === 0 && "categories-empty"
          }`}
        >
          <div
            className={`category-block-wrapper ${
              filteredCategories.length === 0 && "categories-empty"
            }`}
          >
            {filteredCategories.length === 0 ? (
              <div className="categories-empty">
                <Image
                  src={CategoriesEmpty}
                  alt="Categories"
                  frame={{ width: 100, height: 100 }}
                />
              </div>
            ) : (
              filteredCategories.map((category, i) => {
                return (
                  <CategoryItem
                    key={i}
                    icon={category.icon.name}
                    color={category.color.hex}
                    name={category.name}
                    onClick={() => {
                      editCategory.setCategoryId(category.id);
                      editCategory.modal.setShow(true);
                    }}
                  />
                );
              })
            )}
          </div>
        </Load>
      </div>
      <Modal
        show={editCategory.modal.show}
        onClose={() => {
          editCategory.modal.setShow(false);
          editCategory.__clearState();
        }}
      >
        <EditCategory
          edit={editCategory.edit}
          remove={editCategory.remove}
          name={editCategory.name}
          setName={editCategory.setName}
          icon={editCategory.icon}
          setIcon={editCategory.setIcon}
          color={editCategory.color}
          setColor={editCategory.setColor}
          categoryLimit={editCategory.categoryLimit}
          setCategoryLimit={editCategory.setCategoryLimit}
          onClose={() => editCategory.modal.setShow(false)}
          updateCategory={updateCategory}
          clearState={editCategory.__clearState}
          forEarn={editCategory.forEarn}
          setForEarn={editCategory.setForEarn}
          forSpend={editCategory.forSpend}
          setForSpend={editCategory.setForSpend}
          favorite={editCategory.favorite}
          editFavorite={editCategory.editFavorite}
        />
      </Modal>
    </React.Fragment>
  );
};

export default CategoryBlock;

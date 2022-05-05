import { CategoryModel, ColorType, IconType } from "Models/CategoryModel";
import { CategoryType } from "Pages/Main/CategoryBlock/CategoryConstructor/CategoryConstructor";

export interface UseAddCategoryConfig {
  params: CategoryType;
  userId: string;
}

export interface UseCategoryLimitConfig {
  categoryId: string;
  categoryLimit: number;
}

export interface UseGetCategoriesModel {
  categories: CategoryModel[];
  load: boolean;
  updateCategory: () => any;
}

export interface UseGetCategoryColorsModel {
  colors: ColorType[];
  load: boolean;
}

export interface UseGetCategoryIconsModel {
  icons: IconType[];
  load: boolean;
}

export interface UseRemoveCategoryConfig {
  categoryId: string;
}

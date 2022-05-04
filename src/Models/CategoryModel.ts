import { UserModel } from "./UserModel";

export type ColorType = {
  name: string;
  hex: string;
  systemName: string;
};

export type IconType = {
  id: string;
  name: string;
  path: string;
  tag: string;
};

export interface BaseCategoryModel {
  name: string;
  id: string;
  icon: IconType;
  description: string;
  color: ColorType;
}

export interface CategoryModel {
  categoryLimit: number;
  color: ColorType;
  description: string;
  id: string;
  name: string;
  user: UserModel;
  icon: IconType;
}

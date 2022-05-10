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
  id: string;
  name: string;
  categorySpend: number;
  categoryEarn: number;
  forEarn: boolean;
  forSpend: boolean;
  color: ColorType;
  icon: IconType;
  description: string;
  categoryLimit: number;
  user: UserModel;
  percentsFromLimit: number;
}

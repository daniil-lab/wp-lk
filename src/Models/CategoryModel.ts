import { UserModel } from "./UserModel";
import { BillLogModel } from "./BillModel";

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
  contentType?: string;
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
  favorite: boolean;
  description: string;
  categoryLimit: number;
  user: UserModel;
  percentsFromLimit: number;
  spendStatistic: number;
  earnStatistic: number;
  resetDataDate?: string;

  billLogs?: Array<BillLogModel>;
}

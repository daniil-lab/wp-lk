export enum CategoryFilterEnum {
  income = "forEarn",
  expense = "forSpend",
  favorite = "favorite",
}

export interface ICategoryFilter {
  income: boolean;
  expense: boolean;
  favorite: boolean;
}
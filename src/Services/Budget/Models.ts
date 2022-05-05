import { CategoryModel } from "Models/CategoryModel";
import { TransactionModel, Transcation } from "Models/TransactionModel";
import { UseGetCategoriesModel } from "Services/Category/Models";
import { UseTransactionParams } from "Services/Transactions/Models";

export interface FillterTransactions {
  transactions: Transcation[];
  date: string;
}

export interface GeneralBudget {
  income: number;
  incomeLimit: number;
  expenses: number;
  expensesLimit: number;
}

export interface UseBudgetModel {
  getPercentsFromLimit: number;
  fillterTransactions: FillterTransactions[];
  categories: UseGetCategoriesModel;
  transaction: UseTransactionParams;
  selectedCategory: CategoryModel | null;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<CategoryModel | null>
  >;
  generalBudget: GeneralBudget;
}

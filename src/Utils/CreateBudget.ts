import { CategoryModel } from "Models/CategoryModel";
import { TransactionsSortedModel } from "Models/TransactionModel";
import moment from "moment";

export type GeneralBudgetType = {
  income: number;
  incomeLimit: number;
  expenses: number;
  expensesLimit: number;
};

export default class CreateBudget {
  constructor() {}

  fillterTransactions(
    transactions: TransactionsSortedModel[],
    selectedCategory: CategoryModel
  ): TransactionsSortedModel[] {
    return transactions
      .map((group) => {
        const newTransactions = group.transactions.filter((b) => {
          if (b.category) return b.category.id === selectedCategory.id;
        });
        return { ...group, transactions: newTransactions };
      })
      .filter((group) => group.transactions.length > 0);
  }

  getPercentsFromLimit(selectedCategory: CategoryModel): number {
    if (selectedCategory) {
      if (selectedCategory.percentsFromLimit) {
        return selectedCategory.percentsFromLimit < 100
          ? selectedCategory.percentsFromLimit
          : 100;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  getGeneralBudget(
    transactions: TransactionsSortedModel[],
    categories: CategoryModel[]
  ): GeneralBudgetType {
    let incomeLimit = 0;
    let income = 0;
    let expensesLimit = 0;
    let expenses = 0;

    categories.forEach((category) => {
      if (category.forSpend) expensesLimit += category.categoryLimit;
      if (category.forEarn) incomeLimit += category.categoryLimit;
    });

    transactions.forEach((group) => {
      group.transactions.map((transaction) => {
        if (
          transaction?.transactionType === "DEPOSIT" ||
          transaction?.transactionType === "EARN" ||
          transaction?.action === "DEPOSIT" ||
          transaction?.action === "EARN"
        )
          income = income + (transaction?.sum ?? transaction?.amount?.amount);
        if (
          transaction?.transactionType === "WITHDRAW" ||
          transaction?.transactionType === "SPEND" ||
          transaction?.action === "WITHDRAW" ||
          transaction?.action === "SPEND"
        )
          expenses =
            expenses + (transaction?.sum ?? transaction?.amount?.amount);
      });
    });

    return { income, incomeLimit, expenses, expensesLimit };
  }

  getSelectedCategoryBudget(
    transactions: TransactionsSortedModel[],
    categories: CategoryModel[],
    selectedCategory: CategoryModel
  ): GeneralBudgetType {
    let incomeLimit = 0;
    let income = 0;
    let expensesLimit = 0;
    let expenses = 0;

    categories
      .filter((category) => category.id === selectedCategory.id)
      .forEach((category) => {
        if (category.forSpend) expensesLimit += category.categoryLimit;
        if (category.forEarn) incomeLimit += category.categoryLimit;
      });

    transactions.forEach((group) => {
      group.transactions.map((transaction) => {
        if (transaction?.category?.id === selectedCategory.id) {
          if (
            transaction.transactionType === "DEPOSIT" ||
            transaction.transactionType === "EARN" ||
            transaction?.action === "EARN" ||
            transaction?.action === "DEPOSIT"
          )
            income = income + (transaction?.sum ?? transaction?.amount?.amount);
          if (
            transaction?.transactionType === "WITHDRAW" ||
            transaction?.transactionType === "SPEND" ||
            transaction?.action === "SPEND" ||
            transaction?.action === "WITHDRAW"
          )
            expenses =
              expenses + (transaction?.sum ?? transaction?.amount?.amount);
        }
      });
    });

    return { income, incomeLimit, expenses, expensesLimit };
  }
}

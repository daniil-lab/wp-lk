import { CategoryModel } from "Models/CategoryModel";
import { ITransactionsSorted } from "Models/TransactionModel";
import {
  calculateCategoriesBudget,
  CategoryBudgetType,
} from "./calculateCategoriesBudget";

export type GeneralBudgetType = {
  income: number;
  expenses: number;
};

export default class CreateBudget {
  filterTransactions(
    transactions: ITransactionsSorted[],
    selectedCategory: CategoryModel
  ): ITransactionsSorted[] {
    return transactions
      .map((group) => {
        const newTransactions = group.transactions.filter(
          (b) => b.category && b.category.id === selectedCategory.id
        );
        return { ...group, transactions: newTransactions };
      })
      .filter((group) => group.transactions.length > 0);
  }

  filterTransactionsByCategories(
    transactions: ITransactionsSorted[],
    categories: CategoryModel[]
  ): ITransactionsSorted[] {
    return transactions
      .map((group) => {
        const newTransactions = group.transactions.filter(
          (b) => b.category && categories.find((c) => c.id === b.category.id)
        );
        return { ...group, transactions: newTransactions };
      })
      .filter((group) => group.transactions.length > 0);
  }

  getPercentsFromLimit(selectedCategory: CategoryModel): number {
    return selectedCategory.percentsFromLimit < 100
      ? selectedCategory.percentsFromLimit
      : 100;
  }

  getGeneralBudget(transactions: ITransactionsSorted[]): GeneralBudgetType {
    let income = 0;
    let expenses = 0;

    transactions.forEach((group) => {
      group.transactions.forEach((transaction) => {
        if (!("transactionType" in transaction && "sum" in transaction)) return;

        if (
          transaction?.transactionType === "DEPOSIT" ||
          transaction?.transactionType === "EARN"
        )
          income = income + (transaction?.sum || 0);
        if (
          transaction?.transactionType === "WITHDRAW" ||
          transaction?.transactionType === "SPEND"
        )
          expenses = expenses + (transaction?.sum || 0);
      });
    });

    return {
      income: +income.toFixed(0),
      expenses: +expenses.toFixed(0),
    };
  }

  getCategoriesExpensesBudget(
    transactions: ITransactionsSorted[]
  ): CategoryBudgetType[] {
    return calculateCategoriesBudget(
      transactions.map((t) => t.transactions).flat(1),
      "expenses"
    );
  }

  getCategoriesIncomeBudget(transactions: ITransactionsSorted[]): {
    value: string;
    color: string;
    sum: number;
  }[] {
    return calculateCategoriesBudget(
      transactions.map((t) => t.transactions).flat(1),
      "expenses"
    );
  }

  getSelectedCategoryBudget(
    transactions: ITransactionsSorted[],
    selectedCategory: CategoryModel
  ): GeneralBudgetType {
    let income = 0;
    let expenses = 0;

    transactions.forEach((group) => {
      group.transactions.forEach((transaction) => {
        if (transaction.category.id !== selectedCategory.id) return;

        const transactionSum =
          "sum" in transaction
            ? transaction.sum
            : "amount" in transaction
            ? transaction.amount
            : 0;

        if ("transactionType" in transaction) {
          if (
            transaction.transactionType === "DEPOSIT" ||
            transaction.transactionType === "EARN"
          )
            income += transactionSum;
          if (
            transaction?.transactionType === "WITHDRAW" ||
            transaction?.transactionType === "SPEND"
          )
            expenses += transactionSum;
        }

        if ("action" in transaction) {
          if (transaction.action === "DEPOSIT" || transaction.action === "EARN")
            income += transactionSum;
          if (
            transaction?.action === "WITHDRAW" ||
            transaction?.action === "SPEND"
          )
            expenses += transactionSum;
        }
      });
    });

    return { income, expenses };
  }
}

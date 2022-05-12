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
        const newTransactions = group.transactions.filter(
          (b) => b.category.id === selectedCategory.id
        );
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
        if (transaction.transactionType === "DEPOSIT")
          income = income + transaction?.sum;
        if (transaction.transactionType === "WITHDRAW")
          expenses = expenses + transaction?.sum;
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
        if (transaction.category.id === selectedCategory.id) {
          if (transaction.transactionType === "DEPOSIT")
            income = income + transaction?.sum;
          if (transaction.transactionType === "WITHDRAW")
            expenses = expenses + transaction?.sum;
        }
      });
    });

    return { income, incomeLimit, expenses, expensesLimit };
  }

  getIncomeCategory(
    id: String,
    transactions: TransactionsSortedModel[]
  ): number {
    return 0;
    // return transactions
    //   .map((a) => {
    //     const newTransactions = a?.transactions?.filter(
    //       (b) => b.category?.id === id
    //     );
    //     return { ...a, transactions: newTransactions };
    //   })
    //   .map((item) =>
    //     item.transactions
    //       .filter(
    //         (i) =>
    //           i?.transactionType === "DEPOSIT" ||
    //           i?.transactionType === "EARN" ||
    //           i?.action === "DEPOSIT" ||
    //           i?.action === "EARN"
    //       )
    //       .reduce((x, y) => +x + +(y?.sum ?? y?.amount?.amount), 0)
    //   )
    //   .reduce((x, y) => x + y, 0);
  }
}

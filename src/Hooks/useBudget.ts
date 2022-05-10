import { CategoryModel } from "Models/CategoryModel";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

const useBudget = (categories, transactions) => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryModel | null>(null);

  const fillterTransactions = useMemo(() => {
    return transactions.transactions
      .filter(
        (v) =>
          moment(
            moment(transactions.date.startDate.split("T")[0], "YYYY-MM-DD")
          ).get("month") == moment(v.date).get("month")
      )
      .map((a) => {
        const newTransactions = a?.transactions?.filter(
          (b) => b.category?.id === selectedCategory?.id
        );
        return { ...a, transactions: newTransactions };
      })
      .filter((g) => g.transactions.length > 0);
  }, [selectedCategory, transactions.transactions, categories.categories]);

  const getPercentsFromLimit = useMemo(() => {
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
  }, [selectedCategory]);

  const generalBudget = useMemo(() => {
    const income = fillterTransactions
      .map((a) => {
        const newTransactions = a?.transactions?.filter(
          (b) => b.category?.percentsFromLimit
        );
        return { ...a, transactions: newTransactions };
      })
      .map((item) =>
        item.transactions
          .filter(
            (i) =>
              i?.transactionType === "DEPOSIT" ||
              i?.action === "DEPOSIT" ||
              i?.transactionType === "EARN" ||
              i?.action === "EARN"
          )
          .reduce((x, y) => +x + +y.sum, 0)
      )
      .reduce((x, y) => x + y, 0);

    const incomeLimit = categories.categories
      .filter((c) => c.forEarn)
      .map((c) => c.categoryLimit)
      .reduce((x, y) => x + y, 0);

    const expenses = fillterTransactions
      .map((a) => {
        const newTransactions = a?.transactions?.filter(
          (b) => b.category?.percentsFromLimit
        );
        return { ...a, transactions: newTransactions };
      })
      .map((item) =>
        item.transactions
          .filter(
            (i) =>
              i?.transactionType === "SPEND" ||
              i?.action === "SPEND" ||
              i?.transactionType === "WITHDRAW" ||
              i?.action === "WITHDRAW"
          )
          .reduce((x, y) => +x + +y.sum, 0)
      )
      .reduce((x, y) => x + y, 0);

    const expensesLimit = categories.categories
      .filter((c) => c.forSpend)
      .map((c) => c.categoryLimit)
      .reduce((x, y) => x + y, 0);

    return { income, incomeLimit, expenses, expensesLimit };
  }, [selectedCategory, transactions, categories]);

  useEffect(() => {
    if (categories.load) setSelectedCategory(categories.categories[0]);
  }, [categories.load]);

  return {
    getPercentsFromLimit,
    selectedCategory,
    setSelectedCategory,
    generalBudget,
    fillterTransactions,
  };
};

export default useBudget;

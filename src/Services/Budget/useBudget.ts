import { CategoryModel } from "Models/CategoryModel";
import { TransactionType } from "Models/TransactionModel";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import useGetCategories from "Services/Category/useGetCategories";
import useGetTransaction from "Services/Transactions/useGetTransaction";
import { UseBudgetModel } from "./Models";

const useBudget = (): UseBudgetModel => {
  const categories = useGetCategories();
  const transaction = useGetTransaction();

  // const [transactionType, setTransactionType] = useState<TransactionType | null>(null)

  // const expensesCategories = useMemo(() => {
  //   return categories.categories.filter((c) => !c.onlyForEarn);
  // }, [categories.load, categories.categories]);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryModel | null>(null);

  const fillterTransactions = useMemo(() => {
    return transaction.transactions
      .filter(
        (v) =>
          moment(
            moment(transaction.date.startDate.split("T")[0], "YYYY-MM-DD")
          ).get("month") == moment(v.date).get("month")
      )
      .map((a) => {
        const newTransactions = a?.transactions?.filter(
          (b) => b.category?.id === selectedCategory?.id
        );
        return { ...a, transactions: newTransactions };
      })
      .filter((g) => g.transactions.length > 0);
  }, [selectedCategory, transaction.transactions, categories.categories]);

  useEffect(() => {
    if (categories.load) setSelectedCategory(categories.categories[0]);
  }, [categories.load]);

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
    const f = transaction.transactions.filter(
      (v) =>
        moment(
          moment(transaction.date.startDate.split("T")[0], "YYYY-MM-DD")
        ).get("month") == moment(v.date).get("month")
    );
    const income = f
      .map((a) => {
        const newTransactions = a?.transactions?.filter(
          (b) => !b.category?.percentsFromLimit
        );
        return { ...a, transactions: newTransactions };
      })
      .map((item) =>
        item.transactions
          .filter(
            (i) =>
              i.transactionType === "DEPOSIT" || i.transactionType === "EARN"
          )
          .reduce((x, y) => +x + +y.sum, 0)
      )
      .reduce((x, y) => x + y, 0);

    const incomeLimit = categories.categories
      .filter((c) => c.onlyForEarn)
      .map((c) => c.categoryLimit)
      .reduce((x, y) => x + y, 0);

    const expenses = f
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
              i.transactionType === "SPEND" || i.transactionType === "WITHDRAW"
          )
          .reduce((x, y) => +x + +y.sum, 0)
      )
      .reduce((x, y) => x + y, 0);

    const expensesLimit = categories.categories
      // .filter((c) => !c.onlyForEarn)
      .map((c) => c.categoryLimit)
      .reduce((x, y) => x + y, 0);

    return { income, incomeLimit, expenses, expensesLimit };
  }, [selectedCategory, transaction.transactions, categories.categories]);

  return {
    getPercentsFromLimit,
    fillterTransactions,
    categories,
    transaction,
    selectedCategory,
    setSelectedCategory,
    generalBudget,
  };
};

export default useBudget;

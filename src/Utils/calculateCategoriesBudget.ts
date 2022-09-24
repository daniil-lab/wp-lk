import { TransactionModel } from "../Models/TransactionModel";

export type CategoryBudgetType = {
  color: string;
  value: string;
  sum: number;
  id: string;
};

export const calculateCategoriesBudget = (
  transactions: TransactionModel[],
  mode: "income" | "expenses"
): Array<CategoryBudgetType> =>
  Object.values(
    transactions
      .map((transaction) => ({
        type:
          "action" in transaction
            ? transaction.action
            : transaction.transactionType,
        sum: "sum" in transaction ? transaction.sum : transaction.amount,
        value: transaction.category.name,
        color: transaction.category.color.hex,
        id: transaction.category.id,
      }))
      .reduce<Record<string, CategoryBudgetType>>((accum, item) => {
        if (
          (mode === "income" && ["EARN", "DEPOSIT"].includes(item.type)) ||
          (mode === "expenses" && ["SPEND", "WITHDRAW"].includes(item.type))
        )
          return {
            ...accum,
            [item.value]: {
              sum: accum[item.value]
                ? accum[item.value].sum + item.sum
                : item.sum,
              color: item.color,
              value: item.value,
              id: item.id,
            },
          };

        return accum;
      }, {})
  ).sort((a, b) => a.sum - b.sum);

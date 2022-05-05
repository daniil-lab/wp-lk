import { BillModel } from "Models/BillModel";
import { BaseCategoryModel } from "Models/CategoryModel";
import {
  AbstractTransactionModel,
  TransactionModel,
  TransactionsSortedModel,
  TransactionType,
} from "Models/TransactionModel";

export type BillType = "general" | "bill" | "tinkoff";

export type UseTransactionParams = {
  load: boolean;
  bill: string | null;
  billType: BillType;
  setBillType: React.Dispatch<React.SetStateAction<BillType>>;
  setBill: React.Dispatch<React.SetStateAction<string | null>>;
  date: {
    date: string;
    setStart: (date: string) => void;
    setEnd: (date: string) => void;
    nextMonth: () => void;
    prevMonth: () => void;
    startDate: string;
    endDate: string;
  };
  transactions: TransactionsSortedModel[];
  isLastMonth: boolean;
  income: number | string;
  expenses: number | string;
  prices: any;
  updateTransactions: () => void;
};

export type UseAddOperationConfig = {
  bill: BillModel | null;
  date: string[] | null;
  selectedCategory: BaseCategoryModel | null;
  summ: string | null;
  description: string | null;
  location: number[] | null;
  operationType: TransactionType;
  placeName: string;
  qr?: File;
};

import { BillModel } from "./BillModel";
import { CategoryModel } from "./CategoryModel";

export type TransactionType = "EARN" | "SPEND" | "WITHDRAW" | "DEPOSIT";

export interface AbstractTransactionModel {
  id: string;
  type: string;
  description: string;
  transactionType: TransactionType;
  date: string;
  category: CategoryModel;
  sum: number;
  currency: string;
  billName: string;
}

export interface TransactionModel {
  action: TransactionType;
  bill: BillModel;
  category: null | CategoryModel;
  createAt: string;
  currency: string;
  description: string;
  geocodedPlace: null;
  id: string;
  latitude: null;
  longitude: null;
  sum: number;
}

export type UserTranscationsType = {
  transactionType: TransactionType;
  category: CategoryModel | null;
  date: string;
  currency: string;
  sum: string | number;
  title: string;
  id: string;
  description: string;
  type: string;
};

export interface TransactionsSortedModel {
  date: string;
  transactions: UserTranscationsType[] | AbstractTransactionModel[];
}

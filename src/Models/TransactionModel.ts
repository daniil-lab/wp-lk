import { BillModel } from "./BillModel";
import { CategoryModel } from "./CategoryModel";

export interface TransactionsSortedModel {
  date: string;
  transactions: TranscationModel[];
}

export type AmountType = {
  amount: number;
  cents: number;
};

export type TransactionType = "EARN" | "SPEND" | "WITHDRAW" | "DEPOSIT";

export interface TranscationModel {
  id: string;
  amount?: AmountType;
  sum?: number;
  description: string;
  currency: string;
  transactionType?: TransactionType;
  action?: TransactionType;
  date?: string;
  category: CategoryModel;
  bill?: BillModel;
  geocodedPlace?: string;
  longitude?: number;
  latitude?: number;
  createAt?: string;
  billName?: string;
}

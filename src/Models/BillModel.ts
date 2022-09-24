import { UserModel } from "./UserModel";
import { ITransactionBill } from "./TransactionModel";
import { RequiredField } from "./types";

export interface BillModel {
  balance: BalanceType;
  id: string;
  name: string;
  user: UserModel;

  hidden?: boolean;
  logs?: Array<string>;
  transactions?: Array<RequiredField<ITransactionBill, "user">>;
}

export type Banks = "tinkoff" | "sber" | "tochka";

export type BillType = "general" | "bill" | "tinkoff" | "sber" | "tochka";

export type Act = "start" | "submit";

export type BalanceType = {
  amount: number;
  cents: number;
};

export interface BankCardModel {
  balance: BalanceType;
  bankName: string;
  cardNumber: string;
  id: string;
}

export interface BillLogModel {
  id: string;
  action: string;
  sum: number;
  bill: RequiredField<BillModel, "transactions" | "logs">;
  category: string;
}

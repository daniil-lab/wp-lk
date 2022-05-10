import { UserModel } from "./UserModel";

export interface BillModel {
  balance: BalanceType;
  id: string;
  name: string;
  user: UserModel;
}

export type Banks = "tinkoff" | "sber" | "tochka";

export type BillType = "general" | "bill" | "tinkoff" | "sber" | "tochka";

export type Act = "start" | "submit";

export interface UseGetBillModel {
  load: boolean;
  data: BillModel[];
  generalBalance: number;
  updateBill: () => void;
  tinkoffCards: BankCardModel[];
  sberCards: BankCardModel[];
  tochkaCards: BankCardModel[];
}

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

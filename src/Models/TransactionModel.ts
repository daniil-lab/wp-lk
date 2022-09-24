import { BillModel } from "./BillModel";
import { CategoryModel } from "./CategoryModel";
import { UserModel } from "./UserModel";
import { RequiredField } from "./types";

export interface ITransactionsSorted {
  date: string;
  transactions: TransactionModel[];
}

export type AmountType = {
  amount: number;
  cents: number;
};

export type TransactionType = "EARN" | "SPEND" | "WITHDRAW" | "DEPOSIT";

type CardModel = {
  id: string;
  balance: number;
  picture: {
    id: string;
    name: string;
    path: string;
    contentType: string;
    tag: string;
  };
  bankName: string;
  cardNumber: string;
  name: string;
  cardId: string;
  status: string;
  expirationMillis: number;
  currency: string;
  createdMillis: number;
};

export interface ITransactionBase {
  id: string;
  description: string;
  currency: string;
  category: CategoryModel;
}

export interface ITransactionGeneral extends ITransactionBase {
  // General and bill transactions
  sum: number;
  // General transaction
  type: string;
  transactionType: TransactionType;
  name: string;
  date: string;
  billName: string;
  billId: string;
}

export interface ITransactionBill extends ITransactionBase {
  id: string;
  description: string;
  sum: number;
  currency: string;
  category: CategoryModel;
  // Only for bill transaction
  action: TransactionType;
  geocodedPlace: string;
  longitude: number;
  latitude: number;
  createAt: string;
  bill: BillModel;
  // This field exists not in all requests
  user?: string;
}

export interface ITransactionTinkoff extends ITransactionBase {
  id: string;
  currency: string;
  description: string;

  // From general transaction
  transactionType: TransactionType;
  date: string;

  // Only for tinkoff model
  category: RequiredField<
    CategoryModel & { user: Required<UserModel> },
    "billLogs"
  >;
  group: string;
  card: CardModel;
  tinkoffId: string;

  // For cards transitions
  status: string;
  amount: number;
}

export interface ITransactionSber extends ITransactionBase {
  id: string;
  currency: string;
  description: string;

  // From general transaction
  transactionType: TransactionType;
  date: string;

  // For sber and tochka transactions
  category: CategoryModel;

  // For cards transactions
  status: string;
  amount: number;
}

export interface ITransactionTochka extends ITransactionBase {
  id: string;
  currency: string;
  description: string;

  // From general transaction
  transactionType: TransactionType;
  date: string;

  // For sber and tochka transactions
  category: CategoryModel;

  // For cards transactions
  status: string;
  amount: number;
}

export type TransactionModel =
  | ITransactionGeneral
  | ITransactionBill
  | ITransactionSber
  | ITransactionTinkoff
  | ITransactionTochka;

export type TransactionResponseType<T = ITransactionBase> = {
  status: number;
  data: {
    page: Array<T>;
    total: number;
    totalPages: number;
  };
  message: string;
  advices: Array<string>;
};

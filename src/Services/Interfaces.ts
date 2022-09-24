import { UserModel } from "../Models/UserModel";
import { TransactionType } from "../Models/TransactionModel";
import { CategoryModel } from "../Models/CategoryModel";
import { BalanceType } from "../Models/BillModel";

export interface ITinkoffTransaction {
  amount: BalanceType;
  currency: string;
  date: string;
  description: string;
  id: string;
  status: string;
  transactionType: TransactionType;
}

export interface IWallet {
  walletSystemName: string;
  walletDisplayName: string;
}

export interface ISubscription {
  id: string;
  name: string;
  description: string;
  expiration: number;
  price: number;
  newPrice: number;
}

export interface ISubscriptionGroup {
  id: string;
  name: string;
  variants: ISubscription[];
}

export interface IActiveSubscriptionGroup {
  subscribedTo: string | null;
  isSubscribed: boolean;
}

export interface IRole {
  id: string;
  name: string;
}

export interface IActiveSubscription {
  id: string;
  startDate: string;
  endDate: string;
  variant: ISubscription & { role: IRole };
  active: boolean;
}

export type IFiles = {
  id: string;
  path: string;
};

export interface IAdvertising {
  id: string;
  title: string;
  subTitle: string;
  content: string;
  files: IFiles[];
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

export interface SelectedBillType {
  name: string;
  billId: string;
  type: "bill" | "tinkoff";
}

export interface TransactionsSorted {
  date: string;
  transactions: UserTranscationsType[];
}

export interface IBonus {
  blank: {
    description: string;
    id: string;
    image: {
      id: string;
      name: string;
      path: string;
      tag: string;
    };
    name: string;
  };
  data: string;
  id: string;
  user: UserModel;
}

export interface IBonusBlank {
  id: string;
  name: string;
  description: string;
  image: {
    id: string;
    name: string;
    path: string;
    tag: string;
  };
}

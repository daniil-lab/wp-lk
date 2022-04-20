export type UserType = {
  id: string;
  username: string;
  role: {
    id: string;
    name: string;
    autoApply: boolean;
    roleAfterBuy: boolean;
    roleAfterBuyExpiration: true;
    roleForBlocked: true;
    admin: boolean;
  };
  email: {
    address: string;
    activated: boolean;
  };
  type: string;
  walletType: string;
  touchID: boolean;
  faceID: boolean;
  pinCode: string;
  plannedIncome: 0;
  notificationsEnable: boolean;
  createAt: string;
};

export type IconType = {
  id: string;
  name: string;
  path: string;
  tag: string;
};

export type ColorType = {
  name: string;
  hex: string;
  systemName: string;
};

export interface IBaseCategory {
  name: string;
  id: string;
  icon: IconType;
  description: string;
  color: ColorType;
}

export interface ICategory {
  categoryLimit: number;
  color: ColorType;
  description: string;
  id: string;
  name: string;
  user: UserType;
  icon: IconType;
}

export type BalanceType = {
  amount: number;
  cents: number;
};

export interface ITinkoffCard {
  balance: BalanceType;
  bankName: string;
  cardId: string;
  cardNumber: string;
  createdInBank: string;
  currency: string;
  expiration: string;
  id: string;
  name: string;
  status: string;
}

export interface ISberCard {
  id: string;
  cardNumber: string;
  description: string;
  name: string;
  cardId: string;
  status: string;
  expireDate: string;
  cardAccount: string;
  balance: BalanceType;
  cardName: string;
  bankName: string;
}

export interface ITochkaCard {
  id: string;
  cardNumber: string;
  balance: BalanceType;
  bankName: string;
}

export interface ITinkoffTransaction {
  amount: BalanceType;
  currency: string;
  date: string;
  description: string;
  id: string;
  status: string;
  transactionType: TransactionType;
}

export interface IBalances {
  balance: BalanceType;
  id: string;
  name: string;
  user: UserType;
}

export type TransactionType = "WITHDRAW" | "DEPOSIT" | "EARN" | "SPEND";

export interface ITransaction {
  action: TransactionType;
  bill: {
    balance: BalanceType;
    id: string;
    name: string;
    user: UserType;
  };
  category: null | ICategory;
  createAt: string;
  currency: string;
  description: string;
  geocodedPlace: null;
  id: string;
  latitude: null;
  longitude: null;
  sum: number;
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

export type OperationParamsType = {
  bill: IBalances | null;
  date: string[] | null;
  selectedCategory: IBaseCategory | null;
  summ: string | null;
  description: string | null;
  location: number[] | null;
  operationType: TransactionType;
  qr?: File;
};

export type UserTranscationsType = {
  action: TransactionType;
  category: ICategory | null;
  date: string;
  currency: string;
  amount: string | number;
  title: string;
  id: string;
};

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
  user: UserType;
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

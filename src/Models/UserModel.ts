import { WalletModel } from "./WalletModel";
import { BillModel } from "./BillModel";
import { ITransactionBill } from "./TransactionModel";
import { RequiredField } from "./types";

export type RoleType = {
  id: string;
  name: string;
  autoApply: boolean;
  roleAfterBuy: boolean;
  roleAfterBuyExpiration: true;
  roleForBlocked: true;
  admin: boolean;
};

export type SubscriptionModel = {
  id: string;
  active: boolean;
  startDate: string;
  endDate: string;
  variant: {
    id: string;
    name: string;
    description: string;
    expiration: number;
    price: number;
    newPrice: number;
    role: RoleType;
  };
};

export type UserModel = {
  id: string;
  username: string;
  role: RoleType;
  email: {
    address: string;
    activated: boolean;
  };
  type: string;
  walletType: WalletModel;
  touchID: boolean;
  faceID: boolean;
  pinCode: string;
  plannedIncome: number;
  notificationsEnable: boolean;
  createAt: string;
  googleLink: boolean;
  plannedSpend: number;
  plannedEarn: number;
  password?: string;
  userType?: string;
  touchId?: boolean;
  faceId?: boolean;
  subscription?: SubscriptionModel;
  bills?: Array<RequiredField<BillModel, "transactions" | "logs">>;
  transactions?: Array<RequiredField<ITransactionBill, "user">>;
  registerCred?: string;
  deviceTokens?: Array<string>;
  wallet?: string;
};

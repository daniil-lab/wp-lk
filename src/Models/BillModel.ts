import { UserModel } from "./UserModel";

type BalanceType = {
  amount: number;
  cents: number;
};

export interface BillModel {
  balance: BalanceType;
  id: string;
  name: string;
  user: UserModel;
}

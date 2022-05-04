export type UserModel = {
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

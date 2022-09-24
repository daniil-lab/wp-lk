import { RootStore } from "Redux/Store";

export const GetUserId = (store: RootStore) => store.user.user?.id;
export const GetUserName = (store: RootStore) => store.user.user?.username;
export const GetUserToken = (store: RootStore) => store.user.token;
export const GetUserGoogleLink = (store: RootStore) =>
  store.user.user?.googleLink || false;
export const GetUserEmail = (store: RootStore) =>
  store.user.user?.email.address;
export const GetUserPlannedSpend = (store: RootStore) =>
  store.user.user?.plannedSpend || 0;
export const GetUserPlannedEarn = (store: RootStore) =>
  store.user.user?.plannedEarn || 0;

export const GetPreloaderParams = (store: RootStore) => store.preloader.show;

export const GetToasts = (store: RootStore) => store.toast.toasts;

export const GetUpdateCategory = (store: RootStore) =>
  store.effects.updateCategory;

export const GetUpdateOperations = (store: RootStore) =>
  store.effects.updateOperation;

export const GetUserRole = (store: RootStore) => store.user.user?.role.name;

export const GetUserWallet = (store: RootStore) => store.user?.user?.walletType;

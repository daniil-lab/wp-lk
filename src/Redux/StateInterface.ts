import { UserModel } from "Models/UserModel";

export interface IUserState {
  token: string | null;
  user: UserModel | null;
}

export interface IPreloaderState {
  show: boolean;
}

export interface IToast {
  type: "error" | "success";
  title: string;
  text: string;
}

export interface IToastState {
  toasts: IToast[];
}

export interface IEffectsState {
  updateCategory: boolean | null;
  updateOperation: boolean | null;
}

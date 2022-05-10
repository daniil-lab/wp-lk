import { UserModel } from "Models/UserModel";
import {
  HIDE_PRELOADER,
  HIDE_TOAST,
  LOG_OUT,
  SET_USER,
  SHOW_PRELOADER,
  SHOW_TOAST,
  UPDATE_CATEGORY,
  UPDATE_OPERATION,
} from "Redux/Constants";
import { IToast } from "./StateInterface";

export interface IUserSetAction {
  type: typeof SET_USER;
  payload: {
    token: string;
    user: UserModel;
  };
}

export interface IPreloaderShowAction {
  type: typeof SHOW_PRELOADER;
  payload: null;
}

export interface IPreloaderHideAction {
  type: typeof HIDE_PRELOADER;
  payload: null;
}

export interface IToastShowAction {
  type: typeof SHOW_TOAST;
  payload: {
    toast: IToast;
  };
}

export interface IToastHideAction {
  type: typeof HIDE_TOAST;
  payload: {
    index: number;
  };
}

export interface IUserLogoutAction {
  type: typeof LOG_OUT;
  payload: null;
}

export interface IUpdateCategory {
  type: typeof UPDATE_CATEGORY;
  payload: null;
}

export interface IUpdateOperation {
  type: typeof UPDATE_OPERATION;
  payload: null;
}

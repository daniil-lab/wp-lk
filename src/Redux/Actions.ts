import {
  CHANGE_PLANS,
  HIDE_PRELOADER,
  HIDE_TOAST,
  LINK_GOOGLE,
  LOG_OUT,
  SET_USER,
  SHOW_PRELOADER,
  SHOW_TOAST,
  UPDATE_CATEGORY,
  UPDATE_OPERATION,
} from "./Constants";
import {
  IPreloaderHideAction,
  IPreloaderShowAction,
  IToastHideAction,
  IToastShowAction,
  IUpdateCategory,
  IUserLogoutAction,
  IUserSetAction,
  IUpdateOperation,
  IUserLinkGoogleAction,
  IUserChangePlans,
} from "./Interfaces";
import { IToast } from "./StateInterface";
import { UserModel } from "../Models/UserModel";

export const ShowPreloader = (): IPreloaderShowAction => {
  return {
    type: SHOW_PRELOADER,
    payload: null,
  };
};

export const HidePreloader = (): IPreloaderHideAction => {
  return {
    type: HIDE_PRELOADER,
    payload: null,
  };
};

export const ShowToast = (toast: IToast): IToastShowAction => {
  return {
    type: SHOW_TOAST,
    payload: {
      toast,
    },
  };
};

export const HideToast = (index: number): IToastHideAction => {
  return {
    type: HIDE_TOAST,
    payload: {
      index,
    },
  };
};

export const SetUser = (token: string, user: UserModel): IUserSetAction => {
  return {
    type: SET_USER,
    payload: {
      token,
      user,
    },
  };
};

export const Logout = (): IUserLogoutAction => {
  return {
    type: LOG_OUT,
    payload: null,
  };
};

export const LinkGoogle = (toLink: boolean): IUserLinkGoogleAction => ({
  type: LINK_GOOGLE,
  payload: { toLink },
});

export const ChangeUserPlans = (payload: {
  plannedSpend: number;
  plannedEarn: number;
}): IUserChangePlans => ({
  type: CHANGE_PLANS,
  payload,
});

export const UpdateCategory = (): IUpdateCategory => {
  return {
    type: UPDATE_CATEGORY,
    payload: null,
  };
};

export const UpdateOperations = (): IUpdateOperation => {
  return {
    type: UPDATE_OPERATION,
    payload: null,
  };
};

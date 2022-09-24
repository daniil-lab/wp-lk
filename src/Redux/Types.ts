import {
  IPreloaderHideAction,
  IPreloaderShowAction,
  IToastHideAction,
  IToastShowAction,
  IUpdateCategory,
  IUpdateOperation,
  IUserChangePlans,
  IUserLinkGoogleAction,
  IUserLogoutAction,
  IUserSetAction,
} from "Redux/Interfaces";

export type UserActionType =
  | IUserSetAction
  | IUserLogoutAction
  | IUserLinkGoogleAction
  | IUserChangePlans;

export type PreloaderActionType = IPreloaderShowAction | IPreloaderHideAction;

export type ToastActionType = IToastShowAction | IToastHideAction;

export type EffectsActionType = IUpdateCategory | IUpdateOperation;

import axios from "Utils/Axios";
import { useDispatch, useSelector } from "react-redux";
import { GetUserId } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import IsPhone from "Utils/IsPhone";
import IsEmail from "Utils/IsEmail";
import { Buffer } from "buffer";
import { useState } from "react";
import { IWallet } from "./Interfaces";

const useEditEmail = (email: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const setEditableEmail = async (): Promise<void> => {
    try {
      if (IsEmail(email)) {
        dispatch(ShowPreloader());
        const res = await axios.patch(`${API_URL}api/v1/user/`, {
          email,
        });
        if (res.data.status === 200) {
          dispatch(HidePreloader());
          dispatch(
            ShowToast({
              text: "Email изменен",
              title: "Успех",
              type: "success",
            })
          );
          window.location.reload();
        } else {
          throw new Error(res.data.message);
        }
      } else {
        throw new Error("Некорректный email");
      }
    } catch (error: any) {
      if (
        error.response.data.status === 400 &&
        error.response.data.error === "User with given email already exist"
      ) {
        dispatch(HidePreloader());
        dispatch(
          ShowToast({
            text: "Этот email уже используется",
            title: "Ошибка",
            type: "error",
          })
        );
      } else {
        dispatch(HidePreloader());
        dispatch(
          ShowToast({
            text: error.message,
            title: "Ошибка",
            type: "error",
          })
        );
      }
    }
  };

  return {
    setEditableEmail,
  };
};

const useEditPhone = (phone: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(GetUserId);

  const setEditablePhone = async (): Promise<void> => {
    try {
      if (IsPhone(phone)) {
        dispatch(ShowPreloader());
        const res = await axios.patch(`${API_URL}api/v1/user/${userId}`, {
          username: phone,
        });
        if (res.data.status === 200) {
          dispatch(HidePreloader());
          dispatch(
            ShowToast({
              text: "Номер телефона изменен",
              title: "Успех",
              type: "success",
            })
          );
        } else {
          throw new Error(res.data.message);
        }
      } else {
        throw new Error("Некорректный номер телефона");
      }
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return {
    setEditablePhone,
  };
};

const useExportData = (startDate: string | null, endDate: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(GetUserId);

  const getExportableData = async (): Promise<string | undefined> => {
    try {
      if (!startDate) {
        throw new Error("Введите начало периода");
      }

      if (!endDate) {
        throw new Error("Введите конец периода");
      }

      dispatch(ShowPreloader());

      const res = await axios.post(`${API_URL}api/v1/user/export`, {
        start: new Date(startDate),
        end: new Date(endDate),
        userId,
      });

      dispatch(HidePreloader());

      return res.data;
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return {
    getExportableData,
  };
};

const useRemoveData = (startDate: string | null, endDate: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(GetUserId);

  const removeData = async (): Promise<void> => {
    try {
      if (!startDate) {
        throw new Error("Введите начало периода");
      }

      if (!endDate) {
        throw new Error("Введите конец периода");
      }

      dispatch(ShowPreloader());

      const { data } = await axios.patch(`${API_URL}api/v1/user/clean`, {
        start: new Date(startDate),
        end: new Date(endDate),
        userId,
      });

      if (data.status === 200) {
        dispatch(HidePreloader());
        dispatch(
          ShowToast({
            text: "Данные удалены",
            title: "Успех",
            type: "success",
          })
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return {
    removeData,
  };
};

export const useEditPassword = () => {
  const dispatch = useDispatch<AppDispatch>();

  const editPassword = async (password: string) => {
    try {
      dispatch(ShowPreloader());
      const { data } = await axios.patch(`${API_URL}api/v1/user/`, {
        password: Buffer.from(password).toString("base64"),
      });
      if (data.status === 200) {
        dispatch(HidePreloader());
        dispatch(
          ShowToast({
            text: "Пароль изменен",
            title: "Успех",
            type: "success",
          })
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return {
    editPassword,
  };
};

export const useEditUserCurrency = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [wallet, setWallet] = useState<IWallet>();

  const updateUserCurrency = async (newWallet: IWallet) => {
    try {
      dispatch(ShowPreloader());
      const { data } = await axios.patch(`${API_URL}api/v1/user/`, {
        walletType: newWallet.walletSystemName,
      });
      if (data.status === 200) {
        dispatch(HidePreloader());
        dispatch(
          ShowToast({
            text: "Валюта изменена",
            title: "Успех",
            type: "success",
          })
        );
        setWallet(newWallet);
        window.location.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return { wallet, setWallet, updateUserCurrency };
};

const userHooks = {
  useEditEmail,
  useEditPhone,
  useExportData,
  useRemoveData,
  useEditUserCurrency,
};

export default userHooks;

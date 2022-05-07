import { useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import { Act, Banks } from "./Models";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import submitBankConnection from "Utils/submitBankConnection";

const useBankConnection = (bank: Banks, exportDate: string | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const [act, setAct] = useState<Act>("start");
  const [bankUserId, setBankUserId] = useState<string>();

  const startConnection = async (phone: string): Promise<void> => {
    try {
      if (!phone) {
        throw new Error("Введите номер телефона");
      }

      if (!exportDate) {
        throw new Error("Введите дату");
      }

      dispatch(ShowPreloader());

      const { data } = await axios.post(
        `${API_URL}api/v1/${bank}/connect/start/`,
        {
          phone,
          exportStartDate: new Date(exportDate),
          startExportDate: new Date(exportDate),
        }
      );

      if (data.status === 200) {
        setAct("submit");
        setBankUserId(data.data.id);
      }
    } catch (error: any) {
      const text =
        error.response.status === 400
          ? "Интеграция уже подключена"
          : error.message;

      dispatch(
        ShowToast({
          text,
          title: "Ошибка",
          type: "error",
        })
      );
    } finally {
      dispatch(HidePreloader());
    }
  };

  const submitConnection = async (
    password: string,
    code: string | number,
    onSuccess: () => void
  ): Promise<void> => {
    try {
      if (!password) {
        throw new Error("Введите код");
      }

      if (!code) {
        throw new Error("Введите код");
      }

      if (!exportDate) {
        throw new Error("Введите дату");
      }

      if (!bankUserId) {
        throw new Error("Не удалось подключить банк");
      }

      dispatch(ShowPreloader());

      console.log("submitConnection: input data", {
        password,
        code,
        onSuccess,
      });

      const data = await submitBankConnection(bank, {
        code,
        bankUserId,
        password,
        exportDate,
      });
      console.log("response submitBankConnection", data);
      if (data.status === 200) {
        console.log("data.status === 200");
        const isSync = await syncConnection();
        isSync && onSuccess();
      } else {
        console.log("data.status != 200", data);
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.log("error response", error.response);
      console.log("error request", error.request);
      console.log(
        "error JSON.stringify(error.response)",
        JSON.stringify(error.response)
      );
      console.log(
        "error JSON.stringify(error.request)",
        JSON.stringify(error.request)
      );
      console.log("Ошибка при добавлении банка", error);
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    } finally {
      dispatch(HidePreloader());
    }
  };

  const syncConnection = async (): Promise<boolean> => {
    try {
      const { data } = await axios.get(`${API_URL}api/v1/${bank}/sync/`);
      console.log("syncConnection data", data);
      if (data.status === 200) {
        console.log("syncConnection data.status === 200", data);
        return true;
      } else {
        console.log("syncConnection data.status != 200", data);
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.log("syncConnection catch", error);
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    } finally {
      dispatch(HidePreloader());
    }

    return false;
  };

  return {
    act,
    startConnection,
    submitConnection,
  };
};

export default useBankConnection;

import { Act, Banks } from "Models/BillModel";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import BillRepository from "Repository/BillRepository";

const useBankConnection = (bank: Banks, exportDate: string | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const [act, setAct] = useState<Act>("start");
  const [bankUserId, setBankUserId] = useState<string>();

  const billRepository = new BillRepository();

  const startConnection = async (phone: string): Promise<void> => {
    if (exportDate)
      billRepository.startConnection(bank, phone, exportDate, (id) => {
        setAct("submit");
        setBankUserId(id);
      });
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

      const data = await billRepository.submitConnection(
        bank,
        code,
        bankUserId,
        password,
        exportDate
      );
      if (data) {
        if (data.status === 200) {
          const isSync = await syncConnection();
          isSync && onSuccess();
        } else {
          throw new Error(data.message);
        }
      } else {
        throw new Error("Ошибка при подтверждении");
      }
    } catch (error: any) {
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
      const data = await billRepository.syncConnection(bank);
      if (data.status === 200) {
        return true;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
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

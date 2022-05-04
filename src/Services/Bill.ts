import { BillModel } from "Models/BillModel";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { GetUserId } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";

interface UseGetBillModel {
  load: boolean;
  data: BillModel[];
  generalBalance: number;
  updateBill: () => void;
}

const useGetBill = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<BillModel[]>([]);
  const [generalBalance, setGeneralBalance] = useState<number>(0);
  const [load, setLoad] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean | null>(null);

  const updateBill = (): void => {
    if (update === null) setUpdate(true);
    else setUpdate(!update);
  };

  const getGeneralBalance = (array: BillModel[]): void => {
    const res = array.reduce((x, y) => x + y.balance.amount, 0);

    setGeneralBalance(res);
  };

  const getBills = async (): Promise<void> => {
    setLoad(false);
    try {
      const res = await axios.get(`${API_URL}api/v1/bill/`);
      if (res.data.status === 200) {
        setData(res.data.data);
        getGeneralBalance(res.data.data);
        setLoad(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
      setLoad(true);
    }
  };

  useMemo(() => {
    if (update != null) getBills();
  }, [update]);

  useEffect(() => {
    getBills();
  }, []);

  return {
    load,
    data,
    generalBalance,
    updateBill,
  } as UseGetBillModel;
};

const useAddBill = (name: string, balance: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(GetUserId);

  const addBill = async (): Promise<void> => {
    try {
      if (name.length != 0 && balance.length != 0) {
        dispatch(ShowPreloader());
        const res = await axios.post(`${API_URL}api/v1/bill/`, {
          userId,
          name,
          balance,
          cents: 0,
        });
        if (res.data.status === 201) {
          dispatch(HidePreloader());
          dispatch(
            ShowToast({
              text: "Счет добавлен",
              title: "Успех",
              type: "success",
            })
          );
        } else {
          throw new Error(res.data.message);
        }
      } else {
        throw new Error("Некорректные имя или баланс");
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
    addBill,
  };
};

export default {
  useGetBill,
  useAddBill,
};

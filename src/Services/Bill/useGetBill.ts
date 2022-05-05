import { BillModel } from "Models/BillModel";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { UseGetBillModel } from "./Models";
import useGetTinkoffCards from "./useGetTinkoffCards";

const useGetBill = (): UseGetBillModel => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<BillModel[]>([]);
  const [generalBalance, setGeneralBalance] = useState<number>(0);
  const [load, setLoad] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean | null>(null);
  const tinkoff = useGetTinkoffCards();

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
    load: load && tinkoff.load,
    tinkoffCards: tinkoff.cards,
    data,
    generalBalance,
    updateBill,
  };
};

export default useGetBill;

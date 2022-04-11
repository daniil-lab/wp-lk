import axios from "Utils/Axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { GetUserId, GetUserToken } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import { IBalances, ISberCard, ITinkoffCard, ITochkaCard } from "./Interfaces";

const useGetBill = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(GetUserId);

  const [balances, setBalances] = useState<IBalances[]>([]);

  const [generalBalance, setGeneralBalance] = useState<number>(0);

  const [load, setLoad] = useState<boolean>(false);

  const getGeneralBalance = (array: IBalances[]): void => {
    const res = array.reduce((x, y) => x + y.balance.amount, 0);

    setGeneralBalance(res);
  };

  const get = async (): Promise<void> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/bill/?userId=${userId}`);
      if (res.data.status === 200) {
        setBalances(res.data.data);
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

  const init = async (): Promise<void> => {
    await get();
  };

  useEffect(() => {
    init();
  }, []);

  return {
    load,
    balances,
    generalBalance,
  };
};

const useGetTinkoffCards = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(GetUserId);

  const [cards, setCards] = useState<ITinkoffCard[]>([]);

  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/tinkoff/cards/${userId}`);
      if (res.data.status === 200) {
        setCards(res.data.data);
        setLoad(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      if (error.response.status !== 404) {
        dispatch(
          ShowToast({
            text: error.message,
            title: "Ошибка",
            type: "error",
          })
        );
      }
      setLoad(true);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return {
    cards,
    load,
  };
};

const useGetSberCards = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(GetUserId);

  const [cards, setCards] = useState<ISberCard[]>([]);

  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${API_URL}api/v1/sber/cards/${userId}`);
      if (data.status === 200) {
        setCards(data.data);
        setLoad(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      if (error.response.status !== 404) {
        dispatch(
          ShowToast({
            text: error.message,
            title: "Ошибка",
            type: "error",
          })
        );
      }
      setLoad(true);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return {
    cards,
    load,
  };
};

const useGetTochkaCards = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(GetUserId);

  const [cards, setCards] = useState<ITochkaCard[]>([]);

  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
    try {
      const { data } = await axios.get(
        `${API_URL}api/v1/tochka/cards/${userId}`
      );
      if (data.status === 200) {
        setCards(data.data);
        setLoad(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      if (error.response.status !== 404) {
        dispatch(
          ShowToast({
            text: error.message,
            title: "Ошибка",
            type: "error",
          })
        );
      }
      setLoad(true);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return {
    cards,
    load,
  };
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

const useTinkoff = (
  phone: string,
  exportStartDate: string | null,
  password: string,
  code: string
) => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(GetUserId);

  const [status, setStatus] = useState<"signin" | "code">("signin");
  const [id, setId] = useState<string>();

  const signin = async (): Promise<void> => {
    try {
      if (!phone) {
        throw new Error("Введите номер телефона");
      }

      if (!exportStartDate) {
        throw new Error("Введите дату");
      }

      dispatch(ShowPreloader());

      const { data } = await axios.post(
        `${API_URL}api/v1/tinkoff/connect/start`,
        {
          userId,
          phone,
          exportStartDate: new Date(exportStartDate),
        }
      );

      if (data.status === 200) {
        setStatus("code");
        setId(data.data.id);
        
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

  const syncTinkoff = async (): Promise<void> => {
    try {
      if (!password) {
        throw new Error("Введите код");
      }

      if (!code) {
        throw new Error("Введите код");
      }

      const { data } = await axios.post(
        `${API_URL}api/v1/tinkoff/connect/submit`,
        {
          id,
          code,
          password,
        }
      );
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

  return {
    syncTinkoff,
    signin,
    status,
  };
};

const useSber = (phone: string, startExportDate: string | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(GetUserId);

  const syncSber = async (): Promise<void> => {
    try {
      if (!phone) {
        throw new Error("Введите логин");
      }

      if (!startExportDate) {
        throw new Error("Введите дату");
      }

      dispatch(ShowPreloader());

      const { data } = await axios.post(`${API_URL}api/v1/sber/connect/start`, {
        userId,
        phone,
        startExportDate: new Date(startExportDate),
      });
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
    syncSber,
  };
};

export default {
  useGetBill,
  useGetTinkoffCards,
  useGetSberCards,
  useGetTochkaCards,
  useAddBill,
  useTinkoff,
  useSber,
};

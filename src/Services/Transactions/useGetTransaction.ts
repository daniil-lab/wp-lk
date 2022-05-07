import {
  TransactionsSortedModel,
  TranscationModel,
} from "Models/TransactionModel";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "Redux/Store";
import { BillType, UseTransactionParams } from "./Models";
import moment from "moment";
import "moment/locale/ru";
import { API_URL } from "Utils/Config";
import { ShowToast } from "Redux/Actions";
import axios from "Utils/Axios";
import ArrayGroups from "Utils/ArrayGroups";
import useGetCategories from "Services/Category/useGetCategories";

const sorted = (array: TranscationModel[]): TransactionsSortedModel[] => {
  const sortedTransactionByGroup = ArrayGroups(array);
  const sortedTransactionByDate = sortedTransactionByGroup.sort(
    (x, y) =>
      <any>moment(y?.date ?? y?.createAt).format("L") -
      <any>moment(x?.date ?? x?.createAt).format("L")
  );
  return sortedTransactionByDate;
};

const useGetTransaction = (): UseTransactionParams => {
  const dispatch = useDispatch<AppDispatch>();
  const [load, setLoad] = useState<boolean>(false);
  const [bill, setBill] = useState<string | null>(null);
  const [billType, setBillType] = useState<BillType>("general");
  const [data, setData] = useState<TransactionsSortedModel[]>([]);
  const [startDate, setStartDate] = useState<string>(
    `${moment().startOf("month").format("YYYY-MM-DD")}T00:00:00Z`
  );
  const [endDate, setEndDate] = useState<string>(
    `${moment().endOf("month").format("YYYY-MM-DD")}T23:59:59Z`
  );

  const [update, setUpdate] = useState<boolean | null>(null);
  const updateTransactions = (): void => {
    if (update === null) setUpdate(true);
    else setUpdate(!update);
  };

  const category = useGetCategories();

  const existsCategory = (id: string): boolean => {
    if (category.categories.find((c) => c.id === id)) return true;
    else return false;
  };
  const getTransactionForExistCategory = (): TransactionsSortedModel[] => {
    let res = [];
    data.forEach((g) => {
      if (g.transactions.length > 0) {
        g.transactions.map((t) => {
          if (existsCategory(t?.category?.id)) res.push(t);
        });
      }
    });

    return sorted(res);
  };

  const transactions = useMemo(() => {
    if (load) {
      if (
        billType === "tinkoff" ||
        billType === "sber" ||
        billType === "tochka"
      ) {
        return data.filter(
          (v) =>
            moment(moment(startDate.split("T")[0], "YYYY-MM-DD")).get(
              "month"
            ) == moment(v.date).get("month")
        );
      } else {
        return !bill
          ? data.filter(
              (v) =>
                moment(moment(startDate.split("T")[0], "YYYY-MM-DD")).get(
                  "month"
                ) == moment(v.date).get("month")
            )
          : data.filter(
              (v) =>
                moment(moment(startDate.split("T")[0], "YYYY-MM-DD")).get(
                  "month"
                ) == moment(v.date).get("month")
            );
      }
    } else {
      return [];
    }
  }, [load, data, startDate, endDate, bill, category.load]);

  const income = useMemo(() => {
    if (load) {
      const arr = [...transactions.map((t) => t.transactions)]
        .flat(1)
        .filter(
          (el) => el?.action === "DEPOSIT" || el?.transactionType === "EARN"
        )
        .map((el) => el?.sum ?? el?.amount?.amount);

      return arr.reduce((b, a) => <number>b + <number>a, 0) as number;
    } else {
      return 0 as number;
    }
  }, [load, category.load, data, startDate, endDate, bill]);

  const expenses = useMemo(() => {
    if (load) {
      const arr = [...transactions.map((t) => t.transactions)]
        .flat(1)
        .filter(
          (el) => el?.action === "WITHDRAW" || el?.transactionType === "SPEND"
        )
        .map((el) => el?.sum ?? el?.amount?.amount);

      return arr.reduce((b, a) => <number>b + <number>a, 0) as number;
    } else {
      return 0 as number;
    }
  }, [load, category.load, data, startDate, endDate, bill]);

  const prices = useMemo(() => {
    if (load) {
      let res = {};
      const arr = [...transactions.map((t) => t.transactions)]
        .flat(1)
        .map((el) => ({
          sum: el?.sum ?? el?.amount?.amount,
          value: el.category?.name,
          color: el.category?.color.hex,
        }));
      arr.forEach((el) => {
        if (el.value) {
          if (res[el.value]) {
            res[el.value] = {
              value: el.value,
              sum: res[el.value]?.sum + el?.sum,
              color: el.color,
            };
          } else {
            res[el.value] = {
              value: el.value,
              sum: el?.sum,
              color: el.color,
            };
          }
        }
      });

      return Object.values(res).sort((a: any, b: any) => a.sum - b.sum);
    } else {
      return [];
    }
  }, [load, category.load, data, startDate, endDate, bill]);

  const date = useMemo(() => {
    moment.locale("ru");
    return `${moment(startDate.split("T")[0], "YYYY-MM-DD").format(
      "MMMM YYYY"
    )}`;
  }, [startDate, endDate]);

  // MARK : Change date
  const isLastMonth = useMemo(() => {
    if (
      `${moment(startDate).startOf("month").format("YYYY-MM-DD")}T00:00:00Z` ===
      `${moment().startOf("month").format("YYYY-MM-DD")}T00:00:00Z`
    ) {
      return false;
    } else {
      return true;
    }
  }, [startDate, endDate]);

  const setStart = (date: string): void =>
    setStartDate(`${moment(date).format("YYYY-MM-DD")}T00:00:00Z`);

  const setEnd = (date: string): void =>
    setEndDate(`${moment(date).format("YYYY-MM-DD")}T23:59:59Z`);

  const nextMonth = () => {
    if (!isLastMonth) return;
    setStartDate(
      `${moment(startDate)
        .startOf("month")
        .add(1, "months")
        .format("YYYY-MM-DD")}T00:00:00Z`
    );
    setEndDate(
      `${moment(startDate)
        .endOf("month")
        .add(1, "months")
        .format("YYYY-MM-DD")}T23:59:59Z`
    );
  };

  const prevMonth = () => {
    setStartDate(
      `${moment(startDate)
        .startOf("month")
        .subtract(1, "months")
        .format("YYYY-MM-DD")}T00:00:00Z`
    );
    setEndDate(
      `${moment(startDate)
        .endOf("month")
        .subtract(1, "months")
        .format("YYYY-MM-DD")}T23:59:59Z`
    );
  };

  // MARK : Check model
  const getAllTransactions = async (): Promise<void> => {
    try {
      await axios
        .get(
          `${API_URL}api/v1/abstract/all-transactions?startDate=${startDate}&endDate=${endDate}&page=0&pageSize=10`
        )
        .then((data) => {
          setData(sorted(data.data.data.page));
          setLoad(true);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error: any) {
      setLoad(true);
      dispatch(
        ShowToast({
          text: "Не удалось загрузить список транзакий",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  // MARK : check model
  const getBillTransactions = async (): Promise<void> => {
    try {
      await axios
        .get(
          `${API_URL}api/v1/transaction/bill/${bill}?page=0&pageSize=20&startDate=${startDate}&endDate=${endDate}`
        )
        .then((data) => {
          setData(sorted(data.data.data.page));
          setLoad(true);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error: any) {
      setLoad(true);
      dispatch(
        ShowToast({
          text: "Не удалось загрузить список транзакий",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  const getTinkoffransactions = async (): Promise<void> => {
    try {
      await axios
        .get(
          `${API_URL}api/v1/tinkoff/transactions/${bill}?page=0&pageSize=20&startDate=${startDate}&endDate=${endDate}`
        )
        .then((data) => {
          console.log("Tinkoff transactions", data.data.data.page);
          setData(sorted(data.data.data.page));
          setLoad(true);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error: any) {
      setLoad(true);
      dispatch(
        ShowToast({
          text: "Не удалось загрузить список транзакий",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  const getSberTransactions = async (): Promise<void> => {
    try {
      await axios
        .get(
          `${API_URL}api/v1/sber/transactions/${bill}?page=0&pageSize=20&startDate=${startDate}&endDate=${endDate}`
        )
        .then((data) => {
          setData(sorted(data.data.data.page));
          setLoad(true);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error: any) {
      setLoad(true);
      dispatch(
        ShowToast({
          text: "Не удалось загрузить список транзакий",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  const getTochkaTransactions = async (): Promise<void> => {
    try {
      await axios
        .get(
          `${API_URL}api/v1/tochka/transactions/${bill}?page=0&pageSize=20&startDate=${startDate}&endDate=${endDate}`
        )
        .then((data) => {
          setData(sorted(data.data.data.page));
          setLoad(true);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error: any) {
      setLoad(true);
      dispatch(
        ShowToast({
          text: "Не удалось загрузить список транзакий",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (update != null) {
      if (load) {
        setLoad(false);
      }
      if (billType === "general") getAllTransactions();
      if (billType === "bill") getBillTransactions();
      if (billType === "tinkoff") getTinkoffransactions();
      if (billType === "sber") getSberTransactions();
      if (billType === "tochka") getTinkoffransactions();
      console.log("UPDATE TRANSACTIONS");
    }
  }, [update]);

  useEffect(() => {
    if (load) {
      setLoad(false);
    }
    if (billType === "general") getAllTransactions();
    if (billType === "bill") getBillTransactions();
    if (billType === "tinkoff") getTinkoffransactions();
    if (billType === "sber") getSberTransactions();
    if (billType === "tochka") getTochkaTransactions();
    console.log("GET TRANSACTIONS");
  }, [startDate, endDate, bill]);

  return {
    load: load,
    bill,
    billType,
    setBillType,
    setBill,
    date: {
      date: date,
      setStart,
      setEnd,
      nextMonth,
      prevMonth,
      startDate,
      endDate,
    },
    transactions,
    isLastMonth,
    income,
    expenses,
    prices,
    updateTransactions,
  };
};

export default useGetTransaction;

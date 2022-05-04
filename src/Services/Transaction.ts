import moment from "moment";
import "moment/locale/ru";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import axios from "Utils/Axios";
import {
  AbstractTransactionModel,
  TransactionModel,
  TransactionsSortedModel,
} from "Models/TransactionModel";
import ArrayGroups from "Utils/ArrayGroups";
import { OperationParamsType } from "./Interfaces";
import QrScanner from "qr-scanner";

export type UseTransactionParams = {
  load: boolean;
  bill: string | null;
  billType: BillType;
  setBillType: React.Dispatch<React.SetStateAction<BillType>>;
  setBill: React.Dispatch<React.SetStateAction<string | null>>;
  date: {
    date: string;
    setStart: (date: string) => void;
    setEnd: (date: string) => void;
    nextMonth: () => void;
    prevMonth: () => void;
    startDate: string;
    endDate: string;
  };
  transactions: TransactionsSortedModel[];
  isLastMonth: boolean;
  income: number;
  expenses: number;
  prices: any;
  updateTransactions: () => void;
};

export type BillType = "general" | "bill";

// MARK : Sorted transactions by groups date and min to max date
const sorted = (
  array: AbstractTransactionModel[] | TransactionModel[]
): TransactionsSortedModel[] => {
  const sortedTransactionByGroup = ArrayGroups(array);
  const sortedTransactionByDate = sortedTransactionByGroup.sort(
    (x, y) => <any>moment(y.date).format("L") - <any>moment(x.date).format("L")
  );
  return sortedTransactionByDate;
};

const useGetTransaction = () => {
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

  const transactions = useMemo(() => {
    return load
      ? !bill
        ? data
        : data.filter(
            (v) =>
              moment(moment(startDate.split("T")[0], "YYYY-MM-DD")).get(
                "month"
              ) == moment(v.date).get("month")
          )
      : [];
  }, [load, data, startDate, endDate, bill]);

  const income = useMemo(() => {
    if (load) {
      const arr = [...transactions.map((t) => t.transactions)]
        .flat(1)
        .filter(
          (el) => el.action === "DEPOSIT" || el.transactionType === "EARN"
        )
        .map((el) => el.sum);

      return arr.reduce((b, a) => b + a, 0);
    }
  }, [load, data, startDate, endDate, bill]);

  const expenses = useMemo(() => {
    if (load) {
      const arr = [...transactions.map((t) => t.transactions)]
        .flat(1)
        .filter(
          (el) => el.action === "WITHDRAW" || el.transactionType === "SPEND"
        )
        .map((el) => el.sum);

      return arr.reduce((b, a) => b + a, 0);
    }
  }, [load, data, startDate, endDate, bill]);

  const prices = useMemo(() => {
    if (load) {
      let res = {};
      const arr = [...transactions.map((t) => t.transactions)]
        .flat(1)
        .map((el) => ({
          sum: el.sum,
          value: el.category?.name,
          color: el.category?.color.hex,
        }));
      arr.forEach((el) => {
        if (el.value) {
          if (res[el.value]) {
            res[el.value] = {
              value: el.value,
              sum: res[el.value].sum + el.sum,
              color: el.color,
            };
          } else {
            res[el.value] = {
              value: el.value,
              sum: el.sum,
              color: el.color,
            };
          }
        }
      });

      return Object.values(res).sort((a: any, b: any) => a.sum - b.sum);
    } else {
      return [];
    }
  }, [load, data, startDate, endDate, bill]);

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

  // MARK : fetch data transaction
  const getUrl = () => {
    switch (billType) {
      case "bill": {
        return `${API_URL}api/v1/transaction/bill/${bill}?page=0&pageSize=10`;
      }
      default: {
        return `${API_URL}api/v1/abstract/all-transactions?startDate=${startDate}&endDate=${endDate}&page=0&pageSize=10`;
      }
    }
  };

  const getTransactions = async (): Promise<void> => {
    try {
      const url = getUrl();
      // console.log(url);
      await axios
        .get(url)
        .then((data) => {
          console.log(data.data.data.page);
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
      getTransactions();
    }
  }, [update]);

  useEffect(() => {
    if (load) {
      setLoad(false);
    }
    getTransactions();
  }, [startDate, endDate, bill]);

  return {
    load,
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
  } as UseTransactionParams;
};

const useAddOperation = (OperationParams: OperationParamsType) => {
  const dispatch = useDispatch();

  const OperationAdd = async (onSuccess: () => void): Promise<void> => {
    try {
      const {
        bill,
        operationType,
        summ,
        description,
        selectedCategory,
        location,
        date,
        qr,
        placeName,
      } = OperationParams;

      if (!date) {
        throw new Error("Укажите дату");
      }

      if (!summ) {
        throw new Error("Укажите сумму");
      }
      if (qr) {
        try {
          const { data } = await QrScanner.scanImage(qr, {
            returnDetailedScanResult: true,
          });

          const values = new URLSearchParams(data);
          const t = values.get("t");

          const params = {
            sum: +(values.get("s") || 0) * 100,
            fn: values.get("fn"),
            operationType: values.get("n")?.substring(0, 1),
            fiscalDocumentId: values.get("i"),
            fiscalSign: values.get("fp"),
            rawData: false,
          };

          if (t) {
            const year = +t.substring(0, 4);
            const month = +t.substring(4, 6);
            const day = +t.substring(6, 8);
            const hour = +t.substring(9, 11);
            const minute = +t.substring(11, 13);

            const date = new Date(year, month, day, hour, minute);

            params["date"] = date;
          }

          const fns = await axios.get(`${API_URL}api/v1/fns/ticket-info`, {
            params,
          });

          if (fns.data.status === 200) {
            dispatch(
              ShowToast({
                text: "Чек загружен",
                title: "Успешно",
                type: "success",
              })
            );
          } else {
            throw new Error(fns.data.message);
          }
        } catch (error) {
          dispatch(
            ShowToast({
              text: "Не удалось обработать чек",
              title: "Ошибка",
              type: "error",
            })
          );
        }
      }

      let data =
        operationType === "WITHDRAW"
          ? {
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              time: `${date}T16:23:25.356Z`,
            }
          : {
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              time: `${date}T16:23:25.356Z`,
            };
      if (operationType === "WITHDRAW" && location != null) {
        data = {
          ...data,
          lon: location![1],
          lat: location![0],
        };
      }
      if (operationType === "WITHDRAW" && placeName) {
        data = {
          ...data,
          placeName,
        };
      }

      console.log("data", data);

      const url =
        operationType === "WITHDRAW"
          ? `api/v1/bill/withdraw/${bill?.id}`
          : `api/v1/bill/deposit/${bill?.id}`;

      const res = await axios.patch(`${API_URL}${url}`, data);
      if (res.data.status === 200) {
        dispatch(
          ShowToast({
            text: "Операция добавлена",
            title: "Успешно",
            type: "success",
          })
        );
        onSuccess();
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
    }
  };
  return { OperationAdd };
};

export const useRemoveTransaction = (transactionId: string | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const deleteTransaction = async () => {
    try {
      if (!transactionId) {
        throw new Error("Ошибка обработки транзакции");
      }

      dispatch(ShowPreloader());

      const { data } = await axios.delete(
        `${API_URL}api/v1/transaction/${transactionId}`
      );

      if (data.status === 200) {
        dispatch(
          ShowToast({
            text: "Операция удалена",
            title: "Успешно",
            type: "success",
          })
        );
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
  };

  return { deleteTransaction };
};

export default {
  useGetTransaction,
  useAddOperation,
  useRemoveTransaction,
};

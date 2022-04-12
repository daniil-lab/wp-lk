import moment from "moment";
import QrScanner from "qr-scanner";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { GetUserId } from "Redux/Selectors";
import ArrayGroups from "Utils/ArrayGroups";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import Category from "./Category";
import {
  ITinkoffTransaction,
  ITransaction,
  OperationParamsType,
  TransactionsSorted,
  UserTranscationsType,
} from "./Interfaces";

const useGetTransaction = () => {
  const userId = useSelector(GetUserId);

  const [load, setLoad] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<string[]>([
    moment().format("YYYY-MM-DD"),
  ]);

  const [transactions, setTransactions] = useState<TransactionsSorted[]>([]);

  const filterByDate = (v: TransactionsSorted) => selectedDate.includes(v.date);

  const income = useMemo(() => {
    return transactions
      .filter(filterByDate)
      .map((item) =>
        item.transactions
          .filter((i) => i.action === "DEPOSIT" || i.action === "EARN")
          .reduce((x, y) => x + y.amount, 0)
      )
      .reduce((x, y) => x + y, 0);
  }, [selectedDate]);

  const expenses = useMemo(() => {
    return transactions
      .filter(filterByDate)
      .map((item) =>
        item.transactions
          .filter((i) => i.action === "WITHDRAW" || i.action === "SPEND")
          .reduce((x, y) => x + y.amount, 0)
      )
      .reduce((x, y) => x + y, 0);
  }, [selectedDate]);

  const setDate = (dates: string[]): void =>
    setSelectedDate(dates.map((i) => moment(i).format("YYYY-MM-DD")));

  const filterdTransactions = useMemo(() => {
    const f = transactions.filter(filterByDate);

    if (f) return f;
    else return [];
  }, [selectedDate, transactions]);

  const prices = useMemo(() => {
    const f = transactions
      .find(filterByDate)
      ?.transactions.map((t) => t.amount);
    if (f) return f as number[] | string[];
    else return [];
  }, [selectedDate, transactions]);

  const sorted = (array: UserTranscationsType[]): TransactionsSorted[] => {
    const sortedTransactionByGroup = ArrayGroups(array);
    const sortedTransactionByDate = sortedTransactionByGroup.sort(
      (x, y) =>
        <any>moment(y.date).format("L") - <any>moment(x.date).format("L")
    );
    return sortedTransactionByDate;
  };

  const getOrdinaryTransactions = async (): Promise<ITransaction[]> => {
    try {
      const res = await axios.get(
        `${API_URL}api/v1/transaction/user/${userId}?page=0&pageSize=100`
      );
      if (res.data.status === 200) {
        return res.data.data.page;
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      console.log(error);
      return [];
    }
  };

  const getTinkoffTransactions = async (): Promise<ITinkoffTransaction[]> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/tinkoff/cards/${userId}`);
      if (res.data.status === 200) {
        const cards = res.data.data;

        let array: ITinkoffTransaction[] = [];

        for (let i = 0; i < cards.length; i++) {
          const tr = await axios.get(
            `${API_URL}api/v1/tinkoff/transactions/${cards[i].id}?page=0&pageSize=100`
          );
          array = [...array, ...tr.data.data.page];
        }
        return array;
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      console.log(error);
      return [];
    }
  };

  const get = async (): Promise<void> => {
    const ordinaryTransactions = await getOrdinaryTransactions();
    const tinkoffTransactions = await getTinkoffTransactions();

    const t: UserTranscationsType[] = [];

    for (let i = 0; i < ordinaryTransactions.length; i++) {
      const transaction = ordinaryTransactions[i];
      t.push({
        action: transaction.action,
        category: transaction.category ?? null,
        date: transaction.createAt,
        currency: transaction.currency,
        amount: transaction.sum,
        title: transaction.bill.name,
      });
    }

    for (let i = 0; i < tinkoffTransactions.length; i++) {
      const transaction = tinkoffTransactions[i];
      t.push({
        action: transaction.transactionType,
        category: null,
        date: transaction.date,
        currency: transaction.currency,
        amount: transaction.amount.amount,
        title: "Tinkoff",
      });
    }

    const sort = sorted(t);

    setTransactions(sort);

    setLoad(true);
  };

  const init = async (): Promise<void> => await get();

  useEffect(() => {
    init();
  }, []);

  return {
    load,
    transactions: filterdTransactions,
    selectedDate,
    setDate,
    prices,
    allTransactions: transactions,
    income,
    expenses,
  };
};

const useGetBudget = () => {
  const { allTransactions: transactions } = useGetTransaction();

  const { useGetCategory } = Category;
  const { categories, load } = useGetCategory();

  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment().format("YYYY-MM-DD")
  );

  const prev = (): void => {
    let currentDate = moment(selectedMonth);
    setSelectedMonth(
      moment(currentDate).subtract(1, "months").format("YYYY-MM-DD")
    );
  };

  const next = (): void => {
    let currentDate = moment(selectedMonth);
    let futureMonth = moment(currentDate).add(1, "M");
    let futureMonthEnd = moment(futureMonth).endOf("month");

    if (
      currentDate.date() != futureMonth.date() &&
      futureMonth.isSame(futureMonthEnd.format("YYYY-MM-DD"))
    ) {
      futureMonth = futureMonth.add(1, "d");
    }
    setSelectedMonth(futureMonth.format("YYYY-MM-DD"));
  };

  const expenses = useMemo(() => {
    const f = transactions
      .filter(
        (transaction) =>
          transaction.date.split("-")[1] === selectedMonth.split("-")[1] &&
          transaction.date.split("-")[0] === selectedMonth.split("-")[0]
      )
      .map((t) => t.transactions);

    const merged = f.flat(1);

    const exp = merged.filter(
      (t) => t.action === "WITHDRAW" || t.action === "SPEND"
    );

    const amount =
      exp.length > 0
        ? exp.map((item) => item.amount).reduce((prev, next) => prev + next)
        : 0;

    console.log({
      array: exp,
      amount,
    });

    return "expenses";
  }, [selectedMonth]);

  useEffect(() => {
    if (load) {
      console.log("categories", categories);
    }
  }, [load]);

  return {
    selectedMonth,
    expenses,
    prev,
    next,
  };
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
      } = OperationParams;

      if (!date) {
        throw new Error("Укажите дату");
      }

      if (!summ) {
        throw new Error("Укажите сумму");
      }

      if (!location) {
        throw new Error("Укажите местоположение");
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

      const data =
        operationType === "WITHDRAW"
          ? {
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              lon: location![1],
              lat: location![0],
              placeName: "string",
              time: `${date}T16:23:25.356Z`,
            }
          : {
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              time: `${date}T16:23:25.356Z`,
            };

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

export default {
  useGetTransaction,
  useAddOperation,
  useGetBudget,
};

import moment from "moment";
import QrScanner from "qr-scanner";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
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

const useGetTransaction = (selecterBill?: string | null) => {
  const [load, setLoad] = useState<boolean>(false);
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [prices, setPreces] = useState<(string | number)[]>([]);
  const [transactions, setTransactions] = useState<TransactionsSorted[]>([]);
  const [selectedDate, setSelectedDate] = useState<string[]>([
    moment().format("YYYY-MM-DD"),
  ]);

  const setDate = (dates: string[]): void =>
    setSelectedDate(dates.map((i) => moment(i).format("YYYY-MM-DD")));

  // MARK : Controll transaction of date
  function next() {
    if (!moment(selectedDate[0]).isSameOrAfter(moment().subtract(1, "day")))
      setDate([moment(selectedDate[0]).add(1, "months").format("YYYY-MM-DD")]);
  }

  function prev() {
    setDate([
      moment(selectedDate[0]).subtract(1, "months").format("YYYY-MM-DD"),
    ]);
  }

  // MARK : Filter by selected date
  const filterByDate = (v: TransactionsSorted) => {
    const now = moment(selectedDate[0]);
    return moment(now).get("month") == moment(v.date).get("month");
  };

  // MARK : Filter by selected bill
  const mapBySelectedBill = (v: TransactionsSorted) => {
    return {
      ...v,
      transactions: v.transactions.filter(
        (b) => !selecterBill || b.title == selecterBill
      ),
    };
  };

  // MARK : Sorted transactions by groups date and min to max date
  const sorted = (array: UserTranscationsType[]): TransactionsSorted[] => {
    const sortedTransactionByGroup = ArrayGroups(array);
    const sortedTransactionByDate = sortedTransactionByGroup.sort(
      (x, y) =>
        <any>moment(y.date).format("L") - <any>moment(x.date).format("L")
    );
    return sortedTransactionByDate;
  };

  // MARK : Get transactions of bills
  const getOrdinaryTransactions = async (): Promise<ITransaction[]> => {
    try {
      const res = await axios.get(
        `${API_URL}api/v1/transaction/user/?page=0&pageSize=10`
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

  // MARK : Get transactions of tinkoff
  const getTinkoffTransactions = async (): Promise<ITinkoffTransaction[]> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/tinkoff/cards/`);
      if (res.data.status === 200) {
        const cards = res.data.data;

        let array: ITinkoffTransaction[] = [];

        for (let i = 0; i < cards.length; i++) {
          const tr = await axios.get(
            `${API_URL}api/v1/tinkoff/transactions/${cards[i].id}?page=0&pageSize=10`
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

  // MARK : Getter transactions list
  const get = async (): Promise<void> => {
    const ordinaryTransactions = await getOrdinaryTransactions();
    const tinkoffTransactions = await getTinkoffTransactions();

    const t: UserTranscationsType[] = [];

    for (let i = 0; i < ordinaryTransactions.length; i++) {
      const transaction = ordinaryTransactions[i];
      t.push({
        id: transaction.id,
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
        id: transaction.id,
        action: transaction.transactionType,
        category: null,
        date: transaction.date,
        currency: transaction.currency,
        amount: transaction.amount.amount,
        title: "Tinkoff",
      });
    }

    setTransactions(sorted(t));

    setLoad(true);
  };

  const init = async (): Promise<void> => await get();

  // MARK : Computed transactions by change date
  const filterdTransactions = useMemo(() => {
    const f = transactions.filter(filterByDate);
    if (f) return f;
    else return [];
  }, [selectedDate, transactions]);

  // MARK : Watch change date
  useEffect(() => {
    if (moment(selectedDate[0]).isAfter(moment())) {
      setSelectedDate([moment().format("YYYY-MM-DD")]);
    }
  }, [selectedDate]);

  // MARK : Watch income & expenses
  useEffect(() => {
    const newIcome = transactions
      .filter(filterByDate)
      .map(mapBySelectedBill)
      .map((item) =>
        item.transactions
          .filter((i) => i.action === "DEPOSIT" || i.action === "EARN")
          .reduce((x, y) => +x + +y.amount, 0)
      )
      .reduce((x, y) => x + y, 0);

    const newExpenses = transactions
      .filter(filterByDate)
      .map(mapBySelectedBill)
      .map((item) =>
        item.transactions
          .filter((i) => i.action === "WITHDRAW" || i.action === "SPEND")
          .reduce((x, y) => +x + +y.amount, 0)
      )
      .reduce((x, y) => x + y, 0);

    setIncome(newIcome);
    setExpenses(newExpenses);
  }, [selectedDate, transactions, selecterBill]);

  // MARK : Calculate prices transactions for chart
  useEffect(() => {
    let res = {};
    transactions
      .find(filterByDate)
      ?.transactions.filter((b) => !selecterBill || b.title == selecterBill)
      .forEach((el) => {
        if (el.category) {
          res[el.category.name] = res[el.category.name]
            ? (res[el.category?.name] += +el.amount)
            : +el.amount;
        } else {
          res[el.title] = res[el.title]
            ? (res[el.title] += +el.amount)
            : +el.amount;
        }
      });
    setPreces(Object.values(res));
  }, [selectedDate, transactions, selecterBill]);

  // MARK : Watch change date
  useEffect(() => {
    if (moment(selectedDate[0]).isAfter(moment())) {
      setSelectedDate([moment().format("YYYY-MM-DD")]);
    }
  }, [selectedDate]);

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
    next,
    prev,
  };
};

const useGetBudget = () => {
  const { allTransactions } = useGetTransaction();

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
    const f = allTransactions
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
        ? exp.map((item) => item.amount).reduce((prev, next) => +prev + +next)
        : 0;

    return "expenses";
  }, [selectedMonth]);

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
        placeName,
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

      // if (operationType === "WITHDRAW" && !placeName) {
      //   throw new Error("Укажите название местоположения");
      // }

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
              placeName,
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

export const useTransaction = (transactionId: string | null) => {
  const dispatch = useDispatch();

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

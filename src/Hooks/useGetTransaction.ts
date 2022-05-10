import { TransactionsSortedModel } from "Models/TransactionModel";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "Redux/Store";
import moment from "moment";
import "moment/locale/ru";
import { BillType } from "Models/BillModel";
import TransactionRepository from "Repository/TransactionRepository";
import TransactionSorted from "Utils/TransactionSorted";
import { ShowToast } from "Redux/Actions";
import useGetCategories from "./useGetCategories";

const useGetTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [load, setLoad] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean | null>(null);

  const [bill, setBill] = useState<string | null>(null);
  const [billType, setBillType] = useState<BillType>("general");
  const [data, setData] = useState<TransactionsSortedModel[]>([]);
  const [startDate, setStartDate] = useState<string>(
    `${moment().startOf("month").format("YYYY-MM-DD")}T00:00:00Z`
  );
  const [endDate, setEndDate] = useState<string>(
    `${moment().endOf("month").format("YYYY-MM-DD")}T23:59:59Z`
  );

  const transactionRepository = new TransactionRepository();

  const category = useGetCategories();

  const updateTransactions = (): void => {
    if (update === null) setUpdate(true);
    else setUpdate(!update);
  };

  const date = useMemo(() => {
    moment.locale("ru");
    return `${moment(startDate.split("T")[0], "YYYY-MM-DD").format(
      "MMMM YYYY"
    )}`;
  }, [startDate, endDate]);

  const transactions = useMemo(() => {
    if (load) {
      return data.filter(
        (v) =>
          moment(moment(startDate.split("T")[0], "YYYY-MM-DD")).get("month") ==
          moment(v.date).get("month")
      );
    } else {
      return [];
    }
  }, [load, data, startDate, endDate, bill, category.load]);

  const income = useMemo(() => {
    if (load) {
      return [...transactions.map((t) => t.transactions)]
        .flat(1)
        .filter(
          (el) => el?.action === "DEPOSIT" || el?.transactionType === "EARN"
        )
        .map((el) => el?.sum ?? el?.amount?.amount)
        .reduce((b, a) => <number>b + <number>a, 0) as number;
    } else {
      return 0 as number;
    }
  }, [load, category.load, data, startDate, endDate, bill]);

  const expenses = useMemo(() => {
    if (load) {
      return [...transactions.map((t) => t.transactions)]
        .flat(1)
        .filter(
          (el) => el?.action === "WITHDRAW" || el?.transactionType === "SPEND"
        )
        .map((el) => el?.sum ?? el?.amount?.amount)
        .reduce((b, a) => <number>b + <number>a, 0) as number;
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

      return Object.values(res).sort(
        (a: any, b: any) => a.sum - b.sum
      ) as number[];
    } else {
      return [];
    }
  }, [load, category.load, data, startDate, endDate, bill]);

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

  const asyncEffect = async (): Promise<void> => {
    if (billType === "general") {
      const action = await transactionRepository.getGeneralTransactions(
        startDate,
        endDate
      );
      if (action) setData([...TransactionSorted(action)]);
      else
        dispatch(
          ShowToast({
            type: "error",
            title: "Ошибка",
            text: "Ошибка при получении транзакций",
          })
        );
    }
    if (billType === "bill") {
      const action = await transactionRepository.getBillTransactions(
        bill!,
        startDate,
        endDate
      );
      if (action) setData([...TransactionSorted(action)]);
      else
        dispatch(
          ShowToast({
            type: "error",
            title: "Ошибка",
            text: "Ошибка при получении транзакций",
          })
        );
    }

    if (billType === "tinkoff") {
      const action = await transactionRepository.getTinkoffransactions(
        bill!,
        startDate,
        endDate
      );
      if (action) setData([...TransactionSorted(action)]);
      else
        dispatch(
          ShowToast({
            type: "error",
            title: "Ошибка",
            text: "Ошибка при получении транзакций",
          })
        );
    }
    if (billType === "sber") {
      const action = await transactionRepository.getSberTransactions(
        bill!,
        startDate,
        endDate
      );
      if (action) setData([...TransactionSorted(action)]);
      else
        dispatch(
          ShowToast({
            type: "error",
            title: "Ошибка",
            text: "Ошибка при получении транзакций",
          })
        );
    }
    if (billType === "tochka") {
      const action = await transactionRepository.getTinkoffransactions(
        bill!,
        startDate,
        endDate
      );
      if (action) setData([...TransactionSorted(action)]);
      else
        dispatch(
          ShowToast({
            type: "error",
            title: "Ошибка",
            text: "Ошибка при получении транзакций",
          })
        );
    }
    setLoad(true);
  };

  useEffect(() => {
    if (update != null) {
      if (load) {
        setLoad(false);
      }
      asyncEffect();
    }
  }, [update]);

  useEffect(() => {
    if (load) {
      setLoad(false);
    }
    asyncEffect();
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

import {
  AbstractTransactionModel,
  TransactionModel,
  TransactionsSortedModel,
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

const sorted = (
  array: AbstractTransactionModel[] | TransactionModel[]
): TransactionsSortedModel[] => {
  const sortedTransactionByGroup = ArrayGroups(array);
  const sortedTransactionByDate = sortedTransactionByGroup.sort(
    (x, y) => <any>moment(y.date).format("L") - <any>moment(x.date).format("L")
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
    return load
      ? !bill
        ? getTransactionForExistCategory()
        : getTransactionForExistCategory().filter(
            (v) =>
              moment(moment(startDate.split("T")[0], "YYYY-MM-DD")).get(
                "month"
              ) == moment(v.date).get("month")
          )
      : [];
  }, [load, data, startDate, endDate, bill, category.load]);

  const income = useMemo(() => {
    if (load) {
      const arr = [...transactions.map((t) => t.transactions)]
        .flat(1)
        .filter(
          (el) => el.action === "DEPOSIT" || el.transactionType === "EARN"
        )
        .map((el) => el.sum);

      return arr.reduce((b, a) => b + a, 0);
    } else {
      return 0;
    }
  }, [load, category.load, data, startDate, endDate, bill]);

  const expenses = useMemo(() => {
    if (load) {
      const arr = [...transactions.map((t) => t.transactions)]
        .flat(1)
        .filter(
          (el) => el.action === "WITHDRAW" || el.transactionType === "SPEND"
        )
        .map((el) => el.sum);

      return arr.reduce((b, a) => b + a, 0);
    } else {
      return 0;
    }
  }, [load, category.load, data, startDate, endDate, bill]);

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
      await axios
        .get(url)
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

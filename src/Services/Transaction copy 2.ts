import moment from "moment";
import QrScanner from "qr-scanner";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
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
  AbstractTransaction,
  SelectedBillType,
} from "./Interfaces";

const useGetTransaction = (selecterBill?: SelectedBillType | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const [load, setLoad] = useState<boolean>(false);

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

  // MARK : Sorted transactions by groups date and min to max date
  const sorted = (
    array: AbstractTransaction[] | ITransaction[]
  ): TransactionsSorted[] => {
    const sortedTransactionByGroup = ArrayGroups(array);
    const sortedTransactionByDate = sortedTransactionByGroup.sort(
      (x, y) =>
        <any>moment(y.date).format("L") - <any>moment(x.date).format("L")
    );
    return sortedTransactionByDate;
  };

  // MARK : Filter by selected bill
  const mapBySelectedBill = (v: TransactionsSorted) => {
    return {
      ...v,
      transactions: v.transactions.filter(
        (b) => !selecterBill || b.title == selecterBill.name
      ),
    };
  };

  // MARK : Filter by selected date
  const filterByDate = (v: TransactionsSorted) => {
    const now = moment(selectedDate[0]);
    return moment(now).get("month") == moment(v.date).get("month");
  };

  // MARK : Computed transactions by selected bill
  const transactionsByBill = useMemo(() => {
    return load
      ? !selecterBill
        ? transactions.map(mapBySelectedBill)
        : transactions.filter(filterByDate)
      : [];
  }, [transactions, load]);

  // MARK : Calculate prices transactions for chart
  const price = useMemo(() => {
    let res = {};
    transactions.filter(filterByDate).map((t) => {
      t.transactions.forEach((el) => {
        if (el.category) {
          res[el.category.name] = res[el.category.name]
            ? (res[el.category?.name] += +el.sum)
            : +el.sum;
        } else {
          res[el.title] = res[el.title] ? (res[el.title] += +el.sum) : +el.sum;
        }
      });
    });

    return load ? Object.values(res) : [];
  }, [selectedDate, transactions, selecterBill]);

  // MARK : Get transactions list
  const getGeneralBillTransactions = async (): Promise<void> => {
    try {
      setLoad(false);
      let d1 = moment(selectedDate[0]).format("YYYY-MM-DD");
      let d2 = moment(selectedDate[selectedDate.length - 1]).format(
        "YYYY-MM-DD"
      );
      const url = `${API_URL}api/v1/abstract/all-transactions?startDate=${d1}T00:00:00Z&endDate=${d2}T00:00:00Z&page=0&pageSize=10`;
      console.log(url);
      await axios
        .get(url)
        .then((data) => {
          setTransactions(sorted(data.data.data.page));
          setLoad(true);
        })
        .catch((error) => {
          console.log(error.response);
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

  // MARK : Get transactions list
  const getTransactionsByBill = async (): Promise<void> => {
    try {
      setLoad(false);
      const url = `${API_URL}api/v1/transaction/bill/${selecterBill?.billId}?page=0&pageSize=10`;
      await axios
        .get(url)
        .then((data) => {
          setTransactions(sorted(data.data.data.page));
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
    if (!selecterBill) getGeneralBillTransactions();
    else {
      getTransactionsByBill();
    }
  }, [selectedDate, selecterBill]);

  return {
    load,
    selectedDate,
    setDate,
    next,
    prev,
    transactions: transactionsByBill,
    price,
  };
};

const useGetBudget = () => {
  const allTransactions = [];
  // const { allTransactions } = useGetTransaction();

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
    // const f = allTransactions
    //   .filter(
    //     (transaction) =>
    //       transaction.date.split("-")[1] === selectedMonth.split("-")[1] &&
    //       transaction.date.split("-")[0] === selectedMonth.split("-")[0]
    //   )
    //   .map((t) => t.transactions);

    // const merged = f.flat(1);

    // const exp = merged.filter(
    //   (t) => t.action === "WITHDRAW" || t.action === "SPEND"
    // );

    // const amount =
    //   exp.length > 0
    //     ? exp.map((item) => item.amount).reduce((prev, next) => +prev + +next)
    //     : 0;

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

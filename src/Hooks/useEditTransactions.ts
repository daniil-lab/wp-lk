import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import { BillModel } from "Models/BillModel";
import { BaseCategoryModel, CategoryModel } from "Models/CategoryModel";
import { TransactionType, ITransactionsSorted } from "Models/TransactionModel";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import TransactionRepository from "Repository/TransactionRepository";
import useGetBill from "./useGetBill";
import useGetCategories from "./useGetCategories";

const useEditTransactions = (
  category: ReturnType<typeof useGetCategories>,
  transactions: ITransactionsSorted[],
  bills?: ReturnType<typeof useGetBill>
) => {
  const dispatch = useDispatch<AppDispatch>();
  const transactionRepository = new TransactionRepository();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [date, setDate] = useState<null | string[]>(null);
  const [operationType, setOperationType] =
    useState<TransactionType>("WITHDRAW");
  const [selectedCategory, setSelectedCategory] =
    useState<BaseCategoryModel | null>(null);
  const [onlyForEarnCategories, setOnlyForEarnCategories] = useState<
    CategoryModel[]
  >([]);
  const [standartCategories, setStandartCategories] = useState<CategoryModel[]>(
    []
  );
  const [summ, setSumm] = useState<number | string>("");
  const [bill, setBill] = useState<BillModel | null>(null);
  const [description, setDescription] = useState<string>("");
  const [placeName, setPlaceName] = useState<string>("");
  const [location, setLocation] = useState<number[] | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  useMemo(() => {
    if (category.categories) {
      const standartArr: CategoryModel[] = [];

      const earnArr: CategoryModel[] = [];

      category.categories.forEach((category) => {
        if (category.forEarn) earnArr.push(category);
        else standartArr.push(category);
      });

      setStandartCategories(standartArr);
      setOnlyForEarnCategories(earnArr);
    }
  }, [category.load, category.categories]);

  useMemo(() => {
    if (standartCategories.length != 0 && operationType == "WITHDRAW") {
      setSelectedCategory(standartCategories[0]);
    }
  }, [category.load, standartCategories]);

  useEffect(() => {
    if (bills && bills.load) setBill(bills.data[0]);
  }, [bills?.load]);

  useEffect(() => {
    if (transactionId) {
      const transaction = transactions
        .map((t) => t.transactions)
        .flat(1)
        .find((transaction) => transaction.id === transactionId);
      if (!transaction) return;
      setDate([
        moment(
          "date" in transaction ? transaction.date : transaction?.createAt
        ).format("YYYY-MM-DD"),
      ]);
      setOperationType(
        ("action" in transaction
          ? transaction.action
          : transaction.transactionType) === "EARN"
          ? "DEPOSIT"
          : "WITHDRAW"
      );
      setSelectedCategory(transaction?.category);
      setBill(
        "bill" in transaction
          ? transaction?.bill
          : bills?.data.filter(
              (b) =>
                "billName" in transaction && b.name === transaction.billName
            )[0] ?? null
      );
      setSumm(
        ("sum" in transaction ? transaction.sum : transaction.amount) as number
      );
      setDescription(transaction.description);
      setPlaceName(
        "geocodedPlace" in transaction ? transaction.geocodedPlace : ""
      );
      setLocation(
        "latitude" in transaction
          ? ([transaction!.latitude, transaction!.longitude] as number[])
          : null
      );
    }
  }, [transactionId]);

  const edit = async (): Promise<void> => {
    dispatch(ShowPreloader());
    const action = await transactionRepository.editTransaction(
      transactionId,
      operationType,
      summ,
      description,
      selectedCategory,
      date,
      location,
      placeName,
      bill
    );
    dispatch(HidePreloader());
    if (action)
      dispatch(
        ShowToast({
          title: "Успех",
          text: "Операция изменена",
          type: "success",
        })
      );
    else
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Ошибка при изменении операции",
          type: "error",
        })
      );
  };

  const remove = async (): Promise<void> => {
    if (transactionId) {
      dispatch(ShowPreloader());
      const action = await transactionRepository.removeTransaction(
        transactionId
      );
      dispatch(HidePreloader());
      if (action)
        dispatch(
          ShowToast({
            title: "Успех",
            text: "Операция удалена",
            type: "success",
          })
        );
      else
        dispatch(
          ShowToast({
            title: "Ошибка",
            text: "Ошибка при удалении операции",
            type: "error",
          })
        );
    }
  };

  return {
    setDate,
    setOperationType,
    setSelectedCategory,
    onlyForEarnCategories,
    setOnlyForEarnCategories,
    standartCategories,
    setStandartCategories,
    setBill,
    setSumm,
    setDescription,
    setPlaceName,
    setLocation,
    bill,
    date,
    selectedCategory,
    summ,
    description,
    location,
    operationType,
    placeName,
    transactionId,
    setTransactionId,
    showEditModal,
    setShowEditModal,
    edit,
    remove,
  };
};

export default useEditTransactions;

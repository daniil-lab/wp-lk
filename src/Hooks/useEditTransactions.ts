import { BillModel } from "Models/BillModel";
import { BaseCategoryModel, CategoryModel } from "Models/CategoryModel";
import { TransactionType, TranscationModel } from "Models/TransactionModel";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import TransactionRepository from "Repository/TransactionRepository";
import { TransactionsSorted } from "Services/Interfaces";

const useEditTransactions = (
  category,
  bills,
  transactions: TransactionsSorted[]
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
        if (category.onlyForEarn) earnArr.push(category);
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
    if (bills.load) setBill(bills.data[0]);
  }, [bills.load]);

  useEffect(() => {
    if (transactionId) {
      const transaction: TranscationModel = transactions.map((g) =>
        g.transactions.filter((t) => t.id === transactionId)
      )[0][0]; // <--- ERROR
      setDate([
        moment(transaction?.date ?? transaction?.createAt).format("YYYY-MM-DD"),
      ]);
      setOperationType(
        transaction?.action ?? transaction?.transactionType === "EARN"
          ? "DEPOSIT"
          : "WITHDRAW"
      );
      setSelectedCategory(transaction?.category);
      setBill(
        transaction?.bill ??
          bills.data.filter((b) => b.name === transaction.billName)[0]
      );
      setSumm((transaction?.sum ?? transaction?.amount?.amount) as number);
      setDescription(transaction.description);
      setPlaceName(transaction?.geocodedPlace ?? "");
      setLocation(
        transaction?.latitude
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

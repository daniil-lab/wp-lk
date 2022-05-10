import axios from "axios";
import QrScanner from "qr-scanner";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import TransactionRepository from "Repository/TransactionRepository";
import { API_URL } from "Utils/Config";

const useAddTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [showAddOperationModal, setShowAddOperationModal] =
    useState<boolean>(false);

  const transactionRepository = new TransactionRepository();

  const addTransaction = async (config): Promise<boolean | undefined> => {
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
    } = config;
    if (!date) {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Укажите дату",
          type: "error",
        })
      );
    }

    if (!summ) {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Укажите сумму",
          type: "error",
        })
      );
    }

    // const { data } = await QrScanner.scanImage(qr, {
    //   returnDetailedScanResult: true,
    // });

    // const values = new URLSearchParams(data);
    // const t = values.get("t");

    // const params = {
    //   sum: +(values.get("s") || 0) * 100,
    //   fn: values.get("fn"),
    //   operationType: values.get("n")?.substring(0, 1),
    //   fiscalDocumentId: values.get("i"),
    //   fiscalSign: values.get("fp"),
    //   rawData: false,
    // };

    // if (t) {
    //   const year = +t.substring(0, 4);
    //   const month = +t.substring(4, 6);
    //   const day = +t.substring(6, 8);
    //   const hour = +t.substring(9, 11);
    //   const minute = +t.substring(11, 13);

    //   const date = new Date(year, month, day, hour, minute);

    //   params["date"] = date;
    // }

    let data = {};

    if (operationType === "WITHDRAW")
      data = {
        amount: parseInt(summ),
        cents: 0,
        description: description,
        categoryId: selectedCategory?.id,
        time: `${date}T00:00:00.000Z`,
      };

    if (operationType === "DEPOSIT")
      data = {
        amount: parseInt(summ),
        cents: 0,
        description: description,
        categoryId: selectedCategory?.id,
        time: `${date}T00:00:00.000Z`,
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

    dispatch(ShowPreloader());
    const action = await transactionRepository.addTransaction(
      bill.id,
      operationType,
      data
    );
    dispatch(HidePreloader());
    if (action) {
      dispatch(
        ShowToast({
          title: "Успех",
          text: "Операция успешно добавлена",
          type: "success",
        })
      );
      return true;
    } else {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Ошибка при добавлении операции",
          type: "error",
        })
      );
    }
  };

  return {
    addTransaction,
    modal: { showAddOperationModal, setShowAddOperationModal },
  };
};

export default useAddTransaction;

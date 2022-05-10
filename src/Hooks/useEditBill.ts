import { useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";

import BillRepository from "Repository/BillRepository";

import { AppDispatch } from "Redux/Store";

const useEditBill = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [billId, setBillId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [balance, setBalance] = useState<number | string>(0);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const billRepository = new BillRepository();

  const remove = async (): Promise<void> => {
    if (billId) {
      dispatch(ShowPreloader());
      const action = await billRepository.removeBill(billId);
      dispatch(HidePreloader());
      if (action === true)
        dispatch(
          ShowToast({
            title: "Успех",
            text: "Счет успешно удален",
            type: "success",
          })
        );
      else
        dispatch(
          ShowToast({
            title: "Ошибка",
            text: "Произошла ошибка при удалении счета",
            type: "error",
          })
        );
    }
  };

  const edit = async (): Promise<void> => {
    if (billId) {
      dispatch(ShowPreloader());
      const action = await billRepository.editBill(billId, name, balance);
      dispatch(HidePreloader());
      if (action === true)
        dispatch(
          ShowToast({
            title: "Успех",
            text: "Счет успешно изменен",
            type: "success",
          })
        );
      else
        dispatch(
          ShowToast({
            title: "Ошибка",
            text: "Произошла ошибка при редактировании счета",
            type: "error",
          })
        );
    }
  };

  return {
    name,
    setName,
    balance,
    setBalance,
    billId,
    setBillId,
    showEditModal,
    setShowEditModal,
    remove,
    edit,
  };
};

export default useEditBill;

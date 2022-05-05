import { useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";

const useRemoveBill = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billId, setBillId] = useState<string | null>(null);

  const remove = async (): Promise<void> => {
    if (!billId) {
      dispatch(
        ShowToast({
          text: "Не укдалось удалить счет",
          title: "Ошибка",
          type: "error",
        })
      );
      return;
    }
    try {
      dispatch(ShowPreloader());
      await axios.delete(`${API_URL}api/v1/bill/${billId}`);
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: "Счет успешно удален",
          title: "Успех",
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: "Не укдалось удалить счет",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return { showDeleteModal, remove, setShowDeleteModal, setBillId, billId };
};

export default useRemoveBill;

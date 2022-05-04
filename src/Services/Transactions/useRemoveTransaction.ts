import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import axios from "Utils/Axios";

export const useRemoveTransaction = (transactionId: string | null) => {
  const dispatch = useDispatch<AppDispatch>();

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

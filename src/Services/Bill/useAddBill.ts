import { useDispatch, useSelector } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { GetUserId } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import axios from "Utils/Axios";

const useAddBill = (name: string, balance: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(GetUserId);

  const addBill = async (): Promise<void> => {
    try {
      if (name.length != 0 && balance.length != 0) {
        dispatch(ShowPreloader());
        const res = await axios.post(`${API_URL}api/v1/bill/`, {
          userId,
          name,
          balance,
          cents: 0,
        });
        if (res.data.status === 201) {
          dispatch(HidePreloader());
          dispatch(
            ShowToast({
              text: "Счет добавлен",
              title: "Успех",
              type: "success",
            })
          );
        } else {
          throw new Error(res.data.message);
        }
      } else {
        throw new Error("Некорректные имя или баланс");
      }
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return addBill;
};

export default useAddBill;

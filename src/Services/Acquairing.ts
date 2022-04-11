import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { GetUserId } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";

export const useAcquiring = (subscriptionVariantId?: string) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(GetUserId);

  const subscribe = async () => {
    try {
      if (!subscriptionVariantId) {
        throw new Error("Подписка не выбрана");
      }

      dispatch(ShowPreloader());

      const { data } = await axios.get(
        `${API_URL}api/v1/acquiring/tinkoff/payment-url/`,
        {
          params: { subscriptionVariantId, userId },
        }
      );

      window.location.href = data.data;
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

  return { subscribe, isSuccess };
};

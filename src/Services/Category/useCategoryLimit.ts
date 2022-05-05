import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { UseCategoryLimitConfig } from "./Models";

const useCategoryLimit = () => {
  const dispatch = useDispatch<AppDispatch>();

  const updateLimit = async (config: UseCategoryLimitConfig): Promise<void> => {
    try {
      dispatch(ShowPreloader());
      await axios({
        method: "patch",
        url: `${API_URL}api/v1/category/${config.categoryId}/`,
        data: {
          categoryLimit: config.categoryLimit,
        },
      });
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: "Лимит категории успешно изменен",
          title: "Успех",
          type: "success",
        })
      );
    } catch (e: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: "Не укдалось изменить лимит",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return updateLimit;
};

export default useCategoryLimit;

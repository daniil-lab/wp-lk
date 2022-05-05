import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { UseAddCategoryConfig } from "./Models";

const useAddCategory = (config: UseAddCategoryConfig) => {
  const dispatch = useDispatch<AppDispatch>();

  const { params, userId } = config;

  const addCategory = async (): Promise<void> => {
    try {
      if (!params.name) {
        throw new Error("Введите название категории");
      }

      if (!params.icon) {
        throw new Error("Выберите иконку категории");
      }

      if (!params.color) {
        throw new Error("Выберите цвет категории");
      }
      dispatch(ShowPreloader());

      await axios({
        method: "post",
        url: `${API_URL}api/v1/category/`,
        data: {
          name: params.name,
          icon: params.icon.id,
          color: params.color.systemName,
          userId: userId,
          onlyForEarn: params.onlyForEarn,
          categoryLimit: parseInt(params.expenses),
        },
      });
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: "Категория успешно добавлена",
          title: "Успех",
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: error.message,
          type: "error",
        })
      );
    }
  };

  return addCategory;
};

export default useAddCategory;

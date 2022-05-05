import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { UseRemoveCategoryConfig } from "./Models";

const useRemoveCategory = (params: UseRemoveCategoryConfig) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryId } = params;

  const remove = async (): Promise<void> => {
    try {
      dispatch(ShowPreloader());
      await axios({
        method: "DELETE",
        url: `${API_URL}api/v1/category/${categoryId}`,
      });
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: "Категория успешно удалена",
          title: "Успех",
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: "Не укдалось удалить категорию",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return remove;
};

export default useRemoveCategory;

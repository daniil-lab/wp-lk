import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import CategoryRepository from "Repository/CategoryRepository";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";

const useCategoryLimit = () => {
  const dispatch = useDispatch<AppDispatch>();

  const categoryRepository = new CategoryRepository();

  const updateLimit = async (config): Promise<void> => {
    try {
      dispatch(ShowPreloader());
      const action = await categoryRepository.changeLimit(config);
      dispatch(HidePreloader());
      if (action)
        dispatch(
          ShowToast({
            text: "Лимит категории успешно изменен",
            title: "Успех",
            type: "success",
          })
        );
      else throw new Error();
    } catch (e: any) {
      dispatch(HidePreloader());
      dispatch(
        ShowToast({
          text: "Не удалось изменить лимит",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return updateLimit;
};

export default useCategoryLimit;

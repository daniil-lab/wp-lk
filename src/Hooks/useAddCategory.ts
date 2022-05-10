import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import CategoryRepository from "Repository/CategoryRepository";

const useAddCategory = (config) => {
  const dispatch = useDispatch<AppDispatch>();

  const { params, userId } = config;

  const categoryRepository = new CategoryRepository();

  const addCategory = async (): Promise<boolean | undefined> => {
    if (!params.name) {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Введите название категории",
          type: "error",
        })
      );
      return;
    }

    if (!params.icon) {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Выберите иконку категории",
          type: "error",
        })
      );
      return;
    }

    if (!params.color) {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Выберите цвет категории",
          type: "error",
        })
      );
      return;
    }
    if (!params.forEarn && !params.forSpend) {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Выберите тип категории",
          type: "error",
        })
      );
      return;
    }
    if (params.categoryLimit === 0) {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Установите лимит для категории",
          type: "error",
        })
      );
      return;
    }
    dispatch(ShowPreloader());
    const action = await categoryRepository.addCategory(userId, params);
    dispatch(HidePreloader());
    if (action) {
      dispatch(
        ShowToast({
          text: "Категория успешно добавлена",
          title: "Успех",
          type: "success",
        })
      );

      return true;
    } else
      dispatch(
        ShowToast({
          text: "Ошибка при добавлении категории",
          title: "Ошибка",
          type: "error",
        })
      );
  };

  return addCategory;
};

export default useAddCategory;

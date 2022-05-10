import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import CategoryRepository from "Repository/CategoryRepository";

const useRemoveCategory = (params) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryId } = params;

  const categoryRepository = new CategoryRepository();

  const remove = async (): Promise<void> => {
    if (categoryId) {
      dispatch(ShowPreloader());
      const action = await categoryRepository.removeCategory(categoryId);

      dispatch(HidePreloader());
      if (action)
        dispatch(
          ShowToast({
            text: "Категория успешно удалена",
            title: "Успех",
            type: "success",
          })
        );
      else
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

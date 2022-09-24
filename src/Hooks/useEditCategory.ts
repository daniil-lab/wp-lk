import { CategoryModel, IconType, ColorType } from "Models/CategoryModel";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import CategoryRepository from "Repository/CategoryRepository";

const useEditCategory = (
  categories: CategoryModel[],
  modifyCategory: (categoryId: string, categoryData: CategoryModel) => void
) => {
  const dispatch = useDispatch<AppDispatch>();

  const [show, setShow] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<IconType | null>(null);
  const [color, setColor] = useState<ColorType | null>(null);
  const [categoryLimit, setCategoryLimit] = useState<number>(0);
  const [forEarn, setForEarn] = useState<boolean>(false);
  const [forSpend, setForSpend] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);

  const __clearState = (): void => {
    setCategoryId(null);
    setName("");
    setIcon(null);
    setColor(null);
    setCategoryLimit(0);
    setForEarn(false);
    setForSpend(false);
    setFavorite(false);
  };

  const categoryRepository = new CategoryRepository();

  const edit = async (): Promise<boolean | undefined> => {
    if (name.length === 0) {
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Невозможно добавить категорию без имени",
          type: "error",
        })
      );
      return;
    }
    if (categoryId && icon && color) {
      dispatch(ShowPreloader());
      const action = await categoryRepository.editCategory(
        categoryId,
        name,
        "",
        icon.id,
        color.systemName,
        categoryLimit,
        forEarn,
        forSpend
      );
      dispatch(HidePreloader());
      if (action) {
        dispatch(
          ShowToast({
            title: "Успех",
            text: "Категория успешно изменена",
            type: "success",
          })
        );
        return true;
      } else {
        dispatch(
          ShowToast({
            title: "Ошибка",
            text: "Ошибка при редактировании категории",
            type: "error",
          })
        );
      }
    }
  };

  const editFavorite = async (): Promise<boolean | void> => {
    if (!categoryId) return;

    setFavorite(!favorite);
    try {
      const data = await (favorite
        ? categoryRepository.removeFromFavorite(categoryId)
        : categoryRepository.makeFavorite(categoryId));
      modifyCategory(categoryId, "data" in data ? data.data : data);
    } catch {
      setFavorite(favorite);
    }
  };

  const remove = async (): Promise<void> => {
    if (categoryId) {
      dispatch(ShowPreloader());
      const action = await categoryRepository.removeCategory(categoryId);
      dispatch(HidePreloader());
      if (action)
        dispatch(
          ShowToast({
            title: "Успех",
            text: "Категория успешно удалена",
            type: "success",
          })
        );
      else
        dispatch(
          ShowToast({
            title: "Ошибка",
            text: "Ошибка при удаление категории",
            type: "error",
          })
        );
      __clearState();
    }
  };

  useEffect(() => {
    if (categoryId) {
      const category = categories.filter((c) => c.id === categoryId)[0];
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setCategoryLimit(category.categoryLimit);
      setForEarn(category.forEarn);
      setForSpend(category.forSpend);
      setFavorite(category.favorite);
    }
  }, [categoryId]);

  return {
    modal: { show, setShow },
    categoryId,
    setCategoryId,
    name,
    setName,
    icon,
    setIcon,
    color,
    setColor,
    categoryLimit,
    setCategoryLimit,
    edit,
    remove,
    __clearState,
    forEarn,
    setForEarn,
    forSpend,
    setForSpend,
    favorite,
    editFavorite,
  };
};

export default useEditCategory;

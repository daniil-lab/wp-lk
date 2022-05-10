import { IconType } from "Models/CategoryModel";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import CategoryRepository from "Repository/CategoryRepository";

const useGetCategoryIcons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [icons, setIcons] = useState<IconType[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const categoryRepository = new CategoryRepository();

  const getColors = async (): Promise<void> => {
    const action = await categoryRepository.getCategoryIcons();
    if (action) setIcons(action);
    else
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Ошибка при получении иконок категорий",
          type: "error",
        })
      );
    setLoad(true);
  };

  useEffect(() => {
    if (load) {
      setLoad(false);
    }
    getColors();
  }, []);

  return { icons, load };
};

export default useGetCategoryIcons;

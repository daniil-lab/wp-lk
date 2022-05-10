import { ColorType } from "Models/CategoryModel";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import CategoryRepository from "Repository/CategoryRepository";

const useGetCategoryColors = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [colors, setColors] = useState<ColorType[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const categoryRepository = new CategoryRepository();

  const getColors = async (): Promise<void> => {
    const action = await categoryRepository.getCategoryColors();
    if (action) setColors(action);
    else
      dispatch(
        ShowToast({
          title: "Ошибка",
          text: "Ошибка при получении цветов категорий",
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

  return { colors, load };
};

export default useGetCategoryColors;

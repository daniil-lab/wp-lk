import { CategoryModel } from "Models/CategoryModel";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import CategoryRepository from "Repository/CategoryRepository";

const useGetCategories = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [load, setLoad] = useState<boolean>(false);
  const [data, setData] = useState<CategoryModel[]>([]);

  const categoryRepository = new CategoryRepository();

  const categories = useMemo(() => {
    return data;
  }, [load, data]);

  const [update, setUpdate] = useState<boolean | null>(null);
  const updateCategory = (): void => {
    if (update === null) setUpdate(true);
    else setUpdate(!update);
  };

  const modifyCategory = (categoryId: string, categoryData: CategoryModel) => {
    const categoryIndex = data.findIndex(
      (category) => category.id === categoryId
    );
    if (categoryIndex !== -1)
      setData([
        ...data.slice(0, categoryIndex),
        categoryData,
        ...data.slice(categoryIndex + 1),
      ]);
  };

  useEffect(() => {
    if (update != null) {
      if (load) {
        setLoad(false);
      }
      refresh();
    }
  }, [update]);

  const refresh = async (): Promise<void> => {
    await getCategories();
  };

  const getCategories = async (): Promise<void> => {
    const action = await categoryRepository.getCategories();
    if (action) setData(action);
    else
      dispatch(
        ShowToast({
          text: "Не удалось загрузить список категорий",
          title: "Ошибка",
          type: "error",
        })
      );
    setLoad(true);
  };

  useEffect(() => {
    if (load) {
      setLoad(false);
    }
    getCategories();
  }, []);

  return {
    categories,
    load,
    updateCategory,
    modifyCategory,
  };
};

export default useGetCategories;

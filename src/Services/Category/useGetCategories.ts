import { CategoryModel } from "Models/CategoryModel";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { UseGetCategoriesModel } from "./Models";

const useGetCategories = (): UseGetCategoriesModel => {
  const dispatch = useDispatch<AppDispatch>();

  const [load, setLoad] = useState<boolean>(false);

  const [data, setData] = useState<CategoryModel[]>([]);
  const categories = useMemo(() => {
    return data;
  }, [load, data]);

  const [update, setUpdate] = useState<boolean | null>(null);
  const updateCategory = (): void => {
    if (update === null) setUpdate(true);
    else setUpdate(!update);
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
    try {
      const res = await axios.get(`${API_URL}api/v1/category/`);
      if (res.data.status === 200) {
        setData(res.data.data);
        setLoad(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      setLoad(true);
      dispatch(
        ShowToast({
          text: "Не удалось загрузить список категорий",
          title: "Ошибка",
          type: "error",
        })
      );
    }
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
  };
};

export default useGetCategories;

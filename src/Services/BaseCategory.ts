import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetUserToken } from "Redux/Selectors";
import { API_URL } from "Utils/Config";
import { CategoryModel } from "../Models/CategoryModel";

const useGetBaseCategory = () => {
  const token = useSelector(GetUserToken);

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/base-category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.status === 200) {
        setCategories(res.data.data);
        setLoad(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {}
  };

  const init = async (): Promise<void> => {
    await get();
  };

  useEffect(() => {
    init();
  }, []);

  return {
    categories,
    load,
  };
};

export default useGetBaseCategory;

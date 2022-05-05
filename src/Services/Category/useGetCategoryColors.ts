import { ColorType } from "Models/CategoryModel";
import { useEffect, useState } from "react";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { UseGetCategoryColorsModel } from "./Models";

const useGetCategoryColors = (): UseGetCategoryColorsModel => {
  const [colors, setColors] = useState<ColorType[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const getColors = async (): Promise<void> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/category/colors`);
      if (res.data.status === 200) {
        setColors(res.data.data);
        setLoad(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
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

import { IconType } from "Models/CategoryModel";
import { useEffect, useState } from "react";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { UseGetCategoryIconsModel } from "./Models";

const useGetCategoryIcons = (): UseGetCategoryIconsModel => {
  const [icons, setIcons] = useState<IconType[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const getCategoryIcons = async (): Promise<void> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/image/tag/CATEGORY_ICON`);
      if (res.data.status === 200) {
        setIcons(res.data.data);
        setLoad(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (load) setLoad(false);
    getCategoryIcons();
  }, []);
  return { icons, load };
};

export default useGetCategoryIcons;

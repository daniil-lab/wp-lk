import axios from "axios";
import { CategoryType } from "Pages/Main/CategoryBlock/CategoryConstructor/CategoryConstructor";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ShowToast, UpdateCategory } from "Redux/Actions";
import { GetUpdateCategory, GetUserToken } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import { ColorType, IconType } from "./Interfaces";

export interface ICategory {
  id: string;
  name: string;
  categorySpend: number,
  categoryEarn: number;
  onlyForEarn: boolean;
  color: {
    name: string;
    hex: string;
    systemName: string;
  };
  icon: {
    id: string;
    name: string;
    path: string;
    tag: string;
  };
  description: string;
  categoryLimit: number;
  user: {
    id: string;
    username: string;
    role: {
      id: string;
      name: string;
      autoApply: boolean;
      roleAfterBuy: boolean;
      roleAfterBuyExpiration: true;
      roleForBlocked: true;
      admin: boolean;
    };
    email: {
      address: string;
      activated: boolean;
    };
    type: string;
    walletType: string;
    touchID: boolean;
    faceID: boolean;
    pinCode: string;
    plannedIncome: 0;
    notificationsEnable: boolean;
    createAt: string;
  };
}

const useGetCategory = () => {
  const token = useSelector(GetUserToken);
  const updateCategory = useSelector(GetUpdateCategory);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
    try {
      setLoad(false);
      const res = await axios.get(`${API_URL}api/v1/category/`, {
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
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const init = async (): Promise<void> => {
    await get();
  };

  useEffect(() => {
    init();
  }, [updateCategory]);

  return {
    categories,
    load,
  };
};

const useGetCategoryColors = () => {
  const [colors, setColors] = useState<ColorType[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
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

  const init = async (): Promise<void> => {
    await get();
  };

  useEffect(() => {
    init();
  }, []);
  return { colors, load };
};

const useGetCategoryIcons = () => {
  const [icons, setIcons] = useState<IconType[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
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

  const init = async (): Promise<void> => {
    await get();
  };

  useEffect(() => {
    init();
  }, []);
  return { icons, load };
};

const addCategory = async (
  params: CategoryType,
  userId: string,
  dispatch: AppDispatch
): Promise<boolean> => {
  try {
    if (!params.name) {
      throw new Error("Введите название категории");
    }
    
    if (!params.icon) {
      throw new Error("Выберите иконку категории");
    }
    
    if (!params.color) {
      throw new Error("Выберите цвет категории");
    }

    await axios({
      method: "post",
      url: `${API_URL}api/v1/category/`,
      data: {
        name: params.name,
        icon: params.icon.id,
        color: params.color.systemName,
        userId: userId,
        categoryLimit: 0,
        onlyForEarn: params.onlyForEarn,
      },
    });

    dispatch(UpdateCategory());
    return true
  } catch (error: any) {
    dispatch(
      ShowToast({
        title: "Ошибка",
        text: error.message,
        type: "error",
      })
    );
  }

  return false
};

const setCategoryLimit = async (
  categoryId: string,
  dispatch: AppDispatch,
  categoryLimit: number
) => {
  try {
    const response = await axios({
      method: "patch",
      url: `${API_URL}api/v1/category/${categoryId}/`,
      data: {
        categoryLimit
      }
    })
  } catch(e: any) {
    console.log(e)
  }
}

const deleteCategory = async (
  categoryId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `${API_URL}api/v1/category/${categoryId}`,
    });
    dispatch(UpdateCategory());
  } catch (error: any) {
    console.log(error);
  }
};

export default {
  useGetCategory,
  useGetCategoryColors,
  useGetCategoryIcons,
  addCategory,
  deleteCategory,
  setCategoryLimit
};

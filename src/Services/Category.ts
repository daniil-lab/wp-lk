import axios from "axios";
import { ColorType, IconType } from "Models/CategoryModel";
import { CategoryType } from "Pages/Main/CategoryBlock/CategoryConstructor/CategoryConstructor";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HidePreloader,
  ShowPreloader,
  ShowToast,
  UpdateCategory,
} from "Redux/Actions";
import { GetUpdateCategory, GetUserToken } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";

export interface UseGetCategoryType {
  categories: ICategory[];
  load: boolean;
  updateCategory: () => void;
}

export interface ICategory {
  id: string;
  name: string;
  categorySpend: number;
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
  percentsFromLimit: number;
}

const useGetCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(GetUserToken);

  const [data, setData] = useState<ICategory[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const [update, setUpdate] = useState<boolean | null>(null);

  const categories = useMemo(() => {
    return data;
  }, [load, data]);

  const updateCategory = (): void => {
    if (update === null) setUpdate(true);
    else setUpdate(!update);
  };

  const getCategories = async (): Promise<void> => {
    try {
      setLoad(false);
      const res = await axios.get(`${API_URL}api/v1/category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    if (update != null) {
      if (load) {
        setLoad(false);
      }
      getCategories();
    }
  }, [update]);

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
  } as UseGetCategoryType;
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
    return true;
  } catch (error: any) {
    dispatch(
      ShowToast({
        title: "Ошибка",
        text: error.message,
        type: "error",
      })
    );
  }

  return false;
};

const setCategoryLimit = async (
  categoryId: string,
  dispatch: AppDispatch,
  categoryLimit: number
) => {
  try {
    dispatch(ShowPreloader());
    await axios({
      method: "patch",
      url: `${API_URL}api/v1/category/${categoryId}/`,
      data: {
        categoryLimit,
      },
    });
    dispatch(HidePreloader());
    dispatch(
      ShowToast({
        text: "Лимит категории успешно изменен",
        title: "Успех",
        type: "success",
      })
    );
  } catch (e: any) {
    dispatch(HidePreloader());
    dispatch(
      ShowToast({
        text: "Не укдалось изменить лимит",
        title: "Ошибка",
        type: "error",
      })
    );
  }
};

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
  setCategoryLimit,
};

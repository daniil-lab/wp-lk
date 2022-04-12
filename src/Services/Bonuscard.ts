import axios from "axios";
import { CategoryType } from "Pages/Main/CategoryBlock/CategoryConstructor/CategoryConstructor";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UpdateCategory } from "Redux/Actions";
import { GetUpdateCategory, GetUserId, GetUserToken } from "Redux/Selectors";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import { ColorType, IconType, UserType } from "./Interfaces";

export interface IBonus {
  blank: {
    description: string;
    id: string;
    image: {
      id: string;
      name: string;
      path: string;
      tag: string;
    };
    name: string;
  };
  data: string;
  id: string;
  user: UserType;
}

const useGetCards = () => {
  const userId = useSelector(GetUserId);
  const token = useSelector(GetUserToken);
  const updateCategory = useSelector(GetUpdateCategory);

  const [bonus, setbonus] = useState<IBonus[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
    try {
      setLoad(false);
      const res = await axios.get(
        `${API_URL}api/v1/loyalty-card/?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === 200) {
        setbonus(res.data.data);
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
    bonus,
    load,
  };
};

// const useGetCategoryColors = () => {
//   const [colors, setColors] = useState<ColorType[]>([]);
//   const [load, setLoad] = useState<boolean>(false);

//   const get = async (): Promise<void> => {
//     try {
//       const res = await axios.get(`${API_URL}api/v1/category/colors`);
//       if (res.data.status === 200) {
//         setColors(res.data.data);
//         setLoad(true);
//       } else {
//         throw new Error(res.data.message);
//       }
//     } catch (error: any) {
//       console.log(error.message);
//     }
//   };

//   const init = async (): Promise<void> => {
//     await get();
//   };

//   useEffect(() => {
//     init();
//   }, []);
//   return { colors, load };
// };

const DeleteCard = (id: string) => {
  const get = async (): Promise<void> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/loyalty-card/${id}`);
      if (res.data.status === 200) {
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
};

// const addCategory = async (
//   params: CategoryType,
//   userId: string,
//   dispatch: AppDispatch
// ): Promise<void> => {
//   try {
//     const response = await axios({
//       method: "post",
//       url: `${API_URL}api/v1/category/`,
//       data: {
//         name: params.name,
//         icon: params.icon?.id,
//         color: params.color?.systemName,
//         userId: userId,
//         categoryLimit: 0,
//       },
//     });
//     dispatch(UpdateCategory());
//   } catch (error: any) {
//     console.log(error);
//   }
// };

export default {
  useGetCards,
  DeleteCard,
};

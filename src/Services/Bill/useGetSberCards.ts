import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { BankCardModel } from "./Models";

const useGetSberCards = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [cards, setCards] = useState<BankCardModel[]>([]);

  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/sber/cards/`);
      if (res.data.status === 200) {
        setCards(res.data.data);
        setLoad(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      if (error.response.status !== 404) {
        dispatch(
          ShowToast({
            text: error.message,
            title: "Ошибка",
            type: "error",
          })
        );
      }
      setLoad(true);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return {
    cards,
    load,
  };
};

export default useGetSberCards;

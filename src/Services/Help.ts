import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";

const useSendHelp = () => {
  const dispatch = useDispatch<AppDispatch>();
  return async (phone: string, email: string, content: string) => {
    try {
      const res = await axios.post(`${API_URL}api/v1/help`, {
        body: { phone, email, content },
      });
      if (res.data.status === 200) {
        dispatch(
          ShowToast({
            text: "Сообщение отправлено!",
            title: "Успех!",
            type: "success",
          })
        );
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
};

export default useSendHelp;

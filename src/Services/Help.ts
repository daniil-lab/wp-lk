import axios from "Utils/Axios"
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import IsPhone from "Utils/IsPhone"
import IsEmail from "Utils/IsEmail"

const useSendHelp = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  return async (phone: string, email: string, content: string) => {
    if (phone === "" || email === "" || content === "") return dispatch(ShowToast({
      text: "Заполните все поля",
      type: "error",
      title: "Ошибка"
    }))

    if (!IsPhone(`+${phone.replace(/[^0-9]/g, "")}`)) return dispatch(ShowToast({
      text: "Неверный номер телефона",
      type: "error",
      title: "Ошибка"
    }))

    if (!IsEmail(email)) return dispatch(ShowToast({
      text: "Неверный email",
      type: "error",
      title: "Ошибка"
    }))


    try {
      const res = await axios.post(`${API_URL}api/v1/help/`, 
      { phone: `+${phone.replace(/[^0-9]/g, "")}`, email, content },
      {headers: {
        "Content-Type": "application/json"
      }}
      );
      if (res.data.status === 201) {
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
      dispatch(ShowToast({
        text: "Ошибка при отправке письма",
        type: "error",
        title: "Ошибка"
      }))
    }
  };
};

export default useSendHelp;

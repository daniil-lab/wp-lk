import QrScanner from "qr-scanner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "Redux/Store";
import { API_URL } from "Utils/Config";
import { UseAddOperationConfig } from "./Models";
import axios from "Utils/Axios";
import { ShowToast } from "Redux/Actions";

const useAddTransaction = (config: UseAddOperationConfig) => {
  const dispatch = useDispatch<AppDispatch>();

  const OperationAdd = async (onSuccess: () => void): Promise<void> => {
    try {
      const {
        bill,
        operationType,
        summ,
        description,
        selectedCategory,
        location,
        date,
        qr,
        placeName,
      } = config;

      if (!date) {
        throw new Error("Укажите дату");
      }

      if (!summ) {
        throw new Error("Укажите сумму");
      }
      if (qr) {
        try {
          const { data } = await QrScanner.scanImage(qr, {
            returnDetailedScanResult: true,
          });

          const values = new URLSearchParams(data);
          const t = values.get("t");

          const params = {
            sum: +(values.get("s") || 0) * 100,
            fn: values.get("fn"),
            operationType: values.get("n")?.substring(0, 1),
            fiscalDocumentId: values.get("i"),
            fiscalSign: values.get("fp"),
            rawData: false,
          };

          if (t) {
            const year = +t.substring(0, 4);
            const month = +t.substring(4, 6);
            const day = +t.substring(6, 8);
            const hour = +t.substring(9, 11);
            const minute = +t.substring(11, 13);

            const date = new Date(year, month, day, hour, minute);

            params["date"] = date;
          }

          const fns = await axios.get(`${API_URL}api/v1/fns/ticket-info`, {
            params,
          });

          if (fns.data.status === 200) {
            dispatch(
              ShowToast({
                text: "Чек загружен",
                title: "Успешно",
                type: "success",
              })
            );
          } else {
            throw new Error(fns.data.message);
          }
        } catch (error) {
          dispatch(
            ShowToast({
              text: "Не удалось обработать чек",
              title: "Ошибка",
              type: "error",
            })
          );
        }
      }

      let data =
        operationType === "WITHDRAW"
          ? {
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              time: `${date}T16:23:25.356Z`,
            }
          : {
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              time: `${date}T16:23:25.356Z`,
            };
      if (operationType === "WITHDRAW" && location != null) {
        data = {
          ...data,
          lon: location![1],
          lat: location![0],
        };
      }
      if (operationType === "WITHDRAW" && placeName) {
        data = {
          ...data,
          placeName,
        };
      }

      console.log("data", data);

      const url =
        operationType === "WITHDRAW"
          ? `api/v1/bill/withdraw/${bill?.id}`
          : `api/v1/bill/deposit/${bill?.id}`;

      const res = await axios.patch(`${API_URL}${url}`, data);
      if (res.data.status === 200) {
        dispatch(
          ShowToast({
            text: "Операция добавлена",
            title: "Успешно",
            type: "success",
          })
        );
        onSuccess();
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      dispatch(
        ShowToast({
          text: error.message,
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };
  return { OperationAdd };
};

export default useAddTransaction;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import BillRepository from "Repository/BillRepository";

const useRemoveIntegration = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [type, setType] = useState<"sber" | "tinkoff" | "tochka" | null>(null);

  const billRepository = new BillRepository();

  const __disableIntegration = async () => {
    if (type) {
      dispatch(ShowPreloader());
      if (type === "sber") await billRepository.disableSberIntegration();
      if (type === "tinkoff") await billRepository.disableTinkoffIntegration();
      if (type === "tochka") await billRepository.disableTochkaIntegration();
      dispatch(HidePreloader());
    }
  };

  return { modalShow, setModalShow, type, setType, __disableIntegration };
};

export default useRemoveIntegration;

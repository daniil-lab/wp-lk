import { useEffect, useMemo, useState } from "react";

import BillRepository from "Repository/BillRepository";

import { BankCardModel, BillModel } from "Models/BillModel";
import GeneralBalance from "Utils/GeneralBalance";

const useGetBill = () => {
  const [data, setData] = useState<BillModel[]>([]);
  const [tinkoffCards, setTinkoffCards] = useState<BankCardModel[]>([]);
  const [sberCards, setSberCards] = useState<BankCardModel[]>([]);
  const [tochkaCards, setTochkaCards] = useState<BankCardModel[]>([]);

  const [load, setLoad] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean | null>(null);

  const billRepository = new BillRepository();

  const generalBalance = useMemo(() => {
    return GeneralBalance(data, tinkoffCards, sberCards, tochkaCards);
  }, [
    data,
    sberCards,
    tochkaCards,
    data.length,
    sberCards.length,
    tochkaCards.length,
  ]);

  const updateBill = (): void => {
    if (update === null) setUpdate(true);
    else setUpdate(!update);
  };

  const asyncEffect = async (): Promise<void> => {
    const bills = await billRepository.getBills();
    if (bills) setData(bills);
    const tinkoff = await billRepository.getTinkoffCards();
    if (tinkoff) setTinkoffCards(tinkoff);
    const sber = await billRepository.getSberCards();
    if (sber) setSberCards(sber);
    const tochka = await billRepository.getTochkaCards();
    if (tochka) setTochkaCards([...tochka]);

    setLoad(true);
  };

  useEffect(() => {
    if (update != null) {
      if (load) {
        setLoad(false);
      }
      asyncEffect();
    }
  }, [update]);

  useEffect(() => {
    asyncEffect();
  }, []);

  return {
    load,
    tinkoffCards,
    data,
    generalBalance,
    updateBill,
    sberCards,
    tochkaCards,
  };
};

export default useGetBill;

import { useEffect, useState } from "react";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { IWallet } from "./Interfaces";

const useGetWallets = () => {
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  const get = async (): Promise<void> => {
    try {
      const res = await axios.get(`${API_URL}api/v1/wallet/`);
      if (res.data.status === 200) {
        setWallets(res.data.data);
        setLoad(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {}
  };

  const init = async (): Promise<void> => {
    await get();
  };

  useEffect(() => {
    init();
  }, []);

  return {
    wallets,
    load,
  };
};

export default useGetWallets;

import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";

import { BankCardModel, Banks, BillModel } from "Models/BillModel";
import { AxiosResponse } from "axios";

export default class BillRepository {
  constructor() {}

  async getBills(): Promise<BillModel[] | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/bill/`);
      if (res.data.status === 200) {
        return res.data.data;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async getSberCards(): Promise<BankCardModel[] | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/sber/cards/`);
      if (res.data.status === 200) {
        return res.data.data;
      }
    } catch (error: any) {
      if (error.response.status === 404) return [];
      if (error.response.status === 403) return [];
      throw new Error();
    }
  }

  async getTinkoffCards(): Promise<BankCardModel[] | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/tinkoff/cards/`);
      if (res.data.status === 200) {
        return res.data.data;
      }
    } catch (error: any) {
      if (error.response.status === 404) return [];
      if (error.response.status === 403) return [];
      throw new Error();
    }
  }

  async getTochkaCards(): Promise<BankCardModel[] | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/tochka/cards/`);
      if (res.data.status === 200) {
        return res.data.data;
      }
    } catch (error: any) {
      if (error.response.status === 404) return [];
      if (error.response.status === 403) return [];
      throw new Error();
    }
  }

  async addBill(
    userId: string,
    name: string,
    balance: string
  ): Promise<boolean | undefined> {
    try {
      const res = await axios.post(`${API_URL}api/v1/bill/`, {
        userId,
        name,
        balance,
      });
      if (res.data.status === 201) {
        return true;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async removeBill(billId: string): Promise<boolean | undefined> {
    try {
      const res = await axios.delete(`${API_URL}api/v1/bill/${billId}`);
      if (res.status === 200) return true;
    } catch (error: any) {
      throw new Error();
    }
  }

  async startConnection(
    bank: Banks,
    phone: string,
    exportDate: string,
    success: (id: string) => void
  ): Promise<"exist" | undefined> {
    try {
      const { data } = await axios.post(
        `${API_URL}api/v1/${bank}/connect/start/`,
        {
          phone,
          exportStartDate: new Date(exportDate),
          startExportDate: new Date(exportDate),
        }
      );

      if (data.status === 200) {
        success(data.data.id);
      }
    } catch (error: any) {
      if (error.response.status === 400) return "exist";
      else throw new Error();
    }
  }

  async submitConnection(
    bank: Banks,
    code: string | number,
    bankUserId: string,
    password: string,
    exportDate: string
  ): Promise<any> {
    if (bank === "tinkoff") {
      const { data } = await axios.post(
        `${API_URL}api/v1/tinkoff/connect/submit/`,
        {
          code: code,
          id: bankUserId,
          password: password,
        }
      );
      return data;
    }
    if (bank === "sber") {
      const { data } = await axios.post(
        `${API_URL}api/v1/sber/connect/submit`,
        {
          code: code,
          userId: bankUserId,
        }
      );

      return data;
    }

    if (bank === "tochka") {
      const { data } = await axios.post(
        `${API_URL}api/v1/tochka/connect/submit-auth`,
        {
          code: code,
          userId: bankUserId,
          startDate: exportDate,
        }
      );

      return data;
    }
  }

  async syncConnection(bank: Banks): Promise<any | undefined> {
    try {
      const { data } = await axios.get(`${API_URL}api/v1/${bank}/sync/`);
      return data;
    } catch (error: any) {
      throw new Error();
    }
  }
  async editBill(
    billId: string,
    name: string,
    balance: number | string
  ): Promise<boolean | undefined> {
    try {
      const res = await axios.patch(`${API_URL}api/v1/bill/${billId}`, {
        name,
        newAmount: balance,
        newCents: 0,
      });
      if (res.data.status === 200) return true;
    } catch (error: any) {
      throw new Error();
    }
  }

  async disableTinkoffIntegration(): Promise<boolean | undefined> {
    try {
      const res = await axios.delete(`${API_URL}api/v1/tinkoff/`);
      if (res.status === 200) return true;
    } catch (error: any) {
      throw new Error();
    }
  }

  async disableSberIntegration(): Promise<boolean | undefined> {
    try {
      const res = await axios.delete(`${API_URL}api/v1/sber/`);
      if (res.status === 200) return true;
    } catch (error: any) {
      throw new Error();
    }
  }

  async disableTochkaIntegration(): Promise<boolean | undefined> {
    try {
      const res = await axios.delete(`${API_URL}api/v1/tochka/`);
      if (res.status === 200) return true;
    } catch (error: any) {
      throw new Error();
    }
  }
}

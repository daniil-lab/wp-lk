import {
  TransactionType,
  ITransactionTochka,
  TransactionResponseType,
  ITransactionSber,
  ITransactionTinkoff,
  ITransactionBill,
  ITransactionGeneral,
} from "Models/TransactionModel";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { BaseCategoryModel } from "../Models/CategoryModel";
import { BillModel } from "../Models/BillModel";

const SOMETHING_WENT_WRONG = "Что-то пошло не так";

export default class TransactionRepository {
  constructor() {}

  async removeTransaction(transactionId: string): Promise<boolean | undefined> {
    try {
      await axios.delete(`${API_URL}api/v1/transaction/${transactionId}`);
      return true;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async getGeneralTransactions(data: {
    startDate: string;
    endDate: string;
    page?: number;
    pageSize?: number;
    transactionType?: "WITHDRAW" | "DEPOSIT";
  }): Promise<TransactionResponseType<ITransactionGeneral>> {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/abstract/all-transactions`,
        { params: { page: 0, pageSize: 10, ...data } }
      );
      return response.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async getBillTransactions(
    billId: string,
    data: {
      startDate: string;
      endDate: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<TransactionResponseType<ITransactionBill>> {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/transaction/bill/${billId}`,
        { params: { page: 0, pageSize: 20, ...data } }
      );
      return response.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async getTinkoffTransactions(
    billId: string,
    data: {
      startDate: string;
      endDate: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<TransactionResponseType<ITransactionTinkoff>> {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/tinkoff/transactions/${billId}`,
        { params: { page: 0, pageSize: 20, ...data } }
      );
      return response.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async getSberTransactions(
    billId: string,
    data: {
      startDate: string;
      endDate: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<TransactionResponseType<ITransactionSber>> {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/sber/transactions/${billId}`,
        { params: { page: 0, pageSize: 20, ...data } }
      );
      return response.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async getTochkaTransactions(
    billId: string,
    data: {
      startDate: string;
      endDate: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<TransactionResponseType<ITransactionTochka>[]> {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/tochka/transactions/${billId}`,
        { params: { page: 0, pageSize: 20, ...data } }
      );
      return response.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async editTransaction(
    transactionId: string | null,
    operationType: TransactionType,
    summ: string | number,
    description: string,
    selectedCategory: BaseCategoryModel | null,
    date: Array<string> | null,
    location: Array<number> | null,
    placeName: string,
    bill: BillModel | null
  ): Promise<boolean> {
    try {
      let data =
        operationType === "WITHDRAW"
          ? {
              action: "WITHDRAW",
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              time: `${date}T16:23:25.356Z`,
              billId: bill?.id,
              lon: 0,
              lat: 0,
            }
          : {
              action: "DEPOSIT",
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              time: `${date}T16:23:25.356Z`,
              billId: bill?.id,
              lon: 0,
              lat: 0,
              geocodedPlace: "",
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
          geocodedPlace: placeName,
        };
      }

      const res = await axios.patch(
        `${API_URL}api/v1/transaction/${transactionId}`,
        data
      );
      return res.data.status === 200;
    } catch (error: any) {
      throw new Error();
    }
  }

  async addTransaction(billId, operationType, data): Promise<boolean> {
    try {
      const url =
        operationType === "WITHDRAW"
          ? `api/v1/bill/withdraw/${billId}`
          : `api/v1/bill/deposit/${billId}`;

      const res = await axios.patch(`${API_URL}${url}`, {
        amount: data.amount,
        cents: 0,
        description: data.description,
        categoryId: data.categoryId,
        time: data.time,
      });

      return res.data.status === 200;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async updateTinkoffTransaction(
    transactionId: string,
    categoryId: string
  ): Promise<boolean> {
    try {
      await axios.patch(
        `${API_URL}api/v1/tinkoff/transaction/${transactionId}`,
        {
          categoryId: categoryId,
        }
      );
      return true;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async getAllPeriodTransactions(data: {
    start: string;
    end: string;
    page: number;
    categoryId?: string;
    userId?: string;
    billId?: string;
    pageSize?: number;
  }): Promise<TransactionResponseType<ITransactionGeneral>> {
    try {
      const res = await axios.get(`${API_URL}api/v1/transaction/period`, {
        params: {
          pageSize: 10,
          userId: "a22f1299-21f8-4bbc-99e2-8ed2a9a55ee4",
          ...data,
        },
      });
      return res.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }
}

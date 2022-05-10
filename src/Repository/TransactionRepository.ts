import { TranscationModel } from "Models/TransactionModel";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";

export default class TransactionRepository {
  constructor() {}

  async removeTransaction(transactionId: string): Promise<boolean | undefined> {
    try {
      const data = await axios.delete(
        `${API_URL}api/v1/transaction/${transactionId}`
      );
      if (data.status === 200) {
        return true;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async getGeneralTransactions(
    startDate: string,
    endDate: string
  ): Promise<TranscationModel[] | undefined> {
    try {
      const data = await axios.get(
        `${API_URL}api/v1/abstract/all-transactions?startDate=${startDate}&endDate=${endDate}&page=0&pageSize=10`
      );
      if (data.status === 200) {
        return data.data.data.page;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async getBillTransactions(
    billId: string,
    startDate: string,
    endDate: string
  ): Promise<TranscationModel[] | undefined> {
    try {
      const data = await axios.get(
        `${API_URL}api/v1/transaction/bill/${billId}?page=0&pageSize=20&startDate=${startDate}&endDate=${endDate}`
      );
      if (data.status === 200) {
        return data.data.data.page;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async getTinkoffransactions(
    billId: string,
    startDate: string,
    endDate: string
  ): Promise<TranscationModel[] | undefined> {
    try {
      const data = await axios.get(
        `${API_URL}api/v1/tinkoff/transactions/${billId}?page=0&pageSize=20&startDate=${startDate}&endDate=${endDate}`
      );
      if (data.status === 200) {
        return data.data.data.page;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async getSberTransactions(
    billId: string,
    startDate: string,
    endDate: string
  ): Promise<TranscationModel[] | undefined> {
    try {
      const data = await axios.get(
        `${API_URL}api/v1/sber/transactions/${billId}?page=0&pageSize=20&startDate=${startDate}&endDate=${endDate}`
      );
      if (data.status === 200) {
        return data.data.data.page;
      } else {
        throw new Error();
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async getTochkaTransactions(
    billId: string,
    startDate: string,
    endDate: string
  ): Promise<TranscationModel[] | undefined> {
    try {
      const data = await axios.get(
        `${API_URL}api/v1/tochka/transactions/${billId}?page=0&pageSize=20&startDate=${startDate}&endDate=${endDate}`
      );
      if (data.status === 200) {
        return data.data.data.page;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async editTransaction(
    transactionId,
    operationType,
    summ,
    description,
    selectedCategory,
    date,
    location,
    placeName,
    bill
  ): Promise<boolean | undefined> {
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
              billId: bill.id,
            }
          : {
              action: "DEPOSIT",
              amount: summ,
              cents: 0,
              description: description,
              categoryId: selectedCategory?.id,
              time: `${date}T16:23:25.356Z`,
              billId: bill.id,
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
      if (res.data.status === 200) {
        return true;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async addTransaction(
    billId,
    operationType,
    data
  ): Promise<boolean | undefined> {
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

      if (res.data.status === 200) {
        return true;
      }

      return false;
    } catch (error: any) {
      console.log(error.response);
      throw new Error();
    }
  }

  async updateTinkoffTransaction(
    transactionId: string,
    categoryId: string
  ): Promise<boolean | undefined> {
    try {
      const res = await axios.patch(
        `${API_URL}api/v1/tinkoff/transaction/${transactionId}`,
        {
          categoryId: categoryId,
        }
      );
      if (res.status === 200) return true;
    } catch (error: any) {
      throw new Error();
    }
  }

  async getTransactionById(): Promise<void> {}
}

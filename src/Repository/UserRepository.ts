import axios from "axios";

import { API_URL } from "../Utils/Config";
import { UserModel } from "../Models/UserModel";

const SOMETHING_WENT_WRONG = "Что-то пошло не так";

export default class UserRepository {
  async changeUserPlans(data: {
    plannedSpend?: number;
    plannedEarn?: number;
  }): Promise<{
    status: number;
    message: string;
    advices: Array<string>;
    data: UserModel;
  }> {
    try {
      const res = await axios.patch(`${API_URL}api/v1/user/plans`, data);
      return res.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async linkUser(cred: string): Promise<{
    status: number;
    message: string;
    advices: Array<string>;
    data: UserModel;
  }> {
    try {
      const res = await axios.patch(`${API_URL}api/v1/user/google-link`, {
        cred,
      });
      return res.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async unlinkUser(): Promise<{
    status: number;
    message: string;
    advices: Array<string>;
    data: UserModel;
  }> {
    try {
      const res = await axios.delete(`${API_URL}api/v1/user/google-link`);
      return res.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }
}

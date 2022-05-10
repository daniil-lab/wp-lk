import { CourseType } from "Models/WalletModel";
import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";

export default class WalletRepository {
  constructor() {}

  async course(): Promise<CourseType[] | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/wallet/course`);
      if (res.status === 200) return res.data.data;
    } catch (error: any) {}
  }
}

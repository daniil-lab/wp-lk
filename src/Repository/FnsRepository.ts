import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";

export default class FnsRepository {
  constructor() {}

  async ticketInfo(params): Promise<boolean | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/fns/ticket-info`, {
        params,
      });

      if (res.data.status === 200) {
        return true;
      }
    } catch (error: any) {
      throw new Error();
    }
  }
}

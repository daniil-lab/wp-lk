import { Banks } from "Services/Bill/Models";
import axios from "./Axios";
import { API_URL } from "./Config";

interface Params {
  code: string | number;
  bankUserId: string;
  password: string;
  exportDate: string;
}

const submitBankConnection = async (bank: Banks, params: Params) => {
  console.log("input data", {
    bank,
    params,
  });
  if (bank === "tinkoff") {
    const { data } = await axios.post(
      `${API_URL}api/v1/tinkoff/connect/submit/`,
      {
        code: params.code,
        id: params.bankUserId,
        password: params.password,
      }
    );
    console.log("response data", submitBankConnection);
    return data;
  }

  if (bank === "sber") {
    const { data } = await axios.post(`${API_URL}api/v1/sber/connect/submit`, {
      code: params.code,
      userId: params.bankUserId,
    });

    return data;
  }

  if (bank === "tochka") {
    const { data } = await axios.post(
      `${API_URL}api/v1/tochka/connect/submit-auth`,
      {
        code: params.code,
        userId: params.bankUserId,
        startDate: params.exportDate,
      }
    );

    return data;
  }
};
export default submitBankConnection;

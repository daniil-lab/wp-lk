import axios from "Utils/Axios";

import { AppDispatch, RootStore } from "Redux/Store";

import {
  HidePreloader,
  Logout,
  SetUser,
  ShowPreloader,
  ShowToast,
} from "Redux/Actions";

import { Buffer } from "buffer";

import { API_URL } from "Utils/Config";
import { base64encode } from "nodejs-base64";

class Auth {
  dispatch: AppDispatch | undefined;
  store?: RootStore | undefined;

  constructor(dispatch: AppDispatch, store?: RootStore) {
    this.dispatch = dispatch;
    this.store = store;
  }

  private clearNumber(str: string): string {
    return str.replace(/[^0-9]/g, "");
  }

  public async createUser(username: string, password: string) {
    if(this.dispatch) {
      try {
        this.dispatch(ShowPreloader());
       
        const response = await axios({
          method: "post",
          url: `${API_URL}api/v1/user/`,
          data: {
            username: "+" + this.clearNumber(username),
            password: Buffer.from(password).toString("base64"),
            walletType: "RUB",
            type: "SYSTEM"
          }
        })

        if (response.status === 201) {
          this.dispatch(HidePreloader());
          return true;
        } else {
          throw new Error(response.data.message);
        }
      } catch(e: any) {
        this.dispatch(
          ShowToast({
            title: "Ошибка",
            text: e.message,
            type: "error",
          })
        );
      } finally {
        this.dispatch(HidePreloader())
      }
    }
  }

  public async ChekRegister(username: string): Promise<boolean | undefined> {
    if (this.dispatch) {
      try {
        this.dispatch(ShowPreloader());

        const response = await axios({
          method: "post",
          url: `${API_URL}api/v1/auth/check-register`,
          data: {
            phone: `+${this.clearNumber(username)}`,
          },
        });

        if (response.status === 200) {
          this.dispatch(HidePreloader());
          return true;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        if (error.request?.status === 404) {
          return false;
        } else {
          this.dispatch(
            ShowToast({
              title: "Ошибка",
              text: error.message,
              type: "error",
            })
          );
        }
      } finally {
        this.dispatch(HidePreloader());
      }
    }
  }

  public async SignIn(username: string, password: string): Promise<void> {
    if (this.dispatch) {
      try {
        if (username === "" || password === "")
          throw new Error("Заполните все поля");

        const data = {
          username: `+${this.clearNumber(username)}`,
          password: Buffer.from(password).toString("base64"),
        };

        const response = await axios({
          method: "post",
          url: `${API_URL}api/v1/auth/`,
          data,
        });

        if (response.status === 200) {
          const { token, user } = response.data.data;
          if (token && user) {
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", user.id);

            this.dispatch(SetUser(token, user));
          }
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        if (error.response.status === 400) {
          this.dispatch(
            ShowToast({
              title: "Ошибка",
              text: "Неверный логин или пароль",
              type: "error",
            })
          );
        } else {
          alert(error.message);
        }
      }
    }
  }

  private async GetUser(user_id: string, token: string): Promise<void> {
    if (this.dispatch) {
      try {
        const response = await axios({
          method: "get",
          url: `${API_URL}api/v1/user/${user_id}`,
        });

        if (response.status === 200) {
          const user = response.data.data;
          this.dispatch(SetUser(token, user));
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        alert(error.message);
      }
    }
  }

  public async Initialization(): Promise<void> {
    if (this.dispatch) {
      try {
        this.dispatch(ShowPreloader());
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        if (token && user_id) {
          await this.GetUser(user_id, token);
        }
        this.dispatch(HidePreloader());
      } catch (error: any) {
        this.dispatch(HidePreloader());
        alert(error.message);
      }
    }
  }

  public async SmsSubmit(username: string): Promise<string | undefined> {
    if (this.dispatch) {
      try {
        this.dispatch(ShowPreloader());

        const data = {
          phone: `+${this.clearNumber(username)}`,
        };

        const response = await axios({
          method: "post",
          url: `${API_URL}api/v1/auth/sms-submit`,
          data,
        });

        if (response.status === 200) {
          this.dispatch(HidePreloader());
          return response.data.data.id;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        this.dispatch(HidePreloader());
        alert(error.message);
      }
    }
  }

  public async SmsConfirm(
    id: string,
    code: string
  ): Promise<boolean | undefined> {
    if (this.dispatch) {
      try {
        if (code === "") throw new Error("Заполните все поля");
        this.dispatch(ShowPreloader());

        const data = {
          id,
          code,
        };

        const response = await axios({
          method: "post",
          url: `${API_URL}api/v1/auth/sms-submit/result`,
          data,
        });

        if (response.status === 200) {
          this.dispatch(HidePreloader());
          return true;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        this.dispatch(HidePreloader());
        if (error.response.status === 400) {
          this.dispatch(
            ShowToast({
              title: "Ошибка",
              text: "Неверный смс код",
              type: "error",
            })
          );
        } else {
          alert(error.message);
        }
      }
    }
  }

  public async SmsAuth(id: string, code: string) {
    if (this.dispatch) {
      try {
        if (code === "") throw new Error("Заполните все поля");
        this.dispatch(ShowPreloader());

        const data = {
          id,
          code,
        };

        const response = await axios({
          method: "post",
          url: `${API_URL}api/v1/auth/sms`,
          data,
        });

        if (response.status === 200) {
          this.dispatch(HidePreloader());
          const { token, user } = response.data.data;
          if (token && user) {
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", user.id);
          }
          return true;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        this.dispatch(HidePreloader());
        if (error.response.status === 400) {
          this.dispatch(
            ShowToast({
              title: "Ошибка",
              text: "Неверный смс код",
              type: "error",
            })
          );
        } else {
          alert(error.message);
        }
      }
    }
  }

  public async CreateUser(username, password, email, type): Promise<void> {
    if (this.dispatch) {
      try {
        const data = {
          username: `+${this.clearNumber(username)}`,
          password: Buffer.from(password).toString("base64"),
          walletType: "RUB",
          email,
          type,
        };

        const response = await axios({
          method: "post",
          url: `${API_URL}api/v1/user/`,
          data,
        });
        if (response.status === 201) {
          this.dispatch(HidePreloader());
          this.SignIn(username, password);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        this.dispatch(HidePreloader());
        alert(error.message);
      }
    }
  }

  public Logout() {
    if (this.dispatch) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      this.dispatch(Logout());
    }
  }
}

export default Auth;

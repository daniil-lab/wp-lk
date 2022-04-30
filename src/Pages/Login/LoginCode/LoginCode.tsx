import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import { AppDispatch } from "Redux/Store";
import Auth from "Services/Auth";
import Logo from "Static/Images/Logo.svg";
import "Styles/Pages/Login/LoginCode/LoginCode.scss";
import { LoginSwitcherParams } from "Utils/Hooks/useLoginNavigation";

interface Props extends LoginSwitcherParams { }

const LoginCode: React.FunctionComponent<Props> = (props: Props) => {
  const { navigate, params } = props;
  const dispatch = useDispatch<AppDispatch>();

  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("")

  const _confirm = async (): Promise<void> => {
    const auth = new Auth(dispatch);
    if (params.id && params.phone) {
      if(!password ||  password.length < 6 || password.length > 32) {
        dispatch(ShowToast({
          title: "Ошибка",
          text: "Минимальная длина пароля 6 символов, максимальная 32",
          type: "error",
        }))

        return
      }

      const confirmed =
        params.type === "restore"
          ? await auth.SmsAuth(params.id, code)
          : await auth.SmsConfirm(params.id, code);

      if (confirmed) {
        await auth.createUser(params.phone, password)

        navigate("login-password", {
          phone: params.phone,
          type: params?.type || "signup",
        });
      }
    }
  };

  return (
    <div className={`login-code`}>
      <img src={Logo} alt="Wallet Box" className="login-code-logo" />
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Введите код"
        style={{
          textAlign: "center",
        }}
      />

      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        style={{
          textAlign: "center",
        }}
      />
      <div className="login-code-info">
        <p className="login-code-subtitle">Подтердите номер телефона и введите будущий пароль</p>
      </div>
      <div className="login-code-button-wrapper">
        <button className="button-secondary" onClick={props.back}>
          Назад
        </button>
        <button className="button-info" onClick={_confirm}>
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default LoginCode;

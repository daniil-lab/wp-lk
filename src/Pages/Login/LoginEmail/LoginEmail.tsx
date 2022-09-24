import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "Redux/Store";
import Auth from "Services/Auth";
import Logo from "Static/Images/Logo.svg";
import "Styles/Pages/Login/LoginEmail/LoginEmail.scss";
import { LoginSwitcherParams } from "Utils/Hooks/useLoginNavigation";

const LoginEmail: React.FC<LoginSwitcherParams> = ({ params, back }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState<string>("");

  const _confirm = async (): Promise<void> => {
    const auth = new Auth(dispatch);
    await auth.CreateUser(params.phone, params.password, email, "SYSTEM");
  };

  return (
    <div className={`login-email glassmorphism`}>
      <img src={Logo} alt="Wallet Box" className="login-email-logo" />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Введите Email"
        style={{ textAlign: "center" }}
      />
      <div className="login-email-button-wrapper">
        <button className="button-primary" onClick={_confirm}>
          Продолжить
        </button>
        <button className="button-secondary" onClick={back}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default LoginEmail;

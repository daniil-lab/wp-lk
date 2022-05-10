import DateField from "Components/DateField/DateField";
import PhoneField from "Components/PhoneField";
import useBankConnection from "Hooks/useBankConnection";
import { Banks } from "Models/BillModel";
import React, { useState } from "react";
import "Styles/Pages/Main/BalanceBlock/AddBillModal/AddBank/TinkoffBank/TinkoffBank.scss";

interface Props {
  onClose: () => void;
  bank: Banks;
}

const names = {
  tinkoff: "Тинькофф",
  sber: "Сбербанк",
  tochka: "Точка",
};

const BankModal: React.FC<Props> = ({ onClose, bank }) => {
  const [phone, setPhone] = useState<string>("");
  const [date, setDate] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { act, startConnection, submitConnection } = useBankConnection(
    bank,
    date
  );

  const handleConnect = async (): Promise<void> => {
    act === "start" && (await startConnection(phone));
    act === "submit" &&
      (await submitConnection(password, code, () => {
        onClose();
        window.location.reload();
      }));
  };

  const handleClose = () => {
    onClose();
    setPhone("");
    setDate(null);
    setCode("");
    setPassword("");
  };

  return (
    <div className="tinkoff-bank">
      <span className="add-bill-modal-title">{names[bank]}</span>
      <p>
        Компании Wallet App недоступны ваши данные. Они шифруются и хранятся у
        вас в телефоне.
        <br />
        Синхронизация данных не позволяет переводить деньги с вашего счета!
      </p>
      <div className="tinkoff-bank-container">
        <span>Введите логин от мобильного банка</span>
        {bank === "sber" ? (
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Логин"
          />
        ) : (
          <PhoneField
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        )}
      </div>

      <DateField date={date} setDate={setDate} label="Дата загрузки операций" />

      {act === "submit" && (
        <>
          <div className="tinkoff-bank-container">
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
            />
          </div>

          <div className="tinkoff-bank-container">
            <span>Код из смс</span>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Код"
            />
          </div>
        </>
      )}

      <div className="buttons">
        <button className="button-secondary" onClick={handleClose}>
          Отмена
        </button>

        <button className="button-primary" onClick={handleConnect}>
          Подключить
        </button>
      </div>
    </div>
  );
};

export default BankModal;

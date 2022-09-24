import React, { useState } from "react";
import { useSelector } from "react-redux";

import AccessDenied from "Components/AccessDenied/AccessDenied";
import Modal from "Components/Modal/Modal";
import { GetUserId } from "Redux/Selectors";
import BillRepository from "Repository/BillRepository";
import { useGetActiveSubscription } from "Services/Subscription";
import CardIcon from "Static/icons/card.svg";
import "Styles/Pages/Main/BalanceBlock/AddBillModal/AddBillModal.scss";
import AddBank from "./AddBank/AddBank";

interface Props {
  onClose: () => void;
  updateBill: () => void;
}

const AddBillModal: React.FunctionComponent<Props> = ({
  onClose,
  updateBill,
}: Props) => {
  const billRepository = new BillRepository();

  const userId = useSelector(GetUserId);
  const [name, setName] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  const [addBankModal, setAddBankModal] = useState<boolean>(false);

  const { activeSubscription } = useGetActiveSubscription();

  const addDefaulBill = async (): Promise<void> => {
    if (name.length === 0) return alert("Добавьте название");
    if (balance.length === 0) return alert("Добавьте баланс");

    if (userId) {
      await billRepository.addBill(userId, name, balance);
      updateBill();
      onClose();
    }
  };

  return (
    <div className="add-bill-modal">
      <span className="add-bill-modal-title">Добавить счет</span>
      <div className="add-bill-modal-block">
        <div>
          <span>Наименование счета</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Наименование"
          />
        </div>
        <div>
          <span>Текущий баланс</span>
          <input
            type="text"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Баланс"
          />
        </div>
      </div>

      <button
        className="button-secondary"
        onClick={() => setAddBankModal(true)}
      >
        <div className="add-carn-button-wrapper">
          <span>
            <img src={CardIcon} alt="Card icon" />
            Подключить банковский счет
          </span>
        </div>
      </button>

      <p>
        Подключите приложение к счету и все операции из банка будут
        автоматически загружаться в приложение
      </p>

      <p>
        Перед использованием ознакомьтесь, с{" "}
        <span>условиями использования и политикой конфиденциальности</span>
      </p>

      <div className="bill-modal-controll">
        <button className="button-secondary" onClick={onClose}>
          Отмена
        </button>
        <button className="button-primary" onClick={addDefaulBill}>
          Добавить
        </button>
      </div>
      <Modal
        zIndex={11}
        show={addBankModal}
        onClose={() => setAddBankModal(false)}
      >
        {activeSubscription?.variant.role.name === "PremiumRole" ||
        activeSubscription?.variant.role.name === "ProRole" ? (
          <AddBank />
        ) : (
          <AccessDenied closeModal={() => setAddBankModal(false)}>
            Оформите подписку, чтобы получить доступ к подключению банковского
            счета
          </AccessDenied>
        )}
      </Modal>
    </div>
  );
};

export default AddBillModal;

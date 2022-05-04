import AccessDenied from "Components/AccessDenied/AccessDenied";
import Modal from "Components/Modal/Modal";
import React, { useState } from "react";
import Bill from "Services/Bill";
import { useGetActiveSubscription } from "Services/Subscription";
import CardIcon from "Static/icons/card.svg";
import "Styles/Pages/Main/BalanceBlock/AddBillModal/AddBillModal.scss";
import AddBank from "./AddBank/AddBank";

// TASK : Update Bills
// TASK : Fix styles

interface Props {
  onClose: () => void;
  updateBill: () => void;
}

const AddBillModal: React.FunctionComponent<Props> = ({
  onClose,
  updateBill,
}: Props) => {
  const [name, setName] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  const [addBankModal, setAddBankModal] = useState<boolean>(false);

  const { activeSubscription } = useGetActiveSubscription();

  const bill = Bill.useAddBill(name, balance);

  const addDefaulBill = async (): Promise<void> => {
    await bill.addBill();
    updateBill();
    onClose();
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
            <img src={CardIcon} />
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
      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default AddBillModal;

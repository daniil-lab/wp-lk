import React from "react";

import "Styles/Pages/Main/BalanceBlock/BalanceEditModal/BalanceEditModal.scss";

interface Props {
  closeModal: () => void;
  updateBill: () => void;
  remove: () => void;
  edit: () => {};
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  balance: number | string;
  setBalance: React.Dispatch<React.SetStateAction<number | string>>;
}

const DeleteModal: React.FC<Props> = ({
  closeModal,
  updateBill,
  name,
  balance,
  edit,
  remove,
  setName,
  setBalance,
}) => {
  const handleDeleteTransaction = async (action: "remove" | "edit") => {
    if (action === "edit") edit();
    if (action === "remove") remove();
    updateBill();
    closeModal();
  };

  return (
    <div className="balance-edit-modal">
      <p className="balance-edit-modal__title">Редактирование счета</p>
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
      {/* <p className="balance-edit-modal__body">
        Подтвердите удаление. Данное действие невозможно отменить
      </p> */}
      <button
        className="button-primary balance-edit-modal__remove"
        onClick={() => handleDeleteTransaction("remove")}
      >
        Удалить
      </button>
      <div className="balance-edit-modal__buttons">
        <button className="button-secondary" onClick={closeModal}>
          Отмена
        </button>
        <button
          className="button-primary"
          style={{
            background: "rgb(137, 238, 179)",
          }}
          onClick={() => handleDeleteTransaction("edit")}
        >
          Изменить
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;

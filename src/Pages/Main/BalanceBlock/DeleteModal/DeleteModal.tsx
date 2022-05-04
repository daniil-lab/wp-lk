import React from "react";
import Transactions from "Services/Transaction";
import "Styles/Pages/Main/BalanceBlock/DeleteModal/DeleteModal.scss";

interface Props {
  closeModal: () => void;
  transactionId: string | null;
  deleteOp?: () => void;
  updateTransactions?: () => void;
  updateCategory?: () => void;
}

const DeleteModal: React.FC<Props> = ({
  closeModal,
  transactionId,
  deleteOp,
  updateTransactions,
  updateCategory,
}) => {
  const { deleteTransaction } =
    Transactions.useRemoveTransaction(transactionId);

  const handleDeleteTransaction = () => {
    if (deleteOp) deleteOp();
    else deleteTransaction();
    closeModal();
    if (updateTransactions) updateTransactions();
    if (updateCategory) updateCategory();
  };

  return (
    <div className="delete">
      <p className="delete__title">Подтверждение удаления</p>
      <p className="delete__body">
        Подтвердите удаление. Данное действие невозможно отменить
      </p>
      <div className="delete__buttons">
        <button className="button-secondary" onClick={closeModal}>
          Отмена
        </button>
        <button className="button-primary" onClick={handleDeleteTransaction}>
          Удалить
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;

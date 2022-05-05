import React from "react";
import useRemoveTransaction from "Services/Transactions/useRemoveTransaction";
import "Styles/Pages/Main/BalanceBlock/DeleteModal/DeleteModal.scss";

interface Props {
  closeModal: () => void;
  transactionId: string | null;
  deleteOp?: () => void;
  updateTransactions?: () => void;
  updateCategory?: () => void;
  updateBill?: () => void;
  handler?: () => any;
}

const DeleteModal: React.FC<Props> = ({
  closeModal,
  transactionId,
  deleteOp,
  updateTransactions,
  updateCategory,
  handler,
}) => {
  const { deleteTransaction } = useRemoveTransaction(transactionId);

  const handleDeleteTransaction = async () => {
    if (deleteOp) deleteOp();
    if (handler) await handler();
    else deleteTransaction();
    if (updateTransactions) updateTransactions();
    if (updateCategory) updateCategory();
    closeModal();
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

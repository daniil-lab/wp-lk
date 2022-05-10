import React, { useState } from "react";
import { TransactionsSorted } from "Services/Interfaces";
import ChartBlockHistoryWrapper from "./ChartBlockHistoryWrapper/ChartBlockHistoryWrapper";
import ChartBlockHistoryItem from "./ChartBlockHistoryItem/ChartBlockHistoryItem";
import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistory.scss";
import moment from "moment";
import Modal from "Components/Modal/Modal";
import DeleteModal from "Pages/Main/BalanceBlock/BalanceEditModal/BalanceEditModal";
import { BillType } from "Services/Transactions/Models";
import { UseGetCategoriesModel } from "Services/Category/Models";
import TransactionEditModal from "./TransactionEditModal/TransactionEditModal";
import useEditTransactions from "Hooks/useEditTransactions";
import { UseGetBillModel } from "Services/Bill/Models";
import useAddCategoryTransaction from "Hooks/useAddCategoryTransaction";
import BankAddCategoryModal from "./BankAddCategoryModal/BankAddCategoryModal";

interface Props {
  transactions: TransactionsSorted[];
  selectedBill: string | null;
  billType: BillType;
  updateTransactions: () => void;
  categories: UseGetCategoriesModel;
  bills: UseGetBillModel;
}

const sortByDate = (a, b) => (moment(a.date).isAfter(moment(b.date)) ? -1 : 1);

const ChartBlockHistory: React.FunctionComponent<Props> = (props: Props) => {
  const { transactions, bills, updateTransactions, categories } = props;
  const {
    showEditModal,
    setShowEditModal,
    setTransactionId,
    ...editTransaction
  } = useEditTransactions(categories, bills, transactions);

  const addCategoryTransaction = useAddCategoryTransaction();

  const existsCategory = (id: string): boolean => {
    if (categories.categories.find((c) => c.id === id)) return true;
    else return false;
  };

  const bankCategories = () => {
    if (
      addCategoryTransaction.transactionType === "SPEND" ||
      addCategoryTransaction.transactionType === "WIDTHDRAW"
    ) {
      return categories.categories.filter((c) => c.forSpend && !c.forEarn);
    }
    if (
      addCategoryTransaction.transactionType === "EARN" ||
      addCategoryTransaction.transactionType === "DEPOSIT"
    ) {
      return categories.categories.filter((c) => !c.forSpend && c.forEarn);
    }
    return [];
  };

  return (
    <div className="chart-block-history">
      {transactions.sort(sortByDate).map((g, i) => {
        return g.transactions.length > 0 ? (
          <ChartBlockHistoryWrapper key={i} date={g.date}>
            {g.transactions.map((transaction, k) => {
              return (
                <ChartBlockHistoryItem
                  key={k}
                  transactionType={
                    transaction?.transactionType ?? transaction?.action
                  }
                  icon={
                    transaction?.category
                      ? existsCategory(transaction?.category?.id)
                        ? {
                            color: transaction?.category?.color.hex ?? "",
                            path: transaction?.category?.icon.name ?? "",
                          }
                        : null
                      : null
                  }
                  title={
                    transaction?.category?.name ?? transaction?.description
                  }
                  subtitle={transaction?.bill?.name ?? transaction?.billName}
                  price={transaction?.amount?.amount ?? transaction?.sum}
                  currency={transaction.currency}
                  onClick={() => {
                    if (transaction?.type === "TINKOFF") {
                      addCategoryTransaction.setTransactionId(transaction.id);
                      addCategoryTransaction.setTransactionType(
                        transaction.transactionType
                      );
                      addCategoryTransaction.modal.setShow(true);
                      if (transaction?.category)
                        addCategoryTransaction.setSelectedCategory(
                          transaction?.category
                        );
                    }
                    if (transaction?.type === "SYSTEM") {
                      setTransactionId(transaction.id);
                      setShowEditModal(true);
                    }
                  }}
                />
              );
            })}
          </ChartBlockHistoryWrapper>
        ) : null;
      })}

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <TransactionEditModal
          onClose={() => setShowEditModal(false)}
          updateTransactions={updateTransactions}
          {...editTransaction}
        />
      </Modal>
      <Modal
        style={{
          width: 500,
          height: 400,
        }}
        show={addCategoryTransaction.modal.show}
        onClose={() => {
          addCategoryTransaction.modal.setShow(false);
          addCategoryTransaction.setTransactionId(null);
          addCategoryTransaction.setOperationType(null);
          addCategoryTransaction.setTransactionType(null);
          addCategoryTransaction.setSelectedCategory(null);
        }}
      >
        <BankAddCategoryModal
          operationType={addCategoryTransaction.operationType}
          selectedCategory={addCategoryTransaction.selectedCategory}
          transactionType={addCategoryTransaction.transactionType}
          categories={bankCategories()}
          setSelectedCategory={addCategoryTransaction.setSelectedCategory}
          edit={addCategoryTransaction.edit}
          updateTransactions={updateTransactions}
          onClose={() => {
            addCategoryTransaction.modal.setShow(false);
            addCategoryTransaction.setTransactionId(null);
            addCategoryTransaction.setOperationType(null);
            addCategoryTransaction.setTransactionType(null);
            addCategoryTransaction.setSelectedCategory(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ChartBlockHistory;

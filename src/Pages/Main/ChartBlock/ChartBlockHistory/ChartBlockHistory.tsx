import React from "react";
import moment from "moment";

import ChartBlockHistoryWrapper from "./ChartBlockHistoryWrapper/ChartBlockHistoryWrapper";
import ChartBlockHistoryItem from "./ChartBlockHistoryItem/ChartBlockHistoryItem";
import Modal from "Components/Modal/Modal";
import useEditTransactions from "Hooks/useEditTransactions";
import useAddCategoryTransaction from "Hooks/useAddCategoryTransaction";
import BankAddCategoryModal from "./BankAddCategoryModal/BankAddCategoryModal";
import { BillType } from "Models/BillModel";
import TransactionEditModal from "./TransactionEditModal/TransactionEditModal";
import { CategoryModel } from "Models/CategoryModel";
import { ITransactionsSorted } from "Models/TransactionModel";
import { ChartMode } from "../types";
import useGetBill from "../../../../Hooks/useGetBill";
import useGetCategories from "../../../../Hooks/useGetCategories";

import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistory.scss";

interface ChartBlockHistoryProps {
  transactions: ITransactionsSorted[];
  selectedBill: string | null;
  billType: BillType;
  categoriesData: ReturnType<typeof useGetCategories>;
  billsData?: ReturnType<typeof useGetBill>;
  updateBills: () => void;
  updateTransactions: () => void;
  budget?: boolean;
  categories?: CategoryModel[];
  mode?: ChartMode;
}

const sortByDate = (a, b) => (moment(a.date).isAfter(moment(b.date)) ? -1 : 1);

const ChartBlockHistory: React.FunctionComponent<ChartBlockHistoryProps> = ({
  transactions,
  billsData,
  updateTransactions,
  categoriesData,
  budget,
  categories,
  updateBills,
}) => {
  const {
    showEditModal,
    setShowEditModal,
    setTransactionId,
    ...editTransaction
  } = useEditTransactions(categoriesData, transactions, billsData);

  const addCategoryTransaction = useAddCategoryTransaction();

  const existsCategory = (id: string): boolean => {
    let arr = budget && categories ? categories : categoriesData.categories;
    return !!arr.find((c) => c.id === id);
  };

  const bankCategories = () => {
    if (
      addCategoryTransaction.transactionType === "SPEND" ||
      addCategoryTransaction.transactionType === "WIDTHDRAW"
    ) {
      return categoriesData.categories.filter((c) => c.forSpend && !c.forEarn);
    }
    if (
      addCategoryTransaction.transactionType === "EARN" ||
      addCategoryTransaction.transactionType === "DEPOSIT"
    ) {
      let arr = budget && categories ? categories : categoriesData.categories;
      return arr.filter((c) => !c.forSpend && c.forEarn);
    }
    return [];
  };

  if (budget) {
    return (
      <div className="chart-block-history">
        {transactions.map((g, i) => {
          return g.transactions.length > 0 ? (
            <ChartBlockHistoryWrapper key={i} date={g.date}>
              {g.transactions.map((transaction, k) => {
                return (
                  <ChartBlockHistoryItem
                    key={k}
                    transactionType={
                      "transactionType" in transaction
                        ? transaction.transactionType
                        : transaction.action
                    }
                    icon={
                      transaction?.category
                        ? existsCategory(transaction.category.id)
                          ? {
                              color: transaction.category.color.hex ?? "",
                              path: transaction.category.icon.name ?? "",
                            }
                          : null
                        : null
                    }
                    title={
                      transaction?.category?.name ?? transaction?.description
                    }
                    subtitle={
                      "bill" in transaction
                        ? transaction.bill.name
                        : "billName" in transaction
                        ? transaction.billName
                        : ""
                    }
                    price={
                      "sum" in transaction
                        ? transaction.sum
                        : transaction.amount
                    }
                    currency={transaction.currency}
                    onClick={() => {}}
                  />
                );
              })}
            </ChartBlockHistoryWrapper>
          ) : null;
        })}
      </div>
    );
  }

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
                    "action" in transaction
                      ? transaction.action
                      : transaction.transactionType
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
                  subtitle={
                    "bill" in transaction
                      ? transaction.bill.name
                      : "billName" in transaction
                      ? transaction.billName
                      : ""
                  }
                  price={
                    "sum" in transaction ? transaction.sum : transaction.amount
                  }
                  currency={transaction.currency}
                  onClick={() => {
                    if ("type" in transaction) {
                      switch (transaction.type) {
                        case "TINKOFF":
                          addCategoryTransaction.setTransactionId(
                            transaction.id
                          );
                          addCategoryTransaction.setTransactionType(
                            transaction.transactionType
                          );
                          addCategoryTransaction.modal.setShow(true);
                          if (transaction?.category)
                            addCategoryTransaction.setSelectedCategory(
                              transaction?.category
                            );
                          return;
                        case "SBER":
                          addCategoryTransaction.setTransactionId(
                            transaction.id
                          );
                          addCategoryTransaction.setTransactionType(
                            transaction.transactionType
                          );
                          addCategoryTransaction.modal.setShow(true);
                          if (transaction?.category)
                            addCategoryTransaction.setSelectedCategory(
                              transaction?.category
                            );
                          return;
                        case "TOCHKA":
                          addCategoryTransaction.setTransactionId(
                            transaction.id
                          );
                          addCategoryTransaction.setTransactionType(
                            transaction.transactionType
                          );
                          addCategoryTransaction.modal.setShow(true);
                          if (transaction.category)
                            addCategoryTransaction.setSelectedCategory(
                              transaction.category
                            );
                          return;
                      }
                    }

                    setTransactionId(transaction.id);
                    setShowEditModal(true);
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
          updateBills={updateBills}
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

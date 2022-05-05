import React, { useState } from "react";
import { TransactionsSorted } from "Services/Interfaces";
import ChartBlockHistoryWrapper from "./ChartBlockHistoryWrapper/ChartBlockHistoryWrapper";
import ChartBlockHistoryItem from "./ChartBlockHistoryItem/ChartBlockHistoryItem";
import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistory.scss";
import moment from "moment";
import Modal from "Components/Modal/Modal";
import DeleteModal from "Pages/Main/BalanceBlock/DeleteModal/DeleteModal";
import { BillType } from "Services/Transactions/Models";
import { UseGetCategoriesModel } from "Services/Category/Models";

interface Props {
  transactions: TransactionsSorted[];
  selectedBill: string | null;
  billType: BillType;
  updateTransactions?: () => void;
  categories: UseGetCategoriesModel;
}

const sortByDate = (a, b) => (moment(a.date).isAfter(moment(b.date)) ? -1 : 1);

const ChartBlockHistory: React.FunctionComponent<Props> = (props: Props) => {
  const { transactions, selectedBill, updateTransactions, categories } = props;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const existsCategory = (id: string): boolean => {
    if (categories.categories.find((c) => c.id === id)) return true;
    else return false;
  };

  return (
    <div className="chart-block-history">
      {transactions.sort(sortByDate).map((g, i) => {
        return g.transactions.length > 0 ? (
          <ChartBlockHistoryWrapper key={i} date={g.date}>
            {g.transactions.map((transaction, k) => {
              return existsCategory(transaction.category.id) ? (
                <ChartBlockHistoryItem
                  key={k}
                  transactionType={
                    !selectedBill
                      ? transaction.transactionType
                      : transaction.action
                  }
                  icon={{
                    color: transaction.category?.color.hex,
                    path: transaction.category?.icon.name,
                  }}
                  title={transaction.category?.name ?? transaction?.description}
                  subtitle={transaction?.bill?.name ?? transaction?.billName}
                  price={transaction.sum}
                  currency={transaction.currency}
                  onClick={() => {
                    setTransactionId(transaction.id);
                    setShowDeleteModal(true);
                  }}
                />
              ) : null;
            })}
          </ChartBlockHistoryWrapper>
        ) : null;
      })}

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteModal
          closeModal={() => setShowDeleteModal(false)}
          transactionId={transactionId}
          updateTransactions={updateTransactions}
        />
      </Modal>
    </div>
  );
};

export default ChartBlockHistory;

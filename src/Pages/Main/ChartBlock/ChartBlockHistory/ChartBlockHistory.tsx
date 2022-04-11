import React from "react";
import { TransactionsSorted } from "Services/Interfaces";
import ChartBlockHistoryWrapper from "./ChartBlockHistoryWrapper/ChartBlockHistoryWrapper";
import ChartBlockHistoryItem from "./ChartBlockHistoryItem/ChartBlockHistoryItem";

import "Styles/Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistory.scss";

import BellIcon from "../../../../Static/icons/bell.svg";

interface Props {
  transactions: TransactionsSorted[];
}

// TODO: DELETE
const transactionMock = [
  {
    date: "04.11.22",
    transactions: [
      {
        action: "SPEND",
        category: {
          categoryLimit: 1,
          color: { hex: undefined },
          description: "description",
          id: "id-123-123",
          name: "name",
          user: null,
          icon: {
            name: "2022-03-14T08:50:17.876507504Z-3e249b2f-f43f-43fc-9b9b-2bdfaad069cd.svg",
          },
        },
        date: "22.10.27",
        currency: "$",
        amount: 12,
        title: "Развлечения",
      },
      {
        action: "SPEND",
        category: {
          categoryLimit: 1,
          color: { hex: "#FED467" },
          description: "description",
          id: "id-123-123",
          name: "name",
          user: null,
          icon: {
            name: "2022-03-14T08:50:17.876507504Z-3e249b2f-f43f-43fc-9b9b-2bdfaad069cd.svg",
          },
        },
        date: "22.10.27",
        currency: "$",
        amount: 12,
        title: "Еда",
      },
      {
        action: "SPEND",
        category: {
          categoryLimit: 1,
          color: { hex: "#5C80FF" },
          description: "description",
          id: "id-123-123",
          name: "name",
          user: null,
          icon: {
            name: "2022-03-14T08:50:17.876507504Z-3e249b2f-f43f-43fc-9b9b-2bdfaad069cd.svg",
          },
        },
        date: "22.10.27",
        currency: "$",
        amount: 12,
        title: "Работа",
      },
    ],
  },
];

const ChartBlockHistory: React.FunctionComponent<Props> = (props: Props) => {
  const { transactions = transactionMock } = props;

  return (
    <div className="chart-block-history">
      {(Object.keys(transactions).length > 0
        ? transactions
        : transactionMock
      ).map((g, i) => {
        return (
          <ChartBlockHistoryWrapper key={i} date={g.date}>
            {g.transactions.map((transaction, k) => {
              return (
                <ChartBlockHistoryItem
                  key={k}
                  type={transaction.action}
                  icon={{
                    color: transaction.category?.color.hex,
                    path: transaction.category?.icon.name,
                  }}
                  title={transaction.title}
                  // title={transaction.category?.name ?? transaction.bill.name}
                  subtitle={"**** 1234"}
                  price={transaction.amount}
                  currency={transaction.currency}
                />
              );
            })}
          </ChartBlockHistoryWrapper>
        );
      })}
    </div>
  );
};

export default ChartBlockHistory;

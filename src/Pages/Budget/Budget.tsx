import React, { useEffect, useState } from "react";
import ExpenseIncomeBlock from "./ExpenseIncomeBlock/ExpenseIncomeBlock";
import PlusCircleFill from "Static/icons/plus-circle-fill.svg";

import "Styles/Pages/Budget/Budget.scss";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";

import Header from "Components/Header/Header";
import Load from "Components/Load/Load";
import Dateslider from "Components/DateSlider/Dateslider";
import Catigories from "../../Services/Category";
import { API_URL } from "Utils/Config";
import useCircleChart from "Utils/Hooks/useCircleChart";
import CircleChart from "Components/CircleChart/CircleChart";
import ChartBlockHistory from "Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistory";
import Transaction from "Services/Transaction";
import Modal from "Components/Modal/Modal";
import AddOperationModal from "Pages/Main/ChartBlock/AddOperationModal/AddOperationModal";
interface Props {}

const Budget: React.FunctionComponent<Props> = (props: Props) => {
  const [showAddOperationModal, setShowAddOperationModal] = useState(false);
  const { load, categories } = Catigories.useGetCategory();

  const [selectedCategory, setCategody] = useState(categories[0]);
  useEffect(() => {
    setCategody(categories[0]);
  }, [categories[0]]);

  const { useGetTransaction } = Transaction;
  const { transactions, selectedDate, next, prev } = useGetTransaction();

  const [fillterTransactions, setFillterTransactions] = useState(transactions);

  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    setFillterTransactions(
      transactions.map((a) => {
        const newTransactions = a?.transactions?.filter(
          (b) => b.category?.name === selectedCategory?.name
        );
        return { ...a, transactions: newTransactions };
      })
    );
  }, [transactions, selectedCategory?.name]);

  useEffect(() => {
    setIncome(
      fillterTransactions
        ?.map((item) =>
          item.transactions
            .filter((i) => i.action === "DEPOSIT" || i.action === "EARN")
            .reduce((x, y) => +x + +y.amount, 0)
        )
        .reduce((x, y) => x + y, 0)
    );

    setExpenses(
      fillterTransactions
        ?.map((item) =>
          item.transactions
            .filter((i) => i.action === "WITHDRAW" || i.action === "SPEND")
            .reduce((x, y) => +x + +y.amount, 0)
        )
        .reduce((x, y) => x + y, 0)
    );
  }, [fillterTransactions]);

  const expenseCircle = useCircleChart(expenses);
  return (
    <div className="budget">
      <div className="budget-content">
        <Header />
        <h1 className="main__title budget__title">Бюджет</h1>
        <div className="app-card">
          <ExpenseIncomeBlock
            selectedCategory={selectedCategory}
            setCategody={setCategody}
            expenses={expenses}
            income={income}
            prev={prev}
            next={next}
            selectedDate={selectedDate[0]}
          />
        </div>
      </div>
      <div className="expense-income-operations">
        <div className="app-card operations">
          <div className="app-card-header operations-header">
            <h1 style={{ flexGrow: 1 }}>Операции</h1>
            <div
              className="content-section-controll operations-controls"
              onClick={() => setShowAddOperationModal(true)}
            >
              <span>Добавить операцию </span>
              <img src={PlusCircleFill} alt={"Plus icon"} />
            </div>
          </div>
          <Load {...{ load }}>
            <div className="operations-block">
              <div className="operations-info">
                <div className="operations-item operations-dates">
                  <Dateslider
                    next={next}
                    prev={prev}
                    selectedDate={selectedDate[0]}
                  />
                </div>
                <div className="operations-item operations-categories">
                  <div className="operations-categories-title">
                    <h1>{selectedCategory?.name}</h1>
                    <div
                      className="operations-icon"
                      style={{
                        backgroundColor: selectedCategory?.color?.hex,
                      }}
                    >
                      <img
                        src={`${API_URL}api/v1/image/content/${selectedCategory?.icon?.name}`}
                      />
                    </div>
                  </div>
                  <div className="expense-income-history operations-history">
                    <div className="expense-income-card expense-income-wrapper">
                      <div className="expense-income-card-content">
                        <span>Расход</span>
                        <span className="expense-income-card-content-title">
                          Сейчас
                        </span>
                        <span>{selectedCategory?.categorySpend} ₽</span>
                        <span className="expense-income-card-content-title ">
                          Запланировано
                        </span>
                        <span>{selectedCategory?.categoryLimit} ₽</span>
                      </div>
                      <div className="expense-income-card-bar">
                        <CircleChart
                          strokeDashoffset={100 - (selectedCategory?.percentsFromLimit < 100 ? selectedCategory?.percentsFromLimit : 100)}
                          color="#F0187B"
                        />
                        <div className="expense-income-card-bar-value">{Math.round(selectedCategory?.percentsFromLimit)}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="operations-transactions">
                  <ChartBlockHistory transactions={fillterTransactions} />
                </div>
              </div>
            </div>
          </Load>
        </div>
      </div>
      <Modal
        show={showAddOperationModal}
        onClose={() => setShowAddOperationModal(false)}
        style={{ width: "30%" }}
      >
        <AddOperationModal onClose={() => setShowAddOperationModal(false)} />
      </Modal>
    </div>
  );
};

export default Budget;

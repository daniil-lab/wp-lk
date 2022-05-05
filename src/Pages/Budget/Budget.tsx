import React, { useState } from "react";
import ExpenseIncomeBlock from "./ExpenseIncomeBlock/ExpenseIncomeBlock";
import PlusCircleFill from "Static/icons/plus-circle-fill.svg";
import Header from "Components/Header/Header";
import Load from "Components/Load/Load";
import Dateslider from "Components/DateSlider/Dateslider";
import { API_URL } from "Utils/Config";
import CircleChart from "Components/CircleChart/CircleChart";
import ChartBlockHistory from "Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistory";
import Modal from "Components/Modal/Modal";
import AddOperationModal from "Pages/Main/ChartBlock/AddOperationModal/AddOperationModal";
import HexToRgbA from "Utils/HexToRgbA";
import "Styles/Pages/Budget/Budget.scss";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";
import useBudget from "Services/Budget/useBudget";
import useCategoryLimit from "Services/Category/useCategoryLimit";
import Image from "Components/Image/Image";
import TransactionsIcon from "Static/icons/transaction.svg";
import useGetBill from "Services/Bill/useGetBill";

interface Props {}

const Budget: React.FunctionComponent<Props> = (props: Props) => {
  const budget = useBudget();
  const bills = useGetBill();
  const updateLimit = useCategoryLimit();

  const getIncomeCategory = (id: string): number => {
    return budget.transaction.transactions
      .map((a) => {
        const newTransactions = a?.transactions?.filter(
          (b) => b.category?.id === id
        );
        return { ...a, transactions: newTransactions };
      })
      .map((item) =>
        item.transactions
          .filter(
            (i) =>
              i.transactionType === "DEPOSIT" || i.transactionType === "EARN"
          )
          .reduce((x, y) => +x + +y.sum, 0)
      )
      .reduce((x, y) => x + y, 0);
  };

  const [showAddOperationModal, setShowAddOperationModal] = useState(false);

  const handleAddOperation = () => {
    if (!!bills.data.length && !!budget.categories.categories.length) {
      setShowAddOperationModal(true);
    } else if (!!bills.data.length) {
      alert("Добавьте категорию!");
    } else if (!!budget.categories.categories.length) {
      alert("Добавьте счет!");
    } else {
      alert("Добавьте категорию и счет!");
    }
  };

  return (
    <div className="budget">
      <div className="budget-content">
        <Header />
        <h1 className="main__title budget__title">Бюджет</h1>
        <div className="app-card">
          {budget.selectedCategory && (
            <ExpenseIncomeBlock
              transactions={budget.transaction.transactions}
              updateCategoryLimit={updateLimit}
              selectCategory={budget.setSelectedCategory}
              selectedCategory={budget.selectedCategory}
              prev={budget.transaction.date.prevMonth}
              next={budget.transaction.date.nextMonth}
              selectedDate={budget.transaction.date.date}
              categories={budget.categories.categories}
              updateCategories={budget.categories.updateCategory}
              getIncomeCategory={getIncomeCategory}
              load={
                budget.transaction.load &&
                budget.categories.load &&
                budget.selectedCategory != null
              }
              generalBudget={budget.generalBudget}
            />
          )}
        </div>
      </div>
      <div className="expense-income-operations">
        <div className="app-card operations">
          <div className="app-card-header operations-header">
            <h1 style={{ flexGrow: 1 }}>Операции</h1>
            <div
              className="content-section-controll operations-controls"
              onClick={handleAddOperation}
            >
              <span>Добавить операцию </span>
              <img src={PlusCircleFill} alt={"Plus icon"} />
            </div>
          </div>
          {budget.selectedCategory && (
            <Load
              {...{ load: budget.categories.load && budget.transaction.load }}
            >
              <div className="operations-block">
                <div className="operations-info">
                  <div className="operations-item operations-dates">
                    <Dateslider
                      prev={budget.transaction.date.prevMonth}
                      next={budget.transaction.date.nextMonth}
                      selectedDate={budget.transaction.date.date}
                    />
                  </div>
                  <div className="operations-item operations-categories">
                    <div className="operations-categories-title">
                      <h1>{budget.selectedCategory.name}</h1>

                      <div
                        className="operations-icon"
                        style={{
                          background: `linear-gradient(135deg, ${
                            budget.selectedCategory.color.hex ?? "#8fe87b"
                          } 0%, ${HexToRgbA(
                            budget.selectedCategory.color.hex ?? "#8fe87b"
                          )} 100%)`,
                        }}
                      >
                        <img
                          src={`${API_URL}api/v1/image/content/${budget.selectedCategory.icon.name}`}
                        />
                      </div>
                    </div>
                    <div className="expense-income-history operations-history">
                      <div className="expense-income-card expense-income-wrapper">
                        <div className="expense-income-card-content">
                          <span>
                            {budget.selectedCategory.onlyForEarn
                              ? "Доход"
                              : "Расход"}
                          </span>
                          <span className="expense-income-card-content-title">
                            Сейчас
                          </span>
                          <span>
                            {budget.selectedCategory.onlyForEarn
                              ? getIncomeCategory(budget.selectedCategory.id)
                              : budget.selectedCategory?.categorySpend}{" "}
                            ₽
                          </span>
                          <span className="expense-income-card-content-title ">
                            Запланировано
                          </span>
                          <span>
                            {budget.selectedCategory?.categoryLimit} ₽
                          </span>
                        </div>
                        <div className="expense-income-card-bar">
                          <CircleChart
                            strokeDashoffset={
                              100 -
                              (budget?.selectedCategory?.onlyForEarn
                                ? (getIncomeCategory(
                                    budget?.selectedCategory?.id
                                  ) /
                                    budget?.selectedCategory?.categoryLimit) *
                                    100 <
                                  100
                                  ? (getIncomeCategory(
                                      budget?.selectedCategory?.id
                                    ) /
                                      budget?.selectedCategory?.categoryLimit) *
                                    100
                                  : 100
                                : budget.getPercentsFromLimit)
                            }
                            color="#F0187B"
                          />
                          <div className="expense-income-card-bar-value">
                            {budget?.selectedCategory?.onlyForEarn
                              ? Math.round(
                                  (getIncomeCategory(
                                    budget?.selectedCategory.id
                                  ) /
                                    budget?.selectedCategory?.categoryLimit) *
                                    100
                                )
                              : budget?.selectedCategory?.percentsFromLimit.toFixed(
                                  1
                                )}{" "}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="operations-transactions">
                    {budget.fillterTransactions.length === 0 ? (
                      <div className="budget-empty-transactions">
                        <Image
                          src={TransactionsIcon}
                          alt="Transactions"
                          frame={{ width: 100, height: 100 }}
                        />
                      </div>
                    ) : (
                      <ChartBlockHistory
                        transactions={budget.fillterTransactions}
                        selectedBill={budget.transaction.bill}
                        billType={budget.transaction.billType}
                        categories={budget.categories}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Load>
          )}
        </div>
      </div>
      <Modal
        show={showAddOperationModal}
        onClose={() => setShowAddOperationModal(false)}
        style={{ width: "30%" }}
      >
        <AddOperationModal
          onClose={() => setShowAddOperationModal(false)}
          updateTransactions={() => {
            budget.transaction.updateTransactions();
            budget.categories.updateCategory();
          }}
        />
      </Modal>
    </div>
  );
};

export default Budget;

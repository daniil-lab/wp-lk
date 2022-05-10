import React, { useMemo, useState } from "react";
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
// import useCategoryLimit from "Services/Category/useCategoryLimit";
import Image from "Components/Image/Image";
import TransactionsIcon from "Static/icons/transaction.svg";
// import useGetBill from "Services/Bill/useGetBill";
import useBudget from "Hooks/useBudget";
import useGetTransaction from "Hooks/useGetTransaction";
import useGetCategories from "Hooks/useGetCategories";
import useGetBill from "Hooks/useGetBill";
import moment from "moment";
import { type } from "os";
import useCategoryLimit from "Hooks/useCategoryLimit";
import useAddTransaction from "Hooks/useAddTransaction";
import NumberWithSpaces from "Utils/NumberWithSpaces";

interface Props {}

const Budget: React.FunctionComponent<Props> = (props: Props) => {
  const transactions = useGetTransaction();
  const addTransaction = useAddTransaction();
  const categories = useGetCategories();
  const budget = useBudget(categories, transactions);
  const bills = useGetBill();
  const updateLimit = useCategoryLimit();

  const getIncomeCategory = (id: string): number => {
    return budget.fillterTransactions
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
              i?.transactionType === "DEPOSIT" ||
              i?.transactionType === "EARN" ||
              i?.action === "DEPOSIT" ||
              i?.action === "EARN"
          )
          .reduce((x, y) => +x + +(y?.sum ?? y?.amount?.amount), 0)
      )
      .reduce((x, y) => x + y, 0);
  };

  const getCurrent = useMemo(() => {
    if (budget.selectedCategory) {
      const f = budget.fillterTransactions;
      const ttt = f.map((a) => {
        const newTransactions = a?.transactions?.filter(
          (b) => b?.category.id === budget.selectedCategory?.id
        );
        return { ...a, transactions: newTransactions };
      });

      if (
        budget.selectedCategory?.forEarn &&
        !budget.selectedCategory?.forSpend
      ) {
        return ttt
          .map((item) =>
            item.transactions
              .filter(
                (i) =>
                  i?.transactionType === "DEPOSIT" ||
                  i?.action === "DEPOSIT" ||
                  i?.transactionType === "EARN" ||
                  i?.action === "EARN"
              )
              .reduce((x, y) => +x + +(y?.sum ?? y?.amount?.amount), 0)
          )
          .reduce((x, y) => x + y, 0);
      }

      if (
        !budget.selectedCategory?.forEarn &&
        budget.selectedCategory?.forSpend
      ) {
        return ttt
          .map((item) =>
            item.transactions
              .filter(
                (i) =>
                  i?.transactionType === "SPEND" ||
                  i?.action === "SPEND" ||
                  i?.transactionType === "WITHDRAW" ||
                  i?.action === "WITHDRAW"
              )
              .reduce((x, y) => +x + +(y?.sum ?? y?.amount?.amount), 0)
          )
          .reduce((x, y) => x + y, 0);
      }

      if (
        budget.selectedCategory?.forEarn &&
        budget.selectedCategory?.forSpend
      ) {
        return ttt
          .map((item) =>
            item.transactions.reduce(
              (x, y) => +x + +(y?.sum ?? y?.amount?.amount),
              0
            )
          )
          .reduce((x, y) => x + y, 0);
      }
    } else {
      return 0;
    }
    return 0;
  }, [budget.selectedCategory]);

  const [showAddOperationModal, setShowAddOperationModal] = useState(false);

  const handleAddOperation = () => {
    if (!!bills.data.length && !!categories.categories.length) {
      setShowAddOperationModal(true);
    } else if (!!bills.data.length) {
      alert("Добавьте категорию!");
    } else if (!!categories.categories.length) {
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
              transactions={budget.fillterTransactions}
              updateCategoryLimit={updateLimit}
              selectCategory={budget.setSelectedCategory}
              selectedCategory={budget.selectedCategory}
              prev={transactions.date.prevMonth}
              next={transactions.date.nextMonth}
              selectedDate={transactions.date.date}
              categories={categories.categories}
              updateCategories={categories.updateCategory}
              getIncomeCategory={getIncomeCategory}
              load={
                transactions.load &&
                categories.load &&
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
            <Load {...{ load: categories.load && transactions.load }}>
              <div className="operations-block">
                <div className="operations-info">
                  <div className="operations-item operations-dates">
                    <Dateslider
                      prev={transactions.date.prevMonth}
                      next={transactions.date.nextMonth}
                      selectedDate={transactions.date.date}
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
                            {budget.selectedCategory.forEarn &&
                              budget.selectedCategory.forSpend &&
                              "Доход / Расход"}
                            {budget.selectedCategory.forEarn &&
                              !budget.selectedCategory.forSpend &&
                              "Доход"}
                            {!budget.selectedCategory.forEarn &&
                              budget.selectedCategory.forSpend &&
                              "Расход"}
                          </span>
                          <span className="expense-income-card-content-title">
                            Сейчас
                          </span>
                          <span>{NumberWithSpaces(getCurrent)} ₽</span>
                          <span className="expense-income-card-content-title ">
                            Запланировано
                          </span>
                          <span>
                            {NumberWithSpaces(
                              budget.selectedCategory?.categoryLimit
                            )}{" "}
                            ₽
                          </span>
                        </div>
                        <div className="expense-income-card-bar">
                          <CircleChart
                            strokeDashoffset={
                              100 -
                              budget?.selectedCategory?.categoryLimit * 100
                            }
                            color="#F0187B"
                          />
                          <div className="expense-income-card-bar-value">
                            {isNaN(
                              Math.round(
                                (getIncomeCategory(
                                  budget?.selectedCategory.id
                                ) /
                                  budget?.selectedCategory?.categoryLimit) *
                                  100
                              )
                            )
                              ? 0
                              : Math.round(
                                  (getIncomeCategory(
                                    budget?.selectedCategory.id
                                  ) /
                                    budget?.selectedCategory?.categoryLimit) *
                                    100
                                )}
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
                        selectedBill={transactions.bill}
                        billType={transactions.billType}
                        categories={categories}
                        bills={[]}
                        updateTransactions={transactions.updateTransactions}
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
            transactions.updateTransactions();
            categories.updateCategory();
          }}
          addTransaction={addTransaction.addTransaction}
          updateBills={bills.updateBill}
          bills={bills}
          category={categories}
        />
      </Modal>
    </div>
  );
};

export default Budget;

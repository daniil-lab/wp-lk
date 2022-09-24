import React, { useEffect, useMemo, useState } from "react";

import ExpenseIncomeBlock from "./ExpenseIncomeBlock/ExpenseIncomeBlock";
import PlusCircleFill from "Static/icons/plus-circle-fill.svg";
import Header from "Components/Header/Header";
import Load from "Components/Load/Load";
import Dateslider from "Components/DateSlider/Dateslider";
import { API_URL } from "Utils/Config";
import ChartBlockHistory from "Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistory";
import Modal from "Components/Modal/Modal";
import AddOperationModal from "Pages/Main/ChartBlock/AddOperationModal/AddOperationModal";
import HexToRgbA from "Utils/HexToRgbA";
import Image from "Components/Image/Image";
import TransactionsIcon from "Static/icons/transaction.svg";
import useGetTransaction from "Hooks/useGetTransaction";
import useGetCategories from "Hooks/useGetCategories";
import useGetBill from "Hooks/useGetBill";
import useAddTransaction from "Hooks/useAddTransaction";
import { CategoryModel } from "Models/CategoryModel";
import CreateBudget from "Utils/CreateBudget";
import ExpensesIncome from "./ExpensesIncome/ExpensesIncome";

import "Styles/Pages/Budget/Budget.scss";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";

const createBudget = new CreateBudget();

const Budget: React.FC = () => {
  const transactionsData = useGetTransaction();
  const addTransaction = useAddTransaction();
  const categoriesData = useGetCategories();
  const billsData = useGetBill();

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryModel | null>(null);
  const [showAddOperationModal, setShowAddOperationModal] = useState(false);

  const filteredTransactions = useMemo(() => {
    if (!(transactionsData.load || categoriesData.load) || !selectedCategory)
      return [];

    return createBudget.filterTransactions(
      transactionsData.transactions,
      selectedCategory
    );
  }, [
    selectedCategory,
    transactionsData.load,
    categoriesData.load,
    transactionsData.transactions,
  ]);

  const filterTransactionsByCategories = useMemo(() => {
    return createBudget.filterTransactionsByCategories(
      transactionsData.transactions,
      categoriesData.categories
    );
  }, [
    categoriesData.categories,
    categoriesData.load,
    transactionsData.transactions,
  ]);

  const selectedCategoryBudget = useMemo(() => {
    if (selectedCategory) {
      const selectedCatBudget = createBudget.getSelectedCategoryBudget(
        transactionsData.transactions,
        selectedCategory
      );
      return {
        income: selectedCatBudget.income,
        expenses: selectedCatBudget.expenses,
        incomeLimit: selectedCategory.earnStatistic,
        expensesLimit: selectedCategory.spendStatistic,
      };
    } else {
      return { income: 0, incomeLimit: 0, expenses: 0, expensesLimit: 0 };
    }
  }, [transactionsData.transactions, selectedCategory]);

  const generalBudget = useMemo(
    () => createBudget.getGeneralBudget(filterTransactionsByCategories),
    [filterTransactionsByCategories]
  );

  const categoriesBudget = useMemo(
    () =>
      createBudget.getCategoriesExpensesBudget(filterTransactionsByCategories),
    [filterTransactionsByCategories]
  );

  const handleAddOperation = () => {
    if (!!billsData.data.length && !!categoriesData.categories.length) {
      setShowAddOperationModal(true);
    } else if (!!billsData.data.length) {
      alert("Добавьте категорию!");
    } else if (!!categoriesData.categories.length) {
      alert("Добавьте счет!");
    } else {
      alert("Добавьте категорию и счет!");
    }
  };

  useEffect(() => {
    if (categoriesData.load) setSelectedCategory(categoriesData.categories[0]);
  }, [categoriesData.load]);

  return (
    <div className="budget">
      <div className="budget-content">
        <Header />
        <h1 className="main__title budget__title">Бюджет</h1>
        <div className="app-card">
          <ExpenseIncomeBlock
            categoriesBudget={categoriesBudget}
            selectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            prev={transactionsData.date.prevMonth}
            next={transactionsData.date.nextMonth}
            selectedDate={transactionsData.date.date}
            categories={categoriesData.categories}
            load={
              transactionsData.load &&
              categoriesData.load &&
              selectedCategory != null
            }
            generalBudget={generalBudget}
          />
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
          {selectedCategory != null && (
            <Load
              {...{
                load: categoriesData.load && transactionsData.load,
              }}
            >
              <div className="operations-block">
                <div className="operations-info">
                  <div className="operations-item operations-dates">
                    <Dateslider
                      prev={transactionsData.date.prevMonth}
                      next={transactionsData.date.nextMonth}
                      selectedDate={transactionsData.date.date}
                    />
                  </div>
                  <div className="operations-item operations-categories">
                    <div
                      className="operations-categories-title"
                      style={{ marginBottom: 20 }}
                    >
                      <h1>{selectedCategory!.name}</h1>

                      <div
                        className="operations-icon"
                        style={{
                          background: `linear-gradient(135deg, ${
                            selectedCategory!.color.hex ?? "#8fe87b"
                          } 0%, ${HexToRgbA(
                            selectedCategory!.color.hex ?? "#8fe87b"
                          )} 100%)`,
                        }}
                      >
                        <img
                          src={`${API_URL}api/v1/image/content/${
                            selectedCategory!.icon.name
                          }`}
                          alt={`${
                            selectedCategory?.icon.name || "Image of"
                          } category`}
                        />
                      </div>
                    </div>
                    <ExpensesIncome
                      limit={selectedCategoryBudget.expensesLimit}
                      type="expenses"
                      value={selectedCategoryBudget.expenses}
                    />
                    <ExpensesIncome
                      limit={selectedCategoryBudget.incomeLimit}
                      type="income"
                      value={selectedCategoryBudget.income}
                    />
                  </div>

                  <div className="operations-transactions">
                    {filteredTransactions.length === 0 ? (
                      <div className="budget-empty-transactions">
                        <Image
                          src={TransactionsIcon}
                          alt="Transactions"
                          frame={{ width: 100, height: 100 }}
                        />
                      </div>
                    ) : (
                      <ChartBlockHistory
                        transactions={filteredTransactions}
                        selectedBill={transactionsData.bill}
                        billType={transactionsData.billType}
                        categoriesData={categoriesData}
                        updateTransactions={transactionsData.updateTransactions}
                        budget={true}
                        categories={categoriesData.categories}
                        updateBills={billsData.updateBill}
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
            transactionsData.updateTransactions();
            categoriesData.updateCategory();
          }}
          addTransaction={addTransaction.addTransaction}
          updateBills={billsData.updateBill}
          billsData={billsData}
          categoriesData={categoriesData}
        />
      </Modal>
    </div>
  );
};

export default Budget;

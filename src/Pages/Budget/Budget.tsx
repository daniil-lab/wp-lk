import React, { useEffect, useMemo, useState } from "react";
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
import useGetTransaction from "Hooks/useGetTransaction";
import useGetCategories from "Hooks/useGetCategories";
import useGetBill from "Hooks/useGetBill";
import moment from "moment";
import { type } from "os";
import useCategoryLimit from "Hooks/useCategoryLimit";
import useAddTransaction from "Hooks/useAddTransaction";
import NumberWithSpaces from "Utils/NumberWithSpaces";
import { CategoryModel } from "Models/CategoryModel";
import CreateBudget from "Utils/CreateBudget";
import { ExpensesIncome } from "./ExpenseIncomeBlock/ExpenseIncomeBlock";

interface Props {}

const Budget: React.FunctionComponent<Props> = (props: Props) => {
  const transactions = useGetTransaction();
  const addTransaction = useAddTransaction();
  const categories = useGetCategories();
  const bills = useGetBill();
  const updateLimit = useCategoryLimit();
  // const budget = useBudget(categories, transactions);

  const createBudget = new CreateBudget();

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryModel | null>(null);

  const fillterTransactions = useMemo(() => {
    if (transactions.load && categories.load) {
      if (selectedCategory) {
        return createBudget.fillterTransactions(
          transactions.transactions,
          selectedCategory
        );
      } else {
        return [];
      }
    } else {
      return [];
    }
  }, [selectedCategory, transactions.load, categories.load]);

  const fillterCategory = useMemo(() => {
    if (categories.load) {
      return categories.categories.filter((category) => {
        if (category.categoryLimit > 0) return category;
      });
    } else {
      return [];
    }
  }, [categories.load]);

  const fillterTransactionsByCategories = useMemo(() => {
    return createBudget.fillterTransactionsByCategories(
      transactions.transactions,
      fillterCategory
    );
  }, [transactions.load, categories.load]);

  const selectedCategoryBudget = useMemo(() => {
    if (selectedCategory) {
      return createBudget.getSelectedCategoryBudget(
        transactions.transactions,
        fillterCategory,
        selectedCategory
      );
    } else {
      return { income: 0, incomeLimit: 0, expenses: 0, expensesLimit: 0 };
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (categories.load) setSelectedCategory(fillterCategory[0]);
  }, [categories.load]);

  const getIncomeCategory = (id: string): number => {
    return 0; // createBudget.getIncomeCategory(id, fillterTransactions);
  };

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
          <ExpenseIncomeBlock
            updateCategoryLimit={updateLimit}
            selectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            prev={transactions.date.prevMonth}
            next={transactions.date.nextMonth}
            selectedDate={transactions.date.date}
            categories={fillterCategory}
            updateCategories={categories.updateCategory}
            getIncomeCategory={getIncomeCategory}
            load={
              transactions.load && categories.load && selectedCategory != null
            }
            generalBudget={createBudget.getGeneralBudget(
              fillterTransactionsByCategories,
              fillterCategory
            )}
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
                load: categories.load && transactions.load,
              }}
            >
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
                    {fillterTransactions.length === 0 ? (
                      <div className="budget-empty-transactions">
                        <Image
                          src={TransactionsIcon}
                          alt="Transactions"
                          frame={{ width: 100, height: 100 }}
                        />
                      </div>
                    ) : (
                      <ChartBlockHistory
                        transactions={fillterTransactions}
                        selectedBill={transactions.bill}
                        billType={transactions.billType}
                        categories={categories}
                        bills={[]}
                        updateTransactions={transactions.updateTransactions}
                        budget={true}
                        filteredCategory={fillterCategory}
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

import React, { useEffect, useMemo, useState } from "react";
import ExpenseIncomeBlock from "./ExpenseIncomeBlock/ExpenseIncomeBlock";
import PlusCircleFill from "Static/icons/plus-circle-fill.svg";

import "Styles/Pages/Budget/Budget.scss";
import "Styles/Pages/Budget/ExpenseIncomeBlock/ExpenseIncomeBlock.scss";

import Header from "Components/Header/Header";
import Load from "Components/Load/Load";
import Dateslider from "Components/DateSlider/Dateslider";
import Catigories, { ICategory } from "../../Services/Category";
import { API_URL } from "Utils/Config";
import useCircleChart from "Utils/Hooks/useCircleChart";
import CircleChart from "Components/CircleChart/CircleChart";
import ChartBlockHistory from "Pages/Main/ChartBlock/ChartBlockHistory/ChartBlockHistory";
import Transaction from "Services/Transaction";
import Modal from "Components/Modal/Modal";
import AddOperationModal from "Pages/Main/ChartBlock/AddOperationModal/AddOperationModal";
import HexToRgbA from "Utils/HexToRgbA";

interface Props {}

const Budget: React.FunctionComponent<Props> = (props: Props) => {
  const categories = Catigories.useGetCategory();
  const transaction = Transaction.useGetTransaction();

  const [showAddOperationModal, setShowAddOperationModal] = useState(false);

  const expensesCategories = useMemo(() => {
    return categories.categories.filter((c) => !c.onlyForEarn);
  }, [categories.load, categories.categories]);

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const fillterTransactions = useMemo(() => {
    return transaction.transactions.map((a) => {
      const newTransactions = a?.transactions?.filter(
        (b) => b.category?.name === selectedCategory?.name
      );
      return { ...a, transactions: newTransactions };
    });
  }, [selectedCategory, transaction.transactions, categories.categories]);

  useEffect(() => {
    if (categories.load) setSelectedCategory(expensesCategories[0]);
  }, [categories.load]);

  const getPercentsFromLimit = useMemo(() => {
    if (selectedCategory) {
      if (selectedCategory.percentsFromLimit) {
        return selectedCategory.percentsFromLimit < 100
          ? selectedCategory.percentsFromLimit
          : 100;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }, [selectedCategory]);

  return (
    <div className="budget">
      <div className="budget-content">
        <Header />
        <h1 className="main__title budget__title">Бюджет</h1>
        <div className="app-card">
          {selectedCategory && (
            <ExpenseIncomeBlock
              percentsFromLimit={getPercentsFromLimit}
              setCategoryLimit={Catigories.setCategoryLimit}
              selectCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              prev={transaction.date.prevMonth}
              next={transaction.date.nextMonth}
              selectedDate={transaction.date.date}
              categories={expensesCategories}
              updateCategories={categories.updateCategory}
              load={
                transaction.load && categories.load && selectedCategory != null
              }
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
              onClick={() => setShowAddOperationModal(true)}
            >
              <span>Добавить операцию </span>
              <img src={PlusCircleFill} alt={"Plus icon"} />
            </div>
          </div>
          {selectedCategory && (
            <Load {...{ load: categories.load && transaction.load }}>
              <div className="operations-block">
                <div className="operations-info">
                  <div className="operations-item operations-dates">
                    <Dateslider
                      prev={transaction.date.prevMonth}
                      next={transaction.date.nextMonth}
                      selectedDate={transaction.date.date}
                    />
                  </div>
                  <div className="operations-item operations-categories">
                    <div className="operations-categories-title">
                      <h1>{selectedCategory.name}</h1>

                      <div
                        className="operations-icon"
                        style={{
                          background: `linear-gradient(135deg, ${
                            selectedCategory.color.hex ?? "#8fe87b"
                          } 0%, ${HexToRgbA(
                            selectedCategory.color.hex ?? "#8fe87b"
                          )} 100%)`,
                        }}
                      >
                        <img
                          src={`${API_URL}api/v1/image/content/${selectedCategory.icon.name}`}
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
                            strokeDashoffset={100 - getPercentsFromLimit}
                            color="#F0187B"
                          />
                          <div className="expense-income-card-bar-value">
                            {selectedCategory?.percentsFromLimit.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="operations-transactions">
                    <ChartBlockHistory
                      transactions={fillterTransactions}
                      selectedBill={transaction.bill}
                      billType={transaction.billType}
                      categories={categories}
                    />
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
            transaction.updateTransactions();
            categories.updateCategory();
          }}
        />
      </Modal>
    </div>
  );
};

export default Budget;

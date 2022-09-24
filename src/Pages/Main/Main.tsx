import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import ContextButton from "Components/ContextButton/ContextButton";
import Header from "Components/Header/Header";
import Modal from "Components/Modal/Modal";
import useAddTransaction from "Hooks/useAddTransaction";
import useGetBill from "Hooks/useGetBill";
import useGetCategories from "Hooks/useGetCategories";
import useGetTransaction from "Hooks/useGetTransaction";
import PlusCircleFill from "Static/icons/plus-circle-fill.svg";
import AddBillModal from "./BalanceBlock/AddBillModal/AddBillModal";
import BalanceBlock from "./BalanceBlock/BalanceBlock";
import Banner from "./Banner/Banner";
import CategoryBlock from "./CategoryBlock/CategoryBlock";
import CategoryConstructor from "./CategoryBlock/CategoryConstructor/CategoryConstructor";
import AddOperationModal from "./ChartBlock/AddOperationModal/AddOperationModal";
import ChartBlock from "./ChartBlock/ChartBlock";
import { ICategoryFilter } from "./types";
import { useViewportSize } from "../../Utils/Hooks/useViewportSize";

import "Styles/Pages/Main/Main.scss";
import { categoryFiltersData } from "./const";

const Main: React.FC = () => {
  const [showBillModal, setShowBillModal] = useState<boolean>(false);
  const [categoryFilters, setCategoryFilters] = useState<ICategoryFilter>({
    income: false,
    expense: false,
    favorite: false,
  });

  const username = useSelector((state: any) => state?.user?.user?.username);
  const billsData = useGetBill();
  const categoriesData = useGetCategories();
  const transactionsData = useGetTransaction();
  const addTransaction = useAddTransaction();
  const { viewportWidth } = useViewportSize();

  const categoryFilterClasses = useMemo(
    () => ({
      income: categoryFilters.income ? "app-card__filters_filter-active" : "",
      expense: categoryFilters.expense ? "app-card__filters_filter-active" : "",
      favorite: categoryFilters.favorite
        ? "app-card__filters_filter-active"
        : "",
    }),
    [categoryFilters]
  );

  const handleToggleCategoryFilters = (filter: keyof ICategoryFilter) => {
    setCategoryFilters({
      ...categoryFilters,
      [filter]: !categoryFilters[filter],
    });
  };

  const handleAddOperation = () => {
    if (!!billsData.data.length && !!categoriesData.categories.length) {
      addTransaction.modal.setShowAddOperationModal(true);
    } else if (!!billsData.data.length) {
      alert("Добавьте категорию!");
    } else if (!!categoriesData.categories.length) {
      alert("Добавьте счет!");
    } else {
      alert("Добавьте категорию и счет!");
    }
  };

  return (
    <div className="main">
      <Header />
      <h1 className="main__title">
        Добрый день{username ? `, ${username}!` : "!"}
      </h1>
      <div className="app-card">
        <div className="app-card-header">
          <div
            className="content-section-controll"
            onClick={handleAddOperation}
          >
            <span>Добавить операцию </span>
            <img src={PlusCircleFill} alt={"Plus icon"} />
          </div>
        </div>
        <ChartBlock
          transactionsData={transactionsData}
          categoriesData={categoriesData}
          billsData={billsData}
        />
      </div>
      <div className="app-card">
        <div className="app-card-header">
          <div
            className="content-section-controll"
            onClick={() => setShowBillModal(true)}
          >
            <span>Добавить счет</span>
            <img src={PlusCircleFill} alt={"Plus icon"} />
          </div>
        </div>
        <BalanceBlock
          data={billsData.data}
          generalBalance={billsData.generalBalance}
          load={billsData.load}
          setBill={transactionsData.setBill}
          selected={transactionsData.bill}
          billType={transactionsData.billType}
          setBillType={transactionsData.setBillType}
          updateBill={billsData.updateBill}
          tinkoffCards={billsData.tinkoffCards}
          sberCards={billsData.sberCards}
          tochkaCards={billsData.tochkaCards}
          updateTransactions={transactionsData.updateTransactions}
        />
      </div>
      {/* MARK : Category list */}
      <div className="app-card">
        <div className="app-card-header">
          <div className="category-header">
            <div className="content-section-title content-section-category">
              <h1>Категории</h1>
            </div>
            {viewportWidth >= 700 && (
              <div className="app-card__filters">
                {categoryFiltersData.map((filterData, index) => (
                  <button
                    key={`${filterData.key}-${index}`}
                    type="button"
                    className={categoryFilterClasses[filterData.key]}
                    onClick={() => handleToggleCategoryFilters(filterData.key)}
                  >
                    {filterData.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <ContextButton
            button={
              <div className="content-section-controll">
                <span>Добавить категорию</span>
                <img src={PlusCircleFill} alt={"Plus icon"} />
              </div>
            }
            content={(params, ctx) => (
              <CategoryConstructor
                updateCategory={categoriesData.updateCategory}
                {...{ ...ctx, params }}
              />
            )}
          />
        </div>
        {viewportWidth < 700 && (
          <div className="app-card__filters">
            {categoryFiltersData.map((filterData, index) => (
              <button
                key={`${filterData.key}-${index}`}
                type="button"
                className={categoryFilterClasses[filterData.key]}
                onClick={() => handleToggleCategoryFilters(filterData.key)}
              >
                {filterData.name}
              </button>
            ))}
          </div>
        )}
        <CategoryBlock
          filters={categoryFilters}
          categories={categoriesData.categories}
          load={categoriesData.load}
          updateCategory={categoriesData.updateCategory}
          modifyCategory={categoriesData.modifyCategory}
        />
      </div>
      <div className="app-card" style={{ minHeight: "200px" }}>
        <Banner />
      </div>
      <Modal
        show={addTransaction.modal.showAddOperationModal}
        onClose={() => addTransaction.modal.setShowAddOperationModal(false)}
      >
        <AddOperationModal
          onClose={() => addTransaction.modal.setShowAddOperationModal(false)}
          updateTransactions={transactionsData.updateTransactions}
          addTransaction={addTransaction.addTransaction}
          updateBills={billsData.updateBill}
          billsData={billsData}
          categoriesData={categoriesData}
        />
      </Modal>

      <Modal show={showBillModal} onClose={() => setShowBillModal(false)}>
        <AddBillModal
          onClose={() => setShowBillModal(false)}
          updateBill={billsData.updateBill}
        />
      </Modal>
    </div>
  );
};

export default Main;

import ContextButton from "Components/ContextButton/ContextButton";
import Header from "Components/Header/Header";
import Modal from "Components/Modal/Modal";
import useAddTransaction from "Hooks/useAddTransaction";
import useGetBill from "Hooks/useGetBill";
import useGetCategories from "Hooks/useGetCategories";
import useGetTransaction from "Hooks/useGetTransaction";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PlusCircleFill from "Static/icons/plus-circle-fill.svg";
import "Styles/Pages/Main/Main.scss";
import AddBillModal from "./BalanceBlock/AddBillModal/AddBillModal";
import BalanceBlock from "./BalanceBlock/BalanceBlock";
import Banner from "./Banner/Banner";
import CategoryBlock from "./CategoryBlock/CategoryBlock";
import CategoryConstructor from "./CategoryBlock/CategoryConstructor/CategoryConstructor";
import AddOperationModal from "./ChartBlock/AddOperationModal/AddOperationModal";
import ChartBlock from "./ChartBlock/ChartBlock";

interface Props {}

const Main: React.FunctionComponent<Props> = (props: Props) => {
  const username = useSelector((state: any) => state?.user?.user?.username);
  const bills = useGetBill();
  const categories = useGetCategories();
  const transaction = useGetTransaction();
  const addTransaction = useAddTransaction();

  const [showBillModal, setShowBillModal] = useState<boolean>(false);

  const handleAddOperation = () => {
    if (!!bills.data.length && !!categories.categories.length) {
      addTransaction.modal.setShowAddOperationModal(true);
    } else if (!!bills.data.length) {
      alert("Добавьте категорию!");
    } else if (!!categories.categories.length) {
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
          transaction={transaction}
          categories={categories}
          bills={bills}
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
          data={bills.data}
          generalBalance={bills.generalBalance}
          load={bills.load}
          setBill={transaction.setBill}
          selected={transaction.bill}
          billType={transaction.billType}
          setBillType={transaction.setBillType}
          updateBill={bills.updateBill}
          tinkoffCards={bills.tinkoffCards}
          sberCards={bills.sberCards}
          tochkaCards={bills.tochkaCards}
          updateTransactions={transaction.updateTransactions}
        />
      </div>
      {/* MARK : Category list */}
      <div className="app-card">
        <div className="app-card-header">
          <div className="content-section-title content-section-category">
            <h1>Категории</h1>
          </div>
          <div>
            <ContextButton
              button={
                <div className="content-section-controll">
                  <span>Добавить категорию</span>
                  <img src={PlusCircleFill} alt={"Plus icon"} />
                </div>
              }
              content={(params, ctx) => (
                <CategoryConstructor
                  updateCategory={categories.updateCategory}
                  {...{ ...ctx, params }}
                />
              )}
            />
          </div>
        </div>
        <CategoryBlock
          categories={categories.categories}
          load={categories.load}
          updateCategory={categories.updateCategory}
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
          updateTransactions={transaction.updateTransactions}
          addTransaction={addTransaction.addTransaction}
          updateBills={bills.updateBill}
          bills={bills}
          category={categories}
        />
      </Modal>

      <Modal show={showBillModal} onClose={() => setShowBillModal(false)}>
        <AddBillModal
          onClose={() => setShowBillModal(false)}
          updateBill={bills.updateBill}
        />
      </Modal>
    </div>
  );
};

export default Main;

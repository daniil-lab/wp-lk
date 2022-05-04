import ContextButton from "Components/ContextButton/ContextButton";
import Header from "Components/Header/Header";
import Modal from "Components/Modal/Modal";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Category from "Services/Category";
import { SelectedBillType } from "Services/Interfaces";
import PlusCircleFill from "Static/icons/plus-circle-fill.svg";
import "Styles/Pages/Main/Main.scss";
import AddBillModal from "./BalanceBlock/AddBillModal/AddBillModal";
import BalanceBlock from "./BalanceBlock/BalanceBlock";
import Banner from "./Banner/Banner";
import CategoryBlock from "./CategoryBlock/CategoryBlock";
import CategoryConstructor from "./CategoryBlock/CategoryConstructor/CategoryConstructor";
import AddOperationModal from "./ChartBlock/AddOperationModal/AddOperationModal";
import ChartBlock from "./ChartBlock/ChartBlock";

import Bill from "Services/Bill";
import Transaction from "Services/Transaction";

interface Props {}

const Main: React.FunctionComponent<Props> = (props: Props) => {
  const username = useSelector((state: any) => state?.user?.user?.username);
  const bill = Bill.useGetBill();
  const transaction = Transaction.useGetTransaction();
  const categories = Category.useGetCategory();

  // MARK : Modals
  const [showAddOperationModal, setShowAddOperationModal] =
    useState<boolean>(false);
  const [showBillModal, setShowBillModal] = useState<boolean>(false);

  const handleAddOperation = () => {
    if (!!bill.data.length && !!categories.categories.length) {
      setShowAddOperationModal(true);
    } else if (!!bill.data.length) {
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
        <ChartBlock transaction={transaction} categories={categories} />
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
          data={bill.data}
          generalBalance={bill.generalBalance}
          load={bill.load}
          setBill={transaction.setBill}
          selected={transaction.bill}
          billType={transaction.billType}
          setBillType={transaction.setBillType}
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
      {/* MARK : Banner */}
      <div className="app-card" style={{ minHeight: "200px" }}>
        <Banner />
      </div>
      <Modal
        show={showAddOperationModal}
        onClose={() => setShowAddOperationModal(false)}
      >
        <AddOperationModal
          onClose={() => setShowAddOperationModal(false)}
          updateTransactions={transaction.updateTransactions}
        />
      </Modal>

      <Modal show={showBillModal} onClose={() => setShowBillModal(false)}>
        <AddBillModal
          onClose={() => setShowBillModal(false)}
          updateBill={bill.updateBill}
        />
      </Modal>
    </div>
  );
};

export default Main;

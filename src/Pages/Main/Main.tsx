import React, { useState } from "react";
import ChartBlock from "./ChartBlock/ChartBlock";
import BalanceBlock from "./BalanceBlock/BalanceBlock";
import Banner from "./Banner/Banner";
import CategoryBlock from "./CategoryBlock/CategoryBlock";
import ContextButton from "Components/ContextButton/ContextButton";
import CategoryConstructor from "./CategoryBlock/CategoryConstructor/CategoryConstructor";
import PlusCircleFill from "Static/icons/plus-circle-fill.svg";
import Modal from "Components/Modal/Modal";
import AddOperationModal from "./ChartBlock/AddOperationModal/AddOperationModal";
import FadeIn from "Components/FadeIn/FadeIn";
import AddBillModal from "./BalanceBlock/AddBillModal/AddBillModal";

import "Styles/Pages/Main/Main.scss";
import Header from "Components/Header/Header";
import { useSelector } from "react-redux";

interface Props {}

const Main: React.FunctionComponent<Props> = (props: Props) => {
  const username = useSelector((state: any) => state?.user?.user?.username);
  const [showAddOperationModal, setShowAddOperationModal] =
    useState<boolean>(false);

  const [showBillModal, setShowBillModal] = useState<boolean>(false);
  return (
    <div className="main">
      <Header />
      <h1 className="main__greet">
        Добрый день{username ? `, ${username}!` : "!"}
      </h1>
      <div className="app-card">
        <div className="app-card-header">
          <div className="content-section-title">Операции</div>
          <div
            className="content-section-controll"
            onClick={() => setShowAddOperationModal(true)}
          >
            <span>Добавить операцию </span>
            <img src={PlusCircleFill} alt={"Plus icon"} />
          </div>
        </div>
        <ChartBlock />
      </div>
      <div className="app-card">
        <div className="app-card-header">
          <div className="content-section-title">Балансы</div>
          <div
            className="content-section-controll"
            onClick={() => setShowBillModal(true)}
          >
            <span>Добавить счет</span>
            <img src={PlusCircleFill} alt={"Plus icon"} />
          </div>
        </div>
        <BalanceBlock />
      </div>
      <div className="app-card">
        <div className="app-card-header">
          <div className="content-section-title">Категории</div>
          <div>
            <ContextButton
              button={
                <div className="content-section-controll">
                  <span>Добавить категорию</span>
                  <img src={PlusCircleFill} alt={"Plus icon"} />
                </div>
              }
              content={(params, ctx) => (
                <CategoryConstructor {...{ ...ctx, params }} />
              )}
            />
          </div>
        </div>
        <CategoryBlock />
      </div>
      <div className="app-card">
        <Banner />
      </div>
      <Modal
        show={showAddOperationModal}
        onClose={() => setShowAddOperationModal(false)}
        style={{ width: "30%" }}
      >
        <AddOperationModal onClose={() => setShowAddOperationModal(false)} />
      </Modal>
      <Modal
        show={showBillModal}
        onClose={() => setShowBillModal(false)}
        style={{ width: "30%" }}
      >
        <AddBillModal onClose={() => setShowBillModal(false)} />
      </Modal>
    </div>
  );
};

export default Main;

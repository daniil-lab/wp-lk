import React, { useState } from "react";
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
  const expense = useCircleChart(67);
  const income = useCircleChart(74);

  const { useGetTransaction } = Transaction;
  const { transactions } = useGetTransaction();
  return (
    <div className="budget">
      <div className="budget-content">
        <Header />
        <h1 className="main__title budget__title">Бюджет</h1>
        <div className="app-card">
          <ExpenseIncomeBlock />
        </div>
      </div>
      <div className="expense-income-operations">
        <div className="app-card operations">
          <div className="app-card-header operations-header">
            <h1>Операции</h1>
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
                  <Dateslider />
                </div>
                <div className="operations-item operations-categories">
                  <div className="operations-categories-title">
                    <h1>{categories[0]?.name}</h1>
                    <div
                      className="operations-icon"
                      style={{
                        backgroundColor: categories[0]?.color?.hex,
                      }}
                    >
                      <img
                        src={`${API_URL}api/v1/image/content/${categories[0]?.icon?.name}`}
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
                        <span>68 495 ₽</span>
                        <span className="expense-income-card-content-title ">
                          Запланировано
                        </span>
                        <span>189 800 ₽</span>
                      </div>
                      <div className="expense-income-card-bar">
                        <CircleChart
                          strokeDashoffset={expense.strokeDashOffsetValue}
                          color="#F0187B"
                        />
                        <div className="expense-income-card-bar-value">67%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="operations-transactions">
                  <ChartBlockHistory {...{ transactions }} />
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

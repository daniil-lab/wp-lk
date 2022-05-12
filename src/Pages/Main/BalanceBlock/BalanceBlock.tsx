import Load from "Components/Load/Load";
import { BankCardModel, BillModel, BillType } from "Models/BillModel";
import React, { useMemo } from "react";
import "Styles/Pages/Main/BalanceBlock/BalanceBlock.scss";
import BalanceBlockItem from "./BalanceBlockItem/BalanceBlockItem";
import WalletIcon from "Static/icons/wallet.svg";
import Image from "Components/Image/Image";
import Modal from "Components/Modal/Modal";
import BalanceEditModal from "./BalanceEditModal/BalanceEditModal";
import TinkoffIcon from "Static/Images/tinkoff.png";
import SberIcon from "Static/Images/sber.png";
import TochkaIcon from "Static/Images/tochka.svg";
import useEditBill from "Hooks/useEditBill";
import BillRepository from "Repository/BillRepository";
import { useDispatch } from "react-redux";
import { AppDispatch } from "Redux/Store";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import useRemoveIntegration from "Hooks/useRemoveIntegration";

interface Props {
  data: BillModel[];
  generalBalance: number;
  load: boolean;
  selected: string | null;
  setBill: React.Dispatch<React.SetStateAction<string | null>>;
  billType: BillType;
  setBillType: React.Dispatch<React.SetStateAction<BillType>>;
  tinkoffCards: BankCardModel[];
  sberCards: BankCardModel[];
  tochkaCards: BankCardModel[];
  updateBill: () => void;
  updateTransactions: () => void;
}

const BalanceBlock: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const removeIntegration = useRemoveIntegration();
  const {
    data,
    load,
    selected,
    setBill,
    generalBalance,
    setBillType,
    updateBill,
    tinkoffCards,
    sberCards,
    tochkaCards,
    updateTransactions,
  } = props;
  const editBill = useEditBill();

  const length = useMemo(() => {
    return load
      ? data.length +
          tinkoffCards.length +
          sberCards.length +
          tochkaCards.length
      : 0;
  }, [load]);

  return (
    <div className="balance-block">
      <h1 className="balance-block-title">Балансы</h1>
      <Load
        {...{ load }}
        className={`${data.length === 0 && "bill-list-isEmpty"}`}
      >
        {length > 0 ? (
          <React.Fragment>
            <BalanceBlockItem
              onClick={() => {
                setBill(null);
                setBillType("general");
              }}
              className={!selected ? "general" : ""}
              title="Общий баланс"
              price={generalBalance}
              cents={0}
            />
            {data.map((bill) => (
              <BalanceBlockItem
                onClick={() => {
                  if (selected == bill.id) {
                    editBill.setBillId(bill.id);
                    editBill.setName(bill.name);
                    editBill.setBalance(bill.balance.amount);
                    editBill.setShowEditModal(true);
                  } else {
                    setBill(bill.id);
                    setBillType("bill");
                  }
                }}
                key={bill.id}
                title={bill.name}
                price={bill.balance.amount}
                cents={bill.balance.cents}
                className={selected == bill.id ? "general" : ""}
              />
            ))}
            {tinkoffCards.map((card) => (
              <BalanceBlockItem
                onClick={() => {
                  if (selected == card.id) {
                    removeIntegration.setType("tinkoff");
                    removeIntegration.setModalShow(true);
                  } else {
                    setBill(card.id);
                    setBillType("tinkoff");
                  }
                }}
                key={card.id}
                icon={TinkoffIcon}
                title={"Tinkoff"}
                price={card.balance.amount}
                cents={card.balance.cents}
                className={selected == card.id ? "general" : ""}
              />
            ))}
            {sberCards.map((card) => (
              <BalanceBlockItem
                onClick={() => {
                  if (selected == card.id) {
                    removeIntegration.setType("sber");
                    removeIntegration.setModalShow(true);
                  } else {
                    setBill(card.id);
                    setBillType("sber");
                  }
                }}
                key={card.id}
                icon={SberIcon}
                title={"Sber"}
                price={card.balance.amount}
                cents={card.balance.cents}
                className={selected == card.id ? "general" : ""}
              />
            ))}
            {tochkaCards.map((card) => (
              <BalanceBlockItem
                onClick={() => {
                  if (selected == card.id) {
                    removeIntegration.setType("tochka");
                    removeIntegration.setModalShow(true);
                  } else {
                    setBill(card.id);
                    setBillType("tochka");
                  }
                }}
                key={card.id}
                icon={TochkaIcon}
                title={"Tochka"}
                subtitle={card.cardNumber}
                price={card.balance.amount}
                cents={card.balance.cents}
                className={selected == card.id ? "general" : ""}
              />
            ))}
          </React.Fragment>
        ) : (
          <div className="bill-list-isEmpty">
            <Image
              src={WalletIcon}
              alt="Wallet"
              frame={{ width: 100, height: 100 }}
            />
          </div>
        )}
      </Load>
      <Modal
        show={removeIntegration.modalShow}
        onClose={() => {
          removeIntegration.setModalShow(false);

          removeIntegration.setType(null);
        }}
      >
        <div className="delete">
          <p className="delete__title">Подтверждение удаления</p>
          <p className="delete__body">
            Подтвердите удаление. Данное действие невозможно отменить
          </p>
          <div className="delete__buttons">
            <button
              className="button-secondary"
              onClick={() => {
                removeIntegration.setModalShow(false);

                removeIntegration.setType(null);
              }}
            >
              Отмена
            </button>
            <button
              className="button-primary"
              onClick={() => {
                removeIntegration.__disableIntegration();
                updateBill();
                updateTransactions();
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        show={editBill.showEditModal}
        onClose={() => {
          editBill.setBillId(null);
          editBill.setName("");
          editBill.setBalance(0);
          editBill.setShowEditModal(false);
        }}
      >
        <BalanceEditModal
          closeModal={() => {
            editBill.setBillId(null);
            editBill.setName("");
            editBill.setBalance(0);
            editBill.setShowEditModal(false);
          }}
          updateBill={updateBill}
          edit={editBill.edit}
          remove={editBill.remove}
          name={editBill.name}
          setName={editBill.setName}
          balance={editBill.balance}
          setBalance={editBill.setBalance}
        />
      </Modal>
    </div>
  );
};

export default BalanceBlock;

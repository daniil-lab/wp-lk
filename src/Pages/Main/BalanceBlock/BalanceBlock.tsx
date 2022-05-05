import Load from "Components/Load/Load";
import { BillModel } from "Models/BillModel";
import React, { useState } from "react";
import "Styles/Pages/Main/BalanceBlock/BalanceBlock.scss";
import BalanceBlockItem from "./BalanceBlockItem/BalanceBlockItem";
import WalletIcon from "Static/icons/wallet.svg";
import Image from "Components/Image/Image";
import { BillType } from "Services/Transactions/Models";
import Modal from "Components/Modal/Modal";
import DeleteModal from "./DeleteModal/DeleteModal";
import useRemoveBill from "Services/Bill/useRemoveBill";

interface Props {
  data: BillModel[];
  generalBalance: number;
  load: boolean;
  selected: string | null;
  setBill: React.Dispatch<React.SetStateAction<string | null>>;
  billType: BillType;
  setBillType: React.Dispatch<React.SetStateAction<BillType>>;

  updateBill: () => void;
}

const BalanceBlock: React.FC<Props> = (props: Props) => {
  const {
    data,
    load,
    selected,
    setBill,
    generalBalance,
    setBillType,
    updateBill,
  } = props;
  const removeBill = useRemoveBill();
  return (
    <div className="balance-block">
      <h1 className="balance-block-title">Балансы</h1>
      <Load
        {...{ load }}
        className={`${data.length === 0 && "bill-list-isEmpty"}`}
      >
        {data.length > 0 ? (
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
                    removeBill.setBillId(bill.id);
                    removeBill.setShowDeleteModal(true);
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
        show={removeBill.showDeleteModal}
        onClose={() => {
          removeBill.setBillId(null);
          removeBill.setShowDeleteModal(false);
        }}
      >
        {removeBill.billId}
        <DeleteModal
          closeModal={() => {
            removeBill.setBillId(null);
            updateBill();
            removeBill.setShowDeleteModal(false);
          }}
          handler={removeBill.remove}
          transactionId={null}
        />
      </Modal>
    </div>
  );
};

export default BalanceBlock;

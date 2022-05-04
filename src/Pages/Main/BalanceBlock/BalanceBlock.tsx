import Load from "Components/Load/Load";
import { BillModel } from "Models/BillModel";
import React from "react";
import Bill from "Services/Bill";
import { SelectedBillType } from "Services/Interfaces";
import { BillType } from "Services/Transaction";
import SberIcon from "Static/Images/sber.png";
import TinkoffIcon from "Static/Images/tinkoff.png";
import "Styles/Pages/Main/BalanceBlock/BalanceBlock.scss";
import BalanceBlockItem from "./BalanceBlockItem/BalanceBlockItem";
import CardBlockItem from "./CardBlockItem/CardBlockItem";
import WalletIcon from "Static/icons/wallet.svg";
import Image from "Components/Image/Image";

interface Props {
  data: BillModel[];
  generalBalance: number;
  load: boolean;
  selected: string | null;
  setBill: React.Dispatch<React.SetStateAction<string | null>>;
  billType: BillType;
  setBillType: React.Dispatch<React.SetStateAction<BillType>>;
}

const BalanceBlock: React.FC<Props> = (props: Props) => {
  const { data, load, selected, setBill, generalBalance, setBillType } = props;
  // const { useGetTinkoffCards, useGetSberCards } = Bill;

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
                  setBill(bill.id);
                  setBillType("bill");
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
    </div>
  );
};

export default BalanceBlock;

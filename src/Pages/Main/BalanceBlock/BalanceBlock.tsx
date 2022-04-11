import Load from "Components/Load/Load";
import React from "react";
import Bill from "Services/Bill";
import "Styles/Pages/Main/BalanceBlock/BalanceBlock.scss";
import BalanceBlockItem from "./BalanceBlockItem/BalanceBlockItem";
import TinkoffIcon from "Static/Images/tinkoff.png";
import SberIcon from "Static/Images/sber.png";
import TochkaIcon from "Static/Images/tochka.svg";

const BalanceBlock: React.FC = () => {
  const { useGetBill, useGetTinkoffCards, useGetSberCards } = Bill;
  const { load: loadBill, balances, generalBalance } = useGetBill();
  const { load: loadTinkoffCards, cards: tinkoffCards } = useGetTinkoffCards();
  const { load: loadSberCards, cards: sberCards } = useGetSberCards();

  return (
    <Load
      {...{ load: loadBill && loadTinkoffCards && loadSberCards }}
      className="balance-block"
    >
      <h1 className="balance-block-title">Балансы</h1>
      <BalanceBlockItem
        className="general"
        title="Общий баланс"
        price={generalBalance}
      />
      {balances.map((balance) => {
        return (
          <BalanceBlockItem
            key={balance.id}
            title={balance.name}
            price={balance.balance.amount}
          />
        );
      })}
      {tinkoffCards.map((card) => (
        <BalanceBlockItem
          key={card.id}
          title={card.bankName}
          price={card.balance.amount}
          subtitle={card.cardNumber}
          icon={TinkoffIcon}
        />
      ))}
      {sberCards.map((card) => (
        <BalanceBlockItem
          key={card.id}
          title={card.bankName}
          price={card.balance.amount}
          subtitle={card.cardNumber}
          icon={SberIcon}
        />
      ))}
    </Load>
  );
};

export default BalanceBlock;

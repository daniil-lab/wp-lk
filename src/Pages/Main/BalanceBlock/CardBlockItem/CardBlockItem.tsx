import React from "react";

import WalletBalanceIcon from "Static/icons/wallet-balance-icon.svg";

import "Styles/Pages/Main/BalanceBlock/BalanceBlockItem/BalanceBlockItem.scss";

interface Props {
  title: string;
  price: string | number;
  className?: string;
  subtitle?: string;
  icon?: string;
  onClick?: (title: string) => void;
}

const CardBlockItem: React.FunctionComponent<Props> = ({
  title,
  price,
  className,
  subtitle,
  icon,
  onClick,
}: Props) => {
  return (
    <div
      className={`balance-block-item ${className}`}
      onClick={() => onClick && onClick(title)}
    >
      <div className="balance-block-item-title">
        <img src={icon || WalletBalanceIcon} alt="Wallet icon" width={20} />
        <span className="balance-block-item-title-text">{title}</span>
        {subtitle && (
          <span className="balance-block-item-subtitle">{subtitle ?? ""}</span>
        )}
      </div>
      <span className="balance-block-item-amount">{price} ₽</span>
    </div>
  );
};

export default CardBlockItem;
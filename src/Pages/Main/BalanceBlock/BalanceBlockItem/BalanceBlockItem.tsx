import React from "react";

import WalletBalanceIcon from "Static/icons/wallet-balance-icon.svg";

import "Styles/Pages/Main/BalanceBlock/BalanceBlockItem/BalanceBlockItem.scss";

interface Props {
  title: string;
  price: string | number;
  className?: string;
  subtitle?: string;
  icon?: string;
  handleDelete?: () => void;
}

const BalanceBlockItem: React.FunctionComponent<Props> = ({
  title,
  price,
  className,
  subtitle,
  icon,
  handleDelete,
}: Props) => {
  return (
    <div className={`balance-block-item ${className || ""}`}>
      <div className="balance-block-item-title">
        <img src={icon || WalletBalanceIcon} alt="Wallet icon" width={20} />
        <span className="balance-block-item-title-text">{title}</span>
        {subtitle && (
          <span className="balance-block-item-subtitle">{subtitle ?? ""}</span>
        )}
      </div>
      <div className="balance-block-item-info">
        {handleDelete && (
          <span className="balance-block-item-delete" onClick={handleDelete}>
            Удалить
          </span>
        )}
        <span className="balance-block-item-amount">{price} ₽</span>
      </div>
    </div>
  );
};

export default BalanceBlockItem;

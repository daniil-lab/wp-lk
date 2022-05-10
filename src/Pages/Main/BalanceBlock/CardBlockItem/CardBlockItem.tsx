import Image from "Components/Image/Image";
import React from "react";
import { useSelector } from "react-redux";
import { GetUserWallet } from "Redux/Selectors";

import WalletBalanceIcon from "Static/icons/wallet-balance-icon.svg";

import "Styles/Pages/Main/BalanceBlock/BalanceBlockItem/BalanceBlockItem.scss";
import GetCurrencySymbol from "Utils/GetCurrencyIcon";

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
        <Image
          frame={{ width: 20, height: 20 }}
          src={icon || WalletBalanceIcon}
          alt="Wallet icon"
          width={20}
          height={20}
        />
        <span className="balance-block-item-title-text">{title}</span>
        {subtitle && (
          <span className="balance-block-item-subtitle">{subtitle ?? ""}</span>
        )}
      </div>
      <span className="balance-block-item-amount">
        {price} {wallet && GetCurrencySymbol(wallet)}
      </span>
    </div>
  );
};

export default CardBlockItem;

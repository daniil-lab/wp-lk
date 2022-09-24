import Image from "Components/Image/Image";
import useGetCourse from "Hooks/useGetCourse";
import React from "react";
import { useSelector } from "react-redux";
import { GetUserWallet } from "Redux/Selectors";

import WalletBalanceIcon from "Static/icons/wallet-balance-icon.svg";

import "Styles/Pages/Main/BalanceBlock/BalanceBlockItem/BalanceBlockItem.scss";
import GetCurrencySymbol from "Utils/GetCurrencyIcon";
import NumberWithSpaces from "Utils/NumberWithSpaces";

interface Props {
  title: string;
  price: string | number;
  cents: string | number;
  className?: string;
  subtitle?: string;
  icon?: string;
  handleDelete?: () => void;
  onClick?: () => void;
}

const BalanceBlockItem: React.FunctionComponent<Props> = ({
  title,
  price,
  className,
  subtitle,
  icon,
  handleDelete,
  onClick,
  cents,
}: Props) => {
  const wallet = useSelector(GetUserWallet);

  return (
    <div className={`balance-block-item ${className || ""}`} onClick={onClick}>
      <div className="balance-block-item-title">
        <Image
          frame={{ width: 20, height: 20 }}
          src={icon || WalletBalanceIcon}
          alt="Wallet icon"
          width={20}
        />
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
        <span className="balance-block-item-amount">
          {NumberWithSpaces(price)},{cents}{" "}
          {wallet && GetCurrencySymbol(wallet)}
        </span>
      </div>
    </div>
  );
};

export default BalanceBlockItem;

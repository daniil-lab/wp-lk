import React, { FC } from "react";
import "../../Styles/Components/Header/Header.scss";
import AvatarImage from "../../Static/Test/avatar.png";
import HeaderIcon from "./HeaderIcon/HeaderIcon";

import MainIcon from "../../Static/icons/mail.svg";
import SearchIcon from "../../Static/icons/search.svg";
import BellIcon from "../../Static/icons/bell.svg";

const Header: FC = () => {
  return (
    <div className="header">
      <div className="header__icons">
        <HeaderIcon src={SearchIcon} />
        <HeaderIcon src={BellIcon} badge={2} />
        <HeaderIcon src={MainIcon} badge={2} />
      </div>
      <div className="header__avatar">
        <img src={AvatarImage} alt="avatar" />
      </div>
    </div>
  );
};

export default Header;

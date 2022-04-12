import React, { useState, ChangeEvent, FC } from "react";

import scanIcon from "../../../Static/icons/scan-qr.svg";
import searchIcon from "../../../Static/icons/search-gery.svg";

const BonusNav: FC = () => {
  const [searchValue, setSearchValue] = useState("");

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  return (
    <div className="bonuscard-nav">
      <div className="bonuscard-input">
        <img src={searchIcon} alt="" />
        <input
          type="text"
          value={searchValue}
          onChange={onChangeHandler}
          placeholder="Поиск"
        />
      </div>
      <div className="bonuscard-btns">
        <button className="button-primary bonuscard-btns-icon">
          <img src={scanIcon} alt="" />
        </button>
        <button className="button-primary bonuscard-btns-add">
          Добавить карту
        </button>
      </div>
    </div>
  );
};

export default BonusNav;

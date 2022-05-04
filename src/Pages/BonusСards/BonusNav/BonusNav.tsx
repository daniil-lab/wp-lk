import Modal from "Components/Modal/Modal";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { IBonus } from "Services/Interfaces";
import { API_URL } from "Utils/Config";
import searchIcon from "../../../Static/icons/search-gery.svg";
import AddModal from "../AddModal/AddModal";

interface BonusNavProps {
  bonusCards: IBonus[];
  setActiveCard: (card: IBonus | null) => void;
  updateBonusCards: () => void;
}

const BonusNav: FC<BonusNavProps> = ({
  bonusCards,
  setActiveCard,
  updateBonusCards,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [list, setList] = useState(bonusCards);
  const [showList, setShowList] = useState(false);

  const openModal = () => setShowAddModal(true);
  const closeModal = () => setShowAddModal(false);

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  useEffect(() => {
    bonusCards && setList(bonusCards);
  }, [bonusCards]);

  useEffect(() => {
    if (searchValue === "") {
      setList(bonusCards);
    } else {
      setList(bonusCards.filter(({ data }) => data.includes(searchValue)));
    }
  }, [searchValue]);

  return (
    <div className="bonuscard-nav">
      <div
        className="bonuscard-input"
        onFocus={() => setShowList(true)}
        onBlur={() => setShowList(false)}
        tabIndex={1}
      >
        <img src={searchIcon} alt="" />
        <input
          type="text"
          value={searchValue}
          onChange={onChangeHandler}
          placeholder="Поиск"
        />
        <div className={`bonuscard-search ${showList ? "active" : ""}`}>
          {list.map((card) => (
            <div
              className="bonuscard-search-item"
              onClick={() => {
                setActiveCard(card);
                setShowList(false);
              }}
              key={card.id}
            >
              <img
                src={`${API_URL}api/v1/image/content/${card.blank.image.name}`}
                alt=""
                className="bonuscard-search-image"
                width={50}
              />
              <span className="bonuscard-search-title">{card.data}</span>
            </div>
          ))}
          {list.length < 1 && (
            <div className="bonuscard-search-item">
              <p>😥 Ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
      <div className="bonuscard-btns">
        <button
          onClick={openModal}
          className="button-primary bonuscard-btns-add"
        >
          Добавить карту
        </button>
      </div>

      <Modal show={showAddModal} onClose={closeModal}>
        <AddModal closeModal={closeModal} updateBonusCards={updateBonusCards} />
      </Modal>
    </div>
  );
};

export default BonusNav;

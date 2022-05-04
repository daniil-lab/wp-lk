import Load from "Components/Load/Load";
import TextFieldPrimary from "Components/TextFieldPrimary/TextFieldPrimary";
import BonusCardContext from "Context/BonusCardContext";
import React, { useContext, useState } from "react";
import { useAddBunusCard } from "Services/Bonuscard";
import { IBonusBlank } from "Services/Interfaces";
import { API_URL } from "Utils/Config";

interface Props {
  blank: IBonusBlank | null;
  closeModal: () => void;
  updateBonusCards: () => void;
}

const AddCardModal: React.FC<Props> = ({
  blank,
  closeModal,
  updateBonusCards,
}) => {
  // const { createBonusCard } = useContext(BonusCardContext);
  const addBunusCard = useAddBunusCard();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!blank) return;
    await addBunusCard.createCard(blank.id, code);
    setCode("");
    setName("");
    closeModal();
    updateBonusCards();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Load load={!!blank}>
        {blank && (
          <>
            <img
              src={`${API_URL}api/v1/image/content/${blank.image.name}`}
              alt=""
              className="bonus-add-modal-blank"
            />

            <div className="add-operation-modal-block">
              <span className="add-operation-modal-block-title">
                Номер карты
              </span>
              <input
                type="number"
                className="add-operation-modal-input"
                placeholder="Номер карты"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="add-operation-modal-block">
              <span className="add-operation-modal-block-title">
                Название карты (не обязательно)
              </span>
              <input
                type="text"
                placeholder="Название карты (не обязательно)"
                className="add-operation-modal-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="bonus-add-modal-buttons">
              <button
                className="button-secondary"
                onClick={closeModal}
                type="button"
              >
                Отмена
              </button>
              <button className="button-primary" type="submit">
                Добавить
              </button>
            </div>
          </>
        )}
      </Load>
    </form>
  );
};

export default AddCardModal;

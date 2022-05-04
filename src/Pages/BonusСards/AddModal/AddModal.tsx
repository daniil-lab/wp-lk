import Load from "Components/Load/Load";
import Modal from "Components/Modal/Modal";
import React, { useState } from "react";
import { useBonusCardBlanks } from "Services/Bonuscard";
import { IBonusBlank } from "Services/Interfaces";
import "Styles/Pages/BonusCard/AddModal/AddModal.scss";
import AddCardModal from "./AddCardModal/AddCardModal";
import AddModalBlank from "./AddModalBlank";

interface Props {
  closeModal: () => void;
  updateBonusCards: () => void;
}

const AddModal: React.FC<Props> = ({ closeModal, updateBonusCards }) => {
  const { bonusCardBlanks, isLoad } = useBonusCardBlanks();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [activeBlank, setActiveBlank] = useState<IBonusBlank | null>(null);

  const openAddCardModal = () => setShowAddCardModal(true);
  const closeAddCardModal = () => {
    setActiveBlank(null);
    setShowAddCardModal(false);
    closeModal();
  };

  return (
    <div className="bonus-add-modal">
      <p className="bonus-add-modal-title">Выберите карту</p>

      <Load load={isLoad}>
        <div className="bonus-add-modal-blanks">
          {bonusCardBlanks.map((blank) => (
            <AddModalBlank
              blank={blank}
              setActiveBlank={setActiveBlank}
              openAddCardModal={openAddCardModal}
              key={blank.id}
            />
          ))}
        </div>
      </Load>

      <div className="bonus-add-modal-buttons">
        <button className="button-primary" onClick={closeModal}>
          Отмена
        </button>
      </div>

      <Modal zIndex={11} show={showAddCardModal} onClose={closeAddCardModal}>
        <AddCardModal
          blank={activeBlank}
          closeModal={closeAddCardModal}
          updateBonusCards={updateBonusCards}
        />
      </Modal>
    </div>
  );
};

export default AddModal;

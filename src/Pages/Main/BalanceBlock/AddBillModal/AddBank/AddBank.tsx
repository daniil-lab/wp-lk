import React, { useState } from "react";
import Modal from "Components/Modal/Modal";
import TinkoffIcon from "Static/Images/tinkoff.png";
import SberIcon from "Static/Images/sber.png";
import TochkaIcon from "Static/Images/tochka.svg";
import PlusFillIcon from "Static/icons/plus.svg";
import "Styles/Pages/Main/BalanceBlock/AddBillModal/AddBank/AddBank.scss";
import BankModal from "./BankModal/BankModal";

type BankModalType = {
  content: React.ReactNode | null;
  show: boolean;
};

const AddBank: React.FC = () => {
  const [bankModal, setBankModal] = useState<BankModalType>({
    content: null,
    show: false,
  });

  const handleOnClose = () => {
    setBankModal((oldBankModal) => ({
      ...oldBankModal,
      show: false,
    }));
  };

  return (
    <div className="add-bank">
      <span className="add-bill-modal-title">Выберите банк</span>
      <div
        className="bank-wrapper"
        onClick={() =>
          setBankModal({
            content: <BankModal bank="tinkoff" onClose={handleOnClose} />,
            show: true,
          })
        }
      >
        <div className="bank-wrapper-brand">
          <img src={TinkoffIcon} alt="Точка" width={60} />
          <span>Тинькофф</span>
        </div>
        <img src={PlusFillIcon} />
      </div>
      <div
        className="bank-wrapper"
        onClick={() =>
          setBankModal({
            content: <BankModal bank="sber" onClose={handleOnClose} />,
            show: true,
          })
        }
      >
        <div className="bank-wrapper-brand">
          <img src={SberIcon} alt="Точка" width={60} />
          <span>Сбербанк</span>
        </div>
        <img src={PlusFillIcon} />
      </div>
      {/* <div
        className="bank-wrapper"
        onClick={() =>
          setBankModal({
            content: <BankModal bank="tochka" onClose={handleOnClose} />,
            show: true,
          })
        }
      >
        <div className="bank-wrapper-brand">
          <img src={TochkaIcon} alt="Точка" width={60} />
          <span>Точка</span>
        </div>
        <img src={PlusFillIcon} />
      </div> */}
      <Modal
        zIndex={12}
        show={bankModal.show}
        onClose={() => setBankModal({ show: false, content: null })}
      >
        {bankModal.content ?? <></>}
      </Modal>
    </div>
  );
};

export default AddBank;

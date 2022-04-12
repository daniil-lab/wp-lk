import React, { useEffect, useState } from "react";
import UserBlockWrapper from "./UserBlockWrapper/UserBlockWrapper";
import Select from "Components/Select/Select";
import useGetWallets from "Services/Wallets";
import PhoneIcon from "Static/icons/phone.svg";
import MailIcon from "Static/icons/mail-user.svg";
import DownloadIcon from "Static/icons/download.svg";
import RemoveIcon from "Static/icons/remove.svg";
import PencilIcon from "Static/icons/pencil.svg";
import { IWallet } from "Services/Interfaces";
import Modal from "Components/Modal/Modal";
import ModalPhone from "./ModalPhone/ModalPhone";
import ModalEmail from "./ModalEmail/ModalEmail";
import { useSelector } from "react-redux";
import { GetUserEmail, GetUserName } from "Redux/Selectors";
import "Styles/Pages/Settings/UserBlock/UserBlock.scss";
import ModalRemoveData from "./ModalRemoveData/ModalRemoveData";
import ModalExportData from "./ModalExportData/ModalExportData";

interface Props {}

const UserBlock: React.FunctionComponent<Props> = (props: Props) => {
  const { load, wallets } = useGetWallets();

  const userPhone = useSelector(GetUserName);
  const userEmail = useSelector(GetUserEmail);

  const [phoneModal, setPhoneModal] = useState<boolean>(false);
  const [emailModal, setEmailModal] = useState<boolean>(false);

  const [exportDataModal, setExportDataModal] = useState<boolean>(false);
  const [removeDataModal, setRemoveDataModal] = useState<boolean>(false);

  const [wallet, setWallet] = useState<IWallet>();

  useEffect(() => {
    if (load) setWallet(wallets[0]);
  }, [load]);

  return (
    <div className="user-block noselect">
      <UserBlockWrapper title="Аккаунт">
        <div className="user-block-item">
          <img src={PhoneIcon} alt="Phone" />
          <span>{userPhone ?? "none"}</span>
          <img
            onClick={() => setPhoneModal(true)}
            src={PencilIcon}
            alt="Edit"
          />
        </div>
        <div className="user-block-item">
          <img src={MailIcon} alt="Email" />
          <span>{userEmail ?? "none"}</span>
          <img
            onClick={() => setEmailModal(true)}
            src={PencilIcon}
            alt="Edit"
          />
        </div>
      </UserBlockWrapper>
      <UserBlockWrapper title="Данные">
        <div
          className="user-block-item"
          onClick={() => setExportDataModal(true)}
        >
          <img src={DownloadIcon} alt="Download" />
          <span>Экспортировать данные в CSV</span>
        </div>
        <div
          className="user-block-item"
          onClick={() => setRemoveDataModal(true)}
        >
          <img src={RemoveIcon} alt="Remove" />
          <span>Удалить данные</span>
        </div>
      </UserBlockWrapper>
      <UserBlockWrapper title="Валюта" className="user-block-wrapper-currency">
        <Select
          value={wallet?.walletDisplayName ?? ""}
          data={wallets.map((i) => ({
            label: i.walletDisplayName,
            symbol: i.walletSystemName,
          }))}
          handler={(index) => {}}
        />
      </UserBlockWrapper>
      <Modal show={phoneModal} onClose={() => setPhoneModal(false)}>
        <ModalPhone onClose={() => setPhoneModal(false)} />
      </Modal>
      <Modal show={emailModal} onClose={() => setEmailModal(false)}>
        <ModalEmail onClose={() => setEmailModal(false)} />
      </Modal>
      <Modal
        show={exportDataModal}
        onClose={() => setExportDataModal(false)}
        style={{ width: "30%" }}
      >
        <ModalExportData onClose={() => setExportDataModal(false)} />
      </Modal>
      <Modal
        show={removeDataModal}
        onClose={() => setRemoveDataModal(false)}
        style={{ width: "30%" }}
      >
        <ModalRemoveData onClose={() => setRemoveDataModal(false)} />
      </Modal>
    </div>
  );
};

export default UserBlock;

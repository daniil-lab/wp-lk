import React, { useState } from "react";
import { useDispatch } from "react-redux";

import UserRepository from "../../../../Repository/UserRepository";
import { LinkGoogle } from "../../../../Redux/Actions";
import Load from "../../../../Components/Load/Load";

type ModalUserGoogleLinkProps = {
  googleLink: boolean;
  onClose: () => void;
};

const ModalUserGoogleLink: React.FC<ModalUserGoogleLinkProps> = ({
  googleLink,
  onClose,
}) => {
  const [googleEmail, setGoogleEmail] = useState("");
  const [isLinking, setLinking] = useState(false);

  const dispatch = useDispatch();

  const userRepository = new UserRepository();

  const handleAccountBinding = async () => {
    if (!(googleLink || googleEmail) || isLinking) return;

    setLinking(true);

    try {
      if (googleLink) {
        await userRepository.unlinkUser();
      } else {
        await userRepository.linkUser(googleEmail);
        onClose();
      }

      dispatch(LinkGoogle(!googleLink));
      console.log("googleLink: ", googleLink);
    } finally {
      setLinking(false);
    }
  };

  return (
    <Load load={!isLinking}>
      <div className="user-modal">
        <span>Редактирование аккаунта Google</span>

        {googleLink ? (
          <div>Отвязать аккаунт Google?</div>
        ) : (
          <input
            type="text"
            value={googleEmail}
            onChange={(e) => setGoogleEmail(e.target.value)}
            placeholder="Введите Email аккаунта Google"
          />
        )}
        <button className="button-primary" onClick={handleAccountBinding}>
          {googleLink ? "Отвязать" : "Привязать"}
        </button>
        <button className="button-secondary" onClick={onClose}>
          Отмена
        </button>
      </div>
    </Load>
  );
};

export default ModalUserGoogleLink;

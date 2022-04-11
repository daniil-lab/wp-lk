import Modal from "Components/Modal/Modal";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "Styles/Pages/Settings/Settings.scss";
import SubscriptionBlock from "./SubscriptionBlock/SubscriptionBlock";
import UserBlock from "./UserBlock/UserBlock";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSuccessSubscribe, setIsSuccessSubscribe] = useState(false);
  const [isFailSubscribe, setIsFailSubscribe] = useState(false);
  const [failMessage, setFailMessage] = useState("Произошла неизвестная ошибка при оплате");

  useEffect(() => {
    const message = searchParams.get("message");
    const success = searchParams.get("Success");

    if (success === "true" || success === "false") {
      setIsSuccessSubscribe(success === "true");
      setIsFailSubscribe(success === "false");

      message && setFailMessage(message);

      navigate("/settings");
    }
  }, [searchParams]);

  return (
    <>
      <div className="settings">
        <div className="app-card">
          <div className="app-card-header">
            <div className="content-section-title">Подписки</div>
            <div className="content-section-controll"></div>
          </div>
          <SubscriptionBlock />
        </div>
        <div className="app-card">
          <div className="app-card-header">
            <div className="content-section-title">Пользователь</div>
            <div className="content-section-controll"></div>
          </div>
          <UserBlock />
        </div>
      </div>

      <Modal
        show={isSuccessSubscribe}
        onClose={() => setIsSuccessSubscribe(false)}
      >
        🎉 Подписка оформлена
      </Modal>
      <Modal show={isFailSubscribe} onClose={() => setIsFailSubscribe(false)}>
        {failMessage}
      </Modal>
    </>
  );
};

export default Settings;

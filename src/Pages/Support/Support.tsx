import Header from "Components/Header/Header";
import React, { useState } from "react";
import "../../Styles/Pages/Support/Support.scss";
import SupportFiled from "./SupportFiled/SupportFiled";

import PhoneIcon from "../../Static/icons/phone.svg";
import MailIcon from "../../Static/icons/mail-user.svg";
import useSendHelp from "Services/Help";

interface Props {}

const Support: React.FunctionComponent<Props> = (props: Props) => {
  const [supportPhone, setSupportPhone] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const send = useSendHelp();
  function changeHandler(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fn: any
  ) {
    fn(e.target.value);
  }

  return (
    <div className="support">
      <div className="support-content">
        <Header />
        <h1 className="main__title support__title">Поддержка</h1>
        <div className="support-cards">
          <div className="support-phone support-item">
            <SupportFiled title="Телефон" icon={PhoneIcon}>
              <input
                type="text"
                placeholder="+7 999 999 99 99"
                value={supportPhone}
                onChange={(e) => changeHandler(e, setSupportPhone)}
              />
            </SupportFiled>
          </div>
          <div className="support-phone support-item">
            <SupportFiled title="Электронная почта" icon={MailIcon}>
              <input
                type="text"
                placeholder="email@email.com"
                value={supportEmail}
                onChange={(e) => changeHandler(e, setSupportEmail)}
              />
            </SupportFiled>
          </div>
          <div className="support-phone support-item">
            <SupportFiled title="Сообщение">
              <textarea
                placeholder="Start typing..."
                value={supportMessage}
                onChange={(e) => changeHandler(e, setSupportMessage)}
              />
            </SupportFiled>
          </div>
          <button
            onClick={(e) => {
              send(supportPhone, supportEmail, supportMessage);
              setSupportPhone("");
              setSupportEmail("");
              setSupportMessage("");
            }}
            className="button-primary support-send"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;

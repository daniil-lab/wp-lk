import React, { FC } from "react";

import "../../../Styles/Pages/Support/SupportFiled/SupportFiled.scss";

interface ISupportFiled {
  title?: string;
  icon?: string;
}

const SupportFiled: FC<ISupportFiled> = ({ title, icon, children }) => {
  return (
    <div className="supportFiled">
      <span>{title}</span>
      <div className="supportFiled-content">
        <img src={icon || ""} aria-hidden="true" alt="" />
        {children}
      </div>
    </div>
  );
};

export default SupportFiled;

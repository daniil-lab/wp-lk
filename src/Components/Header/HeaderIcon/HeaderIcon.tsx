import React, { FC } from "react";
import "../../../Styles/Components/Header/HeaderIcons/HeaderIcons.scss";

interface IHeaderIcon {
  src: string;
  badge?: number;
  alt?: string;
}

const HeaderIcon: FC<IHeaderIcon> = ({ src, badge = 0, alt = "" }) => {
  return (
    <div className="header-icon">
      <img src={src} alt={alt} />
      {!!badge && <div className="header-icon__badge">{badge}</div>}
    </div>
  );
};

export default HeaderIcon;

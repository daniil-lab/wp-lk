import React from "react";

import "Styles/Components/Splash/Splash.scss";

import Logo from "Static/Images/Logo.svg";

interface Props {
  load: boolean;
}

const Splash: React.FunctionComponent<Props> = (props: Props) => {
  const { load } = props;
  return (
    <div className={`splash-container ${load ? "inactive" : "active"}`}>
      <img src={Logo} alt="Wallet Box" className="splash-logo" />
    </div>
  );
};

export default Splash;

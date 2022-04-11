import React from "react";

import "Styles/Components/Preloader/Preloader.scss";

import Loader from "Static/Images/Loader.svg";

interface Props {
  show: boolean;
}

const Preloader: React.FunctionComponent<Props> = (props: Props) => {
  return props.show ? (
    <div className={`preloader ${props.show && "active"}`}>
      <div className="preloader-wrapper">
        <img src={Loader} />
      </div>
    </div>
  ) : null;
};

export default Preloader;

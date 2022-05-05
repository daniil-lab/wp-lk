import React from "react";

import "Styles/Components/Preloader/Preloader.scss";

interface Props {
  show: boolean;
}

const Preloader: React.FunctionComponent<Props> = (props: Props) => {
  return props.show ? (
    <div className={`preloader ${props.show && "active"}`}>
      <div className="preloader-wrapper">
        <div className="loader"></div>
      </div>
    </div>
  ) : null;
};

export default Preloader;

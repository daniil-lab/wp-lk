import React from "react";

import "Styles/Components/IconButton/IconButton.scss";

interface Props {
  icon: string;
  alt?: string;
  onClick?: () => void;
}

const IconButton: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className="icon-button" onClick={props.onClick}>
      <img src={props.icon} alt={props.alt} />
    </div>
  );
};

export default IconButton;

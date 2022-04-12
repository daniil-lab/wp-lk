import React from "react";

import "Styles/Components/TextButton/TextButton.scss";

interface Props {
  title: string;
  onClick?: () => void;
  tintColor?: string;
}

const TextButton: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <span
      className="text-button"
      onClick={props.onClick}
      style={{ color: props.tintColor }}
    >
      {props.title}
    </span>
  );
};

export default TextButton;

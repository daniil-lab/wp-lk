import React, { useState } from "react";

import "Styles/Components/ContextButton/ContextButton.scss";

interface Props {
  content: React.FunctionComponent;
  button: React.ReactNode;
  style?: React.CSSProperties;
}

const ContextButton: React.FunctionComponent<Props> = ({
  content,
  button,
  style,
}: Props) => {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <div className={`context-button`}>
      <div className="context-button-wrapper" onClick={() => setExpand(true)}>
        {button}
      </div>
      <div
        {...{ style }}
        className={`context-button-container ${expand ? "active" : ""}`}
      >
        {content({}, { close: () => setExpand(false) })}
      </div>
      <div
        onClick={() => setExpand(false)}
        className={`context-button-backdrop ${expand ? "active" : ""}`}
      ></div>
    </div>
  );
};

export default ContextButton;

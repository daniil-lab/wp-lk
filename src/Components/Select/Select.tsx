import React, { useMemo, useState } from "react";

import "Styles/Components/Select/Select.scss";

interface Props {
  data: any[];
  value: string | null;
  handler: (v: number) => void;
  width?: string;
}

const Select: React.FunctionComponent<Props> = ({
  data,
  value,
  handler,
  width,
}: Props) => {
  const [expand, toggle] = useState<boolean>(false);

  const _handler = (i: number): void => {
    handler(i);
    toggle(!expand);
  };
  console.log(data);
  return (
    <div className="select" style={{ width }}>
      <div className="select-wrapper" onClick={() => toggle(!expand)}>
        <span>$</span>
        <span>{value ? "Валюта" : "Не выбрано"}</span>
        <svg
          id="select-arrow-down"
          viewBox="0 0 10 6"
          width="100%"
          height="100%"
        >
          <polyline points="1 1 5 5 9 1"></polyline>
        </svg>
      </div>
      {expand && (
        <div onClick={() => toggle(!expand)} className="select-overlay"></div>
      )}
      {expand && (
        <div className={`options ${expand ? "active" : "hidden"}`}>
          {data.map(({ label, symbol }, i) => {
            return (
              <div className="select-content">
                <span key={i} className="option" onClick={() => _handler(i)}>
                  <span>{label}</span>
                  <span>{symbol}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;

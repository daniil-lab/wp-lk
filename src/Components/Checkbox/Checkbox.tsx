import React from "react";

interface Props {
  value: boolean;
  onChange: () => void;
  lable: string;
}

const Checkbox: React.FC<Props> = ({ value, onChange, lable }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
      onClick={onChange}
    >
      <div
        style={{
          width: 25,
          height: 25,
          borderRadius: 50,
          background: "#eaeaea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        {value && (
          <div
            style={{
              width: 17,
              height: 17,
              borderRadius: 50,
              background: "#f0187b",
            }}
          />
        )}
      </div>
      <span style={{ color: "#383838" }}>{lable}</span>
    </div>
  );
};

export default Checkbox;

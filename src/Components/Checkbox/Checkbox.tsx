import React from "react";

interface Props {
  value: boolean;
  onChange: () => void;
  lable: string;
  disabled?: boolean;
}

const Checkbox: React.FC<Props> = ({
  value,
  onChange,
  lable,
  disabled = false,
}) => {
  const handleChange = () => {
    if (!disabled) onChange();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
      onClick={handleChange}
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
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {value && (
          <div
            style={{
              width: 17,
              height: 17,
              borderRadius: 50,
              background: "#f0187b",
              opacity: disabled ? 0.5 : 1,
            }}
          />
        )}
      </div>
      <span style={{ color: "#383838" }}>{lable}</span>
    </div>
  );
};

export default Checkbox;

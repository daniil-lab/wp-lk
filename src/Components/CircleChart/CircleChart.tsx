import React from "react";

interface Props {
  strokeDashoffset: string | number;
  color: string;
}

const CircleChart: React.FunctionComponent<Props> = ({
  strokeDashoffset,
  color,
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={"100%"}
      height={"100%"}
      viewBox="0 0 50 50"
      style={{
        transform: "rotate(-90deg)",
      }}
    >
      <circle
        cx="25"
        cy="25"
        r="15.9155"
        fill="transparent"
        stroke="#F2F2F2"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle
        cx="25"
        cy="25"
        className="circleChart"
        r="15.9155"
        fill="transparent"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={"100 100"}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};

export default CircleChart;

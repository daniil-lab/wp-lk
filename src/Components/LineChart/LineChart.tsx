import React from "react";

import "Styles/Components/LineChart/LineChart.scss";

interface Props {
  value: number;
  color: string;
}

const LineChart: React.FunctionComponent<Props> = ({ value, color }: Props) => {
  let length = 200;
  let to = length * ((100 - value) / 100);

  return (
    <svg id="line-chart" width="200" height="6">
      <path
        className="bg"
        stroke="#EFF3F8"
        d="M0 10, 200 10"
        strokeLinejoin="round"
        strokeLinecap="round"
      ></path>
      <path
        stroke={color}
        d="M0 10, 200 10 "
        strokeLinejoin="round"
        style={{
          // WebkitAnimation: `fill-in-${id} 1s linear forwards`,
          strokeDashoffset: Math.max(0, to),
          strokeDasharray: 200,
        }}
      ></path>
    </svg>
  );
};

export default LineChart;

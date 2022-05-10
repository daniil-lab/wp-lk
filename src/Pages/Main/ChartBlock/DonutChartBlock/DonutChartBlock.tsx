import React, { useEffect, useState } from "react";
import "Styles/Pages/Main/ChartBlock/DonutChartBlock/DonutChartBlock.scss";
import PrevIcon from "../../../../Static/icons/prev.svg";
import NextIcon from "../../../../Static/icons/next.svg";
import CreateDonutChart from "Utils/CreateDonutChart";
import DonutChartBlockCalendar from "./DonutChartCalendar/DonutChartBlockCalendar";
import NumberWithSpaces from "Utils/NumberWithSpaces";

interface Props {
  data: [];
  income: number;
  expenses: number;
  selectedDate: string;
  nextMonth: () => void;
  prevMonth: () => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  isLastMonth: boolean;
}

const DonutChartBlock: React.FunctionComponent<Props> = (props: Props) => {
  const {
    selectedDate,
    data,
    nextMonth,
    prevMonth,
    setStartDate,
    setEndDate,
    isLastMonth,
  } = props;
  const { chartData } = CreateDonutChart(data);
  const [color, setColor] = useState("#9E9E9E");

  useEffect(() => {
    if (chartData.length == 0) setColor("#9E9E9E");
    else if (chartData.length == 1) setColor(chartData[0].stroke);
  }, [chartData.length]);

  return (
    <div className="donut-chart-wrapper">
      <span className="donut-chart-prev" onClick={prevMonth}>
        <img src={PrevIcon} alt="" />
      </span>
      <span
        className="donut-chart-next"
        onClick={() => (isLastMonth ? nextMonth() : undefined)}
      >
        {isLastMonth && <img src={NextIcon} alt="" />}
      </span>
      <div className="donut-chart">
        <DonutChartBlockCalendar
          selectedDate={selectedDate}
          nextMonth={nextMonth}
          prevMonth={prevMonth}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <div className="center">
          <svg
            width="300px"
            height="300px"
            viewBox="0 0 42 42"
            className="donut"
          >
            <circle
              strokeLinejoin="round"
              cx="21"
              cy="21"
              r="15"
              fill="transparent"
              stroke={"rgba(255, 255, 255, 1)"}
              strokeWidth="7"
            ></circle>
            {chartData.length == 0 || chartData.length == 1 ? (
              <circle
                strokeLinejoin="round"
                cx="21"
                cy="21"
                r="15"
                fill="transparent"
                stroke={color}
                strokeWidth="7"
              ></circle>
            ) : (
              chartData.map((p, i) => {
                return (
                  <path
                    key={i}
                    fill="transparent"
                    strokeWidth="5"
                    strokeLinejoin="round"
                    {...p}
                  ></path>
                );
              })
            )}
          </svg>
        </div>
        <div className="donut-chart-label">
          <div className="donut-chart-label-wrapper">
            <span>Доходы</span>
            <h4>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 5 }}
              >
                <path
                  d="M4.86743 2.22083C5.1954 1.83116 5.8046 1.83116 6.13257 2.22083L10.311 7.18524C10.7522 7.70932 10.3717 8.50001 9.67846 8.50001H1.32154C0.628273 8.50001 0.247849 7.70932 0.688962 7.18523L4.86743 2.22083Z"
                  fill="#6A82FB"
                />
              </svg>
              {NumberWithSpaces(props.income)} ₽
            </h4>
            <span>Расходы</span>
            <h4>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 5 }}
              >
                <path
                  d="M4.86743 8.20775C5.1954 8.59742 5.8046 8.59742 6.13257 8.20775L10.311 3.24335C10.7522 2.71926 10.3717 1.92857 9.67846 1.92857H1.32154C0.628273 1.92857 0.247849 2.71926 0.688962 3.24335L4.86743 8.20775Z"
                  fill="#F0187B"
                />
              </svg>
              -{NumberWithSpaces(props.expenses)} ₽
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChartBlock;

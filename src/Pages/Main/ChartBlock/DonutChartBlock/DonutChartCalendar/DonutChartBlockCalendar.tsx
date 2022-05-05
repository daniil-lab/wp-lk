import React from "react";
import DatePicker from "Components/DatePicker/DatePicker";
import Calendar from "Static/icons/calendar-dark.svg";
import "Styles/Pages/Main/ChartBlock/DonutChartBlock/DonutChartBlockCalendar/DonutChartBlockCalendar.scss";
import ContextButton from "Components/ContextButton/ContextButton";

interface Props {
  selectedDate: string;
  nextMonth: () => void;
  prevMonth: () => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

const DonutChartBlockCalendar: React.FunctionComponent<Props> = (
  props: Props
) => {
  const { selectedDate, setStartDate, setEndDate } = props;

  return (
    <div className="donut-chart-block-calendar">
      {/* <div></div> */}
      <span>{selectedDate}</span>
      <ContextButton
        button={<img src={Calendar} alt="Calendar" />}
        content={(_, ctx) => (
          <DatePicker
            {...ctx}
            onEnter={(v) => {
              if (v.length === 1) {
                setStartDate(v[0]);
                setEndDate(v[0]);
              } else {
                setStartDate(v[1]);
                setEndDate(v[v.length - 1]);
              }
            }}
            type="max"
          />
        )}
      />
    </div>
  );
};

export default DonutChartBlockCalendar;

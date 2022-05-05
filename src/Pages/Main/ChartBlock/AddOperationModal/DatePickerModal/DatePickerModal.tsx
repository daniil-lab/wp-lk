import React from "react";

import "Styles/Pages/Main/ChartBlock/AddOperationModal/DatePickerModal/DatePickerModal.scss";
import useCalendar from "Utils/Hooks/useCalendar";

interface Props {}

const DatePickerModal: React.FunctionComponent<Props> = ({}: Props) => {
  const {} = useCalendar();

  return (
    <div className="date-picker-modal">
      <span className="date-picker-modal-title">Календарь</span>
      <div className="date-selector">
        <div className="year" id="year1"></div>
        <div className="month" id="month1"></div>
        <div className="day" id="day1"></div>
      </div>
      <div>Controll</div>
    </div>
  );
};

export default DatePickerModal;

import React, { useState, useMemo } from "react";
import useCalendar from "Utils/Hooks/useCalendar";
import moment from "moment";
import Picker from "./Picker";
import Datetime from "Utils/Datetime";

import "Styles/Components/DatePicker/DatePicker.scss";

interface Props {
  close: () => void;
  onEnter: (v: string[]) => void;
  type?: "max" | "mini";
}

const DatePicker: React.FunctionComponent<Props> = (props: Props) => {
  const { months, getMonthDays, generateArrayOfYears } = useCalendar();

  const [dates, setDates] = useState<string[]>([]);

  const [day, setDay] = useState<string>(
    moment().format("YYYY-MM-DD").split("-")[2]
  );
  const [month, setMonth] = useState<string>(
    moment().format("YYYY-MM-DD").split("-")[1]
  );
  const [year, setYear] = useState<string>(
    moment().format("YYYY-MM-DD").split("-")[0]
  );

  const [activeType, setActiveType] = useState<string>("");

  const { getCurrentWeek, getLastWeek, getDaysOfMonth, getDaysOfLastMonth } =
    Datetime;

  const _handlePicker = (type: string, value: string): void => {
    if (type === "month") setMonth(value);

    if (type === "day") setDay(value);

    if (type === "year") setYear(value);

    setActiveType("");
  };

  const _handleClick = (type: string): void => {
    if (type === "ThisWeek") {
      setActiveType("ThisWeek");
      setDates(getCurrentWeek());
    }
    if (type === "LastWeek") {
      setActiveType("LastWeek");
      setDates(getLastWeek());
    }
    if (type === "CurrentMonth") {
      setActiveType("CurrentMonth");
      setDates(getDaysOfMonth());
    }
    if (type === "LastMonth") {
      setActiveType("LastMonth");
      setDates(getDaysOfLastMonth());
    }
  };

  const onSubmit = (): void => {
    props.onEnter(dates);
    props.close();
  };

  useMemo(() => {
    let d = day.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    let m = (months.indexOf(month) + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    let y = year;

    let date = moment(`${y}-${m}-${d}`).format("YYYY-MM-DD");

    setDates([date]);
  }, [day, month, year]);

  return (
    <div>
      <div className="datepicker-backdrop"></div>
      <div className="datepicker noselect">
        {props.type != "mini" && (
          <div>
            <div className="datepicker-max">
              <div
                onClick={() => _handleClick("ThisWeek")}
                className={`datepicker-max-item ${
                  activeType === "ThisWeek" ? "active" : ""
                }`}
              >
                <span>Текущая неделя</span>
              </div>
              <div
                onClick={() => _handleClick("LastWeek")}
                className={`datepicker-max-item ${
                  activeType === "LastWeek" ? "active" : ""
                } `}
              >
                <span>Прошлая неделя</span>
              </div>
              <div
                onClick={() => _handleClick("CurrentMonth")}
                className={`datepicker-max-item ${
                  activeType === "CurrentMonth" ? "active" : ""
                } `}
              >
                <span>Текущий месяц</span>
              </div>
              <div
                onClick={() => _handleClick("LastMonth")}
                className={`datepicker-max-item ${
                  activeType === "LastMonth" ? "active" : ""
                }`}
              >
                <span>Прошлый месяц</span>
              </div>
            </div>
          </div>
        )}
        <div className="datepicker-wrapper">
          <Picker
            onChange={(value) => _handlePicker("month", value)}
            data={months}
          />
          <Picker
            onChange={(value) => _handlePicker("day", value)}
            data={getMonthDays()}
          />
          <Picker
            onChange={(value) => _handlePicker("year", value)}
            data={generateArrayOfYears()}
          />
        </div>
        <div className="datepicker-controll">
          <button
            className="button-secondary datepicker-close"
            onClick={() => props.close()}
          >
            Отмена
          </button>
          <button className="button-primary" onClick={onSubmit}>
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;

import { useState } from "react";
import moment from "moment";

const useCalendar = () => {
  const [year, setYear] = useState("2020");
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("ЯНВАРЬ");

  const months = [
    "ЯНВАРЬ",
    "ФЕВРАЛЬ",
    "МАРТ",
    "АПРЕЛЬ",
    "МАЙ",
    "ИЮНЬ",
    "ИЮЛЬ",
    "АВГУСТ",
    "СЕНТЯБРЬ",
    "ОКТЯБРЬ",
    "НОЯБРЬ",
    "ДЕКАБРЬ",
  ];

  const generateArrayOfYears = (): number[] => {
    const max = new Date().getFullYear();
    const min = max - 9;
    const years: number[] = [];

    for (let i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  };

  const getNumber = (str: string, type: "month" | "day"): string => {
    const i = type === "month" ? `${months.indexOf(str) + 1}` : str;
    return i.length > 1 ? i : `0${i}`;
  };

  const getMonthDays = (): number[] => {
    const n = getNumber(month, "month");
    return Array.from(
      Array(moment(`${year}-${n}`).daysInMonth()),
      (_, i) => i + 1
    );
  };

  const yearHandler = (v: string): void => {
    if (year !== v) setYear(v);
  };
  const monthHandler = (v: string): void => {
    if (month !== v) setMonth(v);
  };
  const dayHandler = (v: string): void => {
    if (day !== v) setDay(v);
  };

  return {
    months,
    generateArrayOfYears,
    getMonthDays,
    yearHandler,
    monthHandler,
    dayHandler,
    year,
    day,
    month,
    getNumber,
  };
};

export default useCalendar;

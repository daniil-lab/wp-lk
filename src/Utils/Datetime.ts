import moment from "moment";

const getCurrentWeek = () => {
  const currentDate = moment();
  const weekStart = currentDate.clone().startOf("isoWeek");
  const days: string[] = [];

  for (let i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, "days").format("YYYY-MM-DD"));
  }
  return days;
};

const getLastWeek = () => {
  const weekStart = moment().subtract(1, "weeks").startOf("isoWeek");
  const days: string[] = [];

  for (let i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, "days").format("YYYY-MM-DD"));
  }
  return days;
};

const getDaysOfMonth = () => {
  return new Array(moment().daysInMonth())
    .fill(null)
    .map((x, i) =>
      moment().startOf("month").add(i, "days").format("YYYY-MM-DD")
    );
};

const getDaysOfLastMonth = () => {
  return new Array(moment().subtract(1, "months").daysInMonth())
    .fill(null)
    .map((x, i) =>
      moment()
        .subtract(1, "months")
        .startOf("month")
        .add(i, "days")
        .format("YYYY-MM-DD")
    );
};

const datetime = {
  getCurrentWeek,
  getLastWeek,
  getDaysOfMonth,
  getDaysOfLastMonth,
};

export default datetime;

import { CourseType, WalletModel } from "Models/WalletModel";

const WalletCourse = (
  wallet: WalletModel,
  courses: CourseType[],
  amount: number
): number => {
  const course = courses.find((c) => c.wallet === wallet);
  if (course) return amount * course.value;
  else return amount;
};

export default WalletCourse;

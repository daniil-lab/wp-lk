import { CourseType } from "Models/WalletModel";
import { useEffect, useState } from "react";
import WalletRepository from "Repository/WalletRepository";

const useGetCourse = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);

  const walletRepository = new WalletRepository();

  const asyncEffect = async (): Promise<void> => {
    const c = await walletRepository.course();
    if (c) setCourses([...c]);
  };

  useEffect(() => {
    asyncEffect();
  }, []);

  return courses;
};

export default useGetCourse;

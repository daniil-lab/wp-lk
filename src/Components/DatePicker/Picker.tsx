import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ITEM_HEIGHT = 30;

interface Props {
  onChange: (v: string) => void;
  data: any[];
  initialSlide: number;
}

const Picker: React.FunctionComponent<Props> = ({
  onChange,
  data,
  initialSlide,
}: Props) => {
  const [value, setValue] = useState<string>("");

  const onSlideChange = (swiper: any): void => setValue(data[swiper.realIndex]);

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <Swiper
      initialSlide={initialSlide}
      onSlideChange={onSlideChange}
      direction="vertical"
      slidesPerView={3}
      spaceBetween={30}
      centeredSlides={true}
      loop={true}
      style={{
        width: 66,
        height: ITEM_HEIGHT * 3 + 30,
      }}
    >
      {data.map((item, i) => (
        <SwiperSlide
          key={i}
          className="datepicker-item-wrapper"
          style={{
            height: ITEM_HEIGHT,
          }}
        >
          <span className={`datepicker-item ${value === item ? "active" : ""}`}>
            {item}
          </span>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Picker;

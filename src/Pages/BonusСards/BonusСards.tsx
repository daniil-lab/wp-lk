import Header from "Components/Header/Header";
import React from "react";
import "../../Styles/Pages/BonusCard/BonusCard.scss";
import BonusNav from "./BonusNav/BonusNav";

import BonusCardMock from "../../Static/Images/cardmock.png";

import Bonus from "../../Services/Bonuscard";
import Load from "Components/Load/Load";
import { API_URL } from "Utils/Config";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {}

const BonusСards: React.FunctionComponent<Props> = (props: Props) => {
  const { bonus, load } = Bonus.useGetCards();
  console.log(bonus);
  return (
    <div className="bonuscard">
      <div className="bonuscard-content">
        <Header />
        <h1 className="bonuscard__title main__title">Бонусные карты</h1>
        <BonusNav />
        <Load load={load}>
          <div className="bonuscard-block">
            <img
              src={`${API_URL}api/v1/image/content/${bonus[0]?.blank?.image?.name}`}
              alt=""
            />
            <div className="bonuscard-info">
              <span className="bonuscard-info-title">Данные карты</span>
              <span className="bonuscard-info-title bonuscard-info-light">
                Номер
              </span>
              <span className="bonuscard-info-title">
                {bonus[0]?.data
                  ?.split("")
                  .reduce((a, b, i) => (i % 3 == 0 ? a + " " + b : a + b), "")}
              </span>
              <div className="bonuscard-delete">
                <span onClick={() => Bonus.DeleteCard(bonus[0].id)}>
                  Удалить карту
                </span>
              </div>
            </div>
          </div>
        </Load>
      </div>
      <div className="bonuscard-slider">
        <h1>Выберите другую карту:</h1>
        <Swiper spaceBetween={30}>
          {bonus?.map((a) => (
            <SwiperSlide>
              {
                <img
                  src={`${API_URL}api/v1/image/content/${bonus[0]?.blank?.image?.name}`}
                  alt=""
                />
              }
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BonusСards;

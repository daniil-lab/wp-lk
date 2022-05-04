import Header from "Components/Header/Header";
import Load from "Components/Load/Load";
import BonusCardContext from "Context/BonusCardContext";
import React, { useEffect, useState } from "react";
import { useBonusCards } from "Services/Bonuscard";
import { IBonus } from "Services/Interfaces";
import "Styles/Pages/BonusCard/BonusCard.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { API_URL } from "Utils/Config";
import BonusNav from "./BonusNav/BonusNav";

const BonusСards: React.FC = () => {
  const { bonusCards, deleteBonusCard, createBonusCard, updateBonusCards } =
    useBonusCards();

  const [activeCard, setActiveCard] = useState<IBonus | null>(null);

  useEffect(() => {
    bonusCards && setActiveCard(bonusCards[0]);
  }, [bonusCards]);

  return (
    <BonusCardContext.Provider value={{ createBonusCard, deleteBonusCard }}>
      <div className="bonuscard">
        <div className="bonuscard-content">
          <Header />
          <h1 className="bonuscard__title main__title">Бонусные карты</h1>
          <BonusNav
            setActiveCard={setActiveCard}
            bonusCards={bonusCards}
            updateBonusCards={updateBonusCards}
          />
          {bonusCards.length ? (
            <Load load={!!activeCard}>
              {activeCard && (
                <div className="bonuscard-block">
                  <img
                    src={`${API_URL}api/v1/image/content/${activeCard.blank.image.name}`}
                    alt=""
                  />
                  <div className="bonuscard-info">
                    <span className="bonuscard-info-title">Данные карты</span>
                    <span className="bonuscard-info-title bonuscard-info-light">
                      Номер
                    </span>
                    <span className="bonuscard-info-title">
                      {activeCard.data
                        .split("")
                        .reduce(
                          (a, b, i) => (i % 3 == 0 ? a + " " + b : a + b),
                          ""
                        )}
                    </span>
                    <div className="bonuscard-delete">
                      <span onClick={() => deleteBonusCard(activeCard.id)}>
                        Удалить карту
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Load>
          ) : (
            <p className="bonuscard-tip">
              Добавьте бонусную карту прямо сейчас!
            </p>
          )}
        </div>

        {!!bonusCards.length && (
          <div className="bonuscard-slider">
            <h1>Выберите другую карту:</h1>

            <Swiper spaceBetween={30}>
              <SwiperSlide className="bonuscard-blanks">
                {bonusCards.map((card) => (
                  <img
                    src={`${API_URL}api/v1/image/content/${card.blank.image.name}`}
                    alt=""
                    onClick={() => setActiveCard(card)}
                    key={card.id}
                  />
                ))}
              </SwiperSlide>
            </Swiper>
          </div>
        )}
      </div>
    </BonusCardContext.Provider>
  );
};

export default BonusСards;

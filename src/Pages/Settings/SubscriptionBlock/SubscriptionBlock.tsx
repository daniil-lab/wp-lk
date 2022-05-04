import Load from "Components/Load/Load";
import React, { useMemo } from "react";
import { useGetSubscriptionGroups } from "Services/Subscription";
import "Styles/Pages/Settings/SubscriptionBlock/SubscriptionBlock.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { updateNonNullChain } from "typescript";
import SubscriptionPossibilities from "Utils/SubscriptionPossibilities";
import SubscriptionItem from "./SubscriptionItem/SubscriptionItem";

const SubscriptionBlock: React.FC = () => {
  const { load: groupLoaded, subscriptionGroups } = useGetSubscriptionGroups();

  const activeSubscriptionIndex = useMemo(() => {
    const subscribed = subscriptionGroups.filter(
      ({ isSubscribed }) => isSubscribed
    );

    return subscribed
      ? subscriptionGroups.indexOf(subscribed[subscribed.length - 1])
      : -1;
  }, [subscriptionGroups]);

  return (
    <Swiper
      spaceBetween={50}
      autoplay
      style={{
        overflowY: "visible",
        position: "relative",
        bottom: "-60px",
        paddingBottom: "30px",
        width: "100%",
      }}
      breakpoints={{
        940: {
          slidesPerView: 1,
        },
        1068: {
          slidesPerView: 2,
        },
        1368: {
          slidesPerView: 3,
        },
      }}
    >
      {groupLoaded ? (
        <div className="subscription-block">
          {subscriptionGroups.map((subscriptionGroup, index) => (
            <SwiperSlide>
              <Load load={true}>
                <SubscriptionItem
                  key={subscriptionGroup.id}
                  subscriptionGroup={subscriptionGroup}
                  isSubscribed={activeSubscriptionIndex >= index}
                  list={SubscriptionPossibilities[subscriptionGroup.name]}
                />
              </Load>
            </SwiperSlide>
          ))}
        </div>
      ) : (
        <div className="subscription-block">
          {[0, 1, 2].map((subscriptionGroup, index) => (
            <SwiperSlide>
              <Load load={false}>
                <React.Fragment></React.Fragment>
              </Load>
            </SwiperSlide>
          ))}
        </div>
      )}
    </Swiper>
  );
};

export default SubscriptionBlock;

import Load from "Components/Load/Load";
import React from "react";
import { useGetSubscriptionGroups } from "Services/Subscription";
import "Styles/Pages/Settings/SubscriptionBlock/SubscriptionBlock.scss";
import SubscriptionPossibilities from "Utils/SubscriptionPossibilities";
import SubscriptionItem from "./SubscriptionItem/SubscriptionItem";

const SubscriptionBlock: React.FC = () => {
  const { load, subscriptionGroups } = useGetSubscriptionGroups();

  return (
    <>
      <Load {...{ load }} className="subscription-block">
        {subscriptionGroups.map((subscriptionGroup) => (
          <SubscriptionItem
            key={subscriptionGroup.id}
            subscriptionGroup={subscriptionGroup}
            list={SubscriptionPossibilities[subscriptionGroup.name]}
          />
        ))}
      </Load>
    </>
  );
};

export default SubscriptionBlock;

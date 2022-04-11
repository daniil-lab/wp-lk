import React from "react";
import { ISubscription, ISubscriptionGroup } from "Services/Interfaces";
import SubBlockItemVariant from "./SubBlockItemVariant";

interface Props {
  subscriptionGroup: ISubscriptionGroup;
  setVariant: (state: ISubscription) => void;
}

const SubBlockItemVariants: React.FC<Props> = ({
  subscriptionGroup,
  setVariant,
}) => {
  const { variants } = subscriptionGroup;

  return (
    <div className="variant">
      {variants.map((variant) => (
        <SubBlockItemVariant
          subscription={variant}
          setSubscription={setVariant}
        />
      ))}
    </div>
  );
};

export default SubBlockItemVariants;

import React from "react";
import { ISubscription, ISubscriptionGroup } from "Services/Interfaces";

interface Props {
  subscriptionGroup: ISubscriptionGroup;
  variant?: ISubscription;
}

const SubBlockSelectedVariant: React.FC<Props> = ({
  subscriptionGroup,
  variant,
}) => {
  return (
    <div className="selected-variant">
      <span className="selected-variant-title">
        Wallet Box {subscriptionGroup.name}
      </span>
      {variant ? (
        <span className="selected-variant-price">
          {variant.newPrice} руб. / {variant.expiration} дней
        </span>
      ) : (
        <span className="selected-variant-price">Выберите срок подписки</span>
      )}
    </div>
  );
};

export default SubBlockSelectedVariant;

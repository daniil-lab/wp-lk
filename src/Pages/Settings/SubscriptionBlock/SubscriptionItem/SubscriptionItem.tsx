import React from "react";
import { Link } from "react-router-dom";
import { ISubscriptionGroup } from "Services/Interfaces";
import "Styles/Pages/Settings/SubscriptionBlock/SubscriptionItem/SubscriptionItem.scss";
import SubscriptionItemLite from "./SubscriptionItemLite";

interface Props {
  subscriptionGroup: ISubscriptionGroup;
  list?: string[];
}

const SubscriptionItem: React.FC<Props> = ({ subscriptionGroup, list }) => {
  const { id, name } = subscriptionGroup;

  if (subscriptionGroup.name === "Lite") {
    return <SubscriptionItemLite />;
  }

  return (
    <div className="subscription-item">
      <span className="subscription-item-title">{name}</span>

      <ul className="subscription-item-list">
        {list?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {subscriptionGroup.variants[0] && (
        <span className="subscription-item-date">
          от {subscriptionGroup.variants[0].newPrice} руб./мес
        </span>
      )}

      <Link
        to={`/sub/${id}`}
        className="button-primary subscription-item-button"
      >
        Продлить подписку
      </Link>
    </div>
  );
};

export default SubscriptionItem;

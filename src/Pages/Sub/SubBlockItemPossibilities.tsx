import React from "react";
import { ISubscriptionGroup } from "Services/Interfaces";
import SubscriptionPossibilities from "Utils/SubscriptionPossibilities";

interface Props {
  subscriptionGroup: ISubscriptionGroup;
}

const SubBlockItemPossibilities: React.FC<Props> = ({ subscriptionGroup }) => {
  const { name } = subscriptionGroup;

  return (
    <div className="possibilities">
      <span className="possibilities-title">
        Возможности с подпиской "{name}"
      </span>

      <ul className="possibilities-list">
        {SubscriptionPossibilities[name].map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubBlockItemPossibilities;

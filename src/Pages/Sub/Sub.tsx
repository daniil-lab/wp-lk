import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAcquiring } from "Services/Acquairing";
import { ISubscription } from "Services/Interfaces";
import { useGetSubscriptionGroupsById } from "Services/Subscription";
import "Styles/Pages/Sub/Sub.scss";
import SubBlockItemPossibilities from "./SubBlockItemPossibilities";
import SubBlockItemVariants from "./SubBlockItemVariants";
import SubBlockSelectedVariant from "./SubBlockSelectedVariant";
import SubNotFound from "./SubNotFound";

const Sub: React.FC = () => {
  const { id } = useParams();
  const { subscriptionGroup, isLoading } = useGetSubscriptionGroupsById(
    id || ""
  );
  const [selectedVariant, setSelectedVariant] = useState<ISubscription>();

  const { subscribe } = useAcquiring(selectedVariant?.id);

  if (isLoading) {
    return null;
  }

  if (!subscriptionGroup) {
    return <SubNotFound />;
  }

  return (
    <div className="sub">
      <span className="sub-title">Детали оплаты</span>

      <div className="layout">
        <div className="block">
          <div className="block-item">
            <SubBlockItemPossibilities subscriptionGroup={subscriptionGroup} />
          </div>
          <div className="block-item">
            <SubBlockItemVariants
              subscriptionGroup={subscriptionGroup}
              setVariant={setSelectedVariant}
            />
            <SubBlockSelectedVariant
              subscriptionGroup={subscriptionGroup}
              variant={selectedVariant}
            />

            <div className="buttons">
              <Link
                to="/"
                className="button-secondary"
                style={{ width: "auto" }}
              >
                Выход
              </Link>
              <button
                className="button-primary"
                style={{ width: "auto" }}
                onClick={subscribe}
              >
                Оплатить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sub;

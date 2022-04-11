import SubscriptionPossibilities from "Utils/SubscriptionPossibilities";

const SubscriptionItemLite = () => {
  return (
    <div className="subscription-item">
      <span className="subscription-item-title">Lite</span>

      <ul className="subscription-item-list">
        {SubscriptionPossibilities.Lite.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <span className="subscription-item-date">free</span>

      <button className="button-primary subscription-item-button" disabled>
        Активировано
      </button>
    </div>
  );
};

export default SubscriptionItemLite;

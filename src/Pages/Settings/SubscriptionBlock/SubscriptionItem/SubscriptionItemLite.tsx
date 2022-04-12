import SubscriptionPossibilities from "Utils/SubscriptionPossibilities";
import Logo from "../../../../Static/Images/Logo.svg";
const SubscriptionItemLite = () => {
  return (
    <div className="subscription-item">
      <img
        src={Logo}
        className="subscription-item-logo"
        aria-hidden="true"
        alt=""
      />
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

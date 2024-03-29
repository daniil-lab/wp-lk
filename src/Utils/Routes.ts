import BonusСards from "Pages/BonusСards/BonusСards";
import Budget from "Pages/Budget/Budget";
import CardScan from "Pages/CardScan/CardScan";
import Main from "Pages/Main/Main";
import Settings from "Pages/Settings/Settings";
import Support from "Pages/Support/Support";

import MainIcon from "Static/icons/sidebar-main-icon.svg";
import BudgetIcon from "Static/icons/sidebar-budget-icon.svg";
import BonusСardsIcon from "Static/icons/sidebar-bonuscard-icon.svg";
import SupportIcon from "Static/icons/sidebar-support-icon.svg";
import SettingsIcon from "Static/icons/sidebar-settings-icon.svg";
import CardScanIcon from "Static/icons/sidebar-card-scan.svg";

import WalletSideImage from "../Static/Images/wallet-side.svg";
import WalletSideSettingsImage from "../Static/Images/wallet-side-settings.svg";
import WalletSideBudgetImage from "../Static/Images/wallet-side-budget.svg";
import WalletSideBonusImage from "../Static/Images/wallet-side-bonus.svg";
import WalletSideSupportImage from "../Static/Images/wallet-side-support.svg";

const dashboardRoutes = [
  {
    path: "/",
    name: "Главная",
    icon: MainIcon,
    component: Main,
    sideIcon: WalletSideImage,
  },
  {
    path: "/budget",
    name: "Бюджет",
    icon: BudgetIcon,
    sideIcon: WalletSideBudgetImage,
    component: Budget,
  },
  {
    path: "/bonuscards",
    name: "Бонусные карты",
    icon: BonusСardsIcon,
    sideIcon: WalletSideBonusImage,
    component: BonusСards,
  },
  {
    path: "/cardscan",
    name: "Сканирование чеков",
    icon: CardScanIcon,
    sideIcon: WalletSideImage,
    component: CardScan,
  },
];

const supportRouters = [
  {
    path: "/support",
    name: "Поддержка",
    icon: SupportIcon,
    sideIcon: WalletSideSupportImage,
    component: Support,
  },
  {
    path: "/settings",
    name: "Настройки",
    icon: SettingsIcon,
    component: Settings,
    sideIcon: WalletSideSettingsImage,
  },
];

const routes = {
  dashboardRoutes,
  supportRouters,
};

export default routes;

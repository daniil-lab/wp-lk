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
    sideIcon: WalletSideImage,
    component: Budget,
  },
  {
    path: "/bonuscards",
    name: "Бонусные карты",
    icon: BonusСardsIcon,
    sideIcon: WalletSideImage,
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
    sideIcon: WalletSideImage,
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

const loginRoutes: any = [];

export default {
  dashboardRoutes,
  loginRoutes,
  supportRouters,
};

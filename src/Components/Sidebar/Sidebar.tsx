import React from "react";
import Routes from "Utils/Routes";

import SidebarRoute from "./SidebarRoute/SidebarRoute";

import "Styles/Components/Sidebar/Sidebar.scss";

import Logo from "Static/Images/Logo.svg";
import LogoutIcon from "Static/icons/sidebar-logout-icon.svg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "Redux/Store";
import { Logout } from "Redux/Actions";
import Auth from "Services/Auth";

interface Props {
  activeRoute: string | null;
}

const Sidebar: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const _logout = (): void => {
    const auth = new Auth(dispatch);
    auth.Logout();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo-wrapper">
        <img src={Logo} alt="Wallet Box" className="sidebar-logo" />
      </div>
      {Routes.dashboardRoutes.map((route, index) => (
        <SidebarRoute
          key={index}
          path={route.path}
          name={route.name}
          icon={route.icon}
          active={props.activeRoute === route.path}
          type="route"
        />
      ))}
      <div className="sidebar__hr" />
      {Routes.supportRouters.map((route, index) => {
        console.log(props.activeRoute, route.path);
        return (
          <SidebarRoute
            key={index}
            path={route.path}
            name={route.name}
            icon={route.icon}
            active={props.activeRoute === route.path}
            type="route"
          />
        );
      })}
      <div onClick={_logout}>
        <SidebarRoute
          name={"Выйти из аккаунта"}
          icon={LogoutIcon}
          type="press"
        />
      </div>
    </div>
  );
};

export default Sidebar;

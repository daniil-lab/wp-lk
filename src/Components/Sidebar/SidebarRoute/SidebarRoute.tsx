import React from "react";
import { useNavigate } from "react-router-dom";

import "Styles/Components/Sidebar/SidebarRoute/SidebarRoute.scss";

interface RouteProps {
  name: string;
  icon: string;
  path?: string;
  active?: boolean;
  type: "route" | "press";
}

const SidebarRoute: React.FunctionComponent<RouteProps> = (
  props: RouteProps
) => {
  const navigate = useNavigate();

  const _onClick = (): void => {
    navigate(props.path!);
  };

  const _logout = (): void => {};

  return props.type === "route" ? (
    <div
      onClick={_onClick}
      className={`sidebar-route ${props.active && "sidebar-route_active"}`}
    >
      <img src={props.icon} alt={props.name} />
      <span>{props.name}</span>
    </div>
  ) : (
    <div
      onClick={_logout}
      className={`sidebar-route ${props.active && "sidebar-route_active"}`}
    >
      <img src={props.icon} alt={props.name} />
      <span>{props.name}</span>
    </div>
  );
};

export default SidebarRoute;

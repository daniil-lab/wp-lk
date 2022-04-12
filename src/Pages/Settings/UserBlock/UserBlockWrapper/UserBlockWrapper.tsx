import React from "react";

import "Styles/Pages/Settings/UserBlock/UserBlockWrapper/UserBlockWrapper.scss";

interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const UserBlockWrapper: React.FunctionComponent<Props> = ({
  title,
  children,
  className,
}: Props) => {
  return (
    <div className={"user-block-wrapper " + className || ""}>
      <span className="user-block-wrapper-title">{title}</span>
      {children}
    </div>
  );
};

export default UserBlockWrapper;

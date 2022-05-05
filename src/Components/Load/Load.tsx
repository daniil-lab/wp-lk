import React from "react";
import "Styles/Components/Load/Load.scss";

interface Props {
  load: boolean;
  children: React.ReactNode;
  className?: string;
  ref?: React.LegacyRef<HTMLDivElement> | undefined;
  baseDivProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

const Load: React.FunctionComponent<Props> = (props: Props) => {
  return props.load ? (
    <div
      {...props.baseDivProps}
      className={`active-load ${props.className ? props.className : ""}`}
    >
      {props.children}
    </div>
  ) : (
    <div className="load">
      <div className="loader"></div>
    </div>
  );
};

export default Load;

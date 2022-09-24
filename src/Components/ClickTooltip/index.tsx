import React, { useMemo, useEffect } from "react";
import ReactDOM from "react-dom";

import "../../Styles/Components/ClickTooltip/ClickTooltip.scss";

type ClickTooltipProps = {
  open: boolean;
  coords: { x: number; y: number };
  style?: React.CSSProperties;
  elemToAppend?: HTMLElement | string;
  onClose?: () => void;
};

const ClickTooltip: React.FC<React.PropsWithChildren<ClickTooltipProps>> = ({
  coords,
  open,
  onClose,
  children,
  style,
  elemToAppend = document.body,
}) => {
  const [visible, setVisibilityState] = React.useState(open);

  const ref = React.useRef<HTMLDivElement>(null);

  const tooltipSize = ref.current
    ? ref.current.getBoundingClientRect()
    : { width: 0, height: 0 };

  const portalElem = useMemo(() => {
    if (typeof elemToAppend === "string")
      return (document.querySelector(elemToAppend) ||
        document.body) as HTMLElement;
    return elemToAppend as HTMLElement;
  }, [elemToAppend]);

  useEffect(() => {
    if (open && onClose) {
      const documentClickHandler = (event) => {
        if (!ref.current?.contains(event.target)) onClose();
      };
      document.body.addEventListener("click", documentClickHandler);
      return () =>
        document.body.removeEventListener("click", documentClickHandler);
    }
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setVisibilityState(true);
      return;
    }

    const timeoutId = setTimeout(() => setVisibilityState(false), 500);
    return () => clearTimeout(timeoutId);
  }, [open]);

  return ReactDOM.createPortal(
    <div
      ref={ref}
      className={`click-tooltip`}
      style={{
        ...style,
        left: coords.x - tooltipSize.width / 2,
        top: coords.y - tooltipSize.height / 2,
        opacity: open ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
      }}
    >
      {children}
    </div>,
    portalElem
  );
};

export default ClickTooltip;

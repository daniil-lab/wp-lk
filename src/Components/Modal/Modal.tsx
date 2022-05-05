import React from "react";
import ReactDOM from "react-dom";

import "Styles/Components/Modal/Modal.scss";

interface Props {
  show: boolean;
  children: React.ReactNode;
  onClose: () => void;
  zIndex?: number;
  style?: React.CSSProperties;
}

const Modal = ({ show, children, onClose, zIndex, style }: Props) => {
  const id = Math.random().toString(36).substring(2, 9);

  return document.getElementById("body")
    ? ReactDOM.createPortal(
        <div
          className={`modal ${id} ${show ? "active" : "inactive"}`}
          style={{ zIndex: zIndex ?? 10 }}
          onClick={(e: any) => {
            show && e.target.className.includes("modal " + id) && onClose();
          }}
        >
          <div className="modal-wrapper" {...{ style }}>
            {children}
          </div>
        </div>,
        document.getElementById("body")!
      )
    : null;
};

export default Modal;

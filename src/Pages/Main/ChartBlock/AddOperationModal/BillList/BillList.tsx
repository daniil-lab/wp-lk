import { BillModel } from "Models/BillModel";
import React, { useRef } from "react";
import useGetBill from "Services/Bill/useGetBill";
import "Styles/Pages/Main/ChartBlock/AddOperationModal/BillList/BillList.scss";
import useDraggableScroll from "Utils/Hooks/useDraggableScroll";

interface Props {
  onClose: () => void;
  handler: (v: BillModel) => void;
}

const BillList: React.FunctionComponent<Props> = ({
  onClose,
  handler,
}: Props) => {
  const bills = useGetBill();

  const ref = useRef(null);

  const { onMouseDown } = useDraggableScroll(ref, { direction: "vertical" });

  const _selectBill = (balance: BillModel): void => {
    handler(balance);
    onClose();
  };

  if (!bills.load) return null;

  return (
    <div className="bill-list" ref={ref} onMouseDown={onMouseDown}>
      {bills.data.map((balance, i) => {
        return (
          <div
            className="bill-list-item"
            key={i}
            onClick={() => _selectBill(balance)}
          >
            {balance.name}
          </div>
        );
      })}
    </div>
  );
};

export default BillList;

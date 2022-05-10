import Header from "Components/Header/Header";
import Modal from "Components/Modal/Modal";
import useAddTransaction from "Hooks/useAddTransaction";
import useGetBill from "Hooks/useGetBill";
import useGetCategories from "Hooks/useGetCategories";
import useGetTransaction from "Hooks/useGetTransaction";
import AddOperationModal from "Pages/Main/ChartBlock/AddOperationModal/AddOperationModal";
import QrScanner from "qr-scanner";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ShowToast } from "Redux/Actions";
import ScanQr from "Static/icons/scan-qr.svg";
import "Styles/Pages/CardScan/CardScan.scss";

const CardScan: React.FC = () => {
  const dispatch = useDispatch();
  const [showAddOperationModal, setShowAddOperationModal] = useState(false);
  const [sum, setSum] = useState("");
  const [qr, setQr] = useState<File>();
  const transaction = useGetTransaction();
  const addTransaction = useAddTransaction();
  const bills = useGetBill();
  const categories = useGetCategories();

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const qr = e.target.files[0];

    setQr(qr);

    try {
      const { data } = await QrScanner.scanImage(qr, {
        returnDetailedScanResult: true,
      });

      const values = new URLSearchParams(data);
      const sum = +(values.get("s") || 0);

      setSum(sum.toString());
      setShowAddOperationModal(true);
    } catch (error) {
      dispatch(
        ShowToast({
          text: "Не удалось обработать чек",
          title: "Ошибка",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="scan">
      <div className="scan-content">
        <Header />
        <h1 className="main__title">Сканирование чека</h1>

        <div className="scan-wrapper">
          <label className="button-primary scan-btn">
            <img src={ScanQr} alt="Scan qr icon" />
            <span>Загрузить чек</span>
            <input
              type="file"
              onChange={handleOnChange}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      <Modal
        show={showAddOperationModal}
        onClose={() => setShowAddOperationModal(false)}
      >
        <AddOperationModal
          onClose={() => setShowAddOperationModal(false)}
          updateTransactions={transaction.updateTransactions}
          addTransaction={addTransaction.addTransaction}
          updateBills={bills.updateBill}
          bills={bills}
          category={categories}
          initialSum={sum}
          qr={qr}
          noQrLink
        />
      </Modal>
    </div>
  );
};

export default CardScan;

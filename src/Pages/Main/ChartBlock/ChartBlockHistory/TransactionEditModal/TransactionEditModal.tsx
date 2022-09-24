import React, { useState } from "react";
import ContextButton from "Components/ContextButton/ContextButton";
import DatePicker from "Components/DatePicker/DatePicker";
import Modal from "Components/Modal/Modal";
import Select from "Components/Select/Select";
import useEditTransactions from "Hooks/useEditTransactions";
import CalendarDark from "Static/icons/calendar-dark.svg";
import { API_URL } from "Utils/Config";
import HexToRgbA from "Utils/HexToRgbA";
import MapModal from "../../AddOperationModal/MapModal/MapModal";
import useGetBill from "Hooks/useGetBill";

import "Styles/Pages/Main/ChartBlock/AddOperationModal/AddOperationModal.scss";

type TransactionEditModalProps = {
  onClose: () => void;
  updateTransactions: () => void;
  updateBills: () => void;
} & Omit<
  ReturnType<typeof useEditTransactions>,
  "showEditModal" | "setShowEditModal" | "setTransactionId"
>;

const TransactionEditModal: React.FC<TransactionEditModalProps> = ({
  edit,
  onClose,
  updateTransactions,
  setDate,
  setOperationType,
  setSelectedCategory,
  onlyForEarnCategories,
  standartCategories,
  setBill,
  setSumm,
  setDescription,
  setPlaceName,
  setLocation,
  bill,
  date,
  selectedCategory,
  summ,
  description,
  location,
  operationType,
  placeName,
  remove,
  updateBills,
}) => {
  const bills = useGetBill();

  const [mapModal, setMapModal] = useState<boolean>(false);

  const onEnter = (v: string[]): void => {
    if (Array.isArray(v)) {
      setDate(v);
    } else {
      setDate([v]);
    }
  };

  const clearLocation = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setLocation(null);
  };

  const _editTransaction = async (): Promise<void> => {
    await edit();
    onClose();
    updateTransactions();
    updateBills();
  };

  const _removeTransaction = async (): Promise<void> => {
    await remove();
    onClose();
    updateTransactions();
    updateBills();
  };

  return (
    <div className="add-operation-modal">
      <h1 className="add-operation-modal-title">Редактирование операции</h1>
      <div className="add-operation-modal-row">
        <span>{date ?? "Дата и время"}</span>
        <div style={{ position: "relative" }}>
          <ContextButton
            button={<img src={CalendarDark} alt="Dark calendar" />}
            content={(_, ctx) => (
              <DatePicker {...ctx} onEnter={onEnter} type="mini" />
            )}
            style={{ left: -200 }}
          />
        </div>
      </div>
      <div className="add-operation-modal-block">
        <span className="add-operation-modal-block-title">Тип операции</span>
        <div className="add-operation-modal-operation-type-container">
          <label className="checkbox">
            <input
              type="radio"
              name="radio"
              checked={operationType === "WITHDRAW"}
              onChange={() => {
                if (operationType != "WITHDRAW") {
                  setOperationType("WITHDRAW");
                  setSelectedCategory(null);
                }
              }}
            />
            <span>Расход</span>
          </label>
          <label className="checkbox">
            <input
              type="radio"
              name="radio"
              checked={operationType === "DEPOSIT"}
              onChange={() => {
                if (operationType != "DEPOSIT") {
                  setOperationType("DEPOSIT");
                  setSelectedCategory(null);
                }
              }}
            />
            <span>Доход</span>
          </label>
        </div>
      </div>

      <div className="add-operation-modal-block">
        <span className="add-operation-modal-block-title">Категория</span>
        <div className="add-operation-modal-base-category-container">
          <div
            className="image"
            style={{
              background: `linear-gradient(135deg, ${
                selectedCategory?.color.hex ?? "#8fe87b"
              } 0%, ${HexToRgbA(
                selectedCategory?.color.hex ?? "#8fe87b"
              )} 100%)`,
            }}
          >
            {selectedCategory != null && (
              <img
                src={`${API_URL}api/v1/image/content/${selectedCategory?.icon.name}`}
                alt="Category base icon"
              />
            )}
          </div>
          <Select
            value={selectedCategory?.name ?? ""}
            data={(operationType === "DEPOSIT"
              ? onlyForEarnCategories
              : standartCategories
            ).map((i) => ({
              label: i.name,
            }))}
            handler={(index) =>
              setSelectedCategory(
                (operationType === "DEPOSIT"
                  ? onlyForEarnCategories
                  : standartCategories)[index]
              )
            }
          />
        </div>
      </div>
      <div className="add-operation-modal-block">
        <span className="add-operation-modal-block-title">Счет</span>
        <div
          className="add-operation-modal-base-category-container"
          style={{
            display: "grid",
            gridAutoColumns: "1fr",
            gridAutoRows: "1fr",
            gridTemplateColumns: "1.5fr 0.5fr",
            gridTemplateRows: "1fr",
            gap: "0px 0px",
            gridTemplateAreas: ". .",
          }}
        >
          <span>{bill?.name}</span>
          <Select
            value={bill?.name ?? ""}
            data={bills.data.map((i) => ({
              label: i.name,
            }))}
            handler={(index) => setBill(bills.data[index])}
          />
        </div>
      </div>

      <div className="add-operation-modal-block">
        <span className="add-operation-modal-block-title">Сумма</span>
        <input
          type="text"
          placeholder="Введите сумму"
          className="add-operation-modal-input"
          value={summ}
          onChange={(e) => setSumm(e.target.value)}
        />
      </div>

      <div className="add-operation-modal-block">
        <span className="add-operation-modal-block-title">Описание</span>
        <textarea
          rows={4}
          placeholder="Введите описание"
          className="add-operation-modal-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div
        className="add-operation-modal-block"
        onClick={() => setMapModal(true)}
      >
        <span className="add-operation-modal-block-title">Местоположение</span>
        <div className="add-operation-modal-block-controls">
          {location ? (
            <>
              <span>
                {location[0]} - {location[1]}
              </span>
              <button className="button-primary" onClick={clearLocation}>
                Очистить
              </button>
            </>
          ) : (
            <span>Адрес еще не указан</span>
          )}
        </div>
      </div>

      <div className="add-operation-modal-block">
        <span className="add-operation-modal-block-title">
          Название местоположения
        </span>
        <input
          type="text"
          placeholder="Введите название местоположения"
          className="add-operation-modal-input"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
        />
      </div>

      {/* {!noQrLink && (
        <Link to="/cardscan" className="add-operation-modal-scan">
          <img src={ScanQr} alt="Scan qr icon" />
          <span>Сканировать чек</span>
        </Link>
      )} */}

      <button
        className="button-primary"
        style={{
          margin: "30px 0",
        }}
        onClick={_removeTransaction}
      >
        Удалить
      </button>

      <div className="add-operation-modal-controll">
        <button className="button-secondary" onClick={onClose}>
          Отмена
        </button>
        <button
          className="button-primary"
          style={{
            background: "rgb(137, 238, 179)",
          }}
          onClick={_editTransaction}
        >
          Изменить
        </button>
      </div>

      <Modal
        style={{
          padding: 0,
          width: 400,
        }}
        zIndex={16}
        show={mapModal}
        onClose={() => setMapModal(false)}
      >
        <MapModal
          onEnter={(v) => {
            if (v) setLocation(v);
          }}
        />
      </Modal>
    </div>
  );
};

export default TransactionEditModal;

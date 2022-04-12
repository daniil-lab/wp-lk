import ContextButton from "Components/ContextButton/ContextButton";
import DatePicker from "Components/DatePicker/DatePicker";
import Modal from "Components/Modal/Modal";
import Select from "Components/Select/Select";
import React, { useEffect, useState } from "react";
import Bill from "Services/Bill";
import Category from "Services/Category";
import { IBalances, IBaseCategory, TransactionType } from "Services/Interfaces";
import Transaction from "Services/Transaction";
import CalendarDark from "Static/icons/calendar-dark.svg";
import ScanQr from "Static/icons/scan-qr.svg";
import "Styles/Pages/Main/ChartBlock/AddOperationModal/AddOperationModal.scss";
import { API_URL } from "Utils/Config";
import HexToRgbA from "Utils/HexToRgbA";
import MapModal from "./MapModal/MapModal";

interface Props {
  onClose: () => void;
}

const AddOperationModal: React.FunctionComponent<Props> = ({
  onClose,
}: Props) => {
  const { useAddOperation } = Transaction;
  const { useGetBill } = Bill;
  const { useGetCategory } = Category;

  const { categories, load } = useGetCategory();
  const { balances, load: loadBill } = useGetBill();

  const [date, setDate] = useState<null | string[]>(null);

  const [operationType, setOperationType] =
    useState<TransactionType>("WITHDRAW");

  const [selectedCategory, setSelectedCategory] =
    useState<IBaseCategory | null>(null);

  const [bill, setBill] = useState<IBalances | null>(null);

  const [summ, setSumm] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [location, setLocation] = useState<number[] | null>(null);

  const [mapModal, setMapModal] = useState<boolean>(false);

  const [expand, setExpand] = useState<boolean>(false);

  const [qr, setQr] = useState<File | null>(null);

  const onEnter = (v: string[]): void => {
    if (Array.isArray(v)) {
      setDate(v);
    } else {
      setDate([v]);
    }
    setExpand(false);
  };

  const clearLocation = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setLocation(null);
  };

  const { OperationAdd } = useAddOperation({
    bill,
    date,
    selectedCategory,
    summ,
    description,
    location,
    operationType,
    qr,
  });

  const _addOperation = async (): Promise<void> => {
    await OperationAdd(onClose);
  };

  useEffect(() => {
    if (load) setSelectedCategory(categories[0]);
    if (loadBill) setBill(balances[0]);
  }, [load, loadBill]);

  return (
    <div className="add-operation-modal">
      <h1 className="add-operation-modal-title">Добавить операцию</h1>
      <div className="add-operation-modal-row">
        <span>{date ?? "Дата и время"}</span>
        <div style={{ position: "relative" }}>
          <ContextButton
            button={<img src={CalendarDark} />}
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
              defaultChecked
              onChange={(e) => setOperationType("WITHDRAW")}
            />
            <span>Расход</span>
          </label>
          <label className="checkbox">
            <input
              type="radio"
              name="radio"
              onChange={(e) => setOperationType("DEPOSIT")}
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
            <img
              src={`${API_URL}api/v1/image/content/${selectedCategory?.icon.name}`}
              alt="Category base icon"
            />
          </div>
          <Select
            value={selectedCategory?.name ?? ""}
            data={categories.map((i) => ({
              label: i.name,
            }))}
            handler={(index) => setSelectedCategory(categories[index])}
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
            data={balances.map((i) => ({
              label: i.name,
            }))}
            handler={(index) => setBill(balances[index])}
          />
        </div>
      </div>

      <div className="add-operation-modal-block">
        <span className="add-operation-modal-block-title">Суммма</span>
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

      <label className="add-operation-modal-scan">
        <img src={ScanQr} alt="Scan qr icon" />
        <span>Загрузить чек</span>
        <input
          type="file"
          onChange={(e) => setQr(e.target.files && e.target.files[0])}
          style={{ display: "none" }}
        />
      </label>

      <div className="add-operation-modal-controll">
        <button className="button-secondary" onClick={onClose}>
          Отмена
        </button>
        <button className="button-primary" onClick={_addOperation}>
          Добавить
        </button>
      </div>

      <Modal
        style={{
          padding: 0,
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

export default AddOperationModal;

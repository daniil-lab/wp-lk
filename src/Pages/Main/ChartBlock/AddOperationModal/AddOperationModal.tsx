import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Checkbox from "Components/Checkbox/Checkbox";
import ContextButton from "Components/ContextButton/ContextButton";
import DatePicker from "Components/DatePicker/DatePicker";
import Modal from "Components/Modal/Modal";
import Select from "Components/Select/Select";
import useGetBill from "Hooks/useGetBill";
import { BillModel } from "Models/BillModel";
import { BaseCategoryModel, CategoryModel } from "Models/CategoryModel";
import { TransactionType } from "Models/TransactionModel";
import { useGetActiveSubscription } from "Services/Subscription";
import CalendarDark from "Static/icons/calendar-dark.svg";
import ScanQr from "Static/icons/scan-qr-nigger.svg";
import "Styles/Pages/Main/ChartBlock/AddOperationModal/AddOperationModal.scss";
import { API_URL } from "Utils/Config";
import HexToRgbA from "Utils/HexToRgbA";
import MapModal from "./MapModal/MapModal";
import { HidePreloader } from "Redux/Actions";
import useGetCategories from "../../../../Hooks/useGetCategories";

interface Props {
  onClose: () => void;
  qr?: File;
  initialSum?: string;
  noQrLink?: boolean;
  updateTransactions: () => void;
  updateBills: () => void;
  addTransaction: (config: any) => Promise<boolean | undefined>;
  billsData: ReturnType<typeof useGetBill>;
  categoriesData: ReturnType<typeof useGetCategories>;
}

const AddOperationModal: React.FC<Props> = ({
  onClose,
  qr,
  initialSum,
  noQrLink,
  updateTransactions,
  addTransaction,
  updateBills,
  billsData,
  categoriesData,
}) => {
  const { activeSubscription } = useGetActiveSubscription();

  const [date, setDate] = useState<null | string[]>(null);
  const [operationType, setOperationType] =
    useState<TransactionType>("WITHDRAW");
  const [selectedCategory, setSelectedCategory] =
    useState<BaseCategoryModel | null>(null);
  const [onlyForEarnCategories, setOnlyForEarnCategories] = useState<
    CategoryModel[]
  >([]);
  const [standartCategories, setStandartCategories] = useState<CategoryModel[]>(
    []
  );
  const [summ, setSumm] = useState("");
  const [bill, setBill] = useState<BillModel | null>(null);
  const [description, setDescription] = useState<string>("");
  const [placeName, setPlaceName] = useState<string>("");
  const [location, setLocation] = useState<number[] | null>(null);
  const [mapModal, setMapModal] = useState<boolean>(false);
  const dispatch = useDispatch();

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

  const _addOperation = async (): Promise<void> => {
    try {
      const action = await addTransaction({
        bill,
        operationType,
        summ,
        description,
        selectedCategory,
        location,
        date,
        qr,
        placeName,
      });
      if (action) {
        onClose();
        updateTransactions();
        updateBills();
      }
    } catch (ex) {
      dispatch(HidePreloader()); // закрываем прелоадер в случае ошибки
      console.log(ex);
    }
  };

  useEffect(() => {
    initialSum && setSumm(initialSum);
  }, [initialSum]);

  useMemo(() => {
    if (categoriesData.categories) {
      const standartArr: CategoryModel[] = [];

      const earnArr: CategoryModel[] = [];

      categoriesData.categories.forEach((category) => {
        if (category.forEarn) earnArr.push(category);
        if (category.forSpend) standartArr.push(category);
      });

      setStandartCategories(standartArr);
      setOnlyForEarnCategories(earnArr);
    }
  }, [categoriesData.load, categoriesData.categories]);

  useMemo(() => {
    if (standartCategories.length != 0 && operationType == "WITHDRAW") {
      setSelectedCategory(standartCategories[0]);
    }
  }, [categoriesData.load, standartCategories]);

  useEffect(() => {
    if (billsData.load) setBill(billsData.data[0]);
  }, [billsData.load]);

  return (
    <div className="add-operation-modal">
      <h1 className="add-operation-modal-title">Добавить операцию</h1>
      <div className="add-operation-modal-row">
        <span>{date ?? "Дата и время"}</span>
        <div style={{ position: "relative" }}>
          <ContextButton
            button={<img src={CalendarDark} alt="Dark calendar button" />}
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
          <Checkbox
            onChange={() => {
              setOperationType("WITHDRAW");
              if (standartCategories.length > 0)
                setSelectedCategory(standartCategories[0]);
              else setSelectedCategory(null);
            }}
            value={operationType === "WITHDRAW"}
            lable={"Расход"}
          />
          <Checkbox
            onChange={() => {
              setOperationType("DEPOSIT");
              if (onlyForEarnCategories.length > 0)
                setSelectedCategory(onlyForEarnCategories[0]);
              else setSelectedCategory(null);
            }}
            value={operationType === "DEPOSIT"}
            lable={"Доход"}
          />
        </div>
      </div>

      <div className="add-operation-modal-block">
        <span className="add-operation-modal-block-title">Категория</span>
        <div className="add-operation-modal-base-category-container">
          {(operationType === "DEPOSIT" &&
            onlyForEarnCategories.length === 0) ||
          (operationType === "WITHDRAW" && standartCategories.length === 0) ? (
            <span>Нет доступных категорий для выбраной операции</span>
          ) : (
            <React.Fragment>
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
            </React.Fragment>
          )}
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
            data={billsData.data.map((i) => ({
              label: i.name,
            }))}
            handler={(index) => setBill(billsData.data[index])}
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

      {activeSubscription?.variant.role.name === "PremiumRole" ||
      activeSubscription?.variant.role.name === "ProRole" ? (
        <React.Fragment>
          <div
            className="add-operation-modal-block"
            onClick={() => setMapModal(true)}
          >
            <span className="add-operation-modal-block-title">
              Местоположение
            </span>
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
        </React.Fragment>
      ) : (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          <span>Оформите подписку, чтобы получить доступ к геометкам</span>
        </div>
      )}

      {!noQrLink && (
        <Link to="/cardscan" className="add-operation-modal-scan">
          <img src={ScanQr} alt="Scan qr icon" />
          <span>Сканировать чек</span>
        </Link>
      )}

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

export default AddOperationModal;

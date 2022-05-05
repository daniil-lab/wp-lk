import { BillModel } from "Models/BillModel";
import { ITinkoffCard } from "Services/Interfaces";

export type Banks = "tinkoff" | "sber" | "tochka";

export type Act = "start" | "submit";

export interface UseGetBillModel {
  load: boolean;
  data: BillModel[];
  generalBalance: number;
  updateBill: () => void;
  tinkoffCards: ITinkoffCard[];
}

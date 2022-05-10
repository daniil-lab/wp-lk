import {
  TransactionsSortedModel,
  TranscationModel,
} from "Models/TransactionModel";
import moment from "moment";
import ArrayGroups from "./ArrayGroups";

export default (array: TranscationModel[]): TransactionsSortedModel[] => {
  return ArrayGroups(array).sort(
    (x, y) =>
      <any>moment(y?.date ?? y?.createAt).format("L") -
      <any>moment(x?.date ?? x?.createAt).format("L")
  );
};

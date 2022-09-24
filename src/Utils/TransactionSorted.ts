import { ITransactionsSorted, TransactionModel } from "Models/TransactionModel";
import moment from "moment";
import ArrayGroups from "./ArrayGroups";

const TransactionsSorted = (
  array: TransactionModel[]
): ITransactionsSorted[] => {
  return ArrayGroups(array).sort(
    (x, y) =>
      (moment(y?.date ?? y?.createAt).format("L") as any) -
      (moment(x?.date ?? x?.createAt).format("L") as any)
  );
};

export default TransactionsSorted;

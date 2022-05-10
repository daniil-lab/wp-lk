import { CategoryModel } from "Models/CategoryModel";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { HidePreloader, ShowPreloader, ShowToast } from "Redux/Actions";
import TransactionRepository from "Repository/TransactionRepository";

const useAddCategoryTransaction = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [operationType, setOperationType] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryModel | null>(null);

  const transactionRepository = new TransactionRepository();

  const edit = async (): Promise<boolean | undefined> => {
    if (transactionId && selectedCategory) {
      dispatch(ShowPreloader());
      const action = await transactionRepository.updateTinkoffTransaction(
        transactionId,
        selectedCategory?.id
      );
      dispatch(HidePreloader());
      if (action) {
        dispatch(
          ShowToast({
            title: "Успех",
            text: "Транзакция успешно изменена",
            type: "success",
          })
        );
        return true;
      } else {
        dispatch(
          ShowToast({
            title: "Ошибка",
            text: "Ошибка при изменении транзакции",
            type: "error",
          })
        );
      }
    }
  };

  return {
    edit,
    modal: { show, setShow },
    transactionId,
    setTransactionId,
    selectedCategory,
    setSelectedCategory,
    operationType,
    setOperationType,
    transactionType,
    setTransactionType,
  };
};

export default useAddCategoryTransaction;

export default (data, tinkoffCards, sberCards, tochkaCards): number => {
  return (
    data.reduce((x, y) => x + y.balance.amount, 0) +
    tinkoffCards.reduce((x, y) => x + y.balance.amount, 0) +
    tochkaCards.reduce((x, y) => x + y.balance.amount, 0) +
    sberCards.reduce((x, y) => x + y.balance.amount, 0)
  );
};

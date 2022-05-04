const ArrayGroups = (array: any[]): any[] => {
  const g = array.reduce((groups, transaction) => {
    const date = transaction.date
      ? transaction.date.split("T")[0]
      : transaction.createAt.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  const res = Object.keys(g).map((date) => {
    return {
      date,
      transactions: g[date],
    };
  });

  return res;
};

export default ArrayGroups;

import { ICategoryFilter } from "./types";

export const categoryFiltersData: Array<{
  name: string;
  key: keyof ICategoryFilter;
}> = [
  {
    name: "Доходы",
    key: "income",
  },
  { name: "Расходы", key: "expense" },
  { name: "Избранное", key: "favorite" },
];

import { createContext } from "react";

const CategoriesContext = createContext({
  allCategories: undefined,
  allCategoriesSelectType: undefined,
  checkCategories: () => {},
  clearCategories: () => {},
  getCategoryById: () => undefined,
});

export default CategoriesContext;

import { createContext } from "react";

const CategoriesContext = createContext({
    allCategories: undefined, allCategoriesSelectType: undefined, checkCategories: () => {}, clearCategories: () => {}
});

export default CategoriesContext;

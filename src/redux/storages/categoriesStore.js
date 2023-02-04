import { createSlice } from "@reduxjs/toolkit";
// import { GenerateArrayForSelect } from "./functions";

export const categoriesStore = createSlice({
  name: "categories",
  initialState: {
    // getAllPath: "/api/Category/get/all",
    // allCities: undefined,
    allCategoriesSelectType: undefined,
    allCategories: undefined,
    // canChangeCategories: true,
  },
  reducers: {
    initCategories: (state, { payload:categories }) => {
      // state.canChangeCategories = false;
      // let categories = payload;
      // console.log(categories);
      state.allCategories = categories;
      state.allCategoriesSelectType = generateArrayForSelect([
        categories.mainCategories,
        categories.subCategories]
      );
    },
    generateArrayForSelect: (state, { payload }) => {
        console.log(payload, payload.arguments);
    //   const newArray = [];
    //   for (let array of arguments) {
    //     if (!Array.isArray(array)) {
    //       break;
    //     }
    //     array.forEach((item) => {
    //       newArray.push({ value: item.name, label: item.name });
    //     });
    //   }
    //   return newArray;
    },
    // setChangeCategories: (state, actionCan) => {
    //     state.canChangeCategories = actionCan.payload;
    // },
  },
});

export const { initCategories, generateArrayForSelect } =
  categoriesStore.actions;
export default categoriesStore.reducer;

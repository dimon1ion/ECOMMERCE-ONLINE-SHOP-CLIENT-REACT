import { createSlice } from "@reduxjs/toolkit"
// import { GenerateArrayForSelect } from "./functions";

export const categoriesStore = createSlice({
    name: "categories",
    initialState:{
        // getAllPath: "/api/Category/get/all",
        // allCities: undefined,
        allCategoriesSelectType: undefined,
        allCategories: undefined,
        // canChangeCategories: true,
    },
    reducers:{
        initCategories: (state, { payload }) => {
            // state.canChangeCategories = false;
            let categories = payload;
            // console.log(categories);
            state.allCategories = categories;
            // state.allCategoriesSelectType = GenerateArrayForSelect(categories.mainCategories, categories.subCategories);
        },
        // setChangeCategories: (state, actionCan) => {
        //     state.canChangeCategories = actionCan.payload;
        // },
    }
});

export const { initCategories } = categoriesStore.actions;
export default categoriesStore.reducer;


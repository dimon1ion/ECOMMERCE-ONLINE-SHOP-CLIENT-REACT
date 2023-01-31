import { configureStore } from "@reduxjs/toolkit";
import categoriesStore from "./storages/categoriesStore";
import serverStore from "./storages/serverStore";
// import categoriesStore from "./categoriesStore";
// import citiesStore from "./citiesStore";
// import server from "./server";

export default configureStore({
    reducer:{
        serverStore,
        categoriesStore,
    },
});
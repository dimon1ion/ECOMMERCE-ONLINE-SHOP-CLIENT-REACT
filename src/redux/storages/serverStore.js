import { createSlice } from "@reduxjs/toolkit"

export const serverStore = createSlice({
    name: "server",
    initialState: {
        path:"https://localhost:44343",
        // authenticated: undefined,
    },
    reducers: {

    }
});

// export const {} = server.actions;
export default serverStore.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.value = action.payload;
      console.log(action.payload);
    },
  },
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;

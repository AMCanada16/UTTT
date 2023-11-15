import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initalState: number = 0

export const selectedGridSlice = createSlice({
  name: "selectedGrid",
  initialState: initalState,
  reducers: {
    setSelectedGrid: (_state, action: PayloadAction<number>) => {
      return action.payload
    }
  }
})

export default selectedGridSlice.reducer
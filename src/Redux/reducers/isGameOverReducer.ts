import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initalState: boolean = false

export const isGameOverSlice = createSlice({
  name: "isGameOver",
  initialState: initalState,
  reducers: {
    setIsGameOver: (_state, action: PayloadAction<boolean>) => {
      return action.payload
    }
  }
})

export default isGameOverSlice.reducer
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initalState: {width: number, height: number} = {width: 0, height: 0}

export const dimensionsSlice = createSlice({
  name: "dimensions",
  initialState: initalState,
  reducers: {
    setWidth: (state, action: PayloadAction<number>) => {
        return {height: state.height, width: action.payload}
    },
    setHeight: (state, action: PayloadAction<number>) => {
      return {height: action.payload, width: state.width}
    }
  }
})

export default dimensionsSlice.reducer
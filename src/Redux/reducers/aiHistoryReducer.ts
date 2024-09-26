import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { gridStateMode } from '../../Types';

const initalState: {
  input: gridStateMode[][];
  output: gridStateMode[][];
} = {
  input: [],
  output: []
}

export const aiHistorySlice = createSlice({
  name: "aiHistory",
  initialState: initalState,
  reducers: {
    pushInput: (state, action: PayloadAction<gridStateMode[]>) => {
      state.input.push(action.payload)
    },
    pushOutput: (state, action: PayloadAction<gridStateMode[]>) => {
      state.output.push(action.payload)
    }
  }
})

export default aiHistorySlice.reducer
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { emptyGame } from '../../Types';

const initalState: DimentionalType = emptyGame

export const gridStateSlice = createSlice({
  name: "gridState",
  initialState: initalState,
  reducers: {
    setGridState: (_state, action: PayloadAction<DimentionalType>) => {
      return action.payload
    }
  }
})

export default gridStateSlice.reducer
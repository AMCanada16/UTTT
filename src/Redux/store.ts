import { configureStore } from '@reduxjs/toolkit';
import dimensionsReducer from './reducers/dimensionsReducer';
import gridStateReducer from './reducers/gridStateReducer';
import playerModeReducer from './reducers/playerModeReducer';
import isGameOverReducer from './reducers/isGameOverReducer';
import selectedGridReducer from './reducers/selectedGridReducer';


const store = configureStore({
  reducer: {
    dimensions: dimensionsReducer,
    gridState: gridStateReducer,
    isGameOver: isGameOverReducer,
    playerMode: playerModeReducer,
    selectedGrid: selectedGridReducer,
  }
});

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
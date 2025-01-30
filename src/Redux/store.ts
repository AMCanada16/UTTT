import { configureStore } from '@reduxjs/toolkit';
import gridStateReducer from '@redux/reducers/gameReducer';
import dimensionsReducer from '@redux/reducers/dimensionsReducer';
import aiHistoryReducer from '@redux/reducers/aiHistoryReducer';


const store = configureStore({
  reducer: {
    dimensions: dimensionsReducer,
    gameState: gridStateReducer,
    aiHistory: aiHistoryReducer
  }
});

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
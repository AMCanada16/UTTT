import { configureStore } from '@reduxjs/toolkit';
import dimensionsReducer from './reducers/dimensionsReducer';


const store = configureStore({
  reducer: {
    dimensions: dimensionsReducer,
  }
});

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
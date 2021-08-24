import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import questionsReducer from './questionsSlice'
import gameReducer from './gameSlice'
export default configureStore({
  reducer: {
    user: userReducer,
    questions: questionsReducer,
    game: gameReducer
  },
  devTools: true
});

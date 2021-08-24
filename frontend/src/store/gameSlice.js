import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { joinGame } from '../client';

export const joinQuiz = createAsyncThunk('game/join', async (payload, thunkAPI) => {
  const { sessionId, playerName } = payload;
  try {
    const resp = await joinGame(sessionId, playerName);
    return resp;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message)
  }
})

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    playerId: '',
    questions: [],
  },
  reducers: {
    addQuestion: (state, action) => {
      const question = action.payload;
      if (state.questions.map(q => q.id).indexOf(question.id) === -1) {
        state.questions = [...(state.questions), question]
      }
    }
  },
  extraReducers: {
    // Set the playerId once joined successfully
    [joinQuiz.fulfilled]: (state, action) => {
      state.playerId = action.payload.playerId;
    },
    [joinQuiz.rejected]: (state, action) => {
    }
  }
})
export const { addQuestion } = gameSlice.actions;
export default gameSlice.reducer;

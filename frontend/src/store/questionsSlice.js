import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../client';

export const fetchQuestions = createAsyncThunk('questions/fetch', async (quizId, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  try {
    const resp = await api.fetchQuestions(token, quizId)
    return resp;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
});

export const updateQuestion = createAsyncThunk('questions/update', async (payload, thunkAPI) => {
  const token = thunkAPI.getState().user.token
  const questions = thunkAPI.getState().questions.questions
  const { quizId, question } = payload
  const updatedQuestions = questions.map(item => {
    return item.id === question.id ? question : item;
  })
  try {
    await api.updateQuiz(token, quizId, { questions: updatedQuestions });
    return updatedQuestions;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const createQuestion = createAsyncThunk('questions/create', async (payload, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const questions = thunkAPI.getState().questions.questions;
  let { quizId, question } = payload;
  const hi = questions.length - 1;
  question = {
    ...question,
    id: questions.length === 0 ? 0 : questions[hi].id + 1
  };
  const updatedQuestions = [...questions, question];
  try {
    await api.updateQuiz(token, quizId, { questions: updatedQuestions });
    return updatedQuestions;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const removeQuestion = createAsyncThunk('questions/remove', async (payload, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const questions = thunkAPI.getState().questions.questions;
  const { quizId, questionId } = payload;
  const updatedQuestions = questions.filter(item => item.id !== questionId);
  try {
    await api.updateQuiz(token, quizId, { questions: updatedQuestions })
    return updatedQuestions
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
})

const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    questions: [],
    removeQuestionModalOpened: false,
    selectedQuestion: -1,
    newQuestionModalOpened: false,
  },
  reducers: {
    showRemoveQuestionDialog: (state, action) => {
      state.selectedQuestion = action.payload
      state.removeQuestionModalOpened = true;
    },
    closeRemoveQuestionDialog: (state) => {
      state.selectedQuestion = false;
      state.removeQuestionModalOpened = false;
    },
    showNewQuestionDialog: (state) => {
      state.newQuestionModalOpened = true;
    },
    closeNewQuestionDialog: (state) => {
      state.newQuestionModalOpened = false;
    }
  },
  extraReducers: {
    [fetchQuestions.fulfilled]: (state, action) => {
      state.questions = action.payload.questions;
    },
    [fetchQuestions.rejected]: (_, action) => {
      console.warn('fetch questions failed', action.payload.error);
    },
    [updateQuestion.fulfilled]: (state, action) => {
      state.questions = action.payload;
    },
    [updateQuestion.rejected]: (_, action) => {
      console.warn('update questions failed', action.payload.error);
    },
    [createQuestion.fulfilled]: (state, action) => {
      state.questions = action.payload;
    },
    [createQuestion.rejected]: (_, action) => {
      console.warn('create questions failed', action.payload.error);
    },
    [removeQuestion.fulfilled]: (state, action) => {
      state.questions = action.payload;
    },
    [removeQuestion.rejected]: (_, action) => {
      console.warn('remove questions failed', action.payload.error);
    }
  }
})
export const {
  showRemoveQuestionDialog,
  closeRemoveQuestionDialog,
  showNewQuestionDialog,
  closeNewQuestionDialog
} = questionsSlice.actions
export default questionsSlice.reducer

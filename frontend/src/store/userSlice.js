import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../client';

/** Redux action creato for dispatching login action */
export const login = createAsyncThunk('users/login', async (payload, thunkAPI) => {
  const { email, password } = payload;
  try {
    const response = await api.login(email, password);
    return response;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

/** Redux action creato for dispatching logout action */
export const logout = createAsyncThunk('user/logout', async (payload, thunkAPI) => {
  const state = thunkAPI.getState()
  try {
    return await api.logout(state.user.token);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

/** Redux action creato for dispatching register action */
export const register = createAsyncThunk('users/register', async (payload, thunkAPI) => {
  const { email, password, name } = payload;
  try {
    const response = await api.register(email, password, name);
    return response;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { token: '', loggedIn: false, sessionId: '' },
  reducers: {
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    }
  },
  extraReducers: {
    // Once the user logged in successfully, setup token
    // and update loggeIn to true
    [login.fulfilled]: (state, action) => {
      state.loggedIn = true;
      state.token = action.payload.token;
    },
    [login.rejected]: (state, action) => {
    },
    // Once the user logged out successfully
    // unset token and change loggedIn status to false
    [logout.fulfilled]: (state, action) => {
      state.loggedIn = false;
      state.token = '';
    },
    [logout.rejected]: (state, action) => {
    },
    // Register does the same thing as login
    [register.fulfilled]: (state, action) => {
      state.loggedIn = true;
      state.token = action.payload.token;
    },
    [register.rejected]: (state, action) => {
    }
  },
});

export const { setSessionId } = userSlice.actions;
export default userSlice.reducer;

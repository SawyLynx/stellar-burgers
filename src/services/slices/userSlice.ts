import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@/utils/burger-api';
import { deleteCookie, setCookie } from '@/utils/cookie';
import type { TUser } from '@/utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface TUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка авторизации'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (
    _,
    {
    }
  ) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Пользователь не авторизован');
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(data);
      return res.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления данных'
      );
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const selectUser = (state: { user: TUserState }) => state.user.user;
export const selectIsAuthChecked = (state: { user: TUserState }) =>
  state.user.isAuthChecked;

export default userSlice.reducer;

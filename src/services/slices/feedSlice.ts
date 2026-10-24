import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import type { TOrder } from '@utils-types';

interface TFeedSliceState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TFeedSliceState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при загрузке ленты заказов'
      );
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectFeedOrders = (state: { feed: TFeedSliceState }) => state.feed.orders;
export const selectFeedIsLoading = (state: { feed: TFeedSliceState }) =>
  state.feed.isLoading;
export const selectFeedError = (state: { feed: TFeedSliceState }) => state.feed.error;
export const selectFeedTotal = (state: { feed: TFeedSliceState }) => state.feed.total;
export const selectFeedTotalToday = (state: { feed: TFeedSliceState }) => state.feed.totalToday;

export default feedSlice.reducer;

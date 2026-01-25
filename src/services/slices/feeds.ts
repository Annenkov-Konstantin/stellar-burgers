import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

export enum Feeds {
  GETFEEDS = 'feeds/getAll'
}

export const getFeeds = createAsyncThunk<TOrdersData>(
  Feeds.GETFEEDS,
  async () => getFeedsApi()
);

type TFeedsStatus = {
  feedsIsLoading: boolean;
  feedsIsRequested: boolean;
  error: string | null;
};

export type TFeedsState = TFeedsStatus & TOrdersData;

export const feedInitialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  feedsIsLoading: false,
  feedsIsRequested: false,
  error: null
};

const feedsSlice = createSlice({
  name: 'feeds',
  initialState: feedInitialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    getFeedsIsLoading: (state) => state.feedsIsLoading,
    getFeedsIsRequested: (state) => state.feedsIsRequested,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getFeedOrderByNumber: (state) => (number: string) =>
      state.orders.find((order) => order.number === parseInt(number))
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.feedsIsLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.feedsIsLoading = false;
        state.feedsIsRequested = true;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.feedsIsLoading = false;
        state.feedsIsRequested = true;
        state.error = action.error.message ?? 'Ошибка при загрузке заказов';
      });
  }
});

export default feedsSlice.reducer;

export const {
  getOrders,
  getFeedsIsLoading,
  getFeedsIsRequested,
  getTotal,
  getTotalToday,
  getFeedOrderByNumber
} = feedsSlice.selectors;

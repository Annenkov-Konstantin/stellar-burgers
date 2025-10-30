// slice для заказа по номеру
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchOrderByNumber = createAsyncThunk(
  'orderByNumber/fetch',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

type TOrderByNumberState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderByNumberState = {
  order: null,
  isLoading: false,
  error: null
};

const orderByNumberSlice = createSlice({
  name: 'orderByNumber',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  selectors: {
    getOrderDetails: (state) => state.order,
    getOrderDetailsLoading: (state) => state.isLoading,
    getOrderDetailsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка при загрузке заказа';
      });
  }
});

export const { clearOrder } = orderByNumberSlice.actions;
export default orderByNumberSlice.reducer;

export const { getOrderDetails, getOrderDetailsLoading, getOrderDetailsError } =
  orderByNumberSlice.selectors;

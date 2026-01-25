import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetch',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
    addUserOrder: (state, action: { payload: TOrder }) => {
      state.orders.unshift(action.payload);
    }
  },
  selectors: {
    getUserOrders: (state) => state.orders,
    getUserOrdersLoading: (state) => state.isLoading,
    getUserOrdersError: (state) => state.error,
    getUserOrderByNumber: (state) => (number: string) =>
      state.orders.find((order) => order.number === parseInt(number))
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export const { clearUserOrders, addUserOrder } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;
export const {
  getUserOrders,
  getUserOrdersLoading,
  getUserOrdersError,
  getUserOrderByNumber
} = userOrdersSlice.selectors;

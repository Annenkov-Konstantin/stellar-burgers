import { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

type TIds = string[];

export enum OrderActions {
  ADD = 'add',
  REMOVE = 'remove'
}

export const OrderBurger = 'burger/order';

export type TOrderAction = OrderActions.ADD | OrderActions.REMOVE;

export const orderBurger = createAsyncThunk(OrderBurger, async (ids: TIds) =>
  orderBurgerApi(ids)
);

type TServerResponse = {
  name: string;
  order: { number: number };
  success: boolean;
};

export type TOrderIngredient = {
  id: string;
  uniqueId: string;
};

export type TOrdersState = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: TOrderIngredient[];
  orderIsSending: boolean;
  orderHasSent: boolean;
  error?: string;
};

const initialOrdersState: TOrdersState = {
  _id: '',
  status: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  number: 0,
  ingredients: [],
  orderIsSending: false,
  orderHasSent: false,
  error: ''
};

const order = createSlice({
  name: 'order',
  initialState: initialOrdersState,
  reducers: {
    initOrder: (state, action: PayloadAction<{ id: string }>) => {
      state._id = state._id === '' ? '1' : (+state._id + 1).toString();
      state.status = 'creating';
      state.createdAt = Date.now().toString();
      state.ingredients.push({
        id: action.payload.id,
        uniqueId: nanoid()
      });
    },
    changeOrder: (
      state,
      action: PayloadAction<{ action: TOrderAction; id: string }>
    ) => {
      state.ingredients.push({
        id: action.payload.id,
        uniqueId: nanoid()
      });
      state.updatedAt = Date.now().toString();
    },
    reorderIngredients: (
      state: TOrdersState,
      action: PayloadAction<TOrderIngredient[]>
    ) => {
      state.ingredients = action.payload;
      state.updatedAt = Date.now().toString();
    },
    removeIngredientByUniqueId: (
      state: TOrdersState,
      action: PayloadAction<{ uniqueId: string }>
    ) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.uniqueId !== action.payload.uniqueId
      );
      state.updatedAt = Date.now().toString();
    },
    resetOrderModal: (state: TOrdersState) => {
      state.number = 0;
      state.orderHasSent = false;
      state.status = '';
      state.name = '';
      state.error = '';
    }
  },

  selectors: {
    getIngredientsInOrder: (state) => state.ingredients,
    getIngredientsIds: (state) => state.ingredients.map((ing) => ing.id),
    getIsOrderSending: (state) => state.orderIsSending,
    getOrdersId: (state) => state._id,
    getDasOrderSent: (state) => state.orderHasSent,
    getOrderData: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.status = 'sending';
        state.orderIsSending = true;
        state.error = '';
      })
      .addCase(
        orderBurger.fulfilled,
        (state, action: PayloadAction<TServerResponse>) => {
          if (action.payload.success) {
            state.status = 'completed';
            state.orderIsSending = false;
            state.orderHasSent = true;
            state.name = action.payload.name;
            state.number = action.payload.order.number;
            state.ingredients = [];
          } else {
            state.status = 'unsuccessful';
            state.orderHasSent = true;
            state.error = 'Order failed';
          }
        }
      )
      .addCase(orderBurger.rejected, (state, action) => {
        state.status = 'rejected';
        state.orderHasSent = true;
        state.error = action.error.message ?? 'Unknown error';
      });
  }
});

export default order.reducer;
export const {
  initOrder,
  changeOrder,
  reorderIngredients,
  removeIngredientByUniqueId,
  resetOrderModal
} = order.actions;
export const {
  getIngredientsInOrder,
  getIngredientsIds,
  getIsOrderSending,
  getOrdersId,
  getDasOrderSent,
  getOrderData
} = order.selectors;

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredients';
import orderReducer from './slices/orders';
import feedsReducer from './slices/feeds';
import orderDetailsReducer from './slices/orderDetails';
import userReducer from './slices/user';
import userOrdersReducer from './slices/userOrders';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  order: orderReducer,
  feeds: feedsReducer,
  orderByNumber: orderDetailsReducer,
  user: userReducer,
  userOrders: userOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();

export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

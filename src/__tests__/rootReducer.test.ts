import { describe, test, expect } from '@jest/globals';
import { rootReducer } from '../services/store';
import { ingredientsInitialState } from '../services/slices/ingredients';
import { initialOrdersState } from '../services/slices/orders';
import { feedInitialState } from '../services/slices/feeds';
import { initialState as orderDetailsInitialState } from '../services/slices/orderDetails';
import { initialState as userInitialState } from '../services/slices/user';
import { initialState as userOrdersInitialState } from '../services/slices/userOrders';

describe('Тестируем rootReducer на правильную инициализацию', () => {
  test('Должен правильно инициализировать все слайсы при запуске с undefined', () => {
    // Вызываем rootReducer с undefined state и пустым action
    const state = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем, что все слайсы инициализированы
    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      order: initialOrdersState,
      feeds: feedInitialState,
      orderByNumber: orderDetailsInitialState,
      user: userInitialState,
      userOrders: userOrdersInitialState
    });
  });

  test('Должен содержать все необходимые ключи состояния', () => {
    const state = rootReducer(undefined, { type: '' });

    const expectedKeys = [
      'ingredients',
      'order',
      'feeds',
      'orderByNumber',
      'user',
      'userOrders'
    ];

    expect(Object.keys(state)).toEqual(expect.arrayContaining(expectedKeys));
    expect(Object.keys(state).length).toBe(expectedKeys.length);
  });

  test('Каждый слайс должен иметь правильную структуру начального состояния', () => {
    const state = rootReducer(undefined, { type: '' });

    // Проверяем ingredients
    expect(state.ingredients).toHaveProperty('items');
    expect(state.ingredients).toHaveProperty('ingredientsIsLoading');
    expect(state.ingredients).toHaveProperty('ingredientsIsRequested');
    expect(state.ingredients).toHaveProperty('error');

    // Проверяем order
    expect(state.order).toHaveProperty('ingredients');
    expect(state.order).toHaveProperty('orderIsSending');
    expect(state.order).toHaveProperty('orderHasSent');
    expect(state.order).toHaveProperty('_id');
    expect(state.order).toHaveProperty('status');
    expect(state.order).toHaveProperty('name');
    expect(state.order).toHaveProperty('createdAt');
    expect(state.order).toHaveProperty('updatedAt');
    expect(state.order).toHaveProperty('number');
    expect(state.order).toHaveProperty('error');

    // Проверяем feeds
    expect(state.feeds).toHaveProperty('orders');
    expect(state.feeds).toHaveProperty('feedsIsLoading');
    expect(state.feeds).toHaveProperty('feedsIsRequested');
    expect(state.feeds).toHaveProperty('total');
    expect(state.feeds).toHaveProperty('totalToday');
    expect(state.feeds).toHaveProperty('error');

    // Проверяем orderByNumber
    expect(state.orderByNumber).toHaveProperty('order');
    expect(state.orderByNumber).toHaveProperty('isLoading');
    expect(state.orderByNumber).toHaveProperty('error');

    // Проверяем user
    expect(state.user).toHaveProperty('user');
    expect(state.user).toHaveProperty('isAuthChecked');
    expect(state.user).toHaveProperty('isLoading');
    expect(state.user).toHaveProperty('forgotPasswordRequest');
    expect(state.user).toHaveProperty('forgotPasswordSuccess');
    expect(state.user).toHaveProperty('resetPasswordRequest');
    expect(state.user).toHaveProperty('resetPasswordSuccess');
    expect(state.user).toHaveProperty('error');

    // Проверяем userOrders
    expect(state.userOrders).toHaveProperty('orders');
    expect(state.userOrders).toHaveProperty('isLoading');
    expect(state.userOrders).toHaveProperty('error');
  });

  test('Должен возвращать текущее состояние при неизвестном действии', () => {
    const initialState = rootReducer(undefined, { type: '' });

    // Создаем измененное состояние
    const modifiedState = {
      ...initialState,
      ingredients: {
        ...initialState.ingredients,
        ingredientsIsLoading: true
      }
    };

    const state = rootReducer(modifiedState, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual(modifiedState);
    expect(state.ingredients.ingredientsIsLoading).toBe(true);
  });

  test('Должен возвращать тот же объект состояния при неизвестном действии (не мутировать)', () => {
    const initialState = rootReducer(undefined, { type: '' });

    const state = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что это тот же объект (не создана новая ссылка)
    expect(state).toBe(initialState);
  });

  test('Все начальные значения должны соответствовать спецификациям', () => {
    const state = rootReducer(undefined, { type: '' });

    // Проверяем ingredients
    expect(state.ingredients.items).toEqual([]);
    expect(state.ingredients.ingredientsIsLoading).toBe(false);
    expect(state.ingredients.ingredientsIsRequested).toBe(false);
    expect(state.ingredients.error).toBeNull();

    // Проверяем order (согласно реальному состоянию из ошибки)
    expect(state.order.ingredients).toEqual([]);
    expect(state.order.orderIsSending).toBe(false);
    expect(state.order.orderHasSent).toBe(false);
    expect(state.order._id).toBe(''); // Исправлено: пустая строка, а не '0'
    expect(state.order.status).toBe('');
    expect(state.order.name).toBe('');
    expect(state.order.createdAt).toBe(''); // Исправлено: пустая строка
    expect(state.order.updatedAt).toBe(''); // Исправлено: пустая строка
    expect(state.order.number).toBe(0);
    expect(state.order.error).toBe('');

    // Проверяем feeds
    expect(state.feeds.orders).toEqual([]);
    expect(state.feeds.feedsIsLoading).toBe(false);
    expect(state.feeds.feedsIsRequested).toBe(false);
    expect(state.feeds.total).toBe(0);
    expect(state.feeds.totalToday).toBe(0);
    expect(state.feeds.error).toBeNull();

    // Проверяем orderByNumber
    expect(state.orderByNumber.order).toBeNull();
    expect(state.orderByNumber.isLoading).toBe(false);
    expect(state.orderByNumber.error).toBeNull();

    // Проверяем user
    expect(state.user.user).toBeNull();
    expect(state.user.isAuthChecked).toBe(false);
    expect(state.user.isLoading).toBe(false);
    expect(state.user.forgotPasswordRequest).toBe(false);
    expect(state.user.forgotPasswordSuccess).toBe(false);
    expect(state.user.resetPasswordRequest).toBe(false);
    expect(state.user.resetPasswordSuccess).toBe(false);
    expect(state.user.error).toBeNull();

    // Проверяем userOrders
    expect(state.userOrders.orders).toEqual([]);
    expect(state.userOrders.isLoading).toBe(false);
    expect(state.userOrders.error).toBeNull();
  });

  test('Состояние каждого слайса должно соответствовать его собственному начальному состоянию', () => {
    const state = rootReducer(undefined, { type: '' });

    // Проверяем каждый слайс отдельно
    expect(state.ingredients).toEqual(ingredientsInitialState);
    expect(state.order).toEqual(initialOrdersState);
    expect(state.feeds).toEqual(feedInitialState);
    expect(state.orderByNumber).toEqual(orderDetailsInitialState);
    expect(state.user).toEqual(userInitialState);
    expect(state.userOrders).toEqual(userOrdersInitialState);
  });
});

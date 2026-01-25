import { describe, test, expect } from '@jest/globals';
import orderByNumberReducer, {
  fetchOrderByNumber,
  initialState,
  getOrderDetails,
  getOrderDetailsLoading,
  getOrderDetailsError,
  TOrderByNumberState
} from '../services/slices/orderDetails';

const mockOrder = {
  _id: '69749ba4a64177001b3286f7',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0940',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0940',
    '643d69a5c3f7b9001cfa0940'
  ],
  owner: '658b0f2887899c001b8259e2',
  status: 'done',
  name: 'Метеоритный флюоресцентный люминесцентный бургер',
  createdAt: '2026-01-24T10:15:00.568Z',
  updatedAt: '2026-01-24T10:15:00.825Z',
  number: 99493,
  __v: 0
};

describe('Тестируем слайс orderDetails (orderByNumber)', () => {
  // Тест 1: Проверка начального состояния
  test('Должен возвращать начальное состояние', () => {
    const state = orderByNumberReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  // Тест 2: Обработка pending
  test('Должен установить isLoading в true при pending', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = orderByNumberReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.order).toBeNull();
  });

  // Тест 3: Обработка fulfilled - сохраняет один заказ (TOrder)
  test('Должен установить данные заказа при fulfilled', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    };
    const state = orderByNumberReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  // Тест 4: Обработка rejected
  test('Должен установить ошибку при rejected', () => {
    const errorMessage = 'Ошибка сети';
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderByNumberReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.order).toBeNull();
  });

  // Тест 5: Обработка rejected с дефолтным сообщением
  test('Должен установить дефолтное сообщение при rejected без error.message', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: {}
    };
    const state = orderByNumberReducer(initialState, action);

    expect(state.error).toBe('Ошибка при загрузке заказа');
  });

  // Тест 6: Проверка неизвестного действия
  test('Должен возвращать текущее состояние при неизвестном действии', () => {
    const currentState: TOrderByNumberState = {
      ...initialState,
      isLoading: true,
      order: mockOrder
    };
    const action = { type: 'UNKNOWN_ACTION' };
    const state = orderByNumberReducer(currentState, action);

    expect(state).toEqual(currentState);
  });

  // Тест 7: Проверка сохранения состояния при других действиях
  test('Не должен изменять состояние при других действиях', () => {
    const currentState: TOrderByNumberState = {
      ...initialState,
      order: mockOrder
    };
    const action = { type: 'SOME_OTHER_ACTION' };
    const state = orderByNumberReducer(currentState, action);

    expect(state).toEqual(currentState);
  });
});

// Тесты для селекторов
describe('Тестируем селекторы orderDetails', () => {
  const rootState = {
    orderByNumber: {
      ...initialState,
      order: mockOrder,
      isLoading: false,
      error: null
    }
  };

  test('getOrderDetails должен возвращать order', () => {
    expect(getOrderDetails(rootState)).toEqual(mockOrder);
  });

  test('getOrderDetails должен возвращать null если заказа нет', () => {
    const stateWithoutOrder = {
      orderByNumber: {
        ...initialState,
        order: null
      }
    };
    expect(getOrderDetails(stateWithoutOrder)).toBeNull();
  });

  test('getOrderDetailsLoading должен возвращать isLoading', () => {
    expect(getOrderDetailsLoading(rootState)).toBe(false);
  });

  test('getOrderDetailsLoading должен возвращать true при загрузке', () => {
    const stateLoading = {
      orderByNumber: {
        ...initialState,
        isLoading: true
      }
    };
    expect(getOrderDetailsLoading(stateLoading)).toBe(true);
  });

  test('getOrderDetailsError должен возвращать error', () => {
    expect(getOrderDetailsError(rootState)).toBeNull();
  });

  test('getOrderDetailsError должен возвращать ошибку если она есть', () => {
    const stateWithError = {
      orderByNumber: {
        ...initialState,
        error: 'Test error'
      }
    };
    expect(getOrderDetailsError(stateWithError)).toBe('Test error');
  });
});

// Edge cases
describe('Edge cases для слайса orderDetails', () => {
  test('Должен корректно обрабатывать fulfilled с undefined (пустой массив заказов)', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: undefined
    };
    const state = orderByNumberReducer(initialState, action);

    expect(state.order).toBeUndefined();
    expect(state.isLoading).toBe(false);
  });

  test('Должен очищать ошибку при новом запросе (pending)', () => {
    const stateWithError: TOrderByNumberState = {
      ...initialState,
      error: 'Предыдущая ошибка',
      isLoading: false
    };

    const action = { type: fetchOrderByNumber.pending.type };
    const state = orderByNumberReducer(stateWithError, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.order).toBeNull();
  });

  // Тест на экшен clearOrder
  test('Должен очищать заказ и ошибку при экшене clearOrder', () => {
    const stateWithOrderAndError: TOrderByNumberState = {
      ...initialState,
      order: mockOrder,
      error: 'Ошибка',
      isLoading: false
    };

    const action = { type: 'orderByNumber/clearOrder' };
    const state = orderByNumberReducer(stateWithOrderAndError, action);

    expect(state.order).toBeNull();
    expect(state.error).toBeNull();
  });
});

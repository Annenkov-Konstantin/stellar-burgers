import { describe, test, expect } from '@jest/globals';
import feedsReducer, {
  getFeeds,
  feedInitialState,
  getOrders,
  getFeedsIsLoading,
  getFeedsIsRequested,
  getTotal,
  getTotalToday,
  getFeedOrderByNumber
} from '../services/slices/feeds';

const mockOrdersData = {
  success: true,
  orders: [
    {
      _id: '697477dfa64177001b3286cb',
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e'],
      status: 'done',
      name: 'Флюоресцентный бургер',
      createdAt: '2026-01-24T07:42:23.159Z',
      updatedAt: '2026-01-24T07:42:23.370Z',
      number: 99489
    },
    {
      _id: '697474d9a64177001b3286c4',
      ingredients: ['643d69a5c3f7b9001cfa093c'],
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2026-01-24T07:29:29.711Z',
      updatedAt: '2026-01-24T07:29:29.912Z',
      number: 99488
    }
  ],
  total: 23483,
  totalToday: 61
};

describe('Тестируем слайс получения заказов', () => {
  // Тест 1: Проверка начального состояния
  test('Должен возвращать начальное состояние', () => {
    const state = feedsReducer(undefined, { type: '' });
    expect(state).toEqual(feedInitialState);
  });

  // Тест 2: Обработка pending (начало загрузки)
  test('Должен установить feedsIsLoading в true при pending', () => {
    const action = { type: getFeeds.pending.type };
    const state = feedsReducer(feedInitialState, action);

    expect(state.feedsIsLoading).toBe(true);
    expect(state.feedsIsRequested).toBe(false);
    expect(state.error).toBeNull();
  });

  // Тест 3: Обработка fulfilled (успешная загрузка)
  test('Должен установить данные заказов при fulfilled', () => {
    const action = {
      type: getFeeds.fulfilled.type,
      payload: mockOrdersData
    };
    const state = feedsReducer(feedInitialState, action);

    expect(state.feedsIsLoading).toBe(false);
    expect(state.feedsIsRequested).toBe(true);
    expect(state.orders).toEqual(mockOrdersData.orders);
    expect(state.total).toBe(mockOrdersData.total);
    expect(state.totalToday).toBe(mockOrdersData.totalToday);
    expect(state.error).toBeNull();
  });

  // Тест 4: Обработка rejected (ошибка загрузки)
  test('Должен установить ошибку при rejected', () => {
    const errorMessage = 'Ошибка сети';
    const action = {
      type: getFeeds.rejected.type,
      error: { message: errorMessage }
    };
    const state = feedsReducer(feedInitialState, action);

    expect(state.feedsIsLoading).toBe(false);
    expect(state.feedsIsRequested).toBe(true);
    expect(state.error).toBe(errorMessage);
    // Проверяем, что данные не изменились
    expect(state.orders).toEqual(feedInitialState.orders);
    expect(state.total).toBe(feedInitialState.total);
  });

  // Тест 5: Обработка rejected с дефолтным сообщением
  test('Должен установить дефолтное сообщение при rejected без error.message', () => {
    const action = {
      type: getFeeds.rejected.type,
      error: {}
    };
    const state = feedsReducer(feedInitialState, action);

    expect(state.error).toBe('Ошибка при загрузке заказов');
  });

  // Тест 6: Проверка селекторов
  describe('Тестируем селекторы', () => {
    // Создаем полное состояние стора с ключом feeds
    const rootState = {
      feeds: {
        ...feedInitialState,
        orders: mockOrdersData.orders,
        total: mockOrdersData.total,
        totalToday: mockOrdersData.totalToday,
        feedsIsLoading: false,
        feedsIsRequested: true,
        error: null
      }
    };

    test('getOrders должен возвращать orders', () => {
      expect(getOrders(rootState)).toEqual(mockOrdersData.orders);
    });

    test('getFeedsIsLoading должен возвращать feedsIsLoading', () => {
      expect(getFeedsIsLoading(rootState)).toBe(false);
    });

    test('getFeedsIsRequested должен возвращать feedsIsRequested', () => {
      expect(getFeedsIsRequested(rootState)).toBe(true);
    });

    test('getTotal должен возвращать total', () => {
      expect(getTotal(rootState)).toBe(mockOrdersData.total);
    });

    test('getTotalToday должен возвращать totalToday', () => {
      expect(getTotalToday(rootState)).toBe(mockOrdersData.totalToday);
    });

    test('getFeedOrderByNumber должен находить заказ по номеру', () => {
      const order = getFeedOrderByNumber(rootState)('99489');
      expect(order).toEqual(mockOrdersData.orders[0]);
    });

    test('getFeedOrderByNumber должен возвращать undefined если заказ не найден', () => {
      const order = getFeedOrderByNumber(rootState)('99999');
      expect(order).toBeUndefined();
    });

    test('getFeedOrderByNumber должен правильно преобразовывать строку в число', () => {
      const order = getFeedOrderByNumber(rootState)('99488');
      expect(order).toEqual(mockOrdersData.orders[1]);
    });
  });

  // Тест 7: Проверка неизвестного действия
  test('Должен возвращать текущее состояние при неизвестном действии', () => {
    const currentState = { ...feedInitialState, feedsIsLoading: true };
    const action = { type: 'UNKNOWN_ACTION' };
    const state = feedsReducer(currentState, action);

    expect(state).toEqual(currentState);
  });

  // Тест 8: Проверка сохранения состояния при других действиях
  test('Не должен изменять состояние при других действиях', () => {
    const currentState = {
      ...feedInitialState,
      orders: mockOrdersData.orders,
      feedsIsRequested: true
    };
    const action = { type: 'SOME_OTHER_ACTION' };
    const state = feedsReducer(currentState, action);

    expect(state).toEqual(currentState);
  });
});

// Дополнительные тесты для проверки edge cases
describe('Edge cases для слайса feeds', () => {
  test('Должен корректно обрабатывать fulfilled с пустыми данными', () => {
    const emptyData = {
      success: true,
      orders: [],
      total: 0,
      totalToday: 0
    };

    const action = {
      type: getFeeds.fulfilled.type,
      payload: emptyData
    };
    const state = feedsReducer(feedInitialState, action);

    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
    expect(state.feedsIsLoading).toBe(false);
    expect(state.feedsIsRequested).toBe(true);
  });

  test('Должен корректно обрабатывать pending после предыдущей ошибки', () => {
    const stateWithError = {
      ...feedInitialState,
      error: 'Предыдущая ошибка',
      feedsIsRequested: true
    };

    const action = { type: getFeeds.pending.type };
    const state = feedsReducer(stateWithError, action);

    expect(state.feedsIsLoading).toBe(true);
    expect(state.feedsIsRequested).toBe(true); // Остается true
    expect(state.error).toBeNull(); // Ошибка сбрасывается
  });
});

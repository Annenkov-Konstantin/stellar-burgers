import { describe, test, expect } from '@jest/globals';
import userOrdersReducer, {
  fetchUserOrders,
  TUserOrdersState,
  initialState,
  clearUserOrders,
  addUserOrder,
  getUserOrders,
  getUserOrdersLoading,
  getUserOrdersError,
  getUserOrderByNumber
} from '../services/slices/userOrders';

// Mock данные для тестов - полный ответ API
const mockApiResponse = {
  success: true,
  orders: [
    {
      _id: '1',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2026-01-24T10:00:00.000Z',
      updatedAt: '2026-01-24T10:00:00.000Z',
      number: 10001
    },
    {
      _id: '2',
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0942'],
      status: 'pending',
      name: 'Флюоресцентный бургер',
      createdAt: '2026-01-24T11:00:00.000Z', // Более поздняя дата
      updatedAt: '2026-01-24T11:00:00.000Z',
      number: 10002
    },
    {
      _id: '3',
      ingredients: ['643d69a5c3f7b9001cfa093e', '643d69a5c3f7b9001cfa0943'],
      status: 'done',
      name: 'Space бургер',
      createdAt: '2026-01-24T09:00:00.000Z', // Более ранняя дата
      updatedAt: '2026-01-24T09:00:00.000Z',
      number: 10003
    }
  ],
  total: 23498,
  totalToday: 52
};

const mockNewOrder = {
  _id: '4',
  ingredients: ['643d69a5c3f7b9001cfa093f', '643d69a5c3f7b9001cfa0944'],
  status: 'created',
  name: 'Новый бургер',
  createdAt: '2026-01-24T12:00:00.000Z',
  updatedAt: '2026-01-24T12:00:00.000Z',
  number: 10004
};

describe('Тестируем слайс userOrders', () => {
  // Тест 1: Проверка начального состояния
  test('Должен возвращать начальное состояние', () => {
    const state = userOrdersReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  // Тест 2: Синхронные экшены
  describe('Тестируем синхронные экшены', () => {
    test('Должен очистить заказы и ошибку при clearUserOrders', () => {
      const stateWithData: TUserOrdersState = {
        ...initialState,
        orders: mockApiResponse.orders,
        error: 'Some error',
        isLoading: false
      };

      const action = clearUserOrders();
      const state = userOrdersReducer(stateWithData, action);

      expect(state.orders).toEqual([]);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false); // isLoading не меняется
    });

    test('Должен добавить заказ в начало при addUserOrder', () => {
      const stateWithOrders: TUserOrdersState = {
        ...initialState,
        orders: [mockApiResponse.orders[0], mockApiResponse.orders[1]]
      };

      const action = addUserOrder(mockNewOrder);
      const state = userOrdersReducer(stateWithOrders, action);

      expect(state.orders).toHaveLength(3);
      expect(state.orders[0]).toEqual(mockNewOrder); // Новый заказ в начале
      expect(state.orders[1]).toEqual(mockApiResponse.orders[0]); // Старый первый заказ теперь второй
      expect(state.orders[2]).toEqual(mockApiResponse.orders[1]); // Старый второй заказ теперь третий
    });

    test('Должен корректно добавить заказ в пустой массив', () => {
      const action = addUserOrder(mockNewOrder);
      const state = userOrdersReducer(initialState, action);

      expect(state.orders).toHaveLength(1);
      expect(state.orders[0]).toEqual(mockNewOrder);
    });
  });

  // Тест 3: Асинхронный экшен fetchUserOrders
  describe('Тестируем fetchUserOrders', () => {
    test('Должен установить isLoading в true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = userOrdersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить заказы и отсортировать их по дате при fulfilled', () => {
      // Создаем копию данных, чтобы не мутировать оригинальный массив
      const testOrders = [...mockApiResponse.orders];

      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: testOrders
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();

      // Проверяем, что заказы отсортированы по убыванию даты (от новых к старым)
      expect(state.orders).toHaveLength(3);
      // Самый поздний (11:00) должен быть первым
      expect(state.orders[0]._id).toBe('2');
      expect(state.orders[0].number).toBe(10002);
      // Средний (10:00) - вторым
      expect(state.orders[1]._id).toBe('1');
      expect(state.orders[1].number).toBe(10001);
      // Самый ранний (09:00) - третьим
      expect(state.orders[2]._id).toBe('3');
      expect(state.orders[2].number).toBe(10003);
    });

    test('Должен обработать пустой массив заказов при fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: []
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.error).toBeNull();
    });

    test('Должен установить ошибку при rejected', () => {
      const errorMessage = 'Ошибка сети';
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });

    test('Должен установить дефолтное сообщение при rejected без error.message', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: {}
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.error).toBe('Ошибка загрузки заказов');
    });
  });

  // Тест 4: Проверка неизвестного действия
  test('Должен возвращать текущее состояние при неизвестном действии', () => {
    const currentState: TUserOrdersState = {
      ...initialState,
      orders: [mockApiResponse.orders[0]],
      isLoading: true
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const state = userOrdersReducer(currentState, action);

    expect(state).toEqual(currentState);
  });

  // Тест 5: Проверка сохранения состояния при других действиях
  test('Не должен изменять состояние при других действиях', () => {
    const currentState: TUserOrdersState = {
      ...initialState,
      orders: mockApiResponse.orders,
      isLoading: false,
      error: null
    };

    const action = { type: 'SOME_OTHER_ACTION' };
    const state = userOrdersReducer(currentState, action);

    expect(state).toEqual(currentState);
  });
});

// Тесты для селекторов
describe('Тестируем селекторы слайса userOrders', () => {
  // Используем отдельные данные для селекторов, чтобы избежать мутации
  const ordersForSelectors = [
    {
      _id: '1',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2026-01-24T10:00:00.000Z',
      updatedAt: '2026-01-24T10:00:00.000Z',
      number: 10001
    },
    {
      _id: '2',
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0942'],
      status: 'pending',
      name: 'Флюоресцентный бургер',
      createdAt: '2026-01-24T11:00:00.000Z',
      updatedAt: '2026-01-24T11:00:00.000Z',
      number: 10002
    },
    {
      _id: '3',
      ingredients: ['643d69a5c3f7b9001cfa093e', '643d69a5c3f7b9001cfa0943'],
      status: 'done',
      name: 'Space бургер',
      createdAt: '2026-01-24T09:00:00.000Z',
      updatedAt: '2026-01-24T09:00:00.000Z',
      number: 10003
    }
  ];

  const rootState = {
    userOrders: {
      ...initialState,
      orders: ordersForSelectors,
      isLoading: false,
      error: null
    }
  };

  test('getUserOrders должен возвращать orders', () => {
    expect(getUserOrders(rootState)).toEqual(ordersForSelectors);
  });

  test('getUserOrdersLoading должен возвращать isLoading', () => {
    expect(getUserOrdersLoading(rootState)).toBe(false);
  });

  test('getUserOrdersLoading должен возвращать true при загрузке', () => {
    const stateLoading = {
      userOrders: {
        ...initialState,
        isLoading: true
      }
    };
    expect(getUserOrdersLoading(stateLoading)).toBe(true);
  });

  test('getUserOrdersError должен возвращать error', () => {
    expect(getUserOrdersError(rootState)).toBeNull();
  });

  test('getUserOrdersError должен возвращать ошибку если она есть', () => {
    const stateWithError = {
      userOrders: {
        ...initialState,
        error: 'Test error'
      }
    };
    expect(getUserOrdersError(stateWithError)).toBe('Test error');
  });

  test('getUserOrderByNumber должен находить заказ по номеру', () => {
    const order = getUserOrderByNumber(rootState)('10002');
    expect(order).toEqual(ordersForSelectors[1]);
  });

  test('getUserOrderByNumber должен возвращать undefined если заказ не найден', () => {
    const order = getUserOrderByNumber(rootState)('99999');
    expect(order).toBeUndefined();
  });

  test('getUserOrderByNumber должен правильно преобразовывать строку в число', () => {
    const order = getUserOrderByNumber(rootState)('10001');
    expect(order).toEqual(ordersForSelectors[0]);
  });
});

// Edge cases
describe('Edge cases для слайса userOrders', () => {
  test('Должен очищать ошибку при новом запросе (pending)', () => {
    const stateWithError: TUserOrdersState = {
      ...initialState,
      error: 'Предыдущая ошибка',
      isLoading: false
    };

    const action = { type: fetchUserOrders.pending.type };
    const state = userOrdersReducer(stateWithError, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull(); // Ошибка очищается
  });

  test('Должен очищать ошибку при clearUserOrders но сохранять isLoading', () => {
    const stateWithErrorAndLoading: TUserOrdersState = {
      ...initialState,
      orders: mockApiResponse.orders,
      error: 'Some error',
      isLoading: true
    };

    const action = clearUserOrders();
    const state = userOrdersReducer(stateWithErrorAndLoading, action);

    expect(state.orders).toEqual([]);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true); // isLoading сохраняется
  });

  test('Должен корректно сортировать заказы при fulfilled (обратный хронологический порядок)', () => {
    const unsortedOrders = [
      {
        _id: '1',
        ingredients: [],
        status: 'done',
        name: 'Самый старый',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        number: 1
      },
      {
        _id: '2',
        ingredients: [],
        status: 'done',
        name: 'Средний',
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
        number: 2
      },
      {
        _id: '3',
        ingredients: [],
        status: 'done',
        name: 'Самый новый',
        createdAt: '2026-01-03T00:00:00.000Z',
        updatedAt: '2026-01-03T00:00:00.000Z',
        number: 3
      }
    ];

    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: unsortedOrders
    };
    const state = userOrdersReducer(initialState, action);

    // Должны быть отсортированы от новых к старым
    expect(state.orders[0].number).toBe(3); // Самый новый
    expect(state.orders[1].number).toBe(2); // Средний
    expect(state.orders[2].number).toBe(1); // Самый старый
  });

  test('Должен корректно обрабатывать addUserOrder при наличии ошибки', () => {
    const stateWithError: TUserOrdersState = {
      ...initialState,
      orders: [mockApiResponse.orders[0]],
      error: 'Some error'
    };

    const action = addUserOrder(mockNewOrder);
    const state = userOrdersReducer(stateWithError, action);

    expect(state.orders).toHaveLength(2);
    expect(state.orders[0]).toEqual(mockNewOrder);
    expect(state.error).toBe('Some error'); // Ошибка не очищается
  });

  test('Должен корректно обрабатывать addUserOrder при isLoading = true', () => {
    const stateLoading: TUserOrdersState = {
      ...initialState,
      orders: [mockApiResponse.orders[0]],
      isLoading: true
    };

    const action = addUserOrder(mockNewOrder);
    const state = userOrdersReducer(stateLoading, action);

    expect(state.orders).toHaveLength(2);
    expect(state.isLoading).toBe(true); // isLoading сохраняется
  });
});

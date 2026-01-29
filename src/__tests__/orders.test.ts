import { describe, test, expect } from '@jest/globals';
import orderReducer, {
  OrderActions,
  orderBurger,
  initialOrdersState,
  initOrder,
  changeOrder,
  reorderIngredients,
  removeIngredientByUniqueId,
  resetOrderModal,
  getIngredientsInOrder,
  getIngredientsIds,
  getIsOrderSending,
  getOrdersId,
  getDasOrderSent,
  getOrderData,
  TOrderIngredient
} from '../services/slices/orders';

// Mock данные для тестов
const mockOrderResponse = {
  success: true,
  name: 'Био-марсианский фалленианский spicy краторный бургер',
  order: {
    number: 99503
  }
};

const mockErrorResponse = {
  success: false,
  name: '',
  order: { number: 0 }
};

// Тестовые ингредиенты
const mockIngredient1: TOrderIngredient = {
  id: '643d69a5c3f7b9001cfa093c',
  uniqueId: 'unique-1'
};

const mockIngredient2: TOrderIngredient = {
  id: '643d69a5c3f7b9001cfa0941',
  uniqueId: 'unique-2'
};

const mockIngredient3: TOrderIngredient = {
  id: '643d69a5c3f7b9001cfa0947',
  uniqueId: 'unique-3'
};

describe('Тестируем слайс order (burgerConstructor)', () => {
  // Тест 1: Проверка начального состояния
  test('Должен возвращать начальное состояние', () => {
    const state = orderReducer(undefined, { type: '' });
    expect(state).toEqual(initialOrdersState);
  });

  // Тест 2: Обработка экшена добавления ингредиента (initOrder)
  describe('Обработка экшена добавления ингредиента', () => {
    test('Должен добавить ингредиент при initOrder', () => {
      const action = initOrder({ id: 'test-id' });
      const state = orderReducer(initialOrdersState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('test-id');
      expect(state.ingredients[0].uniqueId).toBeDefined();
      expect(state._id).toBe('1');
      expect(state.status).toBe('creating');
      expect(state.createdAt).toBeDefined();
    });

    test('Должен инкрементировать _id при повторном initOrder', () => {
      const stateWithOrder = {
        ...initialOrdersState,
        _id: '5',
        ingredients: [mockIngredient1]
      };

      const action = initOrder({ id: 'new-id' });
      const state = orderReducer(stateWithOrder, action);

      expect(state._id).toBe('6');
      expect(state.ingredients).toHaveLength(2);
    });
  });

  // Тест 3: Обработка экшена добавления ингредиента (changeOrder)
  test('Должен добавить ингредиент при changeOrder', () => {
    const initialStateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1]
    };

    const action = changeOrder({ action: OrderActions.ADD, id: 'new-id' });
    const state = orderReducer(initialStateWithIngredients, action);

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[1].id).toBe('new-id');
    expect(state.ingredients[1].uniqueId).toBeDefined();
    expect(state.updatedAt).toBeDefined();
  });

  // Тест 4: Обработка экшена удаления ингредиента
  test('Должен удалить ингредиент по uniqueId', () => {
    const initialStateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
    };

    const action = removeIngredientByUniqueId({ uniqueId: 'unique-2' });
    const state = orderReducer(initialStateWithIngredients, action);

    expect(state.ingredients).toHaveLength(2);
    expect(
      state.ingredients.find((ing) => ing.uniqueId === 'unique-2')
    ).toBeUndefined();
    expect(state.ingredients[0].uniqueId).toBe('unique-1');
    expect(state.ingredients[1].uniqueId).toBe('unique-3');
    expect(state.updatedAt).toBeDefined();
  });

  // Тест 5: Обработка экшена изменения порядка ингредиентов
  describe('Обработка экшена изменения порядка ингредиентов', () => {
    test('Должен изменить порядок ингредиентов', () => {
      const initialStateWithIngredients = {
        ...initialOrdersState,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };

      const newOrder = [mockIngredient3, mockIngredient1, mockIngredient2];
      const action = reorderIngredients(newOrder);
      const state = orderReducer(initialStateWithIngredients, action);

      expect(state.ingredients).toEqual(newOrder);
      expect(state.ingredients[0].uniqueId).toBe('unique-3');
      expect(state.ingredients[1].uniqueId).toBe('unique-1');
      expect(state.ingredients[2].uniqueId).toBe('unique-2');
      expect(state.updatedAt).toBeDefined();
    });

    test('Должен корректно обработать пустой массив', () => {
      const initialStateWithIngredients = {
        ...initialOrdersState,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      const action = reorderIngredients([]);
      const state = orderReducer(initialStateWithIngredients, action);

      expect(state.ingredients).toEqual([]);
    });
  });

  // Тест 6: Обработка экшена resetOrderModal
  test('Должен сбросить модалку заказа', () => {
    const stateWithData = {
      ...initialOrdersState,
      number: 12345,
      orderHasSent: true,
      status: 'completed',
      name: 'Test Burger',
      error: 'Some error'
    };

    const action = resetOrderModal();
    const state = orderReducer(stateWithData, action);

    expect(state.number).toBe(0);
    expect(state.orderHasSent).toBe(false);
    expect(state.status).toBe('');
    expect(state.name).toBe('');
    expect(state.error).toBe('');
    // Другие поля не должны меняться
    expect(state._id).toBe(stateWithData._id);
    expect(state.ingredients).toEqual(stateWithData.ingredients);
  });

  // Тест 7: Асинхронный экшен - pending
  test('Должен установить orderIsSending в true при pending', () => {
    const action = { type: orderBurger.pending.type };
    const state = orderReducer(initialOrdersState, action);

    expect(state.orderIsSending).toBe(true);
    expect(state.status).toBe('sending');
    expect(state.error).toBe('');
  });

  // Тест 8: Асинхронный экшен - fulfilled (успех)
  test('Должен обработать успешный заказ при fulfilled', () => {
    const stateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1, mockIngredient2],
      orderIsSending: true,
      status: 'sending'
    };

    const action = {
      type: orderBurger.fulfilled.type,
      payload: mockOrderResponse
    };
    const state = orderReducer(stateWithIngredients, action);

    expect(state.orderIsSending).toBe(false);
    expect(state.orderHasSent).toBe(true);
    expect(state.status).toBe('completed');
    expect(state.name).toBe(mockOrderResponse.name);
    expect(state.number).toBe(mockOrderResponse.order.number);
    expect(state.ingredients).toEqual([]); // Ингредиенты должны очиститься
    expect(state.error).toBe('');
  });

  // Тест 9: Асинхронный экшен - fulfilled (неуспех)
  test('Должен обработать неуспешный заказ при fulfilled с success: false', () => {
    const stateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1],
      orderIsSending: true,
      status: 'sending'
    };

    const action = {
      type: orderBurger.fulfilled.type,
      payload: mockErrorResponse
    };
    const state = orderReducer(stateWithIngredients, action);

    expect(state.orderHasSent).toBe(true);
    expect(state.status).toBe('unsuccessful');
    expect(state.error).toBe('Order failed');
    // Ингредиенты не должны очищаться при неуспехе
    expect(state.ingredients).toEqual([mockIngredient1]);
  });

  // Тест 10: Асинхронный экшен - rejected
  test('Должен обработать ошибку при rejected', () => {
    const stateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1],
      orderIsSending: true,
      status: 'sending'
    };

    const errorMessage = 'Network Error';
    const action = {
      type: orderBurger.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(stateWithIngredients, action);

    expect(state.orderHasSent).toBe(true);
    expect(state.status).toBe('rejected');
    expect(state.error).toBe(errorMessage);
    // Ингредиенты не должны очищаться при ошибке
    expect(state.ingredients).toEqual([mockIngredient1]);
  });

  // Тест 11: Асинхронный экшен - rejected с дефолтным сообщением
  test('Должен установить дефолтное сообщение при rejected без error.message', () => {
    const action = {
      type: orderBurger.rejected.type,
      error: {}
    };
    const state = orderReducer(initialOrdersState, action);

    expect(state.error).toBe('Unknown error');
  });

  // Тест 12: Проверка неизвестного действия
  test('Должен возвращать текущее состояние при неизвестном действии', () => {
    const currentState = {
      ...initialOrdersState,
      ingredients: [mockIngredient1],
      orderIsSending: true
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const state = orderReducer(currentState, action);

    expect(state).toEqual(currentState);
  });
});

// Тесты для селекторов
describe('Тестируем селекторы слайса order', () => {
  const mockState = {
    order: {
      ...initialOrdersState,
      ingredients: [mockIngredient1, mockIngredient2, mockIngredient3],
      orderIsSending: true,
      orderHasSent: false,
      _id: 'test-id',
      status: 'creating',
      name: 'Test Burger',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      number: 123,
      error: ''
    }
  };

  test('getIngredientsInOrder должен возвращать ingredients', () => {
    expect(getIngredientsInOrder(mockState)).toEqual([
      mockIngredient1,
      mockIngredient2,
      mockIngredient3
    ]);
  });

  test('getIngredientsIds должен возвращать массив id ингредиентов', () => {
    expect(getIngredientsIds(mockState)).toEqual([
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0947'
    ]);
  });

  test('getIsOrderSending должен возвращать orderIsSending', () => {
    expect(getIsOrderSending(mockState)).toBe(true);
  });

  test('getOrdersId должен возвращать _id', () => {
    expect(getOrdersId(mockState)).toBe('test-id');
  });

  test('getDasOrderSent должен возвращать orderHasSent', () => {
    expect(getDasOrderSent(mockState)).toBe(false);
  });

  test('getOrderData должен возвравать все состояние', () => {
    expect(getOrderData(mockState)).toEqual(mockState.order);
  });
});

// Edge cases
describe('Edge cases для слайса order', () => {
  test('Должен корректно обрабатывать удаление несуществующего ингредиента', () => {
    const initialStateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1, mockIngredient2]
    };

    const action = removeIngredientByUniqueId({ uniqueId: 'non-existent' });
    const state = orderReducer(initialStateWithIngredients, action);

    expect(state.ingredients).toEqual([mockIngredient1, mockIngredient2]);
    expect(state.updatedAt).toBeDefined();
  });

  test('Должен корректно обрабатывать повторное добавление того же ингредиента', () => {
    const initialStateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1]
    };

    const action = changeOrder({
      action: OrderActions.ADD,
      id: mockIngredient1.id
    });
    const state = orderReducer(initialStateWithIngredients, action);

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0].id).toBe(mockIngredient1.id);
    expect(state.ingredients[1].id).toBe(mockIngredient1.id);
    expect(state.ingredients[0].uniqueId).not.toBe(
      state.ingredients[1].uniqueId
    );
  });

  test('Должен очищать ошибку при новом запросе (pending)', () => {
    const stateWithError = {
      ...initialOrdersState,
      error: 'Previous error',
      orderIsSending: false
    };

    const action = { type: orderBurger.pending.type };
    const state = orderReducer(stateWithError, action);

    expect(state.orderIsSending).toBe(true);
    expect(state.error).toBe('');
    expect(state.status).toBe('sending');
  });

  test('Должен сохранять ингредиенты при неуспешном заказе', () => {
    const stateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1, mockIngredient2],
      orderIsSending: true
    };

    const action = {
      type: orderBurger.fulfilled.type,
      payload: mockErrorResponse
    };
    const state = orderReducer(stateWithIngredients, action);

    expect(state.ingredients).toEqual([mockIngredient1, mockIngredient2]);
    expect(state.status).toBe('unsuccessful');
  });
  // Удаление из пустого конструктора
  test('Должен корректно обрабатывать удаление из пустого конструктора', () => {
    const action = removeIngredientByUniqueId({ uniqueId: 'non-existent' });
    const state = orderReducer(initialOrdersState, action);

    expect(state.ingredients).toEqual([]);
    expect(state.updatedAt).toBeDefined(); // updatedAt все равно обновляется
    expect(state.ingredients).toHaveLength(0);
  });

  // Попытка перемещения ингредиента с некорректными индексами
  test('Должен корректно обрабатывать массив с другим набором уникальных ID', () => {
    const initialStateWithIngredients = {
      ...initialOrdersState,
      ingredients: [mockIngredient1, mockIngredient2]
    };

    const differentIngredients = [
      { id: 'different-1', uniqueId: 'different-unique-1' },
      { id: 'different-2', uniqueId: 'different-unique-2' }
    ];

    const action = reorderIngredients(differentIngredients);
    const state = orderReducer(initialStateWithIngredients, action);

    // Должен заменить на новый массив, даже если uniqueId другие
    expect(state.ingredients).toEqual(differentIngredients);
    expect(state.updatedAt).toBeDefined();
  });
});

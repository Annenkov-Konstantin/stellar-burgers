import { describe, test, expect } from '@jest/globals';
import ingredientsReducer, {
  getIngredients,
  ingredientsInitialState,
  getIngredientsFromState,
  getIngredientsIsLoading,
  getIngredientsIsRequested,
  getIngredientsError
} from '../services/slices/ingredients';
import { TIngredient } from '../utils/types';

type TResponse = {
  __v: number;
};

// Mock данные для тестов
const mockIngredientsData: (TResponse & TIngredient)[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0
  }
];

describe('Тестируем слайс ingredients', () => {
  // Тест 1: Проверка начального состояния (инициализация rootReducer)
  test('Должен возвращать начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: '' });
    expect(state).toEqual(ingredientsInitialState);
  });

  // Тест 2: Обработка pending - isLoading меняется на true
  test('Должен установить ingredientsIsLoading в true при pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.ingredientsIsLoading).toBe(true);
    expect(state.ingredientsIsRequested).toBe(false);
    expect(state.error).toBeNull();
    expect(state.items).toEqual([]); // Данные не должны измениться
  });

  // Тест 3: Обработка fulfilled - данные записываются, isLoading меняется на false
  test('Должен установить данные ингредиентов при fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredientsData
    };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.ingredientsIsLoading).toBe(false);
    expect(state.ingredientsIsRequested).toBe(true);
    expect(state.items).toEqual(mockIngredientsData); // Данные записываются в store
    expect(state.error).toBeNull();
  });

  // Тест 4: Обработка rejected - ошибка записывается, isLoading меняется на false
  test('Должен установить ошибку при rejected', () => {
    const errorMessage = 'Ошибка сети';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.ingredientsIsLoading).toBe(false);
    expect(state.ingredientsIsRequested).toBe(true);
    expect(state.error).toBe(errorMessage); // Ошибка записывается в store
    expect(state.items).toEqual(ingredientsInitialState.items); // Данные не меняются
  });

  // Тест 5: Обработка rejected с дефолтным сообщением
  test('Должен установить дефолтное сообщение при rejected без error.message', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: {}
    };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.error).toBe('Unknown error'); // Дефолтное сообщение из слайса
  });

  // Тест 6: Проверка селекторов
  describe('Тестируем селекторы ingredients', () => {
    // Создаем полное состояние стора с ключом ingredients
    const rootState = {
      ingredients: {
        ...ingredientsInitialState,
        items: mockIngredientsData,
        ingredientsIsLoading: false,
        ingredientsIsRequested: true,
        error: null
      }
    };

    test('getIngredientsFromState должен возвращать items', () => {
      expect(getIngredientsFromState(rootState)).toEqual(mockIngredientsData);
    });

    test('getIngredientsIsLoading должен возвращать ingredientsIsLoading', () => {
      expect(getIngredientsIsLoading(rootState)).toBe(false);
    });

    test('getIngredientsIsRequested должен возвращать ingredientsIsRequested', () => {
      expect(getIngredientsIsRequested(rootState)).toBe(true);
    });

    test('getIngredientsError должен возвращать error', () => {
      expect(getIngredientsError(rootState)).toBeNull();
    });

    test('getIngredientsError должен возвращать ошибку если она есть', () => {
      const stateWithError = {
        ingredients: {
          ...ingredientsInitialState,
          error: 'Test error'
        }
      };
      expect(getIngredientsError(stateWithError)).toBe('Test error');
    });
  });

  // Тест 7: Проверка неизвестного действия
  test('Должен возвращать текущее состояние при неизвестном действии', () => {
    const currentState = {
      ...ingredientsInitialState,
      ingredientsIsLoading: true
    };
    const action = { type: 'UNKNOWN_ACTION' };
    const state = ingredientsReducer(currentState, action);

    expect(state).toEqual(currentState);
  });

  // Тест 8: Проверка сохранения состояния при других действиях
  test('Не должен изменять состояние при других действиях', () => {
    const currentState = {
      ...ingredientsInitialState,
      items: mockIngredientsData,
      ingredientsIsRequested: true
    };
    const action = { type: 'SOME_OTHER_ACTION' };
    const state = ingredientsReducer(currentState, action);

    expect(state).toEqual(currentState);
  });
});

// Дополнительные тесты для проверки edge cases
describe('Edge cases для слайса ingredients', () => {
  test('Должен корректно обрабатывать fulfilled с пустыми данными', () => {
    const emptyData: TIngredient[] = [];

    const action = {
      type: getIngredients.fulfilled.type,
      payload: emptyData
    };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.items).toEqual([]);
    expect(state.ingredientsIsLoading).toBe(false);
    expect(state.ingredientsIsRequested).toBe(true);
  });

  test('Должен корректно обрабатывать pending после предыдущей ошибки', () => {
    const stateWithError = {
      ...ingredientsInitialState,
      error: 'Предыдущая ошибка',
      ingredientsIsRequested: true
    };

    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(stateWithError, action);

    expect(state.ingredientsIsLoading).toBe(true);
    expect(state.ingredientsIsRequested).toBe(true); // Остается true
  });
});

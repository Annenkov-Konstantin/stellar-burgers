import { describe, test, expect } from '@jest/globals';
import userReducer, {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUser,
  updateUser,
  logoutUser,
  initialState,
  authChecked,
  clearError,
  resetPasswordStatus,
  forgotPasswordStatus,
  getUserData,
  isAuthChecked,
  getUserLoading,
  getUserError,
  getForgotPasswordStatus,
  getResetPasswordStatus,
  TUserState
} from '../services/slices/user';

// Mock данные для тестов
const mockUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockApiResponse = {
  success: true,
  message: 'Success'
};

describe('Тестируем слайс user', () => {
  // Тест 1: Проверка начального состояния
  test('Должен возвращать начальное состояние', () => {
    const state = userReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  // Тест 2: Синхронные экшены
  describe('Тестируем синхронные экшены', () => {
    test('Должен установить isAuthChecked в true при authChecked', () => {
      const action = authChecked();
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    test('Должен очистить ошибку при clearError', () => {
      const stateWithError: TUserState = {
        ...initialState,
        error: 'Some error'
      };

      const action = clearError();
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    test('Должен сбросить статусы resetPassword при resetPasswordStatus', () => {
      const stateWithStatus: TUserState = {
        ...initialState,
        resetPasswordSuccess: true,
        resetPasswordRequest: true
      };

      const action = resetPasswordStatus();
      const state = userReducer(stateWithStatus, action);

      expect(state.resetPasswordSuccess).toBe(false);
      expect(state.resetPasswordRequest).toBe(false);
    });

    test('Должен сбросить статусы forgotPassword при forgotPasswordStatus', () => {
      const stateWithStatus: TUserState = {
        ...initialState,
        forgotPasswordSuccess: true,
        forgotPasswordRequest: true
      };

      const action = forgotPasswordStatus();
      const state = userReducer(stateWithStatus, action);

      expect(state.forgotPasswordSuccess).toBe(false);
      expect(state.forgotPasswordRequest).toBe(false);
    });
  });

  // Тест 3: Асинхронный экшен registerUser
  describe('Тестируем registerUser', () => {
    test('Должен установить isLoading в true при pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить пользователя и isAuthChecked при fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить ошибку при rejected', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });

  // Тест 4: Асинхронный экшен loginUser
  describe('Тестируем loginUser', () => {
    test('Должен установить isLoading в true при pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить пользователя и isAuthChecked при fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить ошибку при rejected', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });

  // Тест 5: Асинхронный экшен forgotPassword
  describe('Тестируем forgotPassword', () => {
    test('Должен установить forgotPasswordRequest в true при pending', () => {
      const action = { type: forgotPassword.pending.type };
      const state = userReducer(initialState, action);

      expect(state.forgotPasswordRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить forgotPasswordSuccess в true при fulfilled', () => {
      const action = {
        type: forgotPassword.fulfilled.type,
        payload: mockApiResponse
      };
      const state = userReducer(initialState, action);

      expect(state.forgotPasswordRequest).toBe(false);
      expect(state.forgotPasswordSuccess).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить ошибку при rejected', () => {
      const errorMessage = 'Forgot password failed';
      const action = {
        type: forgotPassword.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.forgotPasswordRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  // Тест 6: Асинхронный экшен resetPassword
  describe('Тестируем resetPassword', () => {
    test('Должен установить resetPasswordRequest в true при pending', () => {
      const action = { type: resetPassword.pending.type };
      const state = userReducer(initialState, action);

      expect(state.resetPasswordRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить resetPasswordSuccess в true при fulfilled', () => {
      const action = {
        type: resetPassword.fulfilled.type,
        payload: mockApiResponse
      };
      const state = userReducer(initialState, action);

      expect(state.resetPasswordRequest).toBe(false);
      expect(state.resetPasswordSuccess).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить ошибку при rejected', () => {
      const errorMessage = 'Reset password failed';
      const action = {
        type: resetPassword.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.resetPasswordRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  // Тест 7: Асинхронный экшен getUser
  describe('Тестируем getUser', () => {
    test('Должен установить isLoading в true при pending', () => {
      const action = { type: getUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить пользователя и isAuthChecked при fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен установить ошибку и isAuthChecked при rejected', () => {
      const errorMessage = 'Get user failed';
      const action = {
        type: getUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  // Тест 8: Асинхронный экшен updateUser
  describe('Тестируем updateUser', () => {
    test('Должен установить isLoading в true при pending', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен обновить пользователя при fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const stateWithUser: TUserState = {
        ...initialState,
        user: mockUser
      };

      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(updatedUser);
      expect(state.error).toBeNull();
    });

    test('Должен установить ошибку при rejected', () => {
      const errorMessage = 'Update user failed';
      const action = {
        type: updateUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  // Тест 9: Асинхронный экшен logoutUser
  describe('Тестируем logoutUser', () => {
    test('Должен установить isLoading в true при pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Должен очистить пользователя при fulfilled', () => {
      const stateWithUser: TUserState = {
        ...initialState,
        user: mockUser
      };

      const action = {
        type: logoutUser.fulfilled.type,
        payload: mockApiResponse
      };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });

    test('Должен очистить пользователя и установить ошибку при rejected', () => {
      const errorMessage = 'Logout failed';
      const stateWithUser: TUserState = {
        ...initialState,
        user: mockUser
      };

      const action = {
        type: logoutUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe(errorMessage);
    });
  });

  // Тест 10: Проверка неизвестного действия
  test('Должен возвращать текущее состояние при неизвестном действии', () => {
    const currentState: TUserState = {
      ...initialState,
      user: mockUser,
      isLoading: true
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const state = userReducer(currentState, action);

    expect(state).toEqual(currentState);
  });
});

// Тесты для селекторов
describe('Тестируем селекторы слайса user', () => {
  const mockState = {
    user: {
      ...initialState,
      user: mockUser,
      isAuthChecked: true,
      isLoading: false,
      error: null,
      forgotPasswordRequest: false,
      forgotPasswordSuccess: true,
      resetPasswordRequest: false,
      resetPasswordSuccess: false
    }
  };

  test('getUserData должен возвращать user', () => {
    expect(getUserData(mockState)).toEqual(mockUser);
  });

  test('isAuthChecked должен возвращать isAuthChecked', () => {
    expect(isAuthChecked(mockState)).toBe(true);
  });

  test('getUserLoading должен возвращать isLoading', () => {
    expect(getUserLoading(mockState)).toBe(false);
  });

  test('getUserError должен возвращать error', () => {
    expect(getUserError(mockState)).toBeNull();
  });

  test('getUserError должен возвращать ошибку если она есть', () => {
    const stateWithError = {
      user: {
        ...initialState,
        error: 'Test error'
      }
    };
    expect(getUserError(stateWithError)).toBe('Test error');
  });

  test('getForgotPasswordStatus должен возвращать статус forgotPassword', () => {
    expect(getForgotPasswordStatus(mockState)).toEqual({
      request: false,
      success: true
    });
  });

  test('getResetPasswordStatus должен возвращать статус resetPassword', () => {
    expect(getResetPasswordStatus(mockState)).toEqual({
      request: false,
      success: false
    });
  });
});

// Edge cases
describe('Edge cases для слайса user', () => {
  test('Должен корректно обрабатывать pending после предыдущей ошибки (очистка ошибки)', () => {
    const stateWithError: TUserState = {
      ...initialState,
      error: 'Previous error',
      isLoading: false
    };

    const action = { type: registerUser.pending.type };
    const state = userReducer(stateWithError, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull(); // Ошибка должна очиститься
  });

  test('Должен сохранять другие поля при обновлении пользователя', () => {
    const stateWithAllFields: TUserState = {
      ...initialState,
      user: mockUser,
      isAuthChecked: true,
      forgotPasswordSuccess: true,
      resetPasswordSuccess: false
    };

    const updatedUser = { ...mockUser, name: 'Updated Name' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    };
    const state = userReducer(stateWithAllFields, action);

    expect(state.user).toEqual(updatedUser);
    expect(state.isAuthChecked).toBe(true); // Сохраняется
    expect(state.forgotPasswordSuccess).toBe(true); // Сохраняется
    expect(state.resetPasswordSuccess).toBe(false); // Сохраняется
  });

  test('Должен устанавливать дефолтные сообщения об ошибке при rejected без error.message', () => {
    // registerUser
    const action1 = { type: registerUser.rejected.type, error: {} };
    const state1 = userReducer(initialState, action1);
    expect(state1.error).toBe('Registration failed');

    // loginUser
    const action2 = { type: loginUser.rejected.type, error: {} };
    const state2 = userReducer(initialState, action2);
    expect(state2.error).toBe('Login failed');

    // forgotPassword
    const action3 = { type: forgotPassword.rejected.type, error: {} };
    const state3 = userReducer(initialState, action3);
    expect(state3.error).toBe('Forgot password request failed');

    // resetPassword
    const action4 = { type: resetPassword.rejected.type, error: {} };
    const state4 = userReducer(initialState, action4);
    expect(state4.error).toBe('Password reset failed');

    // getUser
    const action5 = { type: getUser.rejected.type, error: {} };
    const state5 = userReducer(initialState, action5);
    expect(state5.error).toBe('Failed to get user data');

    // updateUser
    const action6 = { type: updateUser.rejected.type, error: {} };
    const state6 = userReducer(initialState, action6);
    expect(state6.error).toBe('Failed to update user data');

    // logoutUser
    const action7 = { type: logoutUser.rejected.type, error: {} };
    const state7 = userReducer(initialState, action7);
    expect(state7.error).toBe('Logout failed');
  });

  test('Должен очищать ошибку при clearError даже если есть другие данные', () => {
    const stateWithDataAndError: TUserState = {
      ...initialState,
      user: mockUser,
      isAuthChecked: true,
      error: 'Some error',
      forgotPasswordSuccess: true
    };

    const action = clearError();
    const state = userReducer(stateWithDataAndError, action);

    expect(state.error).toBeNull();
    expect(state.user).toEqual(mockUser); // Пользователь остается
    expect(state.isAuthChecked).toBe(true); // Статус остается
    expect(state.forgotPasswordSuccess).toBe(true); // Статус остается
  });
});

export const validators = {
  // email
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  // Минимальная длина
  minLength:
    (min: number) =>
    (value: string): boolean =>
      value.length >= min,

  // Обязательное поле
  required: (value: string): boolean => value.trim() !== '',

  // Только буквы и пробелы (для имени)
  onlyLetters: (value: string): boolean => {
    const lettersRegex = /^[A-Za-zА-Яа-я\s]+$/;
    return lettersRegex.test(value);
  },

  // Пароль: минимум 6 символов, как минимум одна буква и одна цифра
  password: (value: string): boolean => {
    // Минимум 6 символов
    if (value.length < 6) return false;

    // Содержит хотя бы одну букву
    if (!/[a-zA-Z]/.test(value)) return false;

    // Содержит хотя бы одну цифру
    if (!/\d/.test(value)) return false;

    return true;
  },

  // Базовый пароль (только минимальная длина) - для случаев, когда нужна только проверка длины
  basicPassword: (value: string): boolean => value.length >= 6,

  // Пароль минимум 5 символов (буквы и цифры)
  passwordMin5: (value: string): boolean => {
    if (value.length < 5) return false;

    // Должен содержать хотя бы одну букву и одну цифру
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasDigit = /\d/.test(value);

    return hasLetter && hasDigit;
  }
};

// Типы для ошибок валидации
export type ValidationErrors = {
  [key: string]: string;
};

// Функция для получения сообщений об ошибках
export const getValidationErrors = (field: string, value: string): string => {
  switch (field) {
    case 'name':
      if (!value) return 'Имя обязательно';
      if (!validators.onlyLetters(value))
        return 'Имя может содержать только буквы';
      return '';

    case 'email':
      if (!value) return 'Email обязателен';
      if (!validators.email(value)) return 'Некорректный формат email';
      return '';

    case 'password':
      if (value && !validators.passwordMin5(value)) {
        return 'Пароль должен содержать минимум 5 символов, включая буквы и цифры';
      }
      return '';

    case 'token':
      if (!value) return 'Код из письма обязателен';
      return '';

    default:
      return '';
  }
};

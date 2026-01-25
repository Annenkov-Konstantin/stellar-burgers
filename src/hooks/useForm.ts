import { useState, useCallback, useMemo } from 'react';
import { getValidationErrors, ValidationErrors } from '../utils/validators';

export const useForm = <T extends Record<string, string>>(
  initialValues: T,
  validationRules?: Partial<{ [K in keyof T]: (value: T[K]) => boolean }>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev: T) => ({
        ...prev,
        [name]: value
      }));

      if (validationRules?.[name]) {
        const isValid = validationRules[name]!(value);
        setErrors((prev: ValidationErrors) => ({
          ...prev,
          [name]: isValid ? '' : getValidationErrors(name as string, value)
        }));
      }
    },
    [validationRules]
  );

  const setters = useMemo(() => {
    const result: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    Object.keys(initialValues).forEach((key) => {
      const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
      result[setterName] = useCallback(
        (value: string) => setValue(key as keyof T, value as T[keyof T]),
        [setValue]
      );
    });

    return result;
  }, [initialValues, setValue]);

  const isValid = useMemo(
    () =>
      Object.values(errors).every((error) => !error) &&
      Object.values(values).every((value) => value.trim() !== ''),
    [errors, values]
  );

  return {
    values,
    errors,
    isValid,
    setValue,
    ...setters
  };
};

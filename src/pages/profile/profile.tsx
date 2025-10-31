import { ProfileUI } from '@ui-pages';
import {
  FC,
  SyntheticEvent,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUserData,
  updateUser,
  getUserError,
  getUserLoading
} from '../../services/slices/user';
import { validators } from '../../utils/validators';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const updateError = useSelector(getUserError);
  const isLoading = useSelector(getUserLoading);

  const [formValue, setFormValue] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  // Определяем, какие поля были изменены
  const changedFields = useMemo(() => {
    const changes = {
      name: formValue.name !== user?.name,
      email: formValue.email !== user?.email,
      password: !!formValue.password
    };
    return changes;
  }, [formValue, user]);

  // Валидация только измененных полей
  const isValid = useMemo(() => {
    // Имя: если изменено, должно быть не пустым
    const nameValid = !changedFields.name || formValue.name.trim() !== '';

    // Email: если изменен, должен быть валидным
    const emailValid =
      !changedFields.email || validators.email(formValue.email);

    // Пароль: если введен (изменен), должен быть минимум 6 символов
    const passwordValid =
      !changedFields.password || formValue.password.length >= 6;

    return nameValid && emailValid && passwordValid;
  }, [formValue, changedFields]);

  // Обновление ошибок только для измененных полей
  useEffect(() => {
    const newErrors: typeof errors = {};

    // Проверяем имя только если оно было изменено
    if (changedFields.name && !formValue.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }

    // Проверяем email только если он был изменен
    if (changedFields.email && !validators.email(formValue.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    // Проверяем пароль только если он был введен
    if (changedFields.password && formValue.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
  }, [formValue, changedFields]);

  // Заполняем форму данными пользователя
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    changedFields.name || changedFields.email || changedFields.password;

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (isFormChanged && isValid) {
        const updateData: { name?: string; email?: string; password?: string } =
          {};

        // Добавляем в запрос только измененные поля
        if (changedFields.name) updateData.name = formValue.name;
        if (changedFields.email) updateData.email = formValue.email;
        if (changedFields.password) updateData.password = formValue.password;

        dispatch(updateUser(updateData))
          .unwrap()
          .then(() => {
            setFormValue((prev) => ({ ...prev, password: '' }));
          })
          .catch((error) => {
            console.error('Update failed:', error);
          });
      }
    },
    [dispatch, formValue, isFormChanged, isValid, changedFields]
  );

  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (user) {
        setFormValue({
          name: user.name || '',
          email: user.email || '',
          password: ''
        });
      }
    },
    [user]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValue((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    []
  );

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateError || ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      isLoading={isLoading}
      isValid={isValid}
      fieldErrors={errors}
    />
  );
};

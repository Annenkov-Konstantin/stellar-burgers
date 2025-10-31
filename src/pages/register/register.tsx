import { FC, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RegisterUI } from '@ui-pages';
import {
  registerUser,
  getUserError,
  getUserLoading
} from '../../services/slices/user';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';

export type RegisterFormData = {
  userName: string;
  email: string;
  password: string;
};

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, errors, isValid, setUserName, setEmail, setPassword } =
    useForm<RegisterFormData>(
      {
        userName: '',
        email: '',
        password: ''
      },
      {
        email: validators.email,
        password: validators.passwordMin5,
        userName: (value) =>
          validators.required(value) && validators.onlyLetters(value)
      }
    );

  const error = useSelector(getUserError);
  const isLoading = useSelector(getUserLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    dispatch(
      registerUser({
        email: values.email,
        password: values.password,
        name: values.userName
      })
    )
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Registration error:', err);
      });
  };

  // Показываем только серверные ошибки в общем блоке
  const serverError = error || '';

  return (
    <RegisterUI
      errorText={serverError}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      isValid={isValid}
      fieldErrors={errors}
    />
  );
};

import { FC, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { LoginUI } from '@ui-pages';
import {
  loginUser,
  getUserError,
  getUserLoading
} from '../../services/slices/user';
import { useNavigate } from 'react-router-dom';
import { useTypedLocation } from '../../hooks/use-typed-location';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';

export type LoginFormData = {
  email: string;
  password: string;
};

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useTypedLocation();

  const { values, errors, isValid, setEmail, setPassword } =
    useForm<LoginFormData>(
      {
        email: '',
        password: ''
      },
      {
        email: validators.email,
        password: validators.required
      }
    );

  const error = useSelector(getUserError);
  const isLoading = useSelector(getUserLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('Form submitted, isValid:', isValid);

    if (!isValid) {
      console.log('Form is invalid, not submitting');
      return;
    }

    dispatch(
      loginUser({
        email: values.email,
        password: values.password
      })
    )
      .unwrap()
      .then(() => {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error('Login error:', err);
      });
  };

  // Показываем только серверные ошибки
  const serverError = error || '';

  return (
    <LoginUI
      errorText={serverError}
      email={values.email}
      setEmail={setEmail}
      password={values.password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      isValid={isValid}
      fieldErrors={errors}
    />
  );
};

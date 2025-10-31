import { FC, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import {
  resetPassword,
  getUserError,
  getResetPasswordStatus,
  resetPasswordStatus
} from '../../services/slices/user';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';

export type ResetPasswordFormData = {
  password: string;
  token: string;
};

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, errors, isValid, setPassword, setToken } =
    useForm<ResetPasswordFormData>(
      {
        password: '',
        token: ''
      },
      {
        password: validators.passwordMin5,
        token: validators.required
      }
    );

  const error = useSelector(getUserError);
  const { request: resetPasswordRequest, success: resetPasswordSuccess } =
    useSelector(getResetPasswordStatus);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  useEffect(
    () => () => {
      dispatch(resetPasswordStatus());
    },
    [dispatch]
  );

  useEffect(() => {
    if (resetPasswordSuccess) {
      localStorage.removeItem('resetPassword');
      navigate('/login', { replace: true });
    }
  }, [resetPasswordSuccess, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    dispatch(
      resetPassword({
        password: values.password,
        token: values.token
      })
    );
  };

  // Показываем только серверные ошибки
  const serverError = error || '';

  return (
    <ResetPasswordUI
      errorText={serverError}
      password={values.password}
      token={values.token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
      isLoading={resetPasswordRequest}
      isValid={isValid}
      fieldErrors={errors}
    />
  );
};

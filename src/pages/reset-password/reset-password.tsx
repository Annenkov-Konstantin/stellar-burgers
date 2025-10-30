import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import {
  resetPassword,
  getUserError,
  getResetPasswordStatus,
  resetPasswordStatus
} from '../../services/slices/user';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

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

    dispatch(resetPassword({ password, token }));
  };

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
      isLoading={resetPasswordRequest}
    />
  );
};

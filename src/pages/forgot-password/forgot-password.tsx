import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import {
  forgotPassword,
  getUserError,
  getForgotPasswordStatus,
  forgotPasswordStatus
} from '../../services/slices/user';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const error = useSelector(getUserError);
  const { request: forgotPasswordRequest, success: forgotPasswordSuccess } =
    useSelector(getForgotPasswordStatus);

  useEffect(
    () => () => {
      dispatch(forgotPasswordStatus());
    },
    [dispatch]
  );

  useEffect(() => {
    if (forgotPasswordSuccess) {
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  }, [forgotPasswordSuccess, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(forgotPassword({ email }));
  };

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      isLoading={forgotPasswordRequest}
    />
  );
};

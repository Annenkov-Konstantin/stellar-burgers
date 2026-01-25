import { FC, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import {
  forgotPassword,
  getUserError,
  getForgotPasswordStatus
} from '../../services/slices/user';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';

export type ForgotPasswordFormData = {
  email: string;
};

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, errors, isValid, setEmail } = useForm<ForgotPasswordFormData>(
    {
      email: ''
    },
    {
      email: validators.email
    }
  );

  const error = useSelector(getUserError);
  const { request: isLoading } = useSelector(getForgotPasswordStatus);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    dispatch(forgotPassword({ email: values.email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => {
        console.error('Forgot password error:', err);
      });
  };

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={values.email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      isValid={isValid}
      fieldErrors={errors}
    />
  );
};

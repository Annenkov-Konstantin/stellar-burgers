import { FC } from 'react';
import { Input, Button } from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { NavLink } from 'react-router-dom';
import { ForgotPasswordUIProps } from './type';

export const ForgotPasswordUI: FC<ForgotPasswordUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit,
  isLoading = false,
  isValid = false,
  fieldErrors = {}
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Восстановление пароля</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='forgot-password'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='Укажите e-mail'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name='email'
            error={!!fieldErrors.email}
            errorText={fieldErrors.email || ''}
            size='default'
            disabled={isLoading}
          />
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button
            type='primary'
            size='medium'
            htmlType='submit'
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Отправка...' : 'Восстановить'}
          </Button>
        </div>
        {/* Показываем только серверные ошибки */}
        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Вспомнили пароль?
        <NavLink to={'/login'} className={`pl-2 ${styles.NavLink}`}>
          Войти
        </NavLink>
      </div>
    </div>
  </main>
);

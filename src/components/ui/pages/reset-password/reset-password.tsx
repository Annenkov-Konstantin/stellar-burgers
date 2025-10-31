import { FC } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { NavLink } from 'react-router-dom';
import { ResetPasswordUIProps } from './type';

export const ResetPasswordUI: FC<ResetPasswordUIProps> = ({
  errorText,
  password,
  token,
  setPassword,
  setToken,
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
        name='reset-password'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name='password'
            placeholder='Введите новый пароль'
            disabled={isLoading}
          />
          {/* Отображаем ошибку валидации пароля отдельно */}
          {fieldErrors.password && (
            <p className={`${styles.error} text text_type_main-default pt-2`}>
              {fieldErrors.password}
            </p>
          )}
        </div>
        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Введите код из письма'
            onChange={(e) => setToken(e.target.value)}
            value={token}
            name='token'
            error={!!fieldErrors.token}
            errorText={fieldErrors.token || ''}
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
            {isLoading ? 'Сохранение...' : 'Сохранить'}
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

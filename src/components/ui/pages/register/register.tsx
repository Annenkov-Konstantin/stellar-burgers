import { FC } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { NavLink } from 'react-router-dom';
import { RegisterUIProps } from './type';
import { Preloader } from '../../../ui/preloader';

export const RegisterUI: FC<RegisterUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit,
  password,
  setPassword,
  userName,
  setUserName,
  isLoading = false,
  isValid = false,
  fieldErrors = {}
}) => {
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='register'
          onSubmit={handleSubmit}
        >
          <div className='pb-6'>
            <Input
              type='text'
              placeholder='Имя'
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              name='name'
              error={!!fieldErrors.userName}
              errorText={fieldErrors.userName || ''}
              size='default'
              disabled={isLoading}
            />
          </div>
          <div className='pb-6'>
            <Input
              type='email'
              placeholder='E-mail'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name='email'
              error={!!fieldErrors.email}
              errorText={fieldErrors.email || ''}
              size='default'
              disabled={isLoading}
            />
          </div>
          <div className='pb-6'>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name='password'
              placeholder='Пароль'
              disabled={isLoading}
            />
            {/* Отображаем ошибку валидации пароля отдельно */}
            {fieldErrors.password && (
              <p className={`${styles.error} text text_type_main-default pt-2`}>
                {fieldErrors.password}
              </p>
            )}
          </div>
          <div className={`pb-6 ${styles.button}`}>
            <Button
              type='primary'
              size='medium'
              htmlType='submit'
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
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
          Уже зарегистрированы?
          <NavLink to='/login' className={`pl-2 ${styles.link}`}>
            Войти
          </NavLink>
        </div>
      </div>
    </main>
  );
};

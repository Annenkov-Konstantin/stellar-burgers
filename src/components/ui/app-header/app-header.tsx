import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname.startsWith('/feed');
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор */}
          <Link
            to='/'
            className={`${styles.menu_item} ${isConstructorActive ? styles.menu_item_active : ''}`}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${styles.menu_text}`}
            >
              Конструктор
            </p>
          </Link>

          {/* Лента заказов */}
          <Link
            to='/feed'
            className={`${styles.menu_item} ${isFeedActive ? styles.menu_item_active : ''}`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${styles.menu_text}`}
            >
              Лента заказов
            </p>
          </Link>
        </div>

        {/* Лого */}
        <Link to='/' className={styles.logo}>
          <Logo className='' />
        </Link>

        {/* Личный кабинет */}
        <Link
          to='/profile'
          className={`${styles.menu_item} ${isProfileActive ? styles.menu_item_active : ''}`}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className={`text text_type_main-default ml-2 ${styles.menu_text}`}>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </nav>
    </header>
  );
};

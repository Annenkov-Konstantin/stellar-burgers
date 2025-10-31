import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useTypedLocation } from '../../../hooks/use-typed-location';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useTypedLocation();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname.startsWith('/feed');
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор */}
          <NavLink
            to='/'
            className={`${styles.menu_item} ${isConstructorActive ? styles.menu_item_active : ''}`}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${styles.menu_text}`}
            >
              Конструктор
            </p>
          </NavLink>

          {/* Лента заказов */}
          <NavLink
            to='/feed'
            className={`${styles.menu_item} ${isFeedActive ? styles.menu_item_active : ''}`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${styles.menu_text}`}
            >
              Лента заказов
            </p>
          </NavLink>
        </div>

        {/* Лого */}
        <NavLink to='/' className={styles.logo}>
          <Logo className='' />
        </NavLink>

        {/* Личный кабинет */}
        <NavLink
          to='/profile'
          className={`${styles.menu_item} ${isProfileActive ? styles.menu_item_active : ''}`}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className={`text text_type_main-default ml-2 ${styles.menu_text}`}>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};

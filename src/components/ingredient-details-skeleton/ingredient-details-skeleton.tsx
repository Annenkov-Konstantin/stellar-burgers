import { FC } from 'react';
import { Preloader } from '../ui/preloader/preloader';
import styles from './ingredient-details-skeleton.module.css';

export const IngredientDetailsSkeleton: FC = () => (
  <div className={styles.skeleton}>
    <div className={styles.container}>
      <Preloader />
      <p className='text text_type_main-medium text_color_inactive mt-6'>
        Загружаем данные об ингредиенте...
      </p>
    </div>
  </div>
);

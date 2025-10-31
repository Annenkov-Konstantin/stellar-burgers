import { FC, useEffect, useState } from 'react';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  getIngredientsFromState,
  getIngredientsIsLoading
} from '../../services/slices/ingredients';
import { IngredientDetailsSkeleton } from '../../components/ingredient-details-skeleton/ingredient-details-skeleton';
import styles from '../../components/ingredient-details-skeleton/ingredient-details-skeleton.module.css';

const useImagePreloader = (src: string) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(false);
    if (!src) {
      setLoaded(true);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
  }, [src]);

  return loaded;
};

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredientsData = useSelector(getIngredientsFromState);
  const isLoading = useSelector(getIngredientsIsLoading);

  const ingredientData = ingredientsData.find((object) => object._id === id);

  const imageLoaded = useImagePreloader(ingredientData?.image_large || '');

  if (isLoading || !imageLoaded) {
    return (
      <div className={styles.modal_fixed}>
        <IngredientDetailsSkeleton />
      </div>
    );
  }

  if (!ingredientData) {
    return (
      <div className={styles.modal_fixed}>
        <div className={`${styles.error} text text_type_main-medium`}>
          Ингредиент не найден
        </div>
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

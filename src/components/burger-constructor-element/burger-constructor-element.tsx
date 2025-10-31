import { FC, memo, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  reorderIngredients,
  getIngredientsInOrder,
  removeIngredientByUniqueId
} from '../../services/slices/orders';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const ingredientsInOrder = useSelector(getIngredientsInOrder);

    const handleMoveDown = useCallback(() => {
      if (index >= totalItems - 1) return;

      const newIngredients = [...ingredientsInOrder];
      const currentIndex = newIngredients.findIndex(
        (ing) => ing.uniqueId === ingredient.uniqueId
      );

      if (currentIndex === -1 || currentIndex >= newIngredients.length - 1)
        return;

      [newIngredients[currentIndex], newIngredients[currentIndex + 1]] = [
        newIngredients[currentIndex + 1],
        newIngredients[currentIndex]
      ];

      dispatch(reorderIngredients(newIngredients));
    }, [dispatch, ingredientsInOrder, ingredient.uniqueId, index, totalItems]);

    const handleMoveUp = useCallback(() => {
      if (index <= 0) return;

      const newIngredients = [...ingredientsInOrder];
      const currentIndex = newIngredients.findIndex(
        (ing) => ing.uniqueId === ingredient.uniqueId
      );

      if (currentIndex === -1 || currentIndex === 0) return;

      [newIngredients[currentIndex], newIngredients[currentIndex - 1]] = [
        newIngredients[currentIndex - 1],
        newIngredients[currentIndex]
      ];

      dispatch(reorderIngredients(newIngredients));
    }, [dispatch, ingredientsInOrder, ingredient.uniqueId, index, totalItems]);

    const handleClose = useCallback(() => {
      dispatch(removeIngredientByUniqueId({ uniqueId: ingredient.uniqueId }));
    }, [dispatch, ingredient.uniqueId]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);

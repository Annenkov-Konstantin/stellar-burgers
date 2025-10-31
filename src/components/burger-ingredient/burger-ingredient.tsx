import { FC, memo } from 'react';
import { useTypedLocation } from '../../hooks/use-typed-location';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

import {
  initOrder,
  changeOrder,
  getOrdersId,
  OrderActions
} from '../../services/slices/orders';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useTypedLocation();
    const ordersId = useSelector(getOrdersId);
    const dispatch = useDispatch();

    const handleAdd = () => {
      ordersId === '0'
        ? dispatch(initOrder({ id: ingredient._id }))
        : dispatch(
            changeOrder({ action: OrderActions.ADD, id: ingredient._id })
          );
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);

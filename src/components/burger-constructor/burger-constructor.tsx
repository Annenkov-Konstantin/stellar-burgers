// components/burger-constructor.tsx
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredientsFromState } from '../../services/slices/ingredients';
import {
  getIngredientsInOrder,
  getIngredientsIds,
  getIsOrderSending,
  getDasOrderSent,
  getOrderData,
  orderBurger,
  resetOrderModal
} from '../../services/slices/orders';
import { getUserData } from '../../services/slices/user';
import { addUserOrder } from '../../services/slices/userOrders';

type TConstructorItem = TIngredient & {
  uniqueId: string;
};

type TConstructorItems = {
  bun: TConstructorItem | null;
  ingredients: TConstructorItem[];
};

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ingredientsFromState = useSelector(getIngredientsFromState);
  const ingredientsInOrder = useSelector(getIngredientsInOrder);
  const ingredientsIds = useSelector(getIngredientsIds);
  const orderRequest = useSelector(getIsOrderSending);
  const dasOrderSent = useSelector(getDasOrderSent);
  const orderData = useSelector(getOrderData);
  const user = useSelector(getUserData);

  const constructorItems: TConstructorItems = useMemo(() => {
    let bun: TConstructorItem | null = null;
    const otherIngredients: TConstructorItem[] = [];

    for (const orderIngredient of ingredientsInOrder) {
      const ingredient = ingredientsFromState.find(
        (ing) => ing._id === orderIngredient.id
      );
      if (ingredient) {
        const constructorItem = {
          ...ingredient,
          uniqueId: orderIngredient.uniqueId
        };

        if (ingredient.type === 'bun') {
          bun = constructorItem;
        } else {
          otherIngredients.push(constructorItem);
        }
      }
    }

    return { bun, ingredients: otherIngredients };
  }, [ingredientsFromState, ingredientsInOrder]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || constructorItems.ingredients.length === 0) {
      return;
    }

    if (!orderRequest) {
      dispatch(orderBurger(ingredientsIds))
        .unwrap()
        .then((orderData) => {
          dispatch(addUserOrder(orderData.order));
        });
    }
  };

  const closeOrderModal = () => {
    dispatch(resetOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const orderModalData: TOrder | null = useMemo(() => {
    if (!orderData.number || !dasOrderSent) return null;

    const ingredientIds = orderData.ingredients.map((ing) => ing.id);

    return {
      ...orderData,
      ingredients: ingredientIds
    };
  }, [orderData, dasOrderSent]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
